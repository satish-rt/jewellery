require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const connectDB = require('../src/config/db');

const seedAdmin = async () => {
  try {
    await connectDB();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = new Admin({
      email: adminEmail,
      hashedPassword: adminPassword,
    });
    
    await admin.save();
    console.log(`Admin seeded successfully: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
