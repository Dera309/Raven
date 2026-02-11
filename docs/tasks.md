# Raven - Development Tasks

## Legend
- `[ ]` Not started
- `[/]` In progress  
- `[x]` Completed

---

## Phase 1: Foundation & Core Setup
> Links to: Plan 1.1, 1.2, 1.3 | Requirements 1

### Project Initialization
- [ ] 1.1.1 Create project root with `client/` and `server/` directories
- [ ] 1.1.2 Initialize Next.js 14 app in `client/` with TypeScript
- [ ] 1.1.3 Initialize Express.js app in `server/` with TypeScript
- [ ] 1.1.4 Setup MongoDB connection with Mongoose
- [ ] 1.1.5 Create `.env` files with required variables
- [ ] 1.1.6 Setup ESLint and Prettier for both projects

### Database Models
- [ ] 1.2.1 Create User model (email, password, role, isVerified)
- [ ] 1.2.2 Create ArtistProfile model
- [ ] 1.2.3 Create VixenProfile model with extended fields
- [ ] 1.2.4 Create Media model for portfolio items
- [ ] 1.2.5 Create Booking model with status enum
- [ ] 1.2.6 Create Review model with user references
- [ ] 1.2.7 Create Ad model with duration and status
- [ ] 1.2.8 Create Notification model
- [ ] 1.2.9 Create Conversation and Message models

### Authentication System
- [ ] 1.3.1 Create auth routes (register, login, logout)
- [ ] 1.3.2 Implement password hashing with bcrypt
- [ ] 1.3.3 Implement JWT token generation and verification
- [ ] 1.3.4 Create auth middleware for protected routes
- [ ] 1.3.5 Build registration page UI
- [ ] 1.3.6 Build login page UI
- [ ] 1.3.7 Implement auth context/store on frontend
- [ ] 1.3.8 Create protected route component

---

## Phase 2: Profile & Portfolio Features
> Links to: Plan 2.1, 2.2, 2.3 | Requirements 2, 3, 4

### Artist Profile
- [ ] 2.1.1 Create artist profile API endpoints (GET, POST, PUT)
- [ ] 2.1.2 Build artist profile creation form
- [ ] 2.1.3 Build artist profile view page
- [ ] 2.1.4 Implement profile picture upload

### Vixen Profile
- [ ] 2.2.1 Create vixen profile API endpoints
- [ ] 2.2.2 Build vixen profile creation form with all fields
- [ ] 2.2.3 Implement availability status toggle
- [ ] 2.2.4 Build vixen profile view page with Featured badge
- [ ] 2.2.5 Add portfolio section to profile

### Portfolio Management
- [ ] 2.3.1 Setup Cloudinary or local file storage
- [ ] 2.3.2 Create media upload API with validation
- [ ] 2.3.3 Implement video thumbnail generation
- [ ] 2.3.4 Build media gallery grid component
- [ ] 2.3.5 Add lightbox preview functionality
- [ ] 2.3.6 Implement media delete with confirmation

---

## Phase 3: Discovery & Booking
> Links to: Plan 3.1, 3.2, 3.3 | Requirements 5, 6, 7

### Search & Discovery
- [ ] 3.1.1 Create search API with MongoDB aggregation
- [ ] 3.1.2 Implement location filter
- [ ] 3.1.3 Implement availability filter
- [ ] 3.1.4 Implement rate range filter
- [ ] 3.1.5 Add Featured prioritization in results
- [ ] 3.1.6 Build search page with filter sidebar
- [ ] 3.1.7 Build vixen card component for results
- [ ] 3.1.8 Create vixen detail page

### Booking System
- [ ] 3.2.1 Create booking request API
- [ ] 3.2.2 Create booking management API (accept/decline/complete)
- [ ] 3.2.3 Build booking request form for artists
- [ ] 3.2.4 Build booking management UI for vixens
- [ ] 3.2.5 Build booking history page for both roles
- [ ] 3.2.6 Implement booking status badges

### Reviews & Ratings
- [ ] 3.3.1 Create review API endpoints
- [ ] 3.3.2 Implement average rating calculation
- [ ] 3.3.3 Build review submission modal
- [ ] 3.3.4 Display reviews on profile pages
- [ ] 3.3.5 Add star rating component

---

## Phase 4: Monetization
> Links to: Plan 4.1, 4.2 | Requirements 8

### Payment Integration
- [ ] 4.1.1 Setup Paystack/Flutterwave SDK
- [ ] 4.1.2 Create payment initiation endpoint
- [ ] 4.1.3 Create payment webhook handler
- [ ] 4.1.4 Implement transaction logging

### Ad System
- [ ] 4.2.1 Create ad tiers configuration (7, 30, 90 days)
- [ ] 4.2.2 Create ad purchase API
- [ ] 4.2.3 Implement ad activation after payment
- [ ] 4.2.4 Create ad expiration checker (cron job)
- [ ] 4.2.5 Build ad purchase page with tier selection
- [ ] 4.2.6 Build ad dashboard with analytics
- [ ] 4.2.7 Add expiration reminder notifications

---

## Phase 5: Communication Features
> Links to: Plan 5.1, 5.2 | Requirements 9, 11

### Notifications
- [ ] 5.1.1 Create notification API endpoints
- [ ] 5.1.2 Implement booking notification triggers
- [ ] 5.1.3 Implement review notification triggers
- [ ] 5.1.4 Implement ad expiry notification triggers
- [ ] 5.1.5 Setup email notifications with Nodemailer
- [ ] 5.1.6 Build notification center UI
- [ ] 5.1.7 Implement mark-as-read functionality

### Messaging
- [ ] 5.2.1 Setup Socket.io on backend
- [ ] 5.2.2 Create conversation API endpoints
- [ ] 5.2.3 Create message API endpoints
- [ ] 5.2.4 Implement real-time message delivery
- [ ] 5.2.5 Build conversation list UI
- [ ] 5.2.6 Build chat window component
- [ ] 5.2.7 Add message notification badges

---

## Phase 6: Admin & Moderation
> Links to: Plan 6.1, 6.2 | Requirements 10

### Admin Dashboard
- [ ] 6.1.1 Create admin role check middleware
- [ ] 6.1.2 Create user management API
- [ ] 6.1.3 Create ad revenue reporting API
- [ ] 6.1.4 Build admin dashboard layout
- [ ] 6.1.5 Build user management table
- [ ] 6.1.6 Build revenue analytics charts

### Content Moderation
- [ ] 6.2.1 Create report content API
- [ ] 6.2.2 Build moderation queue UI
- [ ] 6.2.3 Implement user suspension
- [ ] 6.2.4 Implement content approval/rejection

---

## Phase 7: Polish & Deployment
> Links to: Plan 7.1, 7.2, 7.3

### Performance & Security
- [ ] 7.1.1 Add rate limiting to APIs
- [ ] 7.1.2 Implement proper CORS configuration
- [ ] 7.1.3 Add input sanitization
- [ ] 7.1.4 Create MongoDB indexes for performance
- [ ] 7.1.5 Implement pagination for all lists
- [ ] 7.1.6 Add lazy loading for media

### Testing
- [ ] 7.2.1 Write unit tests for auth endpoints
- [ ] 7.2.2 Write unit tests for booking workflow
- [ ] 7.2.3 Write integration tests for payment flow
- [ ] 7.2.4 Write E2E tests for registration flow

### Deployment
- [ ] 7.3.1 Setup production MongoDB Atlas
- [ ] 7.3.2 Deploy backend to Render/Railway
- [ ] 7.3.3 Deploy frontend to Vercel
- [ ] 7.3.4 Configure production environment variables
- [ ] 7.3.5 Setup domain and SSL
