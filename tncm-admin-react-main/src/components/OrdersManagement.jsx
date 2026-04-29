import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, writeBatch, getDocs, limit } from 'firebase/firestore';

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null); // For details modal

    useEffect(() => {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedOrders = [];
            snapshot.forEach((doc) => {
                fetchedOrders.push({ id: doc.id, ...doc.data() });
            });
            setOrders(fetchedOrders);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        const confirmMsg = newStatus === 'Rejected'
            ? 'Are you sure you want to reject this order?'
            : `Update status to ${newStatus}?`;

        if (['Accepted', 'Ready', 'Delivered'].includes(newStatus) || window.confirm(confirmMsg)) {
            try {
                const orderRef = doc(db, 'orders', orderId);
                await updateDoc(orderRef, { status: newStatus });
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status.");
            }
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to Archive/Delete this order?")) {
            try {
                await deleteDoc(doc(db, 'orders', orderId));
            } catch (error) {
                console.error("Error deleting order:", error);
                alert("Failed to delete order.");
            }
        }
    };

    const handleDeleteAllOrders = async () => {
        const confirm1 = window.confirm("⚠️ ARE YOU SURE? All orders will be permanently deleted from the database!");
        if (!confirm1) return;

        const confirm2 = window.prompt("Type 'DELETE' to confirm deletion of all orders:");
        if (confirm2 !== "DELETE") {
            alert("Action cancelled. Spelling was incorrect or action was aborted.");
            return;
        }

        try {
            // Because batch size is limited to 500, we should fetch and delete in batches if there are many.
            // For typical moderate usage, one batch might suffice, but we'll implement a safe loop.
            const ordersRef = collection(db, 'orders');
            let isDeleting = true;
            let totalDeleted = 0;

            while (isDeleting) {
                const snapshot = await getDocs(query(ordersRef, limit(500)));
                if (snapshot.empty) {
                    isDeleting = false;
                    break;
                }

                const batch = writeBatch(db);
                snapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
                totalDeleted += snapshot.size;
            }

            if (totalDeleted > 0) {
                alert(`✅ Successfully deleted ${totalDeleted} orders.`);
            } else {
                alert("No orders to delete.");
            }

        } catch (error) {
            console.error("Error deleting all orders:", error);
            alert("Error: " + error.message);
        }
    };

    const handleOpenMap = (address, coordinates, customerName) => {
        if (coordinates && coordinates.lat && coordinates.lng) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`, '_blank');
        } else if (address) {
            const encodedAddress = encodeURIComponent(address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
        } else {
            alert('No location info available.');
        }
    };

    const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(term) ||
            (order.userName || '').toLowerCase().includes(term) ||
            (order.phone || '').toLowerCase().includes(term)
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
            case 'Payment Awaited': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Ready': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const OrderCard = ({ order }) => {
        const timeAgo = order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString('en-IN') : "Just now";
        const needsAction = order.status === 'Pending' || order.status === 'Payment Awaited';
        const isAccepted = order.status === 'Accepted';
        const isReady = order.status === 'Ready';

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-4 border-b border-gray-50 flex justify-between items-start bg-gray-50/50">
                    <div>
                        <div className="text-[10px] font-mono text-gray-500 font-medium break-all">#{order.id}</div>
                        <div className="text-[11px] text-gray-400 mt-1">{timeAgo}</div>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ml-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>

                {/* Body */}
                <div className="p-4 flex-grow flex flex-col gap-3">
                    {/* Customer Info */}
                    <div>
                        <div className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <i className="fa-solid fa-user text-gray-400 text-xs"></i> {order.userName || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <i className="fa-solid fa-phone text-gray-400 text-xs"></i> {order.phone || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1 truncate" title={order.userEmail}>
                            <i className="fa-solid fa-envelope text-gray-400 text-xs"></i> {order.userEmail || 'N/A'}
                        </div>
                    </div>

                    {/* Delivery / Address */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex justify-between">
                            <span>Delivery Details</span>
                            <span className={order.deliveryType === 'Self Pickup' ? 'text-purple-600' : 'text-blue-600'}>
                                {order.deliveryType === 'Self Pickup' ? 'Pickup' : 'Delivery'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium line-clamp-2 leading-snug">
                            {order.deliveryType === 'Self Pickup' ? 'Store Pickup' : (order.address || 'No address provided')}
                        </p>
                    </div>

                    {/* Price Recap */}
                    <div className="mt-auto">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-xs text-gray-500">Items ({order.items?.length || 0}): ₹{order.subtotal?.toFixed(2)}</span>
                            {order.deliveryCharge > 0 && <span className="text-xs text-amber-600">Del: ₹{order.deliveryCharge.toFixed(2)}</span>}
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2">
                            <span className="text-xs font-bold text-gray-400">
                                {order.paymentMethod === 'UPI' ? 'UPI' : 'COD'}
                            </span>
                            <span className="text-lg font-black text-emerald-600">
                                ₹{order.totalAmount?.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons (Map / Items) */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {order.deliveryType !== 'Self Pickup' && (
                            <button
                                onClick={() => handleOpenMap(order.address, order.coordinates, order.userName)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                                <i className="fa-solid fa-map-location-dot"></i> Map
                            </button>
                        )}
                        <button
                            onClick={() => setSelectedOrder(order)}
                            className={`${order.deliveryType === 'Self Pickup' ? 'col-span-2' : ''} bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5`}
                        >
                            <i className="fa-solid fa-box-open"></i> View Items
                        </button>
                    </div>
                </div>

                {/* Status Update Actions */}
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                    {needsAction ? (
                        <div className="flex gap-2">
                            <button type="button" onClick={() => handleUpdateStatus(order.id, 'Accepted')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1">
                                <i className="fa-solid fa-check"></i> Accept
                            </button>
                            <button type="button" onClick={() => handleUpdateStatus(order.id, 'Rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1">
                                <i className="fa-solid fa-xmark"></i> Reject
                            </button>
                        </div>
                    ) : isAccepted ? (
                        <button type="button" onClick={() => handleUpdateStatus(order.id, 'Ready')} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1">
                            <i className="fa-solid fa-cookie-bite"></i> Mark Ready
                        </button>
                    ) : isReady ? (
                        <button type="button" onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1">
                            <i className="fa-solid fa-truck"></i> Delivered
                        </button>
                    ) : (
                        <button type="button" onClick={() => handleDeleteOrder(order.id)} className="w-full bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 py-2 rounded-xl text-xs font-bold transition flex justify-center items-center gap-1">
                            <i className="fa-solid fa-trash"></i> Archive Order
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header & Search */}
            <div className="bg-white p-5 lg:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex flex-col items-center justify-center shrink-0">
                        <i className="fa-solid fa-receipt text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800">Live Orders</h2>
                        <p className="text-sm text-gray-500 font-medium">{filteredOrders.length} orders found</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-grow sm:w-72">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium transition-all"
                        />
                    </div>
                    <button
                        onClick={handleDeleteAllOrders}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center justify-center w-full sm:w-auto gap-2 shadow-sm"
                        title="Delete All Orders in Database"
                    >
                        <i className="fa-solid fa-trash-can"></i> Clear All
                    </button>
                </div>
            </div>

            {/* Content Body */}
            {loading ? (
                <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center text-gray-400">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl mb-3"></i>
                    <p className="font-bold">Loading live orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <i className="fa-solid fa-box-open text-4xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">No Orders Found</h3>
                    <p className="text-gray-500">Wait for incoming orders or adjust your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOrders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slideUp">

                        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
                            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <i className="fa-solid fa-list-check text-blue-500"></i> Order Details
                            </h3>
                            <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Order ID</span>
                                    <span className="font-mono text-gray-700 font-medium">{selectedOrder.id}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Customer</span>
                                    <span className="text-gray-700 font-medium">{selectedOrder.userName || 'Guest'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Address</span>
                                    <span className="text-gray-700">{selectedOrder.address || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Item List */}
                            <div>
                                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">Items Purchased</h4>
                                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="p-3 flex justify-between items-center bg-white">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-slate-100 text-slate-600 font-bold text-xs px-2 py-1 rounded-md">{item.qty}x</span>
                                                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-emerald-600 text-sm">₹{(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Total */}
                        <div className="p-4 sm:p-5 bg-slate-50 border-t border-gray-100 rounded-b-3xl flex justify-between items-center">
                            <span className="font-bold text-slate-600">Total Amount</span>
                            <span className="text-2xl font-black text-emerald-600">₹{selectedOrder.totalAmount?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
