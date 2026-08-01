<div align="center">
  <h1>🍛 FeastFlow</h1>
  <p><strong>Premium Full-Stack Indian Food Delivery Platform</strong></p>
</div>

<br />

FeastFlow is a production-ready, MERN-stack food delivery application engineered for scalability, seamless user experience, and robust backend management. 

Featuring an authentic Indian menu of 200+ dishes, AI-driven recommendations, and strict Role-Based Access Control (RBAC), FeastFlow is designed to handle the complete order lifecycle from the frontend customer cart to the secure Admin dashboard.

---

## 🚀 Live Demo

- **Frontend User Application:** [https://food-del-frontend-xlcw.onrender.com](https://food-del-frontend-xlcw.onrender.com)
- **Admin Dashboard:** [https://food-del-admin.onrender.com](https://food-del-admin.onrender.com)
- *(Note: Servers are hosted on Render's free tier. Initial load may take up to 60 seconds to wake from sleep mode).*

---

## 🛠️ Advanced Tech Stack

### Frontend Architecture
- **React.js & Vite:** High-performance Single Page Application (SPA) with rapid hot-module replacement.
- **Context API:** Centralized, prop-drilling-free state management for cart synchronization and user sessions.
- **Modern UI/UX:** Responsive layouts featuring CSS grid/flexbox, interactive skeleton loaders, and pulsing micro-animations.

### Backend System
- **Node.js & Express.js:** Scalable RESTful API architecture.
- **MongoDB & Mongoose:** Optimized NoSQL schemas for concurrent order processing, user profiles, and persistent address books.
- **Security:** JWT authentication, strict CORS policies, and global error handling middleware.

### DevOps & SEO
- **Google Search Console Indexed:** Dynamically generated `sitemap.xml` and `robots.txt`.
- **Social Graph Optimization:** Custom Open Graph and Twitter meta tags for rich social media sharing previews.
- **CI/CD Deployment:** Live multi-service deployments via Render.

---

## ✨ Key Features

- 🇮🇳 **Massive Scalable Database:** Over 200+ authentic Indian dishes (Biryani, Tandoori, Curries, Sweets, Street Food) automatically seeded via backend scripts, utilizing optimized high-resolution Unsplash CDNs.
- 🤖 **FeastBot AI Recommender:** A smart contextual search engine that filters the extensive database instantly based on user queries.
- 📦 **Real-Time Order Tracking:** A dynamic, visually engaging timeline that updates as admins process orders in the backend.
- 🗺️ **Persistent Address Book:** Secure user profiles that save, toggle, and auto-fill delivery coordinates via authenticated API endpoints.
- 🔐 **Admin RBAC:** A fully decoupled secure Admin panel allowing authorized staff to add, delete, and manage the live database and incoming orders.

---

## 📂 Project Structure

```text
FeastFlow/
│
├── frontend/        # React.js Customer-facing Web App
├── backend/         # Node.js API, MongoDB Schemas, & Seeding Scripts
├── admin/           # React.js Admin Dashboard (RBAC Secured)
└── README.md        # Documentation
```

---

## 💻 Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajkamal08/Food-del.git
   cd Food-del
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI and JWT_SECRET
   npm run server
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Setup Admin Panel:**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

---
<div align="center">
  <p>Engineered with ❤️ for seamless food delivery.</p>
</div>
