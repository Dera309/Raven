#!/usr/bin/env node

/**
 * Update Admin User Only
 * 
 * This script updates ONLY the admin user without clearing other data
 * Usage: npx ts-node src/update-admin.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import User, { UserRole } from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const updateAdminUser = async () => {
    try {
        await connectDB();
        console.log('✅ Connected to DB');

        // Check if admin user exists
        const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
        
        if (existingAdmin) {
            console.log(`Found existing admin: ${existingAdmin.email}`);
            console.log('Updating admin user...');
        } else {
            console.log('No admin user found. Creating new admin user...');
        }

        // Hash new password
        const adminSalt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('your-secure-password-here', adminSalt);

        if (existingAdmin) {
            // Update existing admin
            existingAdmin.email = 'your-email@example.com';
            existingAdmin.password = adminPassword;
            existingAdmin.name = 'Admin User';
            existingAdmin.isVerified = true;
            
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully');
        } else {
            // Create new admin
            await User.create({
                name: 'Admin User',
                email: 'your-email@example.com',
                password: adminPassword,
                role: UserRole.ADMIN,
                isVerified: true
            });
            console.log('✅ Admin user created successfully');
        }

        console.log('\n📋 Admin Details:');
        console.log('   Email: your-email@example.com');
        console.log('   Password: your-secure-password-here');
        console.log('   Role: admin');
        console.log('   Verified: true');
        
        console.log('\n⚠️  IMPORTANT:');
        console.log('   1. Edit src/update-admin.ts with your real email and password');
        console.log('   2. Run: npx ts-node src/update-admin.ts');
        console.log('   3. All other data (users, bookings, etc.) remains unchanged');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating admin user:', (error as Error).message);
        process.exit(1);
    }
};

updateAdminUser();
