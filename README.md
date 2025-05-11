# Multi-Vendor-E-commerce Store

A modern, full-stack e-commerce web application that allows users to browse products, manage their shopping cart, apply discount coupons, and complete secure purchases. Built with React, Node.js, Express, and MongoDB, stripe this project delivers a responsive and user-friendly shopping experience.

![image alt](https://github.com/KetanPatil-dev/Multi-Vendor-E-Commerce/blob/d95dd6e7c3c23d3f73485925587c3e8f6c8d1693/Images/Screenshot%202025-05-11%20at%2012.04.01%E2%80%AFPM.png)
---

## Table of Contents

- [About The Project](#about-the-project)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Installation](#installation) 
---

## About The Project

This e-commerce store provides users with a seamless shopping experience including:

- Browsing and searching products by categories.
- Viewing detailed product information.
- Managing a shopping cart with add, update, and remove functionalities.
- Applying discount coupons to orders.
- Secure checkout and payment processing.
- User authentication and profile management.

The UI is fully responsive and enhanced with smooth animations and charts for analytics.

---

## Features

- User registration and login with JWT authentication.
- Product catalog with category filters and search.
- Shopping cart with quantity management.
- Coupon code validation and discount application.
- Order placement and history.
- Responsive design with Tailwind CSS and animated UI components.
- Admin panel for managing products and coupons (optional).

---

## Tech Stack

| Frontend                | Backend                  | Database       | Others                  |
|-------------------------|--------------------------|----------------|-------------------------|
| React                   | Node.js                  | MongoDB        | Zustand (state management) |
| Tailwind CSS            | Express.js               | Mongoose       | Framer Motion (animations) |
| Recharts (charts)       | JWT Authentication       |                | react-hot-toast (notifications) |
| Axios (HTTP client)     | Stripe (payment gateway) |                |                         |

---

## Getting Started

### Prerequisites

- Node.js v14 or higher  
- npm or yarn  
- MongoDB (local or Atlas cluster)  

### Installation

1. Clone the repository
git clone https://github.com/yourusername/ecommerce-store.git
cd ecommerce-store

2. Install dependencies

- Backend dependencies:
- npm install
-Frontend dependencies:
- npm install

3. Setup .env file
 PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173

4. Run command for client and server
   - npm run dev



