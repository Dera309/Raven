# Setting Up Admin Dashboard with Real Secure Credentials

## Step 1: Create Your seed.ts File

First, copy the example file to create your local seed.ts:

```bash
cd server
cp src/seed.ts.example src/seed.ts
```

## Step 2: Edit seed.ts with Your Real Credentials

Open `server/src/seed.ts` and find the Admin User section (around line 70):

```typescript
// Create Admin User
const adminSalt = await bcrypt.genSalt(10);
const adminPassword = await bcrypt.hash('your-secure-password-here', adminSalt);

await User.create({
    name: 'Admin User',
    email: 'your-email@example.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    isVerified: true
});
```

### Replace with Your Real Credentials:

**Example:**
```typescript
// Create Admin User
const adminSalt = await bcrypt.genSalt(10);
const adminPassword = await bcrypt.hash('MySecurePassword@2024!', adminSalt);

await User.create({
    name: 'Admin User',
    email: 'chideraobia7@gmail.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    isVerified: true
});
```

## Step 3: Password Security Best Practices

### Strong Password Requirements:
- ✅ Minimum 12 characters
- ✅ Mix of uppercase and lowercase letters
- ✅ Include numbers (0-9)
- ✅ Include special characters (!@#$%^&*)
- ✅ Avoid common words or patterns
- ✅ Don't use personal information

### Example Strong Passwords:
```
✅ MySecurePassword@2024!
✅ Admin#Raven$2024
✅ Secure@Pass123!Raven
✅ R@ven$Admin#2024
```

### Weak Passwords to Avoid:
```
❌ admin123
❌ password
❌ 12345678
❌ admin@admin
❌ raven123
```

## Step 4: Email Setup

Use your real email address:

```typescript
email: 'your-real-email@gmail.com',
// or
email: 'your-real-email@company.com',
```

### Why Use Real Email?
- ✅ Receive password reset emails
- ✅ Account recovery
- ✅ Security notifications
- ✅ Professional communication

## Step 5: Run the Seed Script

After updating seed.ts with your credentials:

```bash
npm run seed
```

You should see:
```
Connected to DB
Cleared existing data
Created Artist User
Created Vixen User
Created Admin User
Seeding completed successfully
```

## Step 6: Login to Admin Dashboard

1. Go to `http://localhost:3000/login`
2. Enter your credentials:
   - Email: `your-real-email@gmail.com`
   - Password: `MySecurePassword@2024!`
3. Click "Sign in"
4. You'll be redirected to `/dashboard/admin`

## Step 7: Verify Logout Works

1. Click the logout button (red icon in top right)
2. You should be redirected to login page
3. Your session is cleared

## Security Checklist

Before going to production:

- ✅ Use a strong, unique password
- ✅ Use your real email address
- ✅ Never commit seed.ts to GitHub (it's in .gitignore)
- ✅ Change password regularly
- ✅ Enable two-factor authentication (if available)
- ✅ Keep credentials secure
- ✅ Don't share admin credentials

## Changing Admin Credentials Later

If you need to change credentials:

1. Edit `server/src/seed.ts` with new credentials
2. Run `npm run seed` again
3. The script will recreate all test data with new admin credentials

## Troubleshooting

### "Invalid credentials" error
- Check email is spelled correctly
- Verify password matches exactly
- Check for extra spaces

### "Cannot find seed.ts"
- Run: `cp src/seed.ts.example src/seed.ts`
- Edit with your credentials
- Run: `npm run seed`

### "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify connection string is correct

### "User already exists"
- The seed script clears existing users
- If error persists, check MongoDB connection
- Try running seed script again

## File Locations

```
server/
├── src/
│   ├── seed.ts              ← Your local file (NOT in Git)
│   ├── seed.ts.example      ← Template (in Git)
│   └── ...
└── ...
```

## Important Notes

⚠️ **Remember:**
- `seed.ts` is in `.gitignore` - it won't be committed
- Your credentials stay private and secure
- Never share your seed.ts file
- Use strong, unique passwords
- Keep your email secure

## Next Steps

After setting up admin with real credentials:

1. ✅ Login to admin dashboard
2. ✅ Verify all features work
3. ✅ Test user management
4. ✅ Test logout functionality
5. ✅ Create real users through registration

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify credentials in seed.ts
3. Check MongoDB connection
4. Review server logs
5. Restart server and try again

## Production Deployment

For production:
1. Use a strong, unique admin password
2. Use a professional email address
3. Store credentials securely
4. Never commit seed.ts
5. Use environment variables for sensitive data
6. Enable HTTPS
7. Consider two-factor authentication
