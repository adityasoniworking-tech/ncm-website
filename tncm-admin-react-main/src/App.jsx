import { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import OrdersManagement from './components/OrdersManagement';
import Settings from './components/Settings';
import Login from './components/Login';
import PWAUpdater from './components/PWAUpdater';
import { db, messaging } from './firebase';
import { collection, onSnapshot, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { getToken } from 'firebase/messaging';
import { subDays, startOfDay, isSameDay, format } from 'date-fns';

function App() {
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem('ncm_admin_active_section') || 'dashboard'
  );

  // Sync section to localStorage
  useEffect(() => {
    localStorage.setItem('ncm_admin_active_section', activeSection);
    // Scroll to top when section changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('ncm_admin_auth') === 'true'
  );

  // Stats State
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
    chartData: [],
  });

  // Inventory Health State
  const [inventory, setInventory] = useState({
    inStock: 0,
    outOfStock: 0,
    total: 0,
  });

  // Ref to prevent notification on initial load
  const isInitialLoad = useRef(true);

  // Request Notification Permissions and FCM Token on mount
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        if (!('Notification' in window)) return;

        const permission = await Notification.requestPermission();
        if (permission === 'granted' && isAuthenticated) {

          // Wait for service worker registration to be ready
          const registration = await navigator.serviceWorker.ready;

          // Get the FCM Token using our explicit service worker
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY, // Reading from .env
            serviceWorkerRegistration: registration
          });

          if (currentToken) {
            // Save token to Firestore so backend can send alerts
            // Using the explicitly permitted /fcmTokens/ collection
            await setDoc(doc(db, 'fcmTokens', 'admin_device_token'), {
              fcmToken: currentToken,
              lastUpdated: new Date().toISOString()
            }, { merge: true });
            console.log("FCM Token registered and saved to /fcmTokens/.");
          }
        }
      } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
      }
    };

    requestNotificationPermission();
  }, [isAuthenticated]);

  // Real-time Orders Listener
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      let total = snapshot.size;
      let pending = 0;
      let rev = 0;

      // Check for specifically NEW orders (after initial load)
      if (!isInitialLoad.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const order = change.doc.data();

            // Play Audio Alert
            const audio = new Audio('/alert.mp3');
            audio.play().catch(e => console.log('Audio play failed due to browser policy:', e));

            // Show Browser Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New Order Received!', {
                body: `Order #${change.doc.id.slice(0, 8)} from ${order.userName || 'Guest'}. Amount: ₹${order.totalAmount || 0}`,
                icon: '/vite.svg'
              });
            }
          }
        });
      }

      // After first pass, set initial load to false
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      }


      // Initialize an array for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
          name: format(d, 'eee'), // Mon, Tue, etc.
          rawDate: startOfDay(d),
          revenue: 0,
          orders: 0
        };
      });

      snapshot.docs.forEach(doc => {
        const order = doc.data();
        const orderDate = order.timestamp?.toDate ? order.timestamp.toDate() : new Date();

        if (order.status === 'Pending' || order.status === 'Payment Awaited') {
          pending++;
        }
        if (['Accepted', 'Ready', 'Delivered'].includes(order.status)) {
          const amount = (order.totalAmount || 0);
          rev += amount;

          // Add to chart data
          const dayMatch = last7Days.find(d => isSameDay(d.rawDate, startOfDay(orderDate)));
          if (dayMatch) {
            dayMatch.revenue += amount;
            dayMatch.orders += 1;
          }
        }
      });

      setStats({
        totalOrders: total,
        pendingOrders: pending,
        revenue: rev,
        chartData: last7Days.map(({ name, revenue, orders }) => ({ name, revenue, orders }))
      });
    }, (error) => {
      console.error("Error fetching orders:", error);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Menu Listener
  useEffect(() => {
    const menuRef = collection(db, 'menu');
    const unsubscribe = onSnapshot(menuRef, (snapshot) => {
      let inStock = 0;
      let outOfStock = 0;
      let total = snapshot.size;

      snapshot.docs.forEach(doc => {
        const item = doc.data();
        if (item.inStock === true) {
          inStock++;
        } else {
          outOfStock++;
        }
      });

      setInventory({
        inStock,
        outOfStock,
        total,
      });
    }, (error) => {
      console.error("Error fetching menu:", error);
    });

    return () => unsubscribe();
  }, []);

  const exportData = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const snapshot = await getDocs(ordersRef);
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      let csv = '--- DASHBOARD SUMMARY ---\n';
      csv += `Total Orders,${orders.length}\n`;
      csv += `Pending Orders,${stats.pendingOrders}\n`;
      csv += `Total Revenue,₹${stats.revenue.toFixed(2)}\n`;
      csv += `Export Date,${new Date().toLocaleString('en-IN')}\n\n`;

      csv += 'Order ID,Customer Name,Phone,Email,Address,Items Ordered,Payment Method,Total Amount,Status,Timestamp\n';

      orders.forEach(order => {
        const customerName = order.userName || order.customerName || 'Guest';
        const phone = order.phone || 'N/A';
        const email = order.userEmail || 'N/A';
        const address = (order.address || 'N/A').replace(/["\r\n]/g, ' ');
        const items = order.items ? order.items.map(i => `${i.qty}x ${i.name}`).join('; ') : 'N/A';
        const payment = order.paymentMethod || 'N/A';
        const total = order.totalAmount || 0;
        const status = order.status || 'Pending';
        const date = order.timestamp?.toDate ? order.timestamp.toDate().toLocaleString('en-IN') : 'N/A';

        csv += `"${order.id}","${customerName}","${phone}","${email}","${address}","${items}","${payment}","${total}","${status}","${date}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert('Orders data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const refreshStats = () => {
    // With real-time listeners, this is just for visual confirmation
    alert('Dashboard statistics are up-to-date (Live Sync Enabled)');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            stats={stats}
            inventory={inventory}
            exportData={exportData}
            refreshStats={refreshStats}
            onNavigate={setActiveSection}
          />
        );
      case 'orders':
        return <OrdersManagement />;
      case 'menu':
        return <MenuManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Section Not Found</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={() => {
          sessionStorage.setItem('ncm_admin_auth', 'true');
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <Layout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      pendingCount={stats.pendingOrders}
    >
      <PWAUpdater />
      <div className="py-2">
        {renderSection()}
      </div>
    </Layout>
  );
}

export default App;
