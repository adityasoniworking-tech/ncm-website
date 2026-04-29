import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';

const loadJSPDF = async () => {
    if (window.jspdf) return window.jspdf;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => resolve(window.jspdf);
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const Bill = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const billRef = useRef(null);
    const [generating, setGenerating] = useState(false);
    const [orderData, setOrderData] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(!location.state?.order);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderData) return;
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('id');
        if (!orderId) {
            setError("No Order ID provided.");
            setLoading(false);
            return;
        }
        const fetchOrder = async () => {
            try {
                const docRef = doc(db, 'orders', orderId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setOrderData({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Order not found.");
                }
            } catch (err) {
                setError("Failed to fetch order details.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderData]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', minHeight: '80vh' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#6b0f1a' }}></i>
                <p style={{ marginTop: '20px', fontWeight: '600', color: '#666' }}>Generating Professional Invoice...</p>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', minHeight: '80vh' }}>
                <h2 style={{ color: '#d9534f' }}>{error || "Order Not Found"}</h2>
                <button onClick={() => navigate('/orders')} style={{ marginTop: '20px', padding: '10px 25px', background: '#6b0f1a', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer' }}>View All Orders</button>
            </div>
        );
    }

    const { id, items = [], timestamp, status, userName, phone, userEmail, address, deliveryCharge, totalAmount } = orderData;

    const orderDate = timestamp
        ? new Date(timestamp.seconds * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A';

    const orderTime = timestamp
        ? new Date(timestamp.seconds * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        : 'N/A';

    const subtotal = items.reduce((total, item) => total + ((item.price || 0) * (item.qty || 1)), 0);
    const finalDelCharge = deliveryCharge || 0;
    const finalTotal = totalAmount || (subtotal + finalDelCharge);

    const handleDownloadPDF = async () => {
        if (!billRef.current) return;
        try {
            setGenerating(true);
            const { jsPDF } = await loadJSPDF();

            // Temporarily add a class to force desktop layout during capture
            billRef.current.classList.add('pdf-export-mode');

            const canvas = await html2canvas(billRef.current, { 
                scale: 3, 
                useCORS: true, 
                backgroundColor: '#ffffff',
                windowWidth: 850 // Force the virtual window width to desktop
            });

            // Remove the class immediately after capture
            billRef.current.classList.remove('pdf-export-mode');

            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`Invoice_${id}.pdf`);
        } catch (error) {
            billRef.current.classList.remove('pdf-export-mode');
            alert('Failed to download PDF.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="invoice-page-wrapper" style={styles.pageWrapper}>
            <SEO title={`Invoice #${id}`} description="Nutty Choco Morsels Order Invoice" />

            <motion.div 
                ref={billRef} 
                className="invoice-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.invoiceWrapper}
            >
                {/* Invoice Header */}
                <div className="invoice-header" style={styles.header}>
                    <div style={styles.headerLeft}>
                        <h1 className="brand-name" style={styles.brandName}>NUTTY CHOCO MORSELS</h1>
                        <p style={styles.tagline}>Premium Artisanal Bakery</p>
                        <div style={styles.companyDetails}>
                            <p>Sargasan, Gandhinagar, Gujarat</p>
                            <p>+91 99787 44573 | nuttychocomorsels@gmail.com</p>
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <h2 className="invoice-label" style={styles.invoiceTitle}>INVOICE</h2>
                        <div style={styles.invoiceMeta}>
                            <p><span>ID:</span> <strong>#{id}</strong></p>
                            <p><span>Date:</span> <strong>{orderDate}</strong></p>
                            <p><span>Time:</span> <strong>{orderTime}</strong></p>
                        </div>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="billing-grid" style={styles.billingSection}>
                    <div style={styles.billTo}>
                        <h3 style={styles.sectionHeading}>BILL TO</h3>
                        <p style={styles.customerName}>{userName || 'Valued Customer'}</p>
                        <p style={styles.customerDetail}>{phone}</p>
                        <p style={styles.customerDetail}>{userEmail}</p>
                        <p style={styles.customerAddress}>{address}</p>
                    </div>
                    <div className="status-container" style={styles.statusBox}>
                        <h3 style={styles.sectionHeading}>PAYMENT STATUS</h3>
                        <div style={{ ...styles.statusBadge, background: status?.toLowerCase() === 'delivered' ? '#e6fffa' : '#fff5f5', color: status?.toLowerCase() === 'delivered' ? '#2c7a7b' : '#c53030' }}>
                            {status || 'Order Received'}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div style={styles.tableSection}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>DESCRIPTION</th>
                                    <th style={{ ...styles.th, textAlign: 'center' }}>QTY</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>PRICE</th>
                                    <th style={{ ...styles.th, textAlign: 'right' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, idx) => (
                                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                        <td style={styles.td}>{item.name}</td>
                                        <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                                        <td style={{ ...styles.td, textAlign: 'right' }}>₹{item.price?.toFixed(2)}</td>
                                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.qty).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                <div className="summary-grid" style={styles.summarySection}>
                    <div className="notes-box" style={styles.notes}>
                        <h3 style={styles.sectionHeading}>NOTES</h3>
                        <p style={styles.noteText}>Thank you for choosing Nutty Choco Morsels! We hope you enjoy our freshly baked artisanal delights. Please keep this invoice for your records.</p>
                    </div>
                    <div className="totals-box" style={styles.totals}>
                        <div style={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.totalRow}>
                            <span>Delivery Charges</span>
                            <span>{finalDelCharge === 0 ? 'FREE' : `₹${finalDelCharge.toFixed(2)}`}</span>
                        </div>
                        <div className="grand-total-row" style={styles.grandTotal}>
                            <span>GRAND TOTAL</span>
                            <span>₹{finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="bill-actions" style={styles.actions}>
                <button onClick={handleDownloadPDF} disabled={generating} style={styles.downloadBtn}>
                    {generating ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
                </button>
                <button onClick={() => navigate('/orders')} style={styles.backBtn}>BACK TO ORDERS</button>
            </div>
        </div>
    );

};

const styles = {
    invoiceWrapper: { background: 'white', width: '100%', maxWidth: '850px', padding: '50px', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', color: '#333', position: 'relative' },
    header: { display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #6b0f1a', paddingBottom: '30px', marginBottom: '40px' },
    brandName: { fontSize: '2.2rem', fontWeight: '800', color: '#6b0f1a', letterSpacing: '-1px', margin: 0 },
    tagline: { fontSize: '1rem', color: '#999', margin: '5px 0 15px 0', fontWeight: '500' },
    companyDetails: { fontSize: '0.9rem', color: '#666', lineHeight: '1.5' },
    headerRight: { textAlign: 'right' },
    invoiceTitle: { fontSize: '3rem', fontWeight: '900', color: '#f0f0f0', margin: '-10px 0 10px 0' },
    invoiceMeta: { fontSize: '0.9rem', lineHeight: '1.8' },
    billingSection: { display: 'flex', justifyContent: 'space-between', marginBottom: '50px' },
    sectionHeading: { fontSize: '0.8rem', fontWeight: '800', color: '#6b0f1a', letterSpacing: '1px', marginBottom: '15px' },
    customerName: { fontSize: '1.4rem', fontWeight: '700', margin: '0 0 10px 0' },
    customerDetail: { fontSize: '0.95rem', color: '#555', margin: '3px 0' },
    customerAddress: { fontSize: '0.95rem', color: '#555', marginTop: '10px', maxWidth: '300px', lineHeight: '1.6' },
    statusBox: { textAlign: 'right' },
    statusBadge: { padding: '8px 20px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '800', display: 'inline-block', textTransform: 'uppercase' },
    tableSection: { marginBottom: '50px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#f8f9fa', color: '#6b0f1a', padding: '15px', fontSize: '0.85rem', fontWeight: '800', borderBottom: '2px solid #eee' },
    td: { padding: '15px', fontSize: '1rem', borderBottom: '1px solid #eee' },
    summarySection: { display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #eee', paddingTop: '30px' },
    notes: { width: '50%' },
    noteText: { fontSize: '0.9rem', color: '#888', lineHeight: '1.6' },
    totals: { width: '40%' },
    totalRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '1rem', color: '#666', gap: '10px' },
    grandTotal: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', padding: '20px 0', borderTop: '2px solid #6b0f1a', marginTop: '10px', fontSize: '1.4rem', fontWeight: '800', color: '#6b0f1a', gap: '10px' },
    footer: { marginTop: '60px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px', fontSize: '0.8rem', color: '#bbb' },
    actions: { display: 'flex', gap: '20px', marginTop: '40px' },
    downloadBtn: { padding: '16px 35px', background: '#6b0f1a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px' },
    backBtn: { padding: '16px 35px', background: 'white', color: '#6b0f1a', border: '2px solid #6b0f1a', borderRadius: '4px', fontWeight: '800', cursor: 'pointer', letterSpacing: '1px' }
};

export default Bill;

