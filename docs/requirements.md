# Raven - Requirements Document

## Introduction

**Raven** is a professional platform connecting music artists with video vixens (video models/dancers) for music video productions. The platform enables:

- **Artists** to discover, review, and hire vixens for their music video projects
- **Vixens** to showcase their portfolio, receive booking requests, and build their brand
- **Both parties** to share videos and pictures of completed works
- **Monetization** through premium ad placements that boost vixen profile visibility

The platform uses **MongoDB** for data persistence and supports media-rich profiles with portfolio management.

---

## User Roles

| Role | Description |
|------|-------------|
| **Artist** | Music artists seeking to hire vixens for video productions |
| **Vixen** | Video models/dancers offering their services for hire |
| **Admin** | Platform administrators managing users, content, and ads |

---

## Requirements

### 1. User Registration & Authentication

**User Story:**
> As a user, I want to register and login to the platform with my role (artist/vixen) so that I can access role-specific features.

**Acceptance Criteria:**
- WHEN a new user registers THEN the system SHALL collect email, password, full name, role, and phone number
- WHEN registering THEN the system SHALL validate email format and require password minimum 8 characters
- WHEN a user with an existing email tries to register THEN the system SHALL display "Email already registered"
- WHEN a user logs in with valid credentials THEN the system SHALL redirect to their role-specific dashboard
- WHEN login fails THEN the system SHALL display "Invalid email or password"
- WHEN authenticated THEN the system SHALL issue a JWT token valid for 7 days

---

### 2. Artist Profile Management

**User Story:**
> As an artist, I want to create and manage my profile so that vixens can see my credentials and past work.

**Acceptance Criteria:**
- WHEN creating a profile THEN the system SHALL require stage name, bio, genre, and profile picture
- WHEN editing profile THEN the system SHALL allow updating all fields except email
- WHEN viewing an artist profile THEN the system SHALL display their portfolio (videos/pictures)
- WHEN a profile is incomplete THEN the system SHALL show a "Complete Profile" banner

---

### 3. Vixen Profile Management

**User Story:**
> As a vixen, I want to create a detailed profile showcasing my skills, rates, and portfolio so that artists can find and hire me.

**Acceptance Criteria:**
- WHEN creating a profile THEN the system SHALL require stage name, bio, body measurements (optional), location, and rate per video
- WHEN editing profile THEN the system SHALL allow updating all fields including availability status
- WHEN a vixen sets "Available" status THEN the system SHALL show them in search results
- WHEN setting "Unavailable" status THEN the system SHALL hide them from search but keep profile viewable via direct link
- WHEN a vixen profile has a premium ad THEN the system SHALL display a "Featured" badge

---

### 4. Portfolio Management (Videos & Pictures)

**User Story:**
> As a user (artist/vixen), I want to upload videos and pictures of my work so that others can see my portfolio.

**Acceptance Criteria:**
- WHEN uploading media THEN the system SHALL accept MP4, MOV (videos) and JPG, PNG, WEBP (images)
- WHEN uploading THEN the system SHALL validate file size (videos ≤ 100MB, images ≤ 10MB)
- WHEN upload completes THEN the system SHALL generate thumbnails for videos
- WHEN viewing portfolio THEN the system SHALL display media in a grid layout with lightbox preview
- WHEN deleting media THEN the system SHALL require confirmation before permanent removal
- WHEN a user has no portfolio items THEN the system SHALL show "Add your first work" prompt

---

### 5. Vixen Search & Discovery

**User Story:**
> As an artist, I want to search and filter vixens by location, availability, and rates so that I can find the right talent for my project.

**Acceptance Criteria:**
- WHEN searching THEN the system SHALL filter by location, availability status, and rate range
- WHEN displaying results THEN the system SHALL show profile picture, name, location, rate, and rating
- WHEN no filters applied THEN the system SHALL show all available vixens ordered by rating
- WHEN a vixen has an active ad THEN the system SHALL show them first in search results (Featured)
- WHEN clicking a vixen card THEN the system SHALL navigate to their full profile

---

### 6. Booking System

**User Story:**
> As an artist, I want to send booking requests to vixens with project details so that I can hire them for my music video.

**Acceptance Criteria:**
- WHEN creating a booking THEN the system SHALL require project title, description, date, location, and offered rate
- WHEN a booking is submitted THEN the system SHALL notify the vixen via email and in-app notification
- WHEN a vixen accepts THEN the system SHALL update status to "Confirmed" and notify the artist
- WHEN a vixen declines THEN the system SHALL update status to "Declined" with optional reason
- WHEN viewing bookings THEN the system SHALL show status: Pending, Confirmed, Declined, Completed, Cancelled
- WHEN a booking date passes THEN the system SHALL allow marking as "Completed"

---

### 7. Reviews & Ratings

**User Story:**
> As a user, I want to leave reviews after completed bookings so that others can make informed decisions.

**Acceptance Criteria:**
- WHEN a booking is marked "Completed" THEN both parties SHALL be prompted to leave a review
- WHEN leaving a review THEN the system SHALL require a 1-5 star rating and optional comment (max 500 chars)
- WHEN a review is submitted THEN the system SHALL update the user's average rating
- WHEN viewing a profile THEN the system SHALL display average rating and individual reviews

---

### 8. Premium Ads for Vixen Visibility

**User Story:**
> As a vixen, I want to purchase premium ad placements so that my profile gets more visibility to artists.

**Acceptance Criteria:**
- WHEN viewing ad options THEN the system SHALL display pricing tiers (7-day, 30-day, 90-day)
- WHEN purchasing an ad THEN the system SHALL process payment and activate the ad immediately
- WHEN an ad is active THEN the system SHALL display "Featured" badge on profile
- WHEN an ad is active THEN the system SHALL prioritize the vixen in search results
- WHEN an ad expires THEN the system SHALL send a reminder notification 3 days before
- WHEN viewing ad dashboard THEN the system SHALL show impressions, profile views, and booking requests

---

### 9. Notifications System

**User Story:**
> As a user, I want to receive notifications for important events so that I stay updated on platform activity.

**Acceptance Criteria:**
- WHEN a booking request is received THEN the system SHALL send push and email notification
- WHEN a booking status changes THEN the system SHALL notify the relevant party
- WHEN a review is received THEN the system SHALL notify the reviewed user
- WHEN an ad is about to expire THEN the system SHALL send a reminder notification
- WHEN viewing notifications THEN the system SHALL mark them as read and allow clearing

---

### 10. Admin Dashboard

**User Story:**
> As an admin, I want to manage users, content, and ads so that I can maintain platform quality.

**Acceptance Criteria:**
- WHEN viewing users THEN the system SHALL show list with filters by role and status
- WHEN suspending a user THEN the system SHALL disable their login and hide their profile
- WHEN viewing reported content THEN the system SHALL show moderation queue
- WHEN approving/rejecting content THEN the system SHALL notify the content owner
- WHEN viewing ad revenue THEN the system SHALL show total revenue, active ads, and transaction history

---

### 11. Messaging System

**User Story:**
> As a user, I want to message other users so that I can discuss project details before booking.

**Acceptance Criteria:**
- WHEN starting a conversation THEN the system SHALL create a chat thread between two users
- WHEN sending a message THEN the system SHALL deliver in real-time using WebSocket
- WHEN receiving a message THEN the system SHALL show notification badge
- WHEN viewing conversations THEN the system SHALL show list ordered by most recent
- WHEN a user is blocked THEN the system SHALL prevent messaging between them
