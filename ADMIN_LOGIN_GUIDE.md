# Admin Dashboard Login Guide

## Quick Start

### Step 1: Create an Admin User

You need to create an admin user in your MongoDB database. Choose one of these methods:

#### Method A: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `raven_db` → `users` collection
4. Click "Insert Document"
5. Paste this JSON:
```json
{
  "name": "Admin User",
  "email": "admin@raven.com",
  "password": "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890", 
  "role": "admin",
  "phone": "+234123456789",
  "isVerified": true,
  "loginAttempts": 0,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

#### Method B: Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to raven_db
use raven_db

# Insert admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@raven.com",
  password: "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890",
  role: "admin",
  phone: "+234123456789",
  isVerified: true,
  loginAttempts: 0,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

#### Method C: Using the Seed Script (Recommended)
Create a seed script to generate a proper admin user:

```bash
cd server
npm run seed
```

This will create test users including an admin account.

### Step 2: Hash the Password

The password in the database must be hashed using bcrypt. Use this Node.js script to generate a hashed password:

```javascript
const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'admin123'; // Change this to your desired password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashedPassword);
}

hashPassword();
```

Run this and copy the hashed password to your database.

### Step 3: Login to Admin Dashboard

1. **Go to Login Page**
   - Navigate to: `http://localhost:3000/login`

2. **Enter Admin Credentials**
   - Email: `admin@raven.com`
   - Password: `admin123` (or whatever you set)

3. **Click "Sign in"**

4. **You'll be redirected to Admin Dashboard**
   - URL: `http://localhost:3000/dashboard/admin`

## Admin Dashboard Features

### Overview Tab
- **Total Revenue**: Sum of all ad purchases
- **Total Users**: Count of all registered users
- **Active Bookings**: Bookings in pending or accepted status
- **User Distribution**: Pie chart showing vixens vs artists
- **Booking Status**: Chart showing completed vs in-progress bookings

### Users Tab
- **View All Users**: List of all registered users
- **User Details**: Name, email, role, verification status, join date
- **Verify/Unverify**: Toggle user verification status
- **Search**: Find users by name or email

### Revenue Tab
- **Ad Purchases**: List of all ad tier purchases
- **Payment Details**: Amount paid, payment reference, date
- **Ad Tiers**: 1-day, 3-day, 7-day, 30-day promotions
- **Revenue Tracking**: Total revenue from ads

## Troubleshooting

### "Access denied. Admin only." Error
**Problem**: User doesn't have admin role
**Solution**: 
1. Check database - user's `role` field should be `"admin"`
2. Verify the role is exactly `"admin"` (lowercase)
3. Restart the server after updating

### "Invalid credentials" Error
**Problem**: Email or password is incorrect
**Solution**:
1. Verify email is correct in database
2. Verify password is properly hashed with bcrypt
3. Check for extra spaces in email

### Admin page shows blank/loading forever
**Problem**: API calls failing
**Solution**:
1. Check server is running on port 8001
2. Check MongoDB connection
3. Open browser console (F12) to see error messages
4. Check server logs for errors

### Statistics showing 0
**Problem**: No data in database
**Solution**:
1. Create test data using seed script
2. Create some bookings and ads
3. Refresh the page

## Test Credentials

After running the seed script, use these credentials:

```
Admin Account:
Email: admin@raven.com
Password: admin123

Test Vixen:
Email: testvixen@test.com
Password: password123

Test Artist:
Email: testartist@test.com
Password: password123
```

## Creating Additional Admin Users

To create more admin users, repeat the process:

1. Generate a hashed password using bcrypt
2. Insert a new user document with `role: "admin"`
3. Login with those credentials

## Security Notes

⚠️ **Important**:
- Never store plain text passwords in the database
- Always use bcrypt to hash passwords
- Change default admin password after first login
- Use strong passwords (minimum 8 characters)
- Keep admin credentials secure
- Don't share admin login details

## API Endpoints (Admin Only)

All these endpoints require admin authentication:

```
GET /api/admin/stats
- Returns: Dashboard statistics

GET /api/admin/users
- Returns: List of all users

PATCH /api/admin/users/:userId
- Body: { isVerified: boolean }
- Returns: Updated user

GET /api/admin/revenue
- Returns: List of all ad purchases
```

## Next Steps

After logging in as admin:
1. Review platform statistics
2. Verify user accounts
3. Monitor revenue
4. Manage user status
5. Track booking activity

## Support

If you encounter issues:
1. Check the browser console (F12) for errors
2. Check server logs for API errors
3. Verify MongoDB connection
4. Ensure all environment variables are set
5. Restart both server and client
