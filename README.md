# Course Management Platform

A modern web application for managing online courses, built with NestJS (backend) and React + TypeScript (frontend).

## 🎯 Project Overview

This platform facilitates online education by providing:
- Course management for teachers
- Student enrollment system
- Real-time chat between students and teachers
- Comprehensive course filtering and search
- User authentication and authorization

## ⚡ Key Features

- **Authentication**
  - JWT-based secure authentication
  - Role-based access control (Student/Teacher)
  
- **Course Management**
  - Course creation and editing
  - Multiple course types (Online/Classroom)
  - Flexible scheduling
  - Price management
  
- **Student Features**
  - Course enrollment
  - Real-time chat with teachers
  - Course browsing and filtering
  
- **Teacher Features**
  - Course creation and management
  - Student enrollment management
  - Real-time chat with students

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:   
   ```bash
   git clone https://github.com/yourusername/course-platform.git
   ```

2. Backend Setup:
   ```bash
   cd file-rouge-a2
   npm install
   npm run start:dev
   ```

3. Frontend Setup:
   ```bash
   cd file-rouge-a2-front
   npm install
   npm run dev
   ```

4. Create .env files:

   Backend (.env):
   ```
   DATABASE_URL=mongodb://localhost:27017/your_database
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=90d
   PORT=3000
   ```

   Frontend (.env):
   ```
   VITE_API_URL=http://localhost:3000
   VITE_WS_URL=ws://localhost:3001
   ```

## 📘 API Documentation

### Authentication

POST   /auth/signup    - Register new user
POST   /auth/login     - User login

### Courses

GET    /courses              - Get all courses
POST   /courses             - Create course
GET    /courses/:id         - Get course details
PUT    /courses/:id         - Update course
DELETE /courses/:id         - Delete course

### Enrollments

GET    /enrollments              - Get all enrollments
POST   /enrollments             - Create enrollment
PUT    /enrollments/:id/status  - Update status
GET    /enrollments/student/:id - Get student enrollments

### Chat (WebSocket)

Connection: ws://localhost:3001
Events:
- 'joinRoom'      - Join chat room
- 'leaveRoom'     - Leave chat room
- 'newMessage'    - Send message
- 'fetchMessages' - Get room messages

### Users

GET    /users              - Get all users
GET    /users/:id         - Get user details
PUT    /users/:id         - Update user
DELETE /users/:id         - Delete user

## 🛠 Tech Stack

- **Backend**
  - NestJS
  - MongoDB
  - Socket.io
  - JWT Authentication

- **Frontend**
  - React
  - TypeScript
  - TailwindCSS
  - Socket.io-client

## 📱 Screenshots

<div align="center">

  <img src="screenshots/dashboard.png" alt="Dashboard" width="600"/>
  <p><em>Dashboard view showing course listings</em></p>

  <img src="screenshots/course-details.png" alt="Course Details" width="600"/>
  <p><em>Course details page with enrollment options</em></p>

  <img src="screenshots/chat.png" alt="Chat Interface" width="600"/>
  <p><em>Real-time chat between students and teachers</em></p>

  <img src="screenshots/login.png" alt="Login Screen" width="600"/>
  <p><em>Login page for user authentication</em></p>
</div>

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 