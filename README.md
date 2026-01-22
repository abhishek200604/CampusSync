<div align="center">
  <img src="logo1.png" alt="CampusSync Logo" width="120" height="120">
  
  # 🎓 CampusSync - College ERP System
  
  ### A Modern, Real-time College Management Platform
  
  [![Live Website](https://img.shields.io/badge/Website-Live-brightgreen?style=for-the-badge)](https://campus-sync-eight.vercel.app/)
  [![Download App](https://img.shields.io/badge/Download-App-blue?style=for-the-badge)](https://appsgeyser.io/19465863/CampusSync)
  [![Built with MERN](https://img.shields.io/badge/Built%20with-MERN-61DAFB?style=for-the-badge)](https://www.mongodb.com/mern-stack)
  
  [🌐 Live Demo](https://campus-sync-eight.vercel.app/) • [📱 Download App](https://appsgeyser.io/19465863/CampusSync) • [📖 Documentation](#-installation)
  
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Usage](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CampusSync** is a comprehensive College ERP (Enterprise Resource Planning) system designed to streamline communication and management between faculty and students. Built with the MERN stack and featuring real-time data synchronization via Socket.io, CampusSync offers an intuitive, modern interface for managing academic schedules, applications, attendance, and notifications.

### 🔗 Quick Links
- **Live Website:** [https://campus-sync-eight.vercel.app/](https://campus-sync-eight.vercel.app/)
- **Mobile App:** [Download on AppsGeyser](https://appsgeyser.io/19465863/CampusSync)

---

## 🚀 Features

### 👨‍🏫 Faculty Portal

- **📊 Dashboard**
  - Overview of today's classes and schedule
  - Pending student applications count
  - Recent notifications and quick actions
  
- **📅 Schedule Management**
  - Create, edit, and delete class schedules
  - Mark student attendance for each class
  - Real-time schedule conflict detection
  
- **🏖️ Leave Management**
  - Apply for leave with date range selection
  - Automatic substitute faculty assignment when conflicts exist
  - View substitute availability in real-time
  
- **📬 Notifications**
  - Review student applications (Leave, Bonafide)
  - Approve or reject applications with one click
  - Instant notification alerts
  
- **👤 Profile Management**
  - View and edit personal information
  - Update contact details and department info

### 👨‍🎓 Student Portal

- **📊 Dashboard**
  - Today's class schedule at a glance
  - Recent application status
  - Quick action buttons for common tasks
  
- **📆 Live Timetable**
  - Real-time schedule updates via Socket.io
  - Automatically syncs when faculty makes changes
  - Color-coded class information
  
- **📝 Applications**
  - Submit leave requests with reason and dates
  - Apply for bonafide certificates
  - Track application status (Pending/Approved/Rejected)
  
- **🔔 Notifications**
  - Instant alerts for schedule changes
  - Application status updates
  - Important announcements
  
- **👤 Profile**
  - View personal and academic information
  - ZPRN and enrollment details

### ⚡ Real-time Features

- **Socket.io Integration** for instant updates across all connected clients
- **Live Schedule Sync** - Students receive immediate notifications when faculty updates schedules
- **Toast Notifications** - Real-time feedback for all user actions
- **Automatic Conflict Detection** - Smart system to prevent scheduling conflicts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | ^18.2.0 | UI Framework |
| Vite | ^5.1.4 | Build Tool & Dev Server |
| TailwindCSS | ^3.4.1 | Styling & Design |
| Redux Toolkit | ^2.2.1 | State Management |
| React Router DOM | ^6.22.2 | Client-side Routing |
| Axios | ^1.6.7 | HTTP Client |
| Socket.io Client | ^4.7.4 | Real-time Communication |
| Lucide React | ^0.344.0 | Icon Library |
| React Hot Toast | ^2.4.1 | Notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime Environment |
| Express.js | ^4.18.2 | Web Framework |
| MongoDB | ^8.2.0 | Database (Mongoose ODM) |
| Socket.io | ^4.7.4 | Real-time Server |
| JWT | ^9.0.2 | Authentication |
| Bcrypt.js | ^2.4.3 | Password Hashing |
| Cookie Parser | ^1.4.6 | Cookie Management |
| CORS | ^2.8.5 | Cross-Origin Support |

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

### Clone and Setup

```bash
# Clone the repository (or download the project folder)
cd PROJECT

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the **`server`** directory with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campussync
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campussync

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Security Note:** In production, use strong, random values for `JWT_SECRET` and never commit your `.env` file to version control.

---

## 🚀 Running the Application

### Option 1: Manual Start (Recommended for Development)

#### 1. Start MongoDB (if using local installation)
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### 2. Start Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

#### 3. Start Frontend Development Server (in a new terminal)
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`

#### 4. Access the Application
Open your browser and navigate to: **http://localhost:5173**

### Option 2: Production Build

```bash
# Build the frontend
cd client
npm run build

# Start the backend server
cd ../server
npm start
```

---

## 📁 Project Structure

```
PROJECT/
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   │   ├── logo1.png           # CampusSync logo
│   │   └── favicon.svg         # Site favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/         # Layout components (Sidebar, Header)
│   │   │   └── ...
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── faculty/        # Faculty-specific pages
│   │   │   └── student/        # Student-specific pages
│   │   ├── store/              # Redux Toolkit store
│   │   │   ├── index.js        # Store configuration
│   │   │   └── slices/         # Redux slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # TailwindCSS configuration
│   └── package.json
│
├── server/                      # Node.js Backend Application
│   ├── config/                 # Configuration files
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── scheduleController.js
│   │   ├── applicationController.js
│   │   └── ...
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js             # JWT authentication
│   │   └── roleCheck.js        # Role-based access control
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Schedule.js
│   │   ├── Application.js
│   │   ├── Attendance.js
│   │   └── ...
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   ├── schedule.js
│   │   ├── application.js
│   │   └── ...
│   ├── socket/                 # Socket.io handlers
│   │   └── socketHandlers.js
│   ├── index.js                # Server entry point
│   └── package.json
│
├── logo1.png                    # Project logo
└── README.md                    # This file
```

---

## 🔐 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Schedule Routes (Faculty)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/schedule` | Get all schedules | Private |
| POST | `/api/schedule` | Create new schedule | Faculty Only |
| PUT | `/api/schedule/:id` | Update schedule | Faculty Only |
| DELETE | `/api/schedule/:id` | Delete schedule | Faculty Only |

### Application Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/application` | Submit application | Student Only |
| GET | `/api/application` | Get all applications | Private |
| PUT | `/api/application/:id/review` | Review application | Faculty Only |

### Faculty Leave Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/faculty-leave/check` | Check schedule conflicts | Faculty Only |
| POST | `/api/faculty-leave` | Apply for leave | Faculty Only |
| GET | `/api/faculty-leave/substitutes` | Get available substitutes | Faculty Only |

### Attendance Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/attendance` | Mark attendance | Faculty Only |
| GET | `/api/attendance/schedule/:id` | Get attendance by schedule | Private |

---

## 👥 User Roles & Permissions

### 👨‍🏫 Faculty
- ✅ Create, edit, and delete class schedules
- ✅ Mark student attendance
- ✅ Apply for leave with automatic substitute assignment
- ✅ Review student applications (approve/reject)
- ✅ Receive notifications for new applications
- ✅ View and manage personal profile

### 👨‍🎓 Student
- ✅ View live, real-time timetable
- ✅ Submit leave and bonafide applications
- ✅ Receive instant notifications for schedule changes
- ✅ Track application status
- ✅ View personal profile and academic information
- ❌ Cannot modify schedules or review applications

---

## 🎨 Design Features

CampusSync features a modern, premium UI with:

- **🌈 Glassmorphism Design** - Modern glass-effect cards with backdrop blur
- **🎨 Gradient Color Schemes**
  - Blue/Cyan gradients for Faculty Portal
  - Purple/Pink gradients for Student Portal
- **✨ Smooth Animations** - Transitions and micro-interactions
- **📱 Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- **🔔 Toast Notifications** - Real-time feedback for all user actions
- **🌙 Dark Theme** - Eye-friendly dark color palette
- **⚡ Fast Performance** - Optimized with Vite and React best practices

---

## 📸 Screenshots

> **Note:** Add screenshots of your application here to showcase the UI

### Home Page
![Home Page](./screenshots/home.png)

### Faculty Dashboard
![Faculty Dashboard](./screenshots/faculty-dashboard.png)

### Student Timetable
![Student Timetable](./screenshots/student-timetable.png)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CampusSync:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created for **educational purposes** as part of a Web Application Development course.

---

## 📞 Contact & Support

For questions, issues, or suggestions:

- 🌐 Visit: [https://campus-sync-eight.vercel.app/](https://campus-sync-eight.vercel.app/)
- 📱 Download: [CampusSync Mobile App](https://appsgeyser.io/19465863/CampusSync)

---

<div align="center">
  
  ### Built with ❤️ using the MERN Stack
  
  **MongoDB • Express.js • React.js • Node.js**
  
  ---
  
  ⭐ Star this repository if you find it helpful!
  
</div>
