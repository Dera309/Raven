# Raven - Implementation Plan

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (React), TypeScript, TailwindCSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT + bcrypt |
| **File Storage** | Cloudinary (images/videos) or local with multer |
| **Real-time** | Socket.io for messaging |
| **Payments** | Paystack/Flutterwave (for African market) |
| **Email** | Nodemailer with SendGrid/Mailgun |

---

## Phase 1: Foundation & Core Setup (Priority: HIGH)

### 1.1 Project Initialization
**Links to:** Requirements 1  
**Priority:** HIGH

- Initialize Next.js frontend with TypeScript
- Initialize Express.js backend with TypeScript
- Setup MongoDB connection with Mongoose
- Configure environment variables
- Setup project structure (MVC pattern)

### 1.2 User Authentication System
**Links to:** Requirements 1  
**Priority:** HIGH

- Create User model with role-based schema
- Implement registration endpoint with validation
- Implement login endpoint with JWT generation
- Create authentication middleware
- Build registration/login UI pages

### 1.3 Database Models
**Links to:** Requirements 1, 2, 3, 4, 6, 7, 8, 9, 11  
**Priority:** HIGH

- User model (base for Artist/Vixen)
- Profile model (extends User with role-specific fields)
- Booking model
- Review model
- Media model (portfolio items)
- Ad model (premium placements)
- Notification model
- Conversation & Message models

---

## Phase 2: Profile & Portfolio Features (Priority: HIGH)

### 2.1 Artist Profile Features
**Links to:** Requirements 2  
**Priority:** HIGH

- Create artist profile schema
- Build profile creation/edit API endpoints
- Design profile UI with edit mode
- Implement profile picture upload

### 2.2 Vixen Profile Features
**Links to:** Requirements 3  
**Priority:** HIGH

- Create vixen profile schema with extended fields
- Build profile API with availability toggle
- Design enhanced profile UI with portfolio section
- Implement Featured badge display logic

### 2.3 Portfolio Management
**Links to:** Requirements 4  
**Priority:** HIGH

- Setup Cloudinary/local file storage
- Create media upload API with validation
- Build media gallery component
- Implement lightbox preview
- Add delete functionality with confirmation

---

## Phase 3: Discovery & Booking (Priority: HIGH)

### 3.1 Search & Discovery System
**Links to:** Requirements 5  
**Priority:** HIGH

- Build search API with MongoDB aggregation
- Implement filters (location, availability, rate)
- Create featured/promoted sorting logic
- Design search results UI with grid layout
- Build individual vixen profile view page

### 3.2 Booking System
**Links to:** Requirements 6  
**Priority:** HIGH

- Create booking request API
- Build booking management endpoints (accept/decline)
- Implement booking status workflow
- Design booking UI for both artists and vixens
- Add booking completion flow

### 3.3 Reviews & Ratings
**Links to:** Requirements 7  
**Priority:** MEDIUM

- Create review model and API
- Calculate and store average ratings
- Build review submission UI
- Display reviews on profiles

---

## Phase 4: Monetization & Ads (Priority: HIGH)

### 4.1 Ad System
**Links to:** Requirements 8  
**Priority:** HIGH

- Create Ad model with duration tiers
- Build ad purchase API
- Integrate payment gateway (Paystack/Flutterwave)
- Implement ad activation/expiration logic
- Design ad dashboard with analytics

### 4.2 Payment Integration
**Links to:** Requirements 8  
**Priority:** HIGH

- Setup payment gateway SDK
- Create payment webhook handlers
- Build payment success/failure flows
- Implement transaction history

---

## Phase 5: Communication Features (Priority: MEDIUM)

### 5.1 Notifications System
**Links to:** Requirements 9  
**Priority:** MEDIUM

- Create notification model and API
- Build notification triggers for events
- Setup email notification sending
- Design notification center UI
- Implement mark-as-read functionality

### 5.2 Messaging System
**Links to:** Requirements 11  
**Priority:** MEDIUM

- Setup Socket.io on backend
- Create conversation and message models
- Build real-time messaging API
- Design chat UI component
- Implement message notifications

---

## Phase 6: Admin & Moderation (Priority: MEDIUM)

### 6.1 Admin Dashboard
**Links to:** Requirements 10  
**Priority:** MEDIUM

- Create admin authentication/role check
- Build user management API
- Build content moderation queue
- Design admin dashboard UI
- Implement ad revenue reporting

### 6.2 Content Moderation
**Links to:** Requirements 10  
**Priority:** MEDIUM

- Create report content API
- Build moderation workflow
- Implement user suspension system
- Add content approval/rejection flow

---

## Phase 7: Polish & Optimization (Priority: LOW)

### 7.1 Performance Optimization
- Implement lazy loading for media
- Add pagination for lists
- Optimize MongoDB queries with indexes
- Setup caching for frequent queries

### 7.2 Security Hardening
- Add rate limiting
- Implement CORS properly
- Add input sanitization
- Setup HTTPS in production

### 7.3 Testing & QA
- Unit tests for API endpoints
- Integration tests for critical flows
- E2E tests for user journeys
- Load testing for scalability

---

## Verification Plan

### Automated Tests

1. **API Unit Tests** (Jest + Supertest)
   ```bash
   cd server && npm test
   ```
   - Test all authentication endpoints
   - Test CRUD operations for all models
   - Test booking workflow state transitions

2. **Frontend Component Tests** (Jest + React Testing Library)
   ```bash
   cd client && npm test
   ```
   - Test form validations
   - Test component rendering
   - Test user interactions

### Manual Verification

1. **Registration/Login Flow**
   - Register as Artist → Verify dashboard access
   - Register as Vixen → Verify different dashboard
   - Test invalid credentials → Verify error messages

2. **Portfolio Upload**
   - Upload image → Verify appears in gallery
   - Upload video → Verify thumbnail generated
   - Upload invalid file → Verify rejection message

3. **Booking Flow**
   - Artist sends booking → Vixen receives notification
   - Vixen accepts → Artist notified, status updates
   - Complete booking → Review prompt appears

4. **Ad Purchase Flow**
   - Purchase ad → Payment processes
   - Ad activates → "Featured" badge shows
   - Search results → Featured vixens appear first
