
# Learning Management System (LMS) Web Application

This project is a full-featured Learning Management System (LMS) built using the MERN stack (MongoDB, Express, React, Node.js). It provides a platform for users to access educational content and for admins to manage courses and users efficiently.

## Features

### User Functionality
- **Subscription-based Video Access**: Users can watch educational videos after subscribing to courses.
- **User Registration & Authentication**: Secure sign-up/sign-in process with JWT-based authentication.
- **Profile Management**: Users can upload their profile images as avatars and manage their accounts.
- **Course Enrollment**: Users can enroll in multiple courses and track their progress through various modules.

### Admin Functionality
- **Course Management**: Admins can create, update, and delete courses, each containing multiple modules.
- **Video Management**: Admins can upload and delete videos associated with courses.
- **Payment Integration**: Secure payment gateway for handling course subscriptions.
- **User Management**: Admins can manage user accounts, including viewing and modifying user details.

### Technology Stack
- **Frontend**: React, Vite (for fast builds and hot module replacement), CSS/Bootstrap for responsive UI design.
- **Backend**: Node.js, Express, MongoDB (for data storage and management).
- **Authentication**: JWT for secure authentication.
- **Payment Integration**: Stripe/PayPal for handling payments.
- **Deployment**: Docker for containerization, CI/CD pipeline setup for automated testing and deployment.

### Getting Started
1. **Clone the repository**: `git clone https://github.com/2004-AlokSINGH/Learning-Managment-System-using-Mern.git`
2. **Install dependencies**: Run `npm install` in both the client and server directories.
3. **Environment Variables**: Set up the necessary environment variables for MongoDB, JWT secret, payment gateway keys, etc.
4. **Run the application**: Use `npm start` to run the server and `npm run dev` to start the React development server.

### Contribution
Contributions are welcome! Please fork the repository and create a pull request to propose changes.

