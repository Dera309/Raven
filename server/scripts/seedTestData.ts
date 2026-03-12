import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../src/models/User';
import VixenProfile from '../src/models/VixenProfile';
import ArtistProfile from '../src/models/ArtistProfile';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB');

        // Clear existing test data
        await User.deleteMany({ email: { $in: ['testvixen@test.com', 'testartist@test.com'] } });
        await VixenProfile.deleteMany({});
        await ArtistProfile.deleteMany({});

        // Create test vixen user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const vixenUser = await User.create({
            name: 'Test Vixen',
            email: 'testvixen@test.com',
            password: hashedPassword,
            role: UserRole.VIXEN,
            profilePicture: 'https://via.placeholder.com/150'
        });

        // Create vixen profile
        await VixenProfile.create({
            user: vixenUser._id,
            stageName: 'Test Vixen',
            location: 'Lagos',
            rate: 50000,
            currency: 'NGN',
            isAvailable: true,
            portfolio: [],
            featured: false,
            rating: 4.5,
            reviewCount: 10
        });

        // Create test artist user
        const artistUser = await User.create({
            name: 'Test Artist',
            email: 'testartist@test.com',
            password: hashedPassword,
            role: UserRole.ARTIST,
            profilePicture: 'https://via.placeholder.com/150'
        });

        // Create artist profile
        await ArtistProfile.create({
            user: artistUser._id,
            stageName: 'Test Artist',
            bio: 'Test artist bio',
            genre: ['Afrobeats'],
            location: 'Lagos'
        });

        console.log('✅ Test data seeded successfully!');
        console.log(`Vixen User ID: ${vixenUser._id}`);
        console.log(`Artist User ID: ${artistUser._id}`);
        console.log('\nTest credentials:');
        console.log('Vixen - Email: testvixen@test.com, Password: password123');
        console.log('Artist - Email: testartist@test.com, Password: password123');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
