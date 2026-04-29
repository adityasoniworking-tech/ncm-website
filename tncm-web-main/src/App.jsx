import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
// Placeholder components mapping to the original pages
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import WhatsAppSelect from './pages/WhatsAppSelect';
import Tracking from './pages/Tracking';
import Bill from './pages/Bill';
import Offline from './pages/Offline';
import { CartProvider } from './context/CartContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CartProvider>
        <Layout />
      </CartProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "menu", element: <Menu /> },
      { path: "contact", element: <Contact /> },
      { path: "orders", element: <Orders /> },
      { path: "profile", element: <Profile /> },
      { path: "whatsapp-select", element: <WhatsAppSelect /> },
      { path: "tracking", element: <Tracking /> },
      { path: "bill", element: <Bill /> },
      { path: "offline", element: <Offline /> },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
