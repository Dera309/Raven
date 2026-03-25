# How to Run the Seed Script - Create Admin User

## Quick Start (3 Steps)

### Step 1: Open Terminal in Server Directory
```bash
cd c:\Users\Admin\OneDrive\Desktop\Raven\server
```

### Step 2: Run the Seed Script
```bash
npm run seed
```

### Step 3: Wait for Completion
You should see output like:
```
Connected to DB
Cleared existing data
Created Artist User
Created Vixen User
Created Admin User
Seeding completed successfully
```

## What the Seed Script Creates

The seed script automatically creates 3 test users:

### 1. Admin User ✅
```
Email: admin@raven.com
Password: admin123
Role: admin
```

### 2. Test Artist
```
Email: artist@test.com
Password: password123
Role: artist
```

### 3. Test Vixen
```
Email: vixen@test.com
Password: password123
Role: vixen
```

## Step-by-Step Instructions

### For Windows Users:

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`
   - Type `cmd` or `powershell`
   - Press Enter

2. **Navigate to Server Directory**
   ```bash
   cd c:\Users\Admin\OneDrive\Desktop\Raven\server
   ```

3. **Run the Seed Command**
   ```bash
   npm run seed
   ```

4. **Wait for Completion**
   - The script will connect to MongoDB
   - Clear existing test data
   - Create 3 new test users
   - Display success message

### For Mac/Linux Users:

1. **Open Terminal**
   - Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
   - Type `terminal`
   - Press Enter

2. **Navigate to Server Directory**
   ```bash
   cd ~/Desktop/Raven/server
   # or wherever your Raven folder is located
   ```

3. **Run the Seed Command**
   ```bash
   npm run seed
   ```

4. **Wait for Completion**

## Troubleshooting

### Error: "npm: command not found"
**Solution**: Node.js is not installed
- Download from https://nodejs.org/
- Install Node.js
- Restart terminal
- Try again

### Error: "Cannot find module 'dotenv'"
**Solution**: Dependencies not installed
```bash
npm install
npm run seed
```

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
**Solution**: MongoDB is not running
- Start MongoDB service
- Or check your MONGO_URI in .env file
- Make sure it's correct

### Error: "MONGO_URI is not defined"
**Solution**: .env file not found or not configured
1. Check if `.env` file exists in `server/` directory
2. Make sure it has `MONGO_URI=...` set
3. Restart terminal after creating/updating .env

### Script runs but no output
**Solution**: Script is still running
- Wait a few seconds
- Check your MongoDB connection
- Look for error messages

## After Running Seed Script

### Login to Admin Dashboard

1. **Start the Client** (if not already running)
   ```bash
   cd c:\Users\Admin\OneDrive\Desktop\Raven\client
   npm run dev
   ```

2. **Go to Login Page**
   - Open browser
   - Navigate to: `http://localhost:3000/login`

3. **Enter Admin Credentials**
   - Email: `admin@raven.com`
   - Password: `admin123`

4. **Click Sign In**
   - You'll be redirected to `/dashboard/admin`

## What Gets Cleared

⚠️ **Important**: The seed script clears existing data:
- All users are deleted
- All artist profiles are deleted
- All vixen profiles are deleted
- All other data remains (bookings, messages, etc.)

If you want to keep existing data, modify the seed script to skip the delete steps.

## Modifying the Seed Script

To add more test data or change credentials, edit:
```
server/src/seed.ts
```

Example: Change admin password
```typescript
const adminPassword = await bcrypt.hash('mynewpassword', adminSalt);
```

Then run `npm run seed` again.

## Running Seed Script Multiple Times

You can run the seed script multiple times:
- Each time it clears and recreates the test data
- Useful for resetting to a clean state
- Good for testing

## Seed Script Code

The seed script is located at: `server/src/seed.ts`

It:
1. Connects to MongoDB
2. Clears existing users and profiles
3. Creates an artist user with profile
4. Creates a vixen user with profile
5. Creates an admin user
6. Exits successfully

## Next Steps

After seeding:
1. ✅ Login as admin with `admin@raven.com` / `admin123`
2. ✅ View admin dashboard
3. ✅ Test user management features
4. ✅ Create your own users through registration

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run seed` | Create test users |
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript |
| `npm start` | Start production server |

## Support

If you encounter issues:
1. Check MongoDB is running
2. Verify .env file is configured
3. Check terminal output for error messages
4. Restart terminal and try again
5. Check GitHub issues for similar problems
