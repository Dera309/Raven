#!/usr/bin/env node

/**
 * Admin User Creator
 * 
 * Usage: node create-admin.js [email] [password] [name]
 * Example: node create-admin.js admin@raven.com admin123 "Admin User"
 * 
 * This script creates an admin user directly in MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./dist/models/User').default;

async function createAdmin() {
    const email = process.argv[2] || 'admin@raven.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User with this email already exists');
            process.exit(1);
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            loginAttempts: 0
        });

        console.log('\n✅ Admin user created successfully!\n');
        console.log('📋 Admin Details:');
        console.log('   Name:', admin.name);
        console.log('   Email:', admin.email);
        console.log('   Role:', admin.role);
        console.log('   Verified:', admin.isVerified);
        console.log('\n🔑 Login Credentials:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('\n📍 Login URL: http://localhost:3000/login\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdmin();
