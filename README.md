# CampusSync - College ERP System

A modern, real-time College ERP system built with the MERN stack, featuring Faculty and Student portals with live data synchronization.

## 🚀 Features

### Faculty Portal
- **Dashboard**: Overview of today's classes, pending applications, notifications
- **Schedule Management**: Create, edit, delete class schedules with attendance marking
- **Leave Management**: Apply for leave with automatic substitute assignment when conflicts exist
- **Notifications**: Review and respond to student applications (Approve/Reject)
- **Profile**: View and edit personal information

### Student Portal
- **Dashboard**: Today's classes, recent applications, quick actions
- **Live Timetable**: Real-time schedule updates when faculty makes changes
- **Applications**: Submit leave requests and bonafide certificates
- **Notifications**: Instant alerts for schedule changes and application status
- **Profile**: View personal information

### Real-time Features
- Socket.io integration for instant updates
- Schedule changes sync immediately to students
- Notification system with toast alerts

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- TailwindCSS
- Redux Toolkit
- React Router DOM
- Axios
- Socket.io Client
- Lucide React (Icons)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication
- Bcrypt.js

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Clone and Setup

```bash
# Navigate to project directory
cd PROJECT

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campussync
JWT_SECRET=your_super_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🚀 Running the Application

### Start MongoDB (if local)
```bash
mongod
```

### Start Backend Server
```bash
cd server
npm run dev
```

### Start Frontend Development Server
```bash
cd client
npm run dev
```

Access the application at: **http://localhost:5173**

## 📁 Project Structure

```
PROJECT/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux Toolkit store
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # Database config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & RBAC
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── socket/             # Socket.io handlers
│   └── index.js            # Server entry
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Schedule (Faculty)
- `GET /api/schedule` - Get schedules
- `POST /api/schedule` - Create schedule
- `PUT /api/schedule/:id` - Update schedule
- `DELETE /api/schedule/:id` - Delete schedule

### Applications
- `POST /api/application` - Submit application (Student)
- `GET /api/application` - Get applications
- `PUT /api/application/:id/review` - Review application (Faculty)

### Faculty Leave
- `POST /api/faculty-leave/check` - Check conflicts
- `POST /api/faculty-leave` - Apply for leave
- `GET /api/faculty-leave/substitutes` - Get available substitutes

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/schedule/:id` - Get attendance by schedule

## 👥 User Roles

### Faculty
- Create and manage class schedules
- Mark student attendance
- Apply for leave with substitute assignment
- Review and approve/reject student applications

### Student
- View live timetable
- Submit leave and bonafide applications
- Receive real-time notifications
- Track application status

## 🎨 Design Features

- Modern glassmorphism UI
- Gradient color schemes (Blue/Cyan for Faculty, Purple/Pink for Students)
- Smooth animations and transitions
- Responsive design for all devices
- Toast notifications for real-time feedback

## 📝 License

This project is created for educational purposes.

---

Built with ❤️ using the MERN Stack
