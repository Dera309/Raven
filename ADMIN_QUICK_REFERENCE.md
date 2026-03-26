# Admin Setup Quick Reference

## 3-Step Setup

### Step 1: Copy Example File
```bash
cd server
cp src/seed.ts.example src/seed.ts
```

### Step 2: Edit with Your Credentials
Open `server/src/seed.ts` and change:
```typescript
// Line ~73
const adminPassword = await bcrypt.hash('YOUR_SECURE_PASSWORD', adminSalt);

// Line ~76
email: 'YOUR_REAL_EMAIL@gmail.com',
```

### Step 3: Run Seed Script
```bash
npm run seed
```

## Login Credentials

After running seed script, login with:
- **Email:** Your email from seed.ts
- **Password:** Your password from seed.ts
- **URL:** http://localhost:3000/login

## Password Generator

Need a strong password? Use this format:
```
[Word][Number][Special][Word][Number]
Example: Raven2024@Admin!Secure
```

## File Checklist

- [ ] Copied seed.ts.example to seed.ts
- [ ] Updated email in seed.ts
- [ ] Updated password in seed.ts
- [ ] Ran `npm run seed`
- [ ] Logged in successfully
- [ ] Tested logout button

## Important

⚠️ **DO NOT:**
- Commit seed.ts to GitHub
- Share your credentials
- Use weak passwords
- Use the same password everywhere

✅ **DO:**
- Use strong passwords (12+ characters)
- Use real email address
- Keep seed.ts private
- Change password regularly

## Troubleshooting

| Problem | Solution |
|---------|----------|
| seed.ts not found | Run: `cp src/seed.ts.example src/seed.ts` |
| Invalid credentials | Check email/password spelling in seed.ts |
| MongoDB error | Ensure MongoDB is running |
| Already exists error | Run seed script again |

## Commands

```bash
# Copy example file
cp server/src/seed.ts.example server/src/seed.ts

# Run seed script
npm run seed

# Start server
npm run dev

# Start client
npm run dev (in client folder)
```

## Login Flow

1. Go to http://localhost:3000/login
2. Enter email and password
3. Click "Sign in"
4. Redirected to /dashboard/admin
5. Click logout button to exit

## Security Tips

- Use 12+ character passwords
- Mix uppercase, lowercase, numbers, symbols
- Use unique passwords for each account
- Never share credentials
- Change password every 90 days
- Enable 2FA when available

## Support

For help:
1. Check ADMIN_SECURE_SETUP.md
2. Review server logs
3. Verify MongoDB connection
4. Check credentials in seed.ts
