# nuttychocomorsels admin portal

Professional real-time management dashboard for **nuttychocomorsels** bakery. Built for speed, reliability, and ease of use.

## 🚀 Key Features

-   **Real-time Order Sync**: Instant updates for new orders using Firebase Firestore snapshots.
-   **Inventory Health**: Monitor stock levels (In Stock/Out of Stock) across the entire menu.
-   **Live Analytics**: Revenue tracking and order volume visualization for the last 7 days.
-   **PWA Integration**: Installable on Desktop/Mobile with background push notifications via FCM.
-   **Audio Alerts**: Automatic audio notifications for new incoming orders.
-   **Export Capabilities**: One-click CSV export for historical order data.
-   **Smart Navigation**: Automatic smooth scroll-to-top on section switching.

## 🛠 Tech Stack

-   **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
-   **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Cloud Messaging)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/), [Font Awesome](https://fontawesome.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

## 📦 Getting Started

### 1. Prerequisite
Ensure you have `Node.js` (latest LTS) installed.

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_VAPID_KEY=your_vapid_key
```

### 4. Run Development Server
```bash
npm run dev
```

## 🔐 Security
The dashboard is private and requires authentication. It is configured with `robots.txt` to prevent search engine indexing.

---
© 2026 nuttychocomorsels 
