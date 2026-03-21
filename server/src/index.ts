import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adRoutes from './routes/adRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

import http from 'http';
import { initSocket, setSocketIO } from './socket';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'NODE_ENV', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please set these variables in your .env file before starting the server.');
    process.exit(1);
}

// Log startup in production without exposing details
const isProduction = process.env.NODE_ENV === 'production';
console.log(`🚀 Raven Server starting in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT || 8001;

// Connect to Database first
connectDB();

// Initialize Socket.io after DB connection
  // --- MANUAL CORS & DIAGNOSTIC MIDDLEWARE ---
  app.use((req: Request, res: Response, next: NextFunction) => {
      const origin = req.header('origin');
      
      // Regex for any render.com or onrender.com subdomain (with optional port)
      const renderRegex = /^https?:\/\/(?:[^.]+\.)*?(render|onrender)\.com(:[0-9]+)?$/i;
      const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
      const isAllowed = !origin || renderRegex.test(origin) || isLocalhost;

      if (origin && isAllowed) {
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token');
          res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
      }

      if (process.env.NODE_ENV === 'production') {
          console.log(`[CORS MANUAL] Method: ${req.method} | Origin: ${origin} | isAllowed: ${isAllowed} | Regex test: ${origin ? renderRegex.test(origin) : 'N/A'}`);
      }

      // Handle Preflight
      if (req.method === 'OPTIONS') {
          return res.sendStatus(204);
      }
      
      next();
  });

// Security Headers (Helmet) - MUST be after manual CORS to avoid header overriding issues in some environments
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:", "wss:", "*.render.com", "*.onrender.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// 3. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many authentication attempts, please try again later',
    skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['location', 'rate', 'genre'] // Allow duplicate query params for filters
}));

// Cookie parser for CSRF
app.use(cookieParser());

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
// Apply to all routes except the token fetcher
app.get('/api/csrf-token', csrfProtection, (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use(csrfProtection);

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Raven API Server Running');
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // ALWAYS log the full error in the server console for debugging
    console.error('SERVER ERROR:', err);
    
    // Handle CSRF errors
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ message: 'Form has been tampered with or CSRF token is invalid' });
    }

    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
        res.status(err.status || 500).json({
            message: 'An error occurred',
            ...(err.isOperational && { details: err.message })
        });
    } else {
        res.status(err.status || 500).json({
            message: err.message,
            stack: err.stack
        });
    }
});

server.listen(port, () => {
    const protocol = isProduction ? 'https' : 'http';
    console.log(`✅ Raven API Server running on ${protocol}://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
        const nextPort = Number(port) + 1;
        console.warn(`⚠️  Port ${port} is already in use. Trying port ${nextPort}...`);
        server.close();
        server.listen(nextPort, () => {
            const protocol = isProduction ? 'https' : 'http';
            console.log(`✅ Raven API Server running on ${protocol}://localhost:${nextPort}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV}`);
        });
    } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    // In production, don't expose error details
    if (!isProduction) {
        console.error(err.stack);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    console.error('❌ Uncaught Exception:', err.message);
    if (!isProduction) {
        console.error(err.stack);
    }
    // Don't exit for EADDRINUSE — the server.on('error') handler already deals with it
    if ((err as NodeJS.ErrnoException).code !== 'EADDRINUSE') {
        process.exit(1);
    }
});
