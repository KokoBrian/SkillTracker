# SkillTracker

# System Architecture

            Browser (React/Javascript)
        ↓
            Server (Django)
        ↓
            Database (SQLite)

# System Directory
Skill-Tracker/
│
├── public/
│   └── index.html
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       └── global.css
│
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   │
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── parent/
│   │   │   ├── ParentDashboard.jsx
│   │   │   ├── LearnerProgress.jsx
│   │   │   ├── Attendance.jsx
│   │   │   └── Messages.jsx
│   │   │
│   │   ├── teacher/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── ClassList.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── UploadResults.jsx
│   │   │   └── Messages.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── ManageClasses.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   └── NotFound.jsx
│
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── AdminRoutes.jsx
│   │   ├── TeacherRoutes.jsx
│   │   └── ParentRoutes.jsx
│
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── classService.js
│
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── UserContext.jsx
│
│   ├── hooks/
│   │   └── useAuth.js
│
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│
│   ├── App.jsx
│   ├── index.jsx
│   └── main.css
│
├── package.json
└── README.md

# Routes
The system uses modular role-based routing. Each user role has its own
route file protected by authorization logic, improving security and maintainability.