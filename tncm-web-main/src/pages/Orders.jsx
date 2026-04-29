import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchOrders(currentUser.uid);
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchOrders = async (uid) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'orders'),
                where('userId', '==', uid),
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

    const viewOrderBill = (orderId) => {
        navigate(`/bill?id=${orderId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#6b0f1a' }}></i>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="orders-page-container" style={styles.container}>
            <div style={styles.content}>
                <header style={styles.header}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#6b0f1a', margin: '0 0 10px 0' }}>My Orders</h1>
                    <p style={{ color: '#666' }}>Track and manage your delicious purchases</p>
                </header>

                <div style={styles.ordersList}>
                    {orders.length === 0 ? (
                        <div style={styles.emptyState}>
                            <i className="fa-solid fa-box-open" style={{ fontSize: '4rem', color: '#eee', marginBottom: '20px' }}></i>
                            <h3>No orders yet</h3>
                            <p>Once you place an order, it will appear here.</p>
                            <button onClick={() => navigate('/menu')} style={styles.shopBtn}>Explore Menu</button>
                        </div>
                    ) : (
                        orders.map(order => {
                            let date = 'No date';
                            let time = '';
                            if (order.timestamp) {
                                const orderDate = order.timestamp.toDate ? order.timestamp.toDate() : new Date(order.timestamp);
                                date = orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
                                time = orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                            }

                            return (
                                <div key={order.id} style={styles.orderCard}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.orderMainInfo}>
                                            <span style={styles.orderLabel}>Order ID</span>
                                            <strong style={styles.orderId}>#{order.id}</strong>
                                        </div>
                                        <div style={styles.orderStatusBadge}>
                                            {order.status || 'Received'}
                                        </div>
                                    </div>

                                    <div style={styles.cardBody}>
                                        <div style={styles.infoRow}>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Placed On</span>
                                                <span style={styles.value}>{date} at {time}</span>
                                            </div>
                                            <div style={styles.infoCol}>
                                                <span style={styles.label}>Total Amount</span>
                                                <span style={styles.amount}>₹{order.totalAmount?.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div style={styles.itemsSection}>
                                            <span style={styles.label}>Items Ordered</span>
                                            <div style={styles.itemsList}>
                                                {order.items?.map((item, idx) => (
                                                    <span key={idx} style={styles.itemTag}>
                                                        {item.qty}x {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={styles.cardFooter}>
                                        <button onClick={() => viewOrderBill(order.id)} style={styles.secondaryBtn}>
                                            <i className="fa-solid fa-file-invoice"></i> View Bill
                                        </button>
                                        <button onClick={() => navigate(`/tracking?id=${order.id}`)} style={styles.primaryBtn}>
                                            <i className="fa-solid fa-location-dot"></i> Track Order
                                        </button>
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
    container: { padding: '40px 5%', background: '#fcf8f8', minHeight: '80vh' },
    content: { maxWidth: '800px', margin: '0 auto' },
    header: { marginBottom: '30px', textAlign: 'center' },
    ordersList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    emptyState: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    shopBtn: { marginTop: '20px', padding: '12px 25px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' },
    orderCard: { background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #f0f0f0' },
    cardHeader: { padding: '20px', background: '#fdfdfd', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    orderMainInfo: { display: 'flex', flexDirection: 'column' },
    orderLabel: { fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' },
    orderId: { fontSize: '1.1rem', color: '#333' },
    orderStatusBadge: { padding: '6px 15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' },
    cardBody: { padding: '20px' },
    infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
    infoCol: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '0.8rem', color: '#999', fontWeight: '600' },
    value: { fontSize: '0.95rem', color: '#444' },
    amount: { fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' },
    itemsSection: { borderTop: '1px dashed #eee', paddingTop: '15px' },
    itemsList: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
    itemTag: { padding: '5px 12px', background: '#f8f9fa', borderRadius: '15px', fontSize: '0.85rem', color: '#666', border: '1px solid #eee' },
    cardFooter: { padding: '15px 20px', background: '#fdfdfd', borderTop: '1px solid #f5f5f5', display: 'flex', gap: '10px' },
    primaryBtn: { flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.3s' },
    secondaryBtn: { padding: '12px 20px', background: 'white', color: '#666', border: '1px solid #ddd', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }
};

export default Orders;