# replit.md

## Overview

This is a full-stack e-commerce application built with React, Express.js, and PostgreSQL. The application provides a complete online shopping experience with user authentication, product management, shopping cart functionality, and Stripe payment integration. It uses a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components for a polished user interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client-side and server-side code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with Passport.js
- **Payments**: Stripe integration for payment processing
- **UI Framework**: Tailwind CSS with shadcn/ui components

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for client-side routing
- **State Management**: React Query for server state, React Context for client state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite with development server integration

### Backend Architecture
- **Express.js**: RESTful API server with middleware for authentication and logging
- **Authentication**: Passport.js with local strategy and bcrypt for password hashing
- **Session Management**: Express sessions with PostgreSQL session store
- **Database**: Drizzle ORM with Neon PostgreSQL serverless database
- **Payment Processing**: Stripe integration for handling payments

### Database Schema
The database includes the following main entities:
- **Users**: User accounts with authentication credentials and admin flags
- **Categories**: Product categories with slugs for URL-friendly navigation
- **Products**: Product catalog with pricing, inventory, and metadata
- **Cart Items**: Shopping cart functionality linked to users and products
- **Orders**: Order management with status tracking and totals

### External Integrations
- **Stripe**: Payment processing with React Stripe.js components
- **Neon Database**: Serverless PostgreSQL hosting
- **Image Hosting**: External image URLs for product and category images

## Data Flow

1. **User Authentication**: Users register/login through Passport.js local strategy
2. **Product Browsing**: Products are fetched from the database with category filtering and search
3. **Shopping Cart**: Cart operations are managed through React Context with database persistence
4. **Checkout Process**: Stripe handles payment processing with server-side validation
5. **Admin Management**: Admin users can manage products, categories, and orders through protected routes

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI libraries (Radix UI, shadcn/ui, Tailwind CSS)
- Stripe integration (@stripe/stripe-js, @stripe/react-stripe-js)
- Form handling (React Hook Form, Zod validation)
- Routing (Wouter)

### Backend Dependencies
- Express.js with middleware (express-session, passport)
- Database (Drizzle ORM, @neondatabase/serverless)
- Authentication (bcrypt, passport-local)
- Payment processing (Stripe)
- Session storage (connect-pg-simple)

### Development Dependencies
- TypeScript for type safety
- Vite for development and build tooling
- ESBuild for server bundling
- Various development utilities and type definitions

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

- **Development**: `npm run dev` runs both client and server in development mode
- **Build**: `npm run build` creates production builds for both client and server
- **Production**: `npm run start` serves the built application
- **Database**: Uses environment variable `DATABASE_URL` for PostgreSQL connection
- **Environment**: Configured for Node.js 20 with PostgreSQL 16 module

The build process creates optimized bundles with Vite handling the client build and ESBuild bundling the server for production deployment.