import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { auth } from '../../services/firebase';
import DeliveryMap, { SHOP_LOCATION, DELIVERY_CONFIG, calculateDistance } from './DeliveryMap';

const CartModal = ({ isOpen, onClose }) => {
    const { cartItems, updateQuantity, cartTotal, clearCart, placeOrder, storeSettings } = useCart();
    const [step, setStep] = useState(1);
    const [deliveryType, setDeliveryType] = useState('Home Delivery');

    // Checkout form state must be declared unconditionally (hooks order must remain stable)
    const [custName, setCustName] = useState('');
    const [custPhone, setCustPhone] = useState('');

    // Address Details
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [taluka, setTaluka] = useState('');
    const [district, setDistrict] = useState('');
    const [stateName, setStateName] = useState('');
    const [pincode, setPincode] = useState('');
    const [landmark, setLandmark] = useState('');
    const nameRef = useRef(null);

    const [geolocationLoading, setGeolocationLoading] = useState(false);

    // Terms agreement
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Delivery Map State
    const [showMap, setShowMap] = useState(false);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [deliveryDistance, setDeliveryDistance] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(null); // [lat, lng]
    const [mapLocationText, setMapLocationText] = useState('Select Delivery Location on Map');

    // Auto-select available delivery type if the current one gets disabled via settings
    useEffect(() => {
        if (storeSettings) {
            if (deliveryType === 'Home Delivery' && storeSettings.showHomeDelivery === false && storeSettings.showPickup !== false) {
                setDeliveryType('Self Pickup');
            } else if (deliveryType === 'Self Pickup' && storeSettings.showPickup === false && storeSettings.showHomeDelivery !== false) {
                setDeliveryType('Home Delivery');
            }
        }
    }, [storeSettings, deliveryType]);

    // Focus the name input only when entering the checkout step.
    useEffect(() => {
        if (step === 2 && nameRef.current) {
            try { nameRef.current.focus({ preventScroll: true }); } catch (e) { nameRef.current.focus(); }
        }
    }, [step]);

    // Debug: log renders and input focus changes to help diagnose focus-stealing
    useEffect(() => {
        console.log('CartModal render', { step, custName, custPhone, cartItemsLength: cartItems.length });
    });

    // Fetch saved profile details when moving to checkout
    useEffect(() => {
        if (step === 2 && auth.currentUser) {
            const fetchProfile = async () => {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../../services/firebase');
                    const docRef = doc(db, 'users', auth.currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.name) setCustName(data.name);
                        if (data.phone) setCustPhone(data.phone);
                        if (data.street) setStreet(data.street);
                        if (data.city) setCity(data.city);
                        if (data.taluka) setTaluka(data.taluka);
                        if (data.district) setDistrict(data.district);
                        if (data.state) setStateName(data.state);
                        if (data.pincode) setPincode(data.pincode);
                        if (data.landmark) setLandmark(data.landmark);
                    }
                } catch (error) {
                    console.error("Error fetching saved profile for cart:", error);
                }
            };
            fetchProfile();
        }
    }, [step]);

    // Reset delivery charge when switching to Pickup
    useEffect(() => {
        if (deliveryType === 'Self Pickup') {
            setDeliveryCharge(0);
        } else if (deliveryType === 'Home Delivery' && selectedLocation === null) {
            setDeliveryCharge(0); // Optional: Reset or keep last calculated
        }
    }, [deliveryType, selectedLocation]);

    const finalTotal = cartTotal + deliveryCharge;

    const handleLocationConfirm = (data) => {
        setSelectedLocation([data.lat, data.lng]);
        setDeliveryDistance(data.distance);
        setDeliveryCharge(data.deliveryCharge);

        if (data.formattedAddress && data.formattedAddress !== 'Address not found' && data.formattedAddress !== 'Location not available') {
            setMapLocationText(data.formattedAddress);
        } else {
            setMapLocationText('Location Selected');
        }

        setShowMap(false);
    };

    const handleLocateMe = (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setGeolocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Calculate Distance & Fees
                const dist = calculateDistance(SHOP_LOCATION[0], SHOP_LOCATION[1], lat, lng);
                let charge = 0;
                if (dist > DELIVERY_CONFIG.minChargeDistance) {
                    const chargeableDistance = dist - DELIVERY_CONFIG.minChargeDistance;
                    const increments = Math.ceil(chargeableDistance / DELIVERY_CONFIG.incrementDistance);
                    charge = increments * DELIVERY_CONFIG.chargePer500m;
                }

                try {
                    const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
                    if (!response.ok) throw new Error('Geocoding request failed');
                    const data = await response.json();

                    let formatted = 'Location Selected';
                    let details = null;
                    if (data.features && data.features.length > 0) {
                        const props = data.features[0].properties;
                        details = props;
                        const parts = [
                            props.name,
                            props.street ? (props.street + (props.housenumber ? ' ' + props.housenumber : '')) : null,
                            props.city || props.town || props.village,
                            props.state,
                            props.postcode
                        ].filter(Boolean);
                        formatted = [...new Set(parts)].join(', ');
                    }

                    handleLocationConfirm({ lat, lng, distance: dist, deliveryCharge: charge, details, formattedAddress: formatted });
                } catch (error) {
                    console.error('Direct locate error:', error);
                    // Still set coords even if geocoding fails
                    handleLocationConfirm({ lat, lng, distance: dist, deliveryCharge: charge, details: null, formattedAddress: 'Address not found' });
                } finally {
                    setGeolocationLoading(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please ensure location services are enabled.');
                setGeolocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (!isOpen) return null;

    // --- Components for Steps ---
    const EmptyCartState = () => (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px', color: '#eee' }}>🛒</div>
            <h3 style={{ color: '#6b0f1a', marginBottom: '10px' }}>Your Basket is Empty</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Looks like you haven't added any sweet treats yet.</p>
            <button
                onClick={onClose}
                style={{ background: 'white', border: '1px solid #6b0f1a', color: '#6b0f1a', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
            >
                Start Shopping
            </button>
        </div>
    );

    const CartItemsList = () => (
        <>
            <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '5px' }}>
                {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '12px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' }}>
                        <div style={{ flex: 1 }}>
                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                            <small style={{ color: '#666' }}>₹{item.price} x {item.qty}</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 10px' }}>
                            <button onClick={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>-</button>
                            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>+</button>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#6b0f1a', minWidth: '70px', textAlign: 'right' }}>
                            ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', borderTop: '2px solid #f8f9fa', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ fontSize: '1.1rem', color: '#666' }}>Total Amount</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#6b0f1a' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => {
                        if (!auth.currentUser) {
                            alert('Order place karne ke liye kripya pehle login karein! (Please login first to place an order)');
                            window.dispatchEvent(new Event('openAuthModal'));
                            return;
                        }
                        setStep(2);
                    }}
                    style={{ width: '100%', background: '#6b0f1a', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                >
                    Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </>
    );

    const CheckoutForm = () => (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}>
                    <i className="fa-solid fa-arrow-left"></i> Back to Cart
                </button>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#6b0f1a', margin: '0 0 15px 0' }}>Checkout Details</h3>

            {/* Delivery Type */}
            {(storeSettings?.showHomeDelivery ?? true) || (storeSettings?.showPickup ?? true) ? (
                <div style={{ background: '#fff', padding: '10px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #eee', display: 'flex', gap: '10px' }}>
                    {(storeSettings?.showPickup ?? true) && (
                        <label style={{ ...styles.deliveryRadio, background: deliveryType === 'Self Pickup' ? '#fff0f0' : '#fff', borderColor: deliveryType === 'Self Pickup' ? '#6b0f1a' : '#ddd' }}>
                            <input type="radio" value="Self Pickup" checked={deliveryType === 'Self Pickup'} onChange={(e) => setDeliveryType(e.target.value)} style={{ accentColor: '#6b0f1a' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🏬 Pickup</span>
                        </label>
                    )}
                    {(storeSettings?.showHomeDelivery ?? true) && (
                        <label style={{ ...styles.deliveryRadio, background: deliveryType === 'Home Delivery' ? '#f0f8ff' : '#fff', borderColor: deliveryType === 'Home Delivery' ? '#007bff' : '#ddd' }}>
                            <input type="radio" value="Home Delivery" checked={deliveryType === 'Home Delivery'} onChange={(e) => setDeliveryType(e.target.value)} style={{ accentColor: '#007bff' }} />
                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>🏠 Delivery</span>
                        </label>
                    )}
                </div>
            ) : (
                <div style={{ background: '#fff9f9', color: '#6b0f1a', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffdcdc', textAlign: 'center', fontWeight: 'bold' }}>
                    Ordering is currently unavailable.
                </div>
            )}

            <input
                ref={nameRef}
                value={custName}
                onChange={e => setCustName(e.target.value)}
                onFocus={() => console.log('Name input focus', document.activeElement && document.activeElement.placeholder)}
                onBlur={() => console.log('Name input blur', document.activeElement && document.activeElement.placeholder)}
                type="text"
                placeholder="Full Name"
                style={styles.input}
            />
            <input
                value={custPhone}
                onChange={e => setCustPhone(e.target.value)}
                onFocus={() => console.log('Phone input focus', document.activeElement && document.activeElement.placeholder)}
                onBlur={() => console.log('Phone input blur', document.activeElement && document.activeElement.placeholder)}
                type="text"
                placeholder="Phone Number"
                style={styles.input}
            />

            {deliveryType === 'Home Delivery' && (
                <div style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 Delivery Address</h4>
                        <input value={street} onChange={e => setStreet(e.target.value)} type="text" placeholder="House No. / Building / Street Name" style={styles.input} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="City / Area" style={styles.inputGrid} />
                            <input value={taluka} onChange={e => setTaluka(e.target.value)} type="text" placeholder="Taluka" style={styles.inputGrid} />
                            <input value={district} onChange={e => setDistrict(e.target.value)} type="text" placeholder="District" style={styles.inputGrid} />
                            <input value={stateName} onChange={e => setStateName(e.target.value)} type="text" placeholder="State" style={styles.inputGrid} />
                            <input value={pincode} onChange={e => setPincode(e.target.value)} type="text" placeholder="Pincode" maxLength="6" style={styles.inputGrid} />
                            <input value={landmark} onChange={e => setLandmark(e.target.value)} type="text" placeholder="Landmark (Optional)" style={styles.inputGrid} />
                        </div>
                    </div>

                    <div style={{ borderTop: '1px dashed #eee', paddingTop: '15px' }}>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div style={{ background: '#fff9f9', border: '1px dashed #6b0f1a', padding: '12px', borderRadius: '8px', color: '#6b0f1a', fontSize: '0.9rem', textAlign: 'center' }}>
                                {selectedLocation ? (
                                    <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                        ✓ {mapLocationText} ({deliveryDistance.toFixed(1)} km)
                                    </div>
                                ) : (
                                    mapLocationText
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    onClick={handleLocateMe}
                                    disabled={geolocationLoading}
                                    style={{ background: 'white', color: geolocationLoading ? '#666' : '#28a745', border: `1px solid ${geolocationLoading ? '#ccc' : '#28a745'}`, padding: '10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', cursor: geolocationLoading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                >
                                    <i className={geolocationLoading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-crosshairs"}></i>
                                    {geolocationLoading ? 'Locating...' : 'Locate Me'}
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); setShowMap(true); }}
                                    style={{ background: 'white', color: '#007bff', border: '1px solid #007bff', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                >
                                    <i className="fa-solid fa-map-location-dot"></i> Open Map
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Total Recap */}
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: '4px solid #6b0f1a' }}>
                {deliveryType === 'Home Delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#666' }}>Delivery Charge</span>
                        <span style={{ color: '#6b0f1a', fontWeight: 'bold' }}>₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: deliveryType === 'Home Delivery' ? '1px dashed #ddd' : 'none', marginTop: deliveryType === 'Home Delivery' ? '5px' : '0', paddingTop: deliveryType === 'Home Delivery' ? '5px' : '0' }}>
                    <span style={{ fontWeight: 'bold' }}>Final Total</span>
                    <span style={{ color: '#6b0f1a', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', background: '#ffecec', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffdcdc', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: '4px', marginRight: '10px', accentColor: '#6b0f1a' }}
                />
                <span style={{ fontSize: '0.85rem', color: '#6b0f1a', fontWeight: '600', lineHeight: '1.4' }}>
                    By placing this order, I acknowledge that the order cannot be cancelled after confirmation
                </span>
            </label>

            <button
                onClick={async () => {
                    if (deliveryType === 'Home Delivery' && (!street || !city || !pincode)) {
                        alert('Please enter your complete delivery address (Street, City, Pincode).');
                        return;
                    }
                    if (deliveryType === 'Home Delivery' && !selectedLocation) {
                        alert('Please select your location on the map to calculate delivery charges.');
                        return;
                    }
                    if (!agreedToTerms) {
                        alert('Please acknowledge that the order cannot be cancelled after confirmation.');
                        return;
                    }

                    try {
                        const orderMeta = {
                            name: custName,
                            phone: custPhone,
                            deliveryType,
                            address: street ? `${street}, ${city}, ${taluka} ${district} ${stateName} ${pincode} ${landmark ? '(Landmark: ' + landmark + ')' : ''}`.replace(/\s+/g, ' ').trim() : null,
                            structuredAddress: { streetName: street, city, taluka, district, stateName, pincode, landmark },
                            coordinates: selectedLocation ? { lat: selectedLocation[0], lng: selectedLocation[1] } : null,
                            deliveryCharge: deliveryCharge,
                            distance: deliveryDistance,
                            paymentMethod: 'COD'
                        };

                        const result = await placeOrder(orderMeta);

                        // --- TELEGRAM NOTIFICATION ---
                        try {
                            const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
                            const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

                            if (botToken && chatId) {
                                // HTML Escape Helper
                                const escapeHTML = (text) => {
                                    if (!text) return '';
                                    return text.toString()
                                        .replace(/&/g, '&amp;')
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;');
                                };

                                // Use HTML for more robust parsing (Markdown can be finicky)
                                let itemsText = cartItems.map(i => `• <b>${i.qty}x ${escapeHTML(i.name)}</b> (₹${(i.price * i.qty).toFixed(2)})`).join('\n');

                                let message = `<b>🚨 NEW ORDER RECEIVED! 🚨</b>\n\n`;
                                message += `<b>Customer:</b> ${escapeHTML(custName)}\n`;
                                message += `<b>Phone:</b> ${escapeHTML(custPhone)}\n`;
                                message += `<b>Type:</b> ${escapeHTML(deliveryType)}\n`;
                                if (deliveryType === 'Home Delivery') {
                                    message += `<b>Address:</b> ${escapeHTML(orderMeta.address)}\n`;
                                }
                                message += `\n<b>Items:</b>\n${itemsText}\n\n`;
                                message += `<b>Total Amount:</b> ₹${finalTotal.toFixed(2)} (COD)`;

                                const sendNotification = async (text, parseMode) => {
                                    return await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            chat_id: chatId.trim(),
                                            text: text,
                                            parse_mode: parseMode
                                        })
                                    });
                                };

                                let response = await sendNotification(message, 'HTML');
                                let responseData = await response.json();

                                if (!response.ok) {
                                    console.error("Telegram HTML Send Failed:", responseData);

                                    // Fallback to plain text if HTML parsing fails
                                    if (responseData.description?.includes("can't parse entities")) {
                                        const plainMessage = message.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
                                        response = await sendNotification(plainMessage, null);
                                        responseData = await response.json();

                                        if (response.ok) {
                                            console.log('Telegram Notification Sent (Plain Text Fallback)!');
                                            return;
                                        }
                                    }

                                    console.error(`Telegram FAIL (${response.status}): ${responseData.description}`);
                                } else {
                                    console.log('Telegram Notification Sent Successfully!');
                                }
                            }
                        } catch (telegramErr) {
                            console.error("Failed to send Telegram notification:", telegramErr);
                        }
                        // -----------------------------

                        // placeOrder will open success modal via context; just close this modal
                        setStep(1);
                        onClose();
                    } catch (err) {
                        if (err && err.code === 'AUTH_REQUIRED') {
                            alert('Order place karne ke liye kripya pehle login karein! (Please login first to place an order)');
                            // Ask layout to open auth modal
                            window.dispatchEvent(new Event('openAuthModal'));
                            return;
                        }

                        console.error('Order error', err);
                        alert('Failed to place order. Please try again.');
                    }
                }}
                disabled={!agreedToTerms || (deliveryType === 'Home Delivery' && (!street || !selectedLocation))}
                style={{
                    width: '100%', background: (!agreedToTerms || (deliveryType === 'Home Delivery' && (!street || !selectedLocation))) ? '#ccc' : 'linear-gradient(135deg, #6b0f1a 0%, #4a0a12 100%)',
                    color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1rem',
                    cursor: (!agreedToTerms || (deliveryType === 'Home Delivery' && (!street || !selectedLocation))) ? 'not-allowed' : 'pointer',
                    boxShadow: (!agreedToTerms || (deliveryType === 'Home Delivery' && (!street || !selectedLocation))) ? 'none' : '0 4px 15px rgba(107, 15, 26, 0.3)'
                }}
            >
                Confirm Order (COD) <i className="fa-solid fa-check-circle"></i>
            </button>
        </div>
    );

    return (
        <>
            <div style={styles.overlay} onClick={() => { setStep(1); onClose(); }}>
                <div
                    style={styles.modalContent}
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onTouchStart={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 100, padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", margin: 0, fontSize: '1.5rem', color: '#6b0f1a' }}>Your Basket</h2>
                        <button onClick={() => { setStep(1); onClose(); }} style={{ background: 'transparent', border: 'none', fontSize: '24px', color: '#666', cursor: 'pointer', padding: 0 }}>&times;</button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px' }}>
                        {cartItems.length === 0 ? EmptyCartState() : (step === 1 ? CartItemsList() : CheckoutForm())}
                    </div>
                </div>
            </div>

            {/* Render Delivery Map Modal on top of everything when requested */}
            {showMap && (
                <DeliveryMap
                    onConfirm={handleLocationConfirm}
                    onClose={() => setShowMap(false)}
                    initialLocation={selectedLocation}
                />
            )}
        </>
    );
};

const styles = {
    overlay: {
        display: 'flex',
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 2000,
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(3px)'
    },
    modalContent: {
        background: '#fff',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '420px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    },
    qtyBtn: {
        width: '28px', height: '28px', borderRadius: '5px', border: '1px solid #ddd', background: 'white', cursor: 'pointer'
    },
    deliveryRadio: {
        flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', borderRadius: '8px', transition: '0.3s'
    },
    input: {
        width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9', outline: 'none'
    },
    inputGrid: {
        width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', outline: 'none'
    }
};

export default CartModal;
