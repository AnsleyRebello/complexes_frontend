# 🏠 Clement Regency Developers - Property Management System

A modern, responsive web application for property management featuring user authentication, property listings, appointment booking, and comprehensive admin dashboard.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-green) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-cyan)

## ✨ Features

### 🏢 **Property Management**
- Browse property listings with advanced filtering
- Detailed property views with image galleries
- Property categorization (apartments, offices, commercial)
- Save properties to favorites list
- Property view tracking and analytics

### 👥 **User Management** 
- User registration and authentication system
- Personalized user dashboard with statistics
- Profile management and preferences
- Activity tracking (viewed properties, appointments, favorites)

### 📅 **Appointment System**
- Book property viewing appointments (physical/virtual)
- Admin approval workflow with status tracking
- Email notifications (configurable)
- Appointment management and history

### 🔧 **Admin Dashboard**
- Comprehensive admin control panel
- User management and statistics
- Property management (CRUD operations)
- Appointment approval system
- Real-time analytics and dashboard metrics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clement-regency-developers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   # See "Environment Configuration" section below
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```
## 🛠️ Tech Stack

### **Frontend:**
- **React 19.1.1** - Modern UI framework with hooks
- **Vite 7.1.7** - Fast build tool and dev server
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icon library

### **Backend Ready:**
Spring Boot structure provided in `/backend-structure/` with:
- REST API endpoints
- MySQL/PostgreSQL database models  
- JWT authentication support
- Repository and service layers

## 📁 Project Structure

```
clement-regency-developers/
├── public/                 # Static assets
├── src/
│   ├── api/               # API services and calls
│   ├── components/        # Reusable React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components and routes
│   ├── services/         # Business logic services
│   └── styles/           # Global styles and themes
├── backend-structure/     # Spring Boot backend models
├── .env.example          # Environment variables template
└── docs/                 # Documentation files
```

## 🎨 Key Features Showcase

### **Dashboard Analytics:**
- User activity and engagement metrics
- Property view statistics and trends
- Appointment management interface
- Favorite properties organization

### **Property Features:**
- Advanced search and filtering system
- Interactive image galleries
- Detailed property information display
- Location mapping and pricing details

### **Admin Features:**
- Complete user management interface
- Property CRUD operations
- Appointment approval workflows
- Real-time dashboard statistics

## 🔒 Security Features

- Environment variable configuration for sensitive data
- Input validation and sanitization
- Protected admin routes and authentication
- Secure credential handling
- Safe demo data for public repositories

## 🚀 Deployment

### **Frontend (Netlify/Vercel):**
1. Build: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### **Backend:**
- Spring Boot structure provided
- Database setup instructions in `backend-structure/`
- Ready for containerization

## 📱 Responsive Design

- Mobile-first responsive approach
- Optimized for tablets and desktops
- Touch-friendly interface elements
- Accessible design patterns and ARIA support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---

