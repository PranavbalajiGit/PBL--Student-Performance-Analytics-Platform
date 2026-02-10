# Student Performance Analytics System

A full-stack web application for analyzing student performance in a college environment with role-based access control (RBAC), data validation, and privacy-aware analytics.

## 🎯 Features

### Core Capabilities
- **Role-Based Access Control (RBAC)**: Three distinct roles with tailored dashboards
  - **Admin**: Campus-wide user management, faculty-student mappings, analytics, and rankings
  - **Faculty**: Excel data uploads with validation, student analytics for mapped students only
  - **Student**: Personal performance dashboard with privacy-aware rankings

### Key Functionalities
✅ Username/password authentication with session management  
✅ Comprehensive performance analytics with weighted scoring  
✅ Excel upload validation (marks, P-Skills, activity/reward points)  
✅ Privacy-aware rankings (Top 20 public, others private)  
✅ External profile integration (GitHub, LeetCode)  
✅ Premium animated landing page (GSAP + Framer Motion)  

## 🏗️ Tech Stack

### Backend
- **Framework**: Node.js + Express
- **Authentication**: Session-based with cookie-parser
- **File Processing**: Multer + XLSX for Excel validation
- **Data Store**: In-memory (MVP) - ready for database integration

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS with custom design system
- **Animations**: GSAP & Framer Motion (landing page only)
- **Charts**: Chart.js for data visualization

## 📁 Project Structure

```
Student Perfomance Analysis/
├── backend/
│   ├── data/
│   │   └── mockData.js           # In-memory data store
│   ├── middleware/
│   │   └── auth.js                # Authentication & RBAC
│   ├── routes/
│   │   ├── auth.routes.js         # Login/logout endpoints
│   │   ├── admin.routes.js        # Admin-only endpoints
│   │   ├── faculty.routes.js      # Faculty-only endpoints
│   │   └── student.routes.js      # Student-only endpoints
│   ├── utils/
│   │   ├── validation.js          # Excel validation logic
│   │   └── analytics.js           # Ranking & scoring algorithms
│   ├── server.js                  # Express server
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.js                # Landing page (GSAP + Framer Motion)
│   │   ├── login/
│   │   ├── admin/                 # Admin dashboard pages
│   │   ├── faculty/               # Faculty dashboard pages
│   │   └── student/               # Student dashboard pages
│   ├── components/                # Reusable React components
│   ├── lib/
│   │   └── api.js                 # API client utilities
│   ├── styles/
│   │   └── globals.css            # TailwindCSS + custom styles
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Default Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Faculty
- **Username**: `faculty1` or `faculty2`
- **Password**: `faculty123`

### Student
- **Username**: `student1`, `student2`, `student3`, `student4`, or `student5`
- **Password**: `student123`

## 📊 Analytics & Ranking System

### Weighted Scoring Algorithm
The system calculates overall performance scores using:
- **Academic Marks**: 40%
- **P-Skills**: 20%
- **Activity Points**: 15%
- **Reward Points**: 15%
- **External Profiles**: 10%

### Privacy-Aware Rankings
- **Top 20 students**: Ranks are publicly visible to all
- **Others**: Ranks visible only to the student themselves
- Promotes healthy competition while respecting privacy

## 📤 Excel Upload Validation

Faculty can upload data via Excel files with **strict validation**:

### Internal Marks
Columns: `Student ID | Subject | Marks | Max Marks`

### P-Skills
Columns: `Student ID | Skill Name | Level | Completion Date`  
Valid Levels: `Beginner`, `Intermediate`, `Advanced`

### Activity/Reward Points
Columns: `Student ID | Type | Description | Points | Date`  
Valid Types: `Activity`, `Reward`

### Validation Rules
✅ Column structure must match exactly  
✅ All students in file must be mapped to the faculty  
✅ Data types must be valid  
❌ If validation fails, **entire upload is rejected**

## 🎨 Design Principles

### Landing Page
- Premium animations with GSAP and Framer Motion
- Gradient backgrounds and smooth transitions
- "View MVP" CTA and "Google Auth Coming Soon" indicator

### Dashboards
- **Clean & professional** - No animations
- Role-specific navigation and features
- Responsive design with TailwindCSS
- Consistent design system across all pages

## 🔄 Future Enhancements

### Database Integration
- Migrate from in-memory storage to PostgreSQL/MongoDB
- Implement proper data persistence
- Add database migrations

### Security
- Implement bcrypt password hashing
- Add JWT token-based authentication
- Enable HTTPS in production
- Implement rate limiting

### Features
- Google OAuth integration
- Automated GitHub/LeetCode score calculation
- Excel template downloads
- Real-time notifications
- Advanced analytics with Chart.js visualizations
- Semester-wise trend analysis
- Bulk data import/export

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user session

### Admin (`/api/admin`) - Admin Only
- `POST /users` - Register student/faculty
- `GET /users` - List all users
- `POST /mappings` - Create faculty-student mapping
- `GET /mappings` - View all mappings
- `GET /analytics` - Campus-wide analytics
- `GET /rankings` - Full student rankings

### Faculty (`/api/faculty`) - Faculty Only
- `GET /students` - List mapped students
- `POST /upload/marks` - Upload internal marks (Excel)
- `POST /upload/pskills` - Upload P-Skills (Excel)
- `POST /upload/points` - Upload activity/reward points (Excel)
- `GET /analytics/:studentId` - Student analytics
- `GET /rankings` - Rankings for mapped students

### Student (`/api/student`) - Student Only
- `GET /profile` - Personal profile
- `GET /marks` - Academic marks and trends
- `GET /pskills` - Personalized skills
- `GET /points` - Activity and reward points
- `GET /rank` - Privacy-aware rank
- `POST /profiles` - Connect GitHub/LeetCode
- `GET /analytics` - Complete analytics

## 🛡️ Security Notes

⚠️ **This is an MVP**. For production deployment:
1. Hash passwords with bcrypt
2. Use secure session storage (Redis)
3. Enable HTTPS
4. Implement CSRF protection
5. Add input sanitization
6. Set up proper environment variables
7. Use a production database

## 🤝 Contributing

This is an academic MVP project. Contributions for enhancements are welcome!

## 📄 License

MIT

---

**Built with ❤️ for educational excellence**
