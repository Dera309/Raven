# Security Fixes Implementation Guide

## Quick Implementation Steps

### Step 1: Install Security Packages
```bash
cd server
npm install helmet express-rate-limit express-validator express-mongo-sanitize xss-clean hpp
```

### Step 2: Update server/src/index.ts

Add these imports at the top:
```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
```

Add security middleware before routes:
```typescript
// Security Headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

### Step 3: Add Input Validation

Create `server/src/middleware/validators.ts`:
```typescript
import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
  body('role').isIn(['artist', 'vixen']),
  body('phone').optional().isMobilePhone(),
  validate
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
];

export const bookingValidation = [
  body('vixenId').isMongoId(),
  body('projectTitle').trim().isLength({ min: 3, max: 100 }).escape(),
  body('description').trim().isLength({ min: 10, max: 1000 }).escape(),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 2, max: 100 }).escape(),
  body('rateOffered').isNumeric().isInt({ min: 0 }),
  validate
];

export const profileValidation = [
  body('stageName').trim().isLength({ min: 2, max: 50 }).escape(),
  body('bio').optional().trim().isLength({ max: 500 }).escape(),
  body('location').trim().isLength({ min: 2, max: 100 }).escape(),
  validate
];

export const mongoIdValidation = [
  param('id').isMongoId(),
  validate
];
```

### Step 4: Update Auth Routes

In `server/src/routes/authRoutes.ts`:
```typescript
import { registerValidation, loginValidation } from '../middleware/validators';

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
```

### Step 5: Generate Strong JWT Secret

```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Update `.env`:
```
JWT_SECRET=<generated_secret_here>
```

### Step 6: Add Error Handling Middleware

Add to `server/src/index.ts` after routes:
```typescript
// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
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
```

### Step 7: Add HTTPS Redirect (Production)

In `server/src/index.ts`:
```typescript
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
```

### Step 8: Update CORS Configuration

```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Step 9: Add Security to Socket.io

In `server/src/socket.ts`:
```typescript
export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        },
        // Add connection limits
        maxHttpBufferSize: 1e6, // 1MB
        pingTimeout: 60000
    });

    // Add authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        // Verify token here
        next();
    });
    
    // Rest of code...
}
```

### Step 10: Client-Side Security

Update `client/src/utils/api.ts`:
```typescript
const handleResponse = async (response: Response) => {
    const data = await response.json();
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
    }
    
    // Handle 429 Too Many Requests
    if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
    }
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
};
```

## Testing Security Fixes

1. Test rate limiting:
```bash
# Should block after 5 attempts
for i in {1..10}; do curl -X POST http://localhost:8000/api/auth/login; done
```

2. Test input validation:
```bash
# Should reject invalid email
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"test"}'
```

3. Test XSS protection:
```bash
# Should sanitize script tags
curl -X POST http://localhost:8000/api/profiles/artist \
  -H "Authorization: Bearer <token>" \
  -d '{"bio":"<script>alert(1)</script>"}'
```

## Monitoring & Maintenance

1. Set up security monitoring:
```bash
npm audit
npm audit fix
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "security-check": "npm audit && snyk test"
  }
}
```

3. Schedule regular security updates:
- Weekly: `npm audit`
- Monthly: Update dependencies
- Quarterly: Security code review
