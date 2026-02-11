# Raven - Hire Video Vixens Platform

A full-stack web application for connecting music video directors and artists with professional video vixens. Built with the MERN stack (MongoDB, Express, React/Next.js, Node.js).

## 🎯 Features

### For Vixens
- **Profile Management**: Create and manage your professional portfolio with photos, measurements, and availability
- **Booking System**: Receive and manage booking requests from artists and directors
- **Promotion Tools**: Promote your profile to get more visibility
- **Messaging**: Real-time communication with clients

### For Artists/Directors
- **Discovery**: Browse and discover vixens by location, genre, and style
- **Booking**: Send booking requests with detailed specifications
- **Reviews**: View ratings and reviews from other artists
- **Portfolio Management**: Manage your artist profile and projects

### General Features
- **Real-time Messaging**: Socket.io powered instant messaging
- **Authentication**: Secure JWT-based authentication with role-based access
- **Notifications**: Real-time notification system
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose ODM**
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Helmet** for security headers
- **Express Rate Limit** for API protection

### Frontend
- **Next.js 16** (React framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time features

### Third-Party Services
- **Cloudinary** for image uploads
- **Paystack** for payment processing (Nigerian market)

## 📁 Project Structure

```
Raven/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── public/            # Static assets
│   └── ...
├── server/                # Express backend
│   ├── src/
│   │   ├── config/       # Database & service configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── types/        # TypeScript type definitions
│   │   └── ...
│   └── ...
├── docs/                  # Documentation
└── ...
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Paystack account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Raven
   ```

2. **Set up the server**
   ```bash
   cd server
   cp .env.development.example .env
   # Edit .env with your configuration
   npm install
   ```

3. **Set up the client**
   ```bash
   cd client
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm install
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev

   # Terminal 2 - Client
   cd client && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

### Production Deployment

1. **Configure environment variables**
   ```bash
   # Server
   cp server/.env.production.example server/.env
   # Edit with production values
   
   # Client
   cp client/.env.production client/.env.local
   # Edit with production values
   ```

2. **Build the applications**
   ```bash
   # Build server
   cd server && npm run build
   
   # Build client
   cd client && npm run build
   ```

3. **Start production servers**
   ```bash
   # Server (use PM2 or similar process manager)
   cd server && npm start
   
   # Client
   cd client && npm run start
   ```

## 🔒 Security Features

- JWT-based authentication with role-based access control
- Password hashing with bcrypt (10 salt rounds)
- Rate limiting on API endpoints
- Input sanitization against NoSQL injection and XSS
- Helmet security headers
- CORS configuration
- HTTPS enforcement in production

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Profiles
- `GET /api/profiles/vixens` - List all vixen profiles
- `GET /api/profiles/artists` - List all artist profiles
- `PUT /api/profiles/vixen` - Update vixen profile
- `PUT /api/profiles/artist` - Update artist profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `PUT /api/bookings/:id` - Update booking status

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
