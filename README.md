
PROJECT: GAME STORE SYSTEM


 Game Store Project
==============================

A complete CRUD web system i made for managing a game store, featuring a Node.js backend and a React frontend. The system allows management of products, customers, employees, orders, and an administrative dashboard.

------------------------------
 Features
------------------------------

 Authentication
- Login with JWT-based authentication
- Protected frontend routes
- Authentication middleware on the backend

 Products
- Create products
- List products
- Update products
- Delete products

 Customers
- Customer registration
- Edit and delete customers
- List all customers

 Employees
- Employee management
- Full CRUD operations

 Orders
- Create orders
- Associate customers and products
- Order listing and management

 Dashboard
- Overview of system data
- Summary of customers, products, orders, and employees

 Logout
- Secure session termination

------------------------------
 Technologies Used
------------------------------

Backend:
- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- dotenv
- Nodemon

Backend architecture:
- Controllers
- Models
- Middlewares
- Centralized database connection

Frontend:
- React
- Vite
- Axios
- React Router DOM
- Context API

Frontend structure:
- Components
- Pages
- Context
- Utils

------------------------------
 Project Structure
------------------------------
```
Project Game Store
├── backend
│   ├── controllers
│   ├── models
│   ├── middlewares
│   ├── db
│   ├── app.js
│   └── .env
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── utils
    │   └── main.jsx
    └── vite.config.js
```
------------------------------
 How to Run the Project
------------------------------

Requirements:
- Node.js (version 18 or higher)
- MySQL
- npm (Node Package Manager)
- Any Browser

------------------------------
 Database Setup
------------------------------

1. Create a MySQL database
2. Create a `.env` file inside the `backend` folder:

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret_key
```

------------------------------
 Running the Backend
------------------------------

-cd backend
-npm install
-npm run dev

Backend will run at:
http://localhost:3000

------------------------------
 Running the Frontend
------------------------------

-cd frontend
-npm install
-npm run dev

Frontend will run at:
http://localhost:5173

------------------------------
 Protected Routes
------------------------------

- Internal routes are accessible only after login
- Access control is handled using JWT and React Context API

------------------------------
 Author
------------------------------

This project was developed by me for academic and learning purposes, integrating frontend and backend into a complete web application.
