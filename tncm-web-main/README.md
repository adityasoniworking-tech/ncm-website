# NCM Consumer Web

The official customer-facing storefront for **Nutty Choco Morsels** - Premium Bakery Delights. Designed to provide a premium, seamless shopping experience.

## ✨ Features

-   **Dynamic Menu**: Browse 100% eggless bakery treats with real-time stock status.
-   **Seamless Checkout**: Integrated cart system for local bakery orders.
-   **Order Tracking**: Real-time status updates from "Pending" to "Delivered".
-   **PWA Ready**: Installable application with full-screen optimization and offline persistence.
-   **Mobile First**: Responsive design optimized for all screen sizes (including notch/full-screen support).
-   **High Performance**: Lazy-loaded assets and optimized background synchronization.

## 🛠 Tech Stack

-   **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
-   **Database**: [Firebase](https://firebase.google.com/) (Firestore with persistent local cache)
-   **Styling**: Vanilla CSS with modern Flex/Grid layouts.
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Deployment**: [Vercel](https://vercel.com/)

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Build & Run
```bash
# Run locally
npm run dev

# Build for production
npm run build
```

## 📱 Mobile Experience
The app includes PWA meta tags and `viewport-fit=cover` to ensure a native-like experience on iOS and Android devices, utilizing the full screen area including the status bar.

---
© 2026 Nutty Choco Morsels 
