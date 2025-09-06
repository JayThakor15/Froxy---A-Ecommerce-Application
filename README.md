# Froxy - Professional E-commerce Application

A modern, full-stack single page e-commerce application built with React, Node.js, Express, and MongoDB.

## Features

### Backend

- **Authentication**: JWT-based user authentication with secure password hashing
- **Product Management**: CRUD operations for products with advanced filtering
- **Shopping Cart**: Persistent cart functionality with MongoDB storage
- **Admin Panel**: Role-based access control with admin privileges
- **API Endpoints**: RESTful APIs for all operations
- **Stripe Payments**: Secure Stripe integration for online payments
- **Order Webhooks**: Stripe webhook for payment confirmation and order status update
- **PDF Invoice Generation**: Automatic PDF invoice generation for each order
- **Email Notifications**: Sends order confirmation and invoice to user after payment

### Frontend

- **Single Page Application (SPA)**: Built with React Router for fast, seamless navigation
- **Modern UI**: Built with React, Vite, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with professional styling
- **User Authentication**: Integrated login/signup modal
- **Product Browsing**: Advanced search and filtering capabilities
- **Shopping Cart**: Add/remove items with quantity management
- **Cart Persistence**: Cart items persist even after logout
- **Admin Dashboard**: Complete product management interface
- **Role-based Access**: Admin-only features and navigation
- **Dark Mode**: Full dark theme support, instantly updates across all pages
- **Order Management**: View order history, order details, and download PDF invoices

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

### Frontend

- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Axios (HTTP client)
- React Hot Toast (notifications)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Email Configuration (for order confirmations)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

   Create a `.env` file in the frontend directory:

   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

5. **Start MongoDB**

   Make sure MongoDB is running on your system. If using a local installation:

   ```bash
   mongod
   ```

6. **Seed the database (optional)**

   ```bash
   cd backend
   node seed.js
   ```

   This will create:

   - Sample products
   - Admin user: `admin@froxy.com` / `admin123`

7. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

8. **Start the frontend development server**

   ```bash
   cd frontend
   npm run dev
   ```

9. **Access the application**

   - Frontend: http://localhost:3000 (or http://localhost:5173 for Vite)
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products

- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Cart

- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:productId` - Update cart item quantity (protected)
- `DELETE /api/cart/:productId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear entire cart (protected)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `GET /api/admin/stats` - Get admin dashboard statistics (admin only)

## Project Structure

```
ecommerce-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── cart.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── FeaturedProducts.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── AdminContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminProductForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Features in Detail

### Authentication System

- Secure user registration and login
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints

### Product Management

- Advanced filtering by category, price range, and search terms
- Sorting options (price, name, rating, newest)
- Pagination for large product catalogs
- Product detail pages with image galleries

### Shopping Cart

- Add/remove items with quantity management
- Real-time cart updates
- Persistent cart storage in MongoDB
- Local storage fallback for non-authenticated users
- Cart total calculations with tax

### Admin Panel

- Complete product management (CRUD operations)
- Admin dashboard with statistics
- Role-based access control
- User management capabilities
- Secure admin-only routes

### Payments & Orders

- Stripe payment integration for secure checkout
- Stripe webhook for real-time payment confirmation
- Order status auto-updates to 'confirmed' after payment
- PDF invoice generated and downloadable for each order
- Order confirmation email with invoice PDF sent to user

### User Experience

- Responsive design for all devices
- Professional UI with Tailwind CSS
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions
- Full dark mode support (instant switching)
- SPA navigation with React Router (no page reloads)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
