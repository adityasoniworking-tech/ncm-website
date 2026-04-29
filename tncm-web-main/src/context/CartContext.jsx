import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // cartItems will be an array of objects: { id, name, price, qty, image? }
    const [cartItems, setCartItems] = useState(() => {
        try {
            // Check original 'user_cart' logic from local storage
            // In original it was { itemId(int): qty(int) }
            const localData = localStorage.getItem('user_cart');
            if (localData) {
                const parsed = JSON.parse(localData);
                // If it's the old format (object instead of array of rich items), we handle it in components that load items.
                // But for pure React implementation, an array of rich objects is better.
                if (Array.isArray(parsed)) {
                    return parsed;
                } else if (typeof parsed === 'object') {
                    // It's the old format {id: qty}. Since we don't have the dbMenuItems here easily, 
                    // we'll just return empty to migrate them to the new format,
                    // or ideally we'd map it. For now, let's start fresh if it's the old object format 
                    // to prevent crashes since our context expects full item objects.
                    return [];
                }
            }
        } catch (e) {
            console.error("Cart parsing error", e);
        }
        return [];
    });

    const [storeSettings, setStoreSettings] = useState({
        showHomeDelivery: true,
        showPickup: true
    });

    useEffect(() => {
        localStorage.setItem('user_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'storeConfig');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                setStoreSettings(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    // Adds a full item object or updates its quantity
    const addToCart = (item, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, qty: i.qty + quantity } : i
                );
            }
            return [...prev, { ...item, qty: quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, change) => {
        setCartItems(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = item.qty + change;
                    if (newQty <= 0) return null; // We filter out nulls below
                    return { ...item, qty: newQty };
                }
                return item;
            }).filter(Boolean); // removes null items
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Success modal state
    const [successData, setSuccessData] = useState(null);

    const openSuccess = (data) => setSuccessData(data);
    const closeSuccess = () => setSuccessData(null);

    // Place order: requires authenticated user
    // orderMeta: { name, phone, deliveryType, address, structuredAddress, mapLocation }
    const placeOrder = async (orderMeta = {}) => {
        const user = auth.currentUser;
        if (!user) {
            // Caller should handle presenting login UI
            const err = new Error('AUTH_REQUIRED');
            err.code = 'AUTH_REQUIRED';
            throw err;
        }

        if (cartItems.length === 0) {
            const err = new Error('CART_EMPTY');
            err.code = 'CART_EMPTY';
            throw err;
        }

        const items = cartItems.map(i => ({ name: i.name, price: i.price, qty: i.qty, id: i.id }));
        const subtotal = cartItems.reduce((s, it) => s + (it.price * it.qty), 0);

        const orderDoc = {
            userId: user.uid,
            userEmail: user.email || null,
            userName: orderMeta.name || null,
            phone: orderMeta.phone || null,
            deliveryType: orderMeta.deliveryType || 'Home Delivery',
            address: orderMeta.address || null,
            structuredAddress: orderMeta.structuredAddress || {},
            mapLocation: orderMeta.mapLocation || null,
            items,
            subtotal,
            deliveryCharge: orderMeta.deliveryCharge || 0,
            totalAmount: subtotal + (orderMeta.deliveryCharge || 0),
            status: 'Pending',
            paymentMethod: orderMeta.paymentMethod || 'COD',
            timestamp: serverTimestamp()
        };

        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderDoc);

        // clear cart on success
        clearCart();

        const result = { id: docRef.id };
        openSuccess(result);
        return result;
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            placeOrder,
            successData,
            openSuccess,
            closeSuccess,
            storeSettings
        }}>
            {children}
        </CartContext.Provider>
    );
};
