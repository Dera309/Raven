import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';

// XSS middleware
const xssMiddleware = (req: any, res: any, next: any) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
};
import hpp from 'hpp';
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
const port = process.env.PORT || 8000;

// Connect to Database first
connectDB();

// Initialize Socket.io after DB connection
const socketInstance = initSocket(server);
setSocketIO(socketInstance);

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:", "wss:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Rate limiting - General API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
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

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        // Allow render.com and onrender.com domains
        if (origin.includes('render.com') || origin.includes('onrender.com')) {
            return callback(null, true);
        }
        
        // Allow the specific frontend URL from env
        if (origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        
        // Reject other origins
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xssMiddleware);

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['location', 'rate', 'genre'] // Allow duplicate query params for filters
}));

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

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
    console.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    
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
    process.exit(1);
});
