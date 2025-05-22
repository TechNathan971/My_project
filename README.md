# PrimeStore - Modern E-commerce Platform

A full-stack e-commerce application built with React, Express.js, TypeScript, and PostgreSQL. Features a modern UI with Tailwind CSS, complete shopping functionality, and Stripe payment integration.

## 🚀 Features

- **User Authentication** - Secure registration and login system
- **Product Catalog** - Browse products by categories with search functionality
- **Shopping Cart** - Add, remove, and update items in cart
- **Admin Dashboard** - Complete product and category management
- **Payment Processing** - Stripe integration for secure payments
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- shadcn/ui component library
- React Query for state management
- Wouter for routing
- React Hook Form for form handling

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Passport.js for authentication
- bcrypt for password hashing
- Express sessions for session management

### External Services
- Stripe for payment processing
- Neon Database (PostgreSQL hosting)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TechNathan971/Zenith-store-.git
cd Zenith-store-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Stripe (optional for demo)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### 4. Database Setup

Push the database schema:

```bash
npm run db:push
```

### 5. Run the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and contexts
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders

### Payments
- `POST /api/create-payment-intent` - Create Stripe payment intent

## 👤 Default Admin Account

For testing, you can create an admin account:
- Email: `admin@primestore.com`
- Password: `admin123`

## 🎨 Customization

### Styling
- Edit `client/src/index.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Components use shadcn/ui - customize in `client/src/components/ui/`

### Database
- Schema defined in `shared/schema.ts`
- Use `npm run db:push` after schema changes

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation with Zod
- Admin-only routes protection

## 🚀 Deployment

The application is configured for easy deployment on platforms like:
- Replit
- Vercel
- Railway
- Heroku

Make sure to set environment variables in your deployment platform.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using modern web technologies.