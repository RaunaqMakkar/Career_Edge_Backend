# Career Edge - Backend

This is the backend server for the Career Edge application, a platform designed to help users manage their career development and job search process.

## Overview

The backend provides API endpoints for the Career Edge frontend application, handling data storage, authentication, and business logic. It's built with scalability and performance in mind to support a seamless user experience.

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for secure authentication
- **Mongoose** - MongoDB object modeling
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Project Structure
BackEnd/
├── config/         # Configuration files and database connection
├── controllers/    # Request handlers and business logic
├── middleware/     # Custom middleware functions (auth, validation)
├── models/         # Database schemas and models
├── routes/         # API route definitions
├── utils/          # Helper functions and utilities
├── .env            # Environment variables (not tracked by git)
├── .gitignore      # Git ignore file
├── package.json    # Project dependencies and scripts
└── server.js       # Application entry point