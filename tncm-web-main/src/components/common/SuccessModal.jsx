import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const SuccessModal = () => {
    const navigate = useNavigate();
    const { successData, closeSuccess } = useCart();
    if (!successData) return null;

    const orderId = successData.id || '';

    const handleTrack = () => {
        closeSuccess();
        navigate(`/tracking?id=${orderId}`);
    };

    const handleDownloadBill = () => {
        closeSuccess();
        navigate(`/bill?id=${orderId}`);
    };

    return (
        <div id="successModal" className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99999 }}>
            <div style={{ background: '#1a1a1a', color: 'white', padding: 40, borderRadius: 25, textAlign: 'center', border: '2px solid #c5a059', maxWidth: 380, width: '90%', position: 'relative' }}>
                <div style={{ fontSize: '4rem', marginBottom: 15 }}>🍰</div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c5a059', marginBottom: 10 }}>Sweet Success!</h2>
                <p style={{ color: '#ccc', fontSize: '0.95rem', marginBottom: 8 }}>Chef has received your order! 👨‍🍳</p>

                <div id="displayOrderId" style={{ background: '#2a2a2a', padding: 12, borderRadius: 10, margin: '20px 0', fontFamily: 'monospace', fontSize: '1.05rem', border: '1px dashed #c5a059', color: '#fff' }}>
                    {orderId ? `#${orderId}` : 'Order ID not available'}
                </div>

                <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                    <button id="trackBtn" onClick={handleTrack} style={{ background: '#c5a059', color: '#1a1a1a', border: 'none', padding: '12px 20px', borderRadius: 50, fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        Track Order →
                    </button>
                    <button id="downloadBillBtn" onClick={handleDownloadBill} style={{ background: '#10b981', color: 'white', border: 'none', padding: '12px 20px', borderRadius: 50, fontWeight: 'bold', cursor: 'pointer', flex: 1, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        📄 Bill
                    </button>
                </div>

                <p id="closeSuccess" onClick={() => closeSuccess()} style={{ marginTop: 20, fontSize: '0.9rem', color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>Close & Continue Shopping</p>
            </div>
        </div>
    );
};

export default SuccessModal;
