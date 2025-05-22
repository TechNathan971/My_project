# PrimeStore Deployment Guide

This guide covers different deployment options for your PrimeStore e-commerce platform.

## 🚀 Quick Deploy Options

### Option 1: Replit (Easiest)
1. Import your repository to Replit
2. Set environment variables in Replit Secrets
3. Run `npm install` and `npm run dev`
4. Use Replit's deployment feature

### Option 2: Vercel + Railway
**Frontend (Vercel):**
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build:client`
3. Set output directory: `dist/client`

**Backend (Railway):**
1. Create new Railway project from GitHub
2. Add PostgreSQL database
3. Set environment variables
4. Deploy with `npm start`

### Option 3: Heroku
1. Create Heroku app: `heroku create your-store-name`
2. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:mini`
3. Set environment variables: `heroku config:set STRIPE_SECRET_KEY=...`
4. Deploy: `git push heroku main`

## 🔧 Environment Variables

Required for all deployments:

```env
# Database (required)
DATABASE_URL=postgresql://user:password@host:port/database

# Stripe (optional, for payments)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Node Environment
NODE_ENV=production
```

## 🗄️ Database Setup

### PostgreSQL Setup
1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run migrations: `npm run db:push`

### Popular Database Providers
- **Neon** (recommended): Free PostgreSQL hosting
- **Supabase**: PostgreSQL with additional features  
- **Railway**: Integrated PostgreSQL
- **Heroku Postgres**: Add-on for Heroku

## 💳 Stripe Configuration

### Get Stripe Keys
1. Sign up at [stripe.com](https://stripe.com)
2. Go to [Dashboard > API Keys](https://dashboard.stripe.com/apikeys)
3. Copy your publishable key (starts with `pk_`)
4. Copy your secret key (starts with `sk_`)

### Test vs Live Mode
- Use `pk_test_` and `sk_test_` for testing
- Use `pk_live_` and `sk_live_` for production

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong database passwords
- [ ] Enable HTTPS (most platforms do this automatically)
- [ ] Set secure session secrets
- [ ] Validate all environment variables are set
- [ ] Test payment flow in Stripe test mode
- [ ] Review and limit admin permissions

## 📊 Performance Optimization

### Frontend
- Images are optimized and served from CDN (Unsplash)
- Code splitting enabled with Vite
- Compression enabled for production builds

### Backend
- Database connection pooling configured
- Query optimization with Drizzle ORM
- Session storage using database

### Database
- Indexes on frequently queried columns
- Connection pooling for better performance

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check DATABASE_URL format
- Ensure database exists and is accessible
- Verify firewall/network settings

**Stripe Not Working**
- Verify API keys are correct
- Check if using test vs live keys appropriately
- Ensure webhook endpoints are configured (if needed)

**Build Failures**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

### Debug Mode
Set `NODE_ENV=development` to enable detailed error logging.

## 📈 Monitoring

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Uptime**: Pingdom or UptimeRobot
- **Performance**: New Relic or DataDog

### Health Check Endpoint
The app includes a health check at `/api/health` for monitoring.

## 🔄 Updates and Maintenance

### Regular Updates
1. Keep dependencies updated: `npm audit`
2. Update Node.js version as needed
3. Monitor Stripe API version updates
4. Backup database regularly

### Database Migrations
Use Drizzle migrations for schema changes:
```bash
npm run db:generate
npm run db:migrate
```

---

Need help with deployment? Check the issues in the GitHub repository or create a new one!