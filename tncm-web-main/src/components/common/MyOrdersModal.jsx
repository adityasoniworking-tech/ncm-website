import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';

const MyOrdersModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        const fetchOrders = async () => {
            const user = auth.currentUser;
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('timestamp', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchOrders();
    }, [isOpen]);

    if (!isOpen) return null;

    const user = auth.currentUser;

    const viewOrderBill = (orderId) => {
        onClose();
        navigate(`/bill?id=${orderId}`);
    };

    return (
        <div style={{ ...styles.overlay, display: 'flex' }}>
            <div className="modal-content" style={styles.modalContent}>
                <div style={styles.stickyHeader}>
                    <span className="close-btn" onClick={onClose} style={styles.closeBtn}>&times;</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", textAlign: 'center', margin: '10px 0 0 0' }}>My Orders</h2>
                </div>

                <div id="myOrdersList">
                    {!user ? (
                        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>Please sign in to view your orders.</p>
                    ) : loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No orders found.</p>
                    ) : (
                        orders.map(order => {
                            // Date formatting logic from manual code
                            let date = 'No date';
                            let time = '';

                            if (order.timestamp) {
                                try {
                                    // Handle Firebase timestamps
                                    const orderDate = order.timestamp.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
                                    date = orderDate.toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    });
                                    time = orderDate.toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });
                                } catch (error) {
                                    console.error('Error formatting timestamp:', error);
                                    date = 'Invalid date';
                                }
                            }

                            return (
                                <div key={order.id} id={`order-row-${order.id}`} style={styles.orderRow}>
                                    <div style={styles.orderHeader}>
                                        <strong style={styles.orderId}>{order.id}</strong>
                                        <div style={styles.dateContainer}>
                                            <span style={styles.dateText}>{date}</span>
                                            {time && <><br /><span style={styles.timeText}>{time}</span></>}
                                        </div>
                                    </div>

                                    <div style={styles.itemsLine}>
                                        {order.items ? (Array.isArray(order.items) ? order.items.map(i => `${i.qty}x ${i.name}`).join(', ') : 'Order details unavailable') : 'No items'}
                                    </div>

                                    <div style={styles.orderFooter}>
                                        <strong style={{ color: '#6b0f1a', fontSize: '0.9rem' }}>
                                            ₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                                        </strong>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                onClick={() => viewOrderBill(order.id)}
                                                style={styles.billBtn}
                                                title="View Bill">
                                                🧾 Bill
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onClose();
                                                    navigate(`/tracking?id=${order.id}`);
                                                }}
                                                style={styles.trackBtn}>
                                                Track
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        zIndex: 2000, justifyContent: 'center', alignItems: 'center'
    },
    modalContent: {
        display: 'block', overflowY: 'auto', maxHeight: '90vh', padding: '20px',
        background: '#fff', width: '90%', maxWidth: '400px', borderRadius: '15px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    },
    stickyHeader: {
        position: 'sticky', top: '-20px', background: 'white', zIndex: 100,
        paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '15px'
    },
    closeBtn: {
        position: 'absolute', right: 0, top: '5px', cursor: 'pointer', fontSize: '24px'
    },
    orderRow: {
        background: '#fff', border: '1px solid #eee', padding: '15px',
        borderRadius: '12px', marginBottom: '12px', borderLeft: '5px solid #6b0f1a'
    },
    orderHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '8px', flexWrap: 'wrap', gap: '5px'
    },
    orderId: {
        fontSize: '0.75rem', color: '#6b0f1a', wordBreak: 'break-all',
        flex: 1, minWidth: '120px', textAlign: 'left', margin: 0
    },
    dateContainer: {
        textAlign: 'right', background: '#f9f9f9', padding: '5px 8px',
        borderRadius: '5px', flexShrink: 0
    },
    dateText: {
        fontSize: '0.8rem', color: '#333', fontWeight: 500
    },
    timeText: {
        fontSize: '0.7rem', color: '#666', fontWeight: 400
    },
    itemsLine: {
        fontSize: '0.85rem', color: '#666', marginBottom: '10px', lineHeight: 1.4
    },
    orderFooter: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px'
    },
    buttonGroup: {
        display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap'
    },
    billBtn: {
        background: 'linear-gradient(135deg, #28a745, #20c997)', color: 'white',
        border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer',
        fontSize: '0.7rem', fontWeight: 600, boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
        transition: 'all 0.3s ease', minWidth: '60px', whiteSpace: 'nowrap'
    },
    trackBtn: {
        background: 'linear-gradient(135deg, #6b0f1a, #8b2530)', color: 'white',
        textDecoration: 'none', padding: '6px 12px', borderRadius: '6px',
        cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
        boxShadow: '0 2px 4px rgba(107,15,26,0.3)', transition: 'all 0.3s ease',
        border: '1px solid #6b0f1a', minWidth: '60px', whiteSpace: 'nowrap',
        textAlign: 'center', display: 'inline-block'
    }
};

export default MyOrdersModal;
