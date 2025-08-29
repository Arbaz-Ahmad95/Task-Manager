# MERN Stack Task Manager

git
## 🚀 Live Demo

**Frontend URL:** http://localhost:3000  
**Backend API:** http://localhost:5000

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based user registration and login
- Role-based access control (Admin & Member roles)
- Protected routes with authentication middleware
- Secure password hashing with bcrypt

### 👥 User Management
- **Admin Users**: Can manage all tasks and users, change user roles
- **Member Users**: Can only manage their own tasks
- User role management interface for admins

### 📝 Task Management
- Create, read, update, and delete tasks
- Task attributes: title, description, status, priority, due date, tags, assignee
- Advanced filtering and search functionality
- Pagination for task lists
- Activity logging for all task operations

### 📊 Dashboard & Analytics
- Statistics overview with task counts by status
- Priority-based task distribution
- Overdue tasks tracking
- Responsive stats widget

### 🎨 User Interface
- Clean, modern React UI with Vite
- Responsive design for mobile and desktop
- Intuitive navigation and forms
- Real-time feedback and error handling

## 🛠️ Technology Stack

### Frontend
- **React 18** with hooks and functional components
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** with modern styling

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Development
- **Jest** & **Supertest** for testing
- **ESLint** for code linting
- **Nodemon** for development server

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd task-manager