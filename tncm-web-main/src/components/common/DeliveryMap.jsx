import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix typical Leaflet icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icons
const shopIcon = L.divIcon({
    className: 'custom-shop-marker',
    html: '<div style="background: #6b0f1a; color: white; padding: 8px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🏪</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: '<div style="background: #28a745; color: white; padding: 8px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">📍</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Configuration & Default Shop Location
export const SHOP_LOCATION = [
    parseFloat(import.meta.env.VITE_MAP_SHOP_LAT || '23.1917174'),
    parseFloat(import.meta.env.VITE_MAP_SHOP_LNG || '72.6213802')
]; // nuttychocomorsels base
export const DELIVERY_CONFIG = {
    firstKmFree: true,
    chargePer500m: 10,
    minChargeDistance: 1.0,
    incrementDistance: 0.5
};

// Haversine Distance Calculator
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Sub-component to sync map view programmatically
const MapViewUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }
    }, [center, map, zoom]);

    // Force invalidation when modal opens
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
};

// Reverse Geocoding (Photon)
const reverseGeocodeAddress = async (lat, lng) => {
    try {
        const response = await fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`);
        if (!response.ok) throw new Error('Geocoding request failed');
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const props = data.features[0].properties;
            const parts = [
                props.name,
                props.street ? (props.street + (props.housenumber ? ' ' + props.housenumber : '')) : null,
                props.city || props.town || props.village,
                props.state,
                props.postcode
            ].filter(Boolean);
            const uniqueParts = [...new Set(parts)];
            return {
                found: true,
                formattedAddress: uniqueParts.join(', ') || 'Address not found',
                details: props
            };
        }
        return { found: false, formattedAddress: 'Address not found' };
    } catch (error) {
        console.error('Geocoding error:', error);
        return { found: false, formattedAddress: 'Address not available' };
    }
};

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// The Component
const DeliveryMap = ({ onConfirm, onClose, initialLocation }) => {
    const [userLoc, setUserLoc] = useState(initialLocation || SHOP_LOCATION);
    const [mapCenter, setMapCenter] = useState(initialLocation || SHOP_LOCATION);
    const [zoom, setZoom] = useState(initialLocation ? 16 : 13);
    const [distance, setDistance] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [addressText, setAddressText] = useState('📍 Fetching address...');
    const [addressDetails, setAddressDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [geolocationLoading, setGeolocationLoading] = useState(false);

    // Initial Processing
    useEffect(() => {
        if (initialLocation) {
            processLocationChange(initialLocation[0], initialLocation[1]);
        } else {
            setAddressText('📍 nuttychocomorsels (Home Shop)');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const processLocationChange = async (lat, lng) => {
        setUserLoc([lat, lng]);

        // Calculate Distance & Fees
        const dist = calculateDistance(SHOP_LOCATION[0], SHOP_LOCATION[1], lat, lng);
        let charge = 0;
        if (dist > DELIVERY_CONFIG.minChargeDistance) {
            const chargeableDistance = dist - DELIVERY_CONFIG.minChargeDistance;
            const increments = Math.ceil(chargeableDistance / DELIVERY_CONFIG.incrementDistance);
            charge = increments * DELIVERY_CONFIG.chargePer500m;
        }
        setDistance(dist);
        setDeliveryCharge(charge);

        // Geocode
        setAddressText(`📍 Fetching address... (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        const geoData = await reverseGeocodeAddress(lat, lng);
        if (geoData.found) {
            setAddressText(`📍 ${geoData.formattedAddress}`);
            setAddressDetails(geoData.details);
        } else {
            setAddressText(`📍 Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            setAddressDetails(null);
        }
    };

    const handleMapClick = (e) => {
        processLocationChange(e.latlng.lat, e.latlng.lng);
    };

    const getMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setGeolocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setMapCenter([latitude, longitude]);
                setZoom(16);
                processLocationChange(latitude, longitude);
                setGeolocationLoading(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please ensure location services are enabled.');
                setGeolocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // Auto-search Photon
    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const bbox = "68.1,20.1,74.5,24.7"; // Approx Gujarat bbox
            const apiUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${SHOP_LOCATION[0]}&lon=${SHOP_LOCATION[1]}&limit=6&bbox=${bbox}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.features) {
                const results = data.features.map(f => {
                    const props = f.properties;
                    if (props.country && props.country !== "India") return null;
                    const name = props.name || props.city || 'Unknown Location';
                    const parts = [props.street, props.suburb, props.city, props.state].filter(p => p && p !== name);
                    return {
                        lat: f.geometry.coordinates[1],
                        lng: f.geometry.coordinates[0],
                        name,
                        description: parts.join(', ')
                    };
                }).filter(Boolean);

                // Deduplicate
                const unique = [];
                const seen = new Set();
                results.forEach(item => {
                    const key = `${item.lat.toFixed(3)},${item.lng.toFixed(3)}`;
                    if (!seen.has(key)) { seen.add(key); unique.push(item); }
                });

                setSearchResults(unique);
            }
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce((q) => performSearch(q), 500), []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSelectResult = (result) => {
        setSearchQuery('');
        setSearchResults([]);
        setMapCenter([result.lat, result.lng]);
        setZoom(16);
        processLocationChange(result.lat, result.lng);
    };

    const handleConfirm = () => {
        onConfirm({
            lat: userLoc[0],
            lng: userLoc[1],
            distance,
            deliveryCharge,
        });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {/* Header */}
                <div style={styles.header}>
                    <h3 style={{ margin: 0, color: '#6b0f1a', fontFamily: "'Playfair Display', serif" }}>📍 Select Delivery Location</h3>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                {/* Search & Location Bar */}
                <div style={{ padding: '15px' }}>
                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Search area (e.g. Kudasan, Sector 21)..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={styles.searchInput}
                        />
                        {searchResults.length > 0 && (
                            <div style={styles.dropdown}>
                                {searchResults.map((res, i) => (
                                    <div key={i} onClick={() => handleSelectResult(res)} style={styles.dropdownItem}>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>{res.name}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{res.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isSearching && (
                            <div style={styles.dropdown}>
                                <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>Searching...</div>
                            </div>
                        )}
                    </div>
                    <button onClick={getMyLocation} disabled={geolocationLoading} style={styles.gpsBtn}>
                        <i className={geolocationLoading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-location-crosshairs"} style={{ marginRight: '8px' }}></i>
                        {geolocationLoading ? 'Locating...' : 'Use My Current Location'}
                    </button>
                </div>

                {/* Map Interface */}
                <div className="delivery-map-container" style={{ position: 'relative', height: '350px', width: '100%', borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
                    <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                        <MapViewUpdater center={mapCenter} zoom={zoom} />

                        {/* Static Shop marker */}
                        <Marker position={SHOP_LOCATION} icon={shopIcon}>
                            <Popup>nuttychocomorsels<br />(Home Shop)</Popup>
                        </Marker>

                        {/* Draggable user marker */}
                        <Marker
                            position={userLoc}
                            icon={userIcon}
                            draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    processLocationChange(lat, lng);
                                }
                            }}
                        >
                            <Popup>Your Delivery Location</Popup>
                        </Marker>

                        {/* Map click listener wrapper using a functional trick inside standard react-leaflet v4 */}
                        <ClickCatcher onClick={handleMapClick} />
                    </MapContainer>
                </div>

                {/* Result Info Area */}
                <div style={styles.footer}>
                    <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>{addressText}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', borderTop: '1px dashed #ddd', paddingTop: '8px', marginTop: '8px' }}>
                            <div><strong>Distance:</strong> {distance.toFixed(2)} km</div>
                            <div style={{ color: '#6b0f1a' }}><strong>Delivery Charge:</strong> ₹{deliveryCharge.toFixed(2)}</div>
                        </div>
                    </div>

                    <button onClick={handleConfirm} style={styles.confirmBtn}>
                        Confirm Location & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper to catch map clicks in clean react-leaflet v4
const ClickCatcher = ({ onClick }) => {
    const map = useMap();
    useEffect(() => {
        map.on('click', onClick);
        return () => {
            map.off('click', onClick);
        };
    }, [map, onClick]);
    return null;
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)',
        zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    modal: {
        background: 'white', width: '90%', maxWidth: '500px', borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
    },
    header: {
        padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa'
    },
    closeBtn: {
        background: 'none', border: 'none', fontSize: '28px', color: '#999', cursor: 'pointer',
        padding: 0, lineHeight: 1
    },
    searchInput: {
        width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none'
    },
    dropdown: {
        position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white',
        border: '1px solid #ddd', borderRadius: '0 0 8px 8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 4000, maxHeight: '200px', overflowY: 'auto'
    },
    dropdownItem: {
        padding: '10px 15px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer'
    },
    gpsBtn: {
        width: '100%', padding: '10px', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9',
        borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    footer: {
        padding: '20px'
    },
    confirmBtn: {
        width: '100%', padding: '15px', background: 'linear-gradient(135deg, #6b0f1a, #8b2530)',
        color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(107,15,26,0.2)'
    }
};

export default DeliveryMap;
