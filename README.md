# MOVERS & PACKERS MANAGEMENT SYSTEM (MPMS)

> **Move Smarter. Move Safer.**  
> A Complete Full-Stack MERN Application (**MongoDB, Express.js, React.js, Node.js + Bootstrap 5**) featuring an **Animated Stars & Circles Ambient Background**, Interactive Three.js 3D Logistics Hero, Dynamic MongoDB Service Catalog, Quotation & Booking Engine, Consignment Milestone Tracker, and Enterprise Admin Console.

---

## 1. Project Title & Overview
**Movers & Packers Management System (MPMS)** is an end-to-end full-stack web application designed for a modern relocation and logistics enterprise. It bridges the communication and operational gap between customers needing residential, commercial, or vehicular shifting and the movers & packers company coordinators.

### Key Highlights
- **100% Native Node.js & Express.js Backend**: Built with standard JavaScript (`.js`) modules—no TypeScript compilation required to execute the backend.
- **Real MongoDB & Mongoose Integration**: Full document modeling with Mongoose schemas, indexes, validation, and auto-seeding. Supports local MongoDB Community Server, MongoDB Atlas, and standalone embedded fallback.
- **Animated Stars & Circles Background**: High-performance CSS GPU-accelerated ambient universe featuring twinkling 4-point sparkle stars, glowing nebula circles/orbs, rotating geometric radar rings, concentric pulse circles, and diagonal shooting stars.
- **Three.js 3D Hero Viewport**: Lightweight WebGL container truck and corrugated moving cargo simulation with play/pause and camera view toggles.
- **Customer Relocation Engine**: Dynamic MongoDB service catalog, 11-field validated booking & tariff quotation system, unique Booking ID generation (`MPMS-2026-XXXX`), and live 4-stage tracking.
- **JWT + Bcrypt Admin Console**: Protected admin dashboard with 9 live statistics cards, full CRUD on services, booking status progression, enquiry handling, customer history lookup, and print-ready MIS reports.

---

## 2. Technology Stack

| Layer | Technology | Description & Role |
| :--- | :--- | :--- |
| **Backend Runtime** | **Node.js (v18+)** | High-performance asynchronous JavaScript server runtime |
| **Backend Framework** | **Express.js (v4.21+)** | RESTful routing, controllers, security middleware, and JSON APIs |
| **Database** | **MongoDB & Mongoose (v8+)** | NoSQL document database with strict Mongoose schema validation |
| **Frontend** | **React.js & JavaScript** | Component-driven Single Page Application (SPA) architecture |
| **UI Framework** | **Bootstrap 5 & Tailwind CSS** | Responsive grid system, typography, modern utility classes |
| **Ambient Visuals** | **Animated Stars & Circles + Three.js** | Twinkling stars, floating orbs, radar rings + 3D logistics hero |
| **Security** | **Bcrypt.js & JSON Web Tokens (JWT)** | Salted password hashing, stateless Bearer token authorization |

---

## 3. Animated Stars & Circles Background System

The application features a modern, responsive, and GPU-accelerated **Stars & Circles Visual Engine** (`src/components/AnimatedBackground.tsx` + `src/index.css`) that delivers a futuristic, high-tech logistics ambiance:

### Visual Elements
1. **Twinkling Stars & Sparkles**:
   - 48+ mathematically distributed stars across the viewport.
   - 4-point SVG cross sparkle stars that pulsate with glowing cyan, golden, and purple luminescence.
   - Micro glowing star points that shimmer at randomized intervals (`mpms-twinkle`, `mpms-twinkle-gold`).
   - Diagonal shooting stars / comets that periodically streak across the night sky.
2. **Floating Glowing Circles & Orbs**:
   - Large ambient orbs (320px–520px) with soft radial gradients and backdrop blur (`filter: blur(60px)`).
   - Gentle floating keyframe motion (`mpms-float-slow` and `mpms-float-reverse`) creating visual depth.
3. **Geometric Radar Rings & Tech Circles**:
   - Concentric dashed circles with orbital satellite dots that rotate continuously (`mpms-rotate-slow`, `mpms-rotate-reverse`).
   - Pulsing concentric rings (`mpms-pulse-ring`) inspired by real-time fleet GPS radar sweeps.
4. **Theme Adaptation & Glassmorphism**:
   - **Dark Mode**: Cosmic deep night sky (`#090e1a`) with electric cyan, purple, and gold shimmering stars.
   - **Light Mode**: Crisp ethereal sky with subtle pastel blue and amber ambient orbs and delicate stars.
   - **Backdrop Blur**: Content surfaces utilize `rgba(..., 0.88)` with `backdrop-filter: blur(12px)` so the stars and circles gently drift behind cards without impeding legibility.
5. **Zero Interaction Interference**:
   - Styled with `pointer-events: none` and `z-index: 0` so form inputs, buttons, and navigation remain 100% clickable.
   - Respects user accessibility preferences via `@media (prefers-reduced-motion: reduce)`.

---

## 4. Application Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     React.js + Bootstrap 5 Frontend                     │
│   (Animated Stars & Circles, 3D Hero, Booking Forms, Admin Console)     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                             HTTP REST API (JSON)
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                    Node.js + Express.js Backend Server                  │
│                     (Executed natively via Node.js)                     │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Middleware: CORS, JSON Parser, Auth JWT, Sanitization           │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│   ┌────────────────────────────────▼────────────────────────────────┐   │
│   │ Express Routers:                                                │   │
│   │  /api/auth       → authRoutes.js       (Login, Register, Token) │   │
│   │  /api/services   → serviceRoutes.js    (CRUD Services)          │   │
│   │  /api/bookings   → bookingRoutes.js    (Bookings & Tracking)    │   │
│   │  /api/enquiries  → enquiryRoutes.js    (Contact & Inquiries)    │   │
│   │  /api/users      → userRoutes.js       (User Management)        │   │
│   │  /api/dashboard  → dashboardRoutes.js  (Live Stats Aggregation) │   │
│   │  /api/reports    → reportRoutes.js     (MIS Filtered Reports)   │   │
│   │  /api/pages      → pageRoutes.js       (CMS About & Contact)    │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│   ┌────────────────────────────────▼────────────────────────────────┐   │
│   │ Controllers (JS Business Logic):                                │   │
│   │  authController.js, bookingController.js, serviceController.js...│   │
│   └────────────────────────────────┬────────────────────────────────┘   │
│                                    │                                    │
│   ┌────────────────────────────────▼────────────────────────────────┐   │
│   │ Mongoose Models (ODM Schemas):                                  │   │
│   │  Admin.js, User.js, Service.js, Booking.js, Enquiry.js, Page.js │   │
│   └────────────────────────────────┬────────────────────────────────┘   │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                             Mongoose Driver
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                             MongoDB Database                            │
│                 (Local Community Server or MongoDB Atlas)                │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Directory Structure

```text
mpms-fullstack/
├── backend/                        # Node.js + Express.js Backend (Pure JavaScript)
│   ├── config/
│   │   └── db.js                   # Mongoose connection & MongoDB setup
│   ├── controllers/
│   │   ├── authController.js       # JWT login, registration, password hashing
│   │   ├── bookingController.js    # Booking submission, ID generation, tracking
│   │   ├── dashboardController.js  # Live statistics & MongoDB collection inspection
│   │   ├── enquiryController.js    # Customer support enquiry handling
│   │   ├── pageController.js       # Dynamic About Us and Contact info CMS
│   │   ├── reportController.js     # Filtered MIS booking and enquiry reports
│   │   ├── serviceController.js    # Service catalog CRUD operations
│   │   └── userController.js       # Customer records and move history
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT Bearer verification & NoSQL sanitization
│   ├── models/
│   │   ├── Admin.js                # Mongoose schema for Admin accounts
│   │   ├── Booking.js              # Mongoose schema for Consignments & Tracking
│   │   ├── Enquiry.js              # Mongoose schema for Customer Enquiries
│   │   ├── Page.js                 # Mongoose schema for CMS pages
│   │   ├── Service.js              # Mongoose schema for Moving Services
│   │   └── User.js                 # Mongoose schema for Customer Profiles
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth endpoints
│   │   ├── bookingRoutes.js        # /api/bookings endpoints
│   │   ├── dashboardRoutes.js      # /api/dashboard endpoints
│   │   ├── enquiryRoutes.js        # /api/enquiries endpoints
│   │   ├── pageRoutes.js           # /api/pages endpoints
│   │   ├── reportRoutes.js         # /api/reports endpoints
│   │   ├── serviceRoutes.js        # /api/services endpoints
│   │   └── userRoutes.js           # /api/users endpoints
│   ├── utils/
│   │   └── store.js                # Document repository & seed initialization
│   ├── server.js                   # Dedicated standalone Express server
│   └── .env.example                # Backend environment configuration
│
├── src/                            # React.js Frontend
│   ├── admin/
│   │   └── AdminPortal.tsx         # Complete Admin Dashboard & Management UI
│   ├── assets/
│   │   └── images/                 # Generated logistics & relocation imagery
│   ├── components/
│   │   ├── AnimatedBackground.tsx  # Animated Stars, Orbs, and Radar Circles
│   │   ├── Footer.tsx              # Corporate footer with direct links
│   │   ├── LogisticsHero3D.tsx     # Three.js 3D Container Truck & Cargo scene
│   │   ├── Navbar.tsx              # Responsive top navigation with theme toggle
│   │   └── SmartImage.tsx          # Resilient image component with fallback
│   ├── context/
│   │   ├── AuthContext.tsx         # JWT state management for Admin & Customer
│   │   └── ThemeContext.tsx        # Light/Dark mode with localStorage sync
│   ├── pages/
│   │   ├── AboutPage.tsx           # Company background, vision, mission, pillars
│   │   ├── ContactPage.tsx         # Customer enquiry form with real validation
│   │   ├── CustomerPortalPage.tsx  # Customer registration, login & move history
│   │   ├── HomePage.tsx            # Hero, quick tracking, service catalog preview
│   │   ├── RequestQuotePage.tsx    # 11-field moving quote and booking engine
│   │   ├── ServiceDetailsPage.tsx  # In-depth service specs, packing & pricing
│   │   ├── ServicesPage.tsx        # Complete service explorer with search/filters
│   │   └── TrackBookingPage.tsx    # 4-stage visual milestone shipment tracker
│   ├── services/
│   │   └── api.ts                  # Frontend API service calling Express backend
│   ├── App.tsx                     # Main application routing and shell
│   ├── index.css                   # Bootstrap 5 + Tailwind + Star animations
│   └── main.tsx                    # React DOM entry point
│
├── index.html                      # HTML entry with Syne & Plus Jakarta Sans fonts
├── metadata.json                   # AI Studio applet metadata configuration
├── package.json                    # Scripts ("dev": "node server.js") & dependencies
├── server.js                       # Full-stack root server mounting Express + Vite
└── README.md                       # Comprehensive documentation & Viva guide
```

---

## 6. How to Run the Project

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Optional: MongoDB Community Server or MongoDB Atlas URI; if not running locally, the built-in document store boots automatically)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create or verify your `.env` file based on `.env.example`:
```env
# MongoDB Connection URI (Local Community Server or Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/mpms_db

# JWT Secret Key for Authentication
JWT_SECRET=mpms_enterprise_jwt_secret_key_2026

# Server Port
PORT=3000
```

### Step 3: Start the Application (Node.js + Express + React)
```bash
npm run dev
# or directly:
node server.js
```

The unified full-stack server will start on:
- **Application URL**: `http://localhost:3000`
- **REST API Base**: `http://localhost:3000/api`
- **API Health Check**: `http://localhost:3000/api/health`

---

## 7. Default Credentials for Demo & Viva

| Account Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@mpms.com` | `Admin@12345` | Full access to Dashboard, Services CRUD, Bookings, Enquiries, Users, Reports, and MongoDB Inspector |
| **Demo Customer** | `customer@example.com` | `Customer@12345` | Customer Portal, Booking History, Profile Lookup |

---

## 8. REST API Endpoints Specification

### 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate admin or customer with email & password; returns signed JWT.
- `POST /api/auth/register`: Register a new customer user account.
- `GET /api/auth/me`: Get current logged-in user profile from JWT Bearer token.
- `PUT /api/auth/profile`: Update admin profile (Name, Phone, Designation).
- `PUT /api/auth/change-password`: Change password with current password verification and bcrypt hashing.

### 2. Relocation Services (`/api/services`)
- `GET /api/services`: List all moving services (supports search, category filter, active-only flag).
- `GET /api/services/:id`: Retrieve single service by MongoDB `_id` or `slug`.
- `POST /api/services`: [Admin] Create a new moving service.
- `PUT /api/services/:id`: [Admin] Update service details, tariff, packaging specs, or toggle status.
- `DELETE /api/services/:id`: [Admin] Delete a service.

### 3. Bookings & Consignment Tracking (`/api/bookings`)
- `POST /api/bookings`: Submit 11-field booking request; generates unique `bookingId` (`MPMS-2026-XXXX`).
- `GET /api/bookings`: [Admin] List bookings with status filter, date range, pagination, and sorting.
- `GET /api/bookings/search`: [Admin] Fast search by Booking ID, customer name, or phone.
- `GET /api/bookings/track/:bookingId`: Public consignment tracking endpoint for milestone progression.
- `GET /api/bookings/:id`: [Admin] Get detailed booking record.
- `PUT /api/bookings/:id`: [Admin] Update booking status (`Pending` → `Confirmed` → `In Progress` → `Completed` / `Cancelled`), assign truck/driver, and add dispatcher remarks.
- `DELETE /api/bookings/:id`: [Admin] Delete booking record.

### 4. Customer Support Enquiries (`/api/enquiries`)
- `POST /api/enquiries`: Public contact enquiry submission.
- `GET /api/enquiries`: [Admin] List all enquiries with search, read/unread filters.
- `PUT /api/enquiries/:id`: [Admin] Mark as Read/Unread or add admin notes.
- `DELETE /api/enquiries/:id`: [Admin] Delete enquiry.

### 5. Analytics & Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats`: Returns live count cards, recent bookings, recent enquiries, and status distribution breakdown.
- `GET /api/dashboard/collections`: Live MongoDB collection document inspector for Viva and academic demos.

### 6. Management Reports (`/api/reports`)
- `GET /api/reports/bookings`: Filtered report by start date, end date, status, and service category with revenue aggregates.
- `GET /api/reports/enquiries`: Filtered enquiry report by date range and read status.

---

## 9. Comprehensive Viva Voce Questions & Answers

### Q1: What is the MERN stack and how does it function in this project?
**Answer**:  
MERN stands for **MongoDB, Express.js, React.js, and Node.js**:
1. **React.js (Frontend)**: Runs in the client's browser, providing a modern Single Page Application (SPA) with interactive forms, Bootstrap 5 styling, Three.js 3D animations, and the animated stars & circles ambient background.
2. **Express.js (Backend Framework)**: Runs on top of Node.js to provide HTTP routing, controllers, input sanitization, and RESTful API endpoints.
3. **Node.js (Runtime)**: Executes the server-side JavaScript code asynchronously using non-blocking I/O.
4. **MongoDB (Database)**: Stores persistent data as JSON-like BSON documents across collections (`admins`, `users`, `services`, `bookings`, `enquiries`, `pages`).

### Q2: Why did you choose Node.js and Express.js rather than PHP or traditional Java servlets?
**Answer**:  
- **Single Language (JavaScript) Across Entire Stack**: Developers use the same data types, JSON formatting, and mental model from database queries to UI components.
- **Event-Driven & Non-Blocking I/O**: Node.js handles thousands of concurrent HTTP requests efficiently using an event loop, ideal for real-time shipment updates and simultaneous customer quotation requests.
- **Rich NPM Ecosystem**: Seamless integration with enterprise modules like `mongoose`, `bcryptjs`, and `jsonwebtoken`.

### Q3: Why is MongoDB preferred over MySQL for a Movers & Packers application?
**Answer**:  
- **Flexible Document Schema**: Relocation bookings have variable attributes (e.g., residential household inventories, vehicle specifications, office equipment counts). MongoDB handles polymorphic and optional fields naturally without complex schema migrations or multi-table joins.
- **Native JSON Compatibility**: Express controllers receive JSON from the frontend, validate with Mongoose, and store directly in MongoDB collections with zero data transformation overhead.
- **Scalability**: MongoDB supports horizontal scaling via sharding and high-availability replica sets.

### Q4: How is the Animated Stars & Circles background implemented?
**Answer**:  
The background is rendered by `AnimatedBackground.tsx` and styled in `src/index.css`:
- **Deterministic Coordinate Positioning**: Stars and orbs are mapped across percentage coordinates (`top`, `left`) to ensure consistent visual distribution without cumulative layout shifts.
- **Hardware-Accelerated Animations**: Uses CSS `@keyframes` (`mpms-twinkle`, `mpms-float-slow`, `mpms-rotate-slow`, `mpms-pulse-ring`) operating on `transform` and `opacity`. These run on the browser GPU compositor thread without causing CPU jank or reflows.
- **Glassmorphism Backdrop**: Content panels use `backdrop-filter: blur(12px)` and subtle transparency (`rgba`), allowing the celestial stars and geometric circles to float behind them while maintaining contrast and WCAG AA legibility.
- **Non-Intrusive**: Styled with `pointer-events: none` and `z-index: 0` so user interaction with form fields and buttons is never intercepted.

### Q5: How is security handled in this application?
**Answer**:  
1. **Password Hashing**: Passwords are never stored in plain text; they are hashed using `bcryptjs` with a salted cost factor of 10.
2. **Stateless JWT Authorization**: Admin and authenticated customer routes verify signed JSON Web Tokens passed in HTTP `Authorization: Bearer <token>` headers.
3. **NoSQL Injection Protection**: All request body parameters are sanitized before querying the database, preventing operator injection attacks (e.g. `{ "$gt": "" }`).
4. **CORS Configuration**: Restricts API calls to approved origins.

### Q6: How does the unique Booking ID generation work?
**Answer**:  
When a user submits a booking (`POST /api/bookings`), the controller computes the current year (e.g., `2026`) and generates a sequential or cryptographically random 4-digit index: `MPMS-${year}-${number}` (e.g., `MPMS-2026-1042`). This ID is indexed in MongoDB for $O(1)$ fast lookups during customer consignment tracking.

### Q7: What are the stages in the booking lifecycle?
**Answer**:  
The booking moves through five distinct statuses:
1. `Pending`: Booking submitted by customer; waiting for coordinator review.
2. `Confirmed`: Quotation approved, packaging team and slot reserved.
3. `In Progress`: Truck dispatched, goods packed, and vehicle transit ongoing.
4. `Completed`: Goods safely delivered, unloaded, and unpacked at destination.
5. `Cancelled`: Cancelled by customer or coordinator with official remarks recorded.

---

## 10. Future Enhancements
- Integration with SMS and WhatsApp gateways for instant milestone notifications.
- Google Maps Distance Matrix API for dynamic toll, corridor, and GPS route tariff calculation.
- Online payment gateway integration (Stripe, Razorpay, or PayPal) for advance booking deposits.
- Customer mobile application using React Native sharing the same Express REST API.

---

## 11. Academic Project Details
- **Project Name**: Movers & Packers Management System (MPMS)
- **Degree**: Bachelor of Technology (B.Tech) in Computer Science & Engineering
- **Domain**: Full-Stack Web Development / MERN Stack & Enterprise Logistics
- **License**: MIT
