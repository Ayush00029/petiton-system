# Beginner / Intermediate Full-Stack Petition System

A clean, beginner-to-intermediate level full-stack web application built with **React, Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt**.

---

## 1. Features

### Citizen
- **Register & Login** (JWT token authentication & bcrypt password hashing)
- **Create a Petition** (Title, Description, Category, Location, Target Signatures)
- **Suggest Category (AI Button)**: Click "Suggest Category" to get an AI category suggestion (`Roads`, `Water`, `Electricity`, `Garbage`, `Street Lights`, `Education`, `Healthcare`, `Other`)
- **View All Approved Petitions**: Browse petitions verified and approved by Admin
- **View Petition Details**: See title, description, location, signature goal progress, and creator details
- **Sign a Petition**: Sign approved petitions with double-signature prevention
- **View My Created Petitions**: Track petitions created by the citizen and check status (`pending`, `approved`, `rejected`)

### Admin
- **Admin Login**
- **View All Petitions**: Filter and view all petitions (`pending`, `approved`, `rejected`)
- **Approve Petition**: Change status from `pending` to `approved`
- **Reject Petition**: Change status from `pending` to `rejected`
- **Delete Petition**: Delete petitions from the platform

---

## 2. Technology Stack & Flow

```
React Component -> Axios Service -> Express Route -> Controller -> Mongoose Model -> MongoDB
```

- **Frontend**: React, React Router v6, Axios, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose)
- **Auth**: JWT & `bcryptjs`
- **AI**: Single endpoint `/api/ai/suggest-category` (Google Gemini with rule-based fallback)

---

## 3. Project Structure

```
petition-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, GetMe
│   │   ├── petitionController.js # Citizen CRUD & Admin Approve/Reject/Delete
│   │   ├── signatureController.js# Signature creation & duplicate prevention
│   │   └── aiController.js       # Suggest Category AI endpoint
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── roleMiddleware.js     # Role guard ('citizen', 'admin')
│   ├── models/
│   │   ├── User.js               # User schema (name, email, password, role)
│   │   ├── Petition.js           # Petition schema (title, description, category, location, target, count, status)
│   │   └── Signature.js          # Signature schema with compound unique index
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── petitionRoutes.js     # /api/petitions
│   │   └── aiRoutes.js           # /api/ai
│   ├── test-suite.js             # Automated API integration tests
│   ├── server.js                 # Express server entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/           # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PetitionCard.jsx
    │   │   └── PetitionStatusBadge.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global user state & token handler
    │   ├── pages/                # 8 Simple Application Pages
    │   │   ├── LandingPage.jsx   # Home Page
    │   │   ├── LoginPage.jsx     # Login Page
    │   │   ├── RegisterPage.jsx  # Register Page
    │   │   ├── PetitionsPage.jsx # Approved Petitions Discovery Page
    │   │   ├── CreatePetitionPage.jsx # Create Petition Page with AI button
    │   │   ├── PetitionDetailsPage.jsx# Details & Signature Page
    │   │   ├── MyPetitionsPage.jsx    # Citizen Created Petitions Page
    │   │   └── AdminDashboard.jsx     # Admin Review & Action Dashboard Page
    │   ├── routes/
    │   │   ├── AppRoutes.jsx     # React Router mappings
    │   │   └── ProtectedRoute.jsx# Auth & Role guard wrapper
    │   ├── services/             # Clean Axios API calls
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── petitionService.js
    │   │   └── aiService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 4. How to Run

### Backend
```bash
cd backend
npm install
node server.js
```

Run test suite:
```bash
node test-suite.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in browser.

### Demo Credentials
- **Citizen**: `citizen@civicvoice.org` / `password123`
- **Admin**: `admin@civicvoice.org` / `password123`
