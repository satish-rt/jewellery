require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const connectDB = require('../src/config/db');

const sampleProducts = [
  {
    name: 'Aurora Signet Ring',
    category: 'gold',
    images: [
      { url: 'https://placehold.co/800x800/FFD700/1A1A1A?text=Aurora+Ring' }
    ],
    price: 1200,
    weight: '8g',
    purity: '18k',
    description: 'A refined signet ring crafted in solid 18k gold with a satin finish.',
    inStock: true,
  },
  {
    name: 'Luna Drop Earrings',
    category: 'silver',
    images: [
      { url: 'https://placehold.co/800x800/C0C0C0/1A1A1A?text=Luna+Earrings' }
    ],
    price: 320,
    weight: '6g',
    purity: 'Sterling Silver',
    description: 'Elegant drop earrings finished with a mirror polish.',
    inStock: true,
  },
  {
    name: 'Solstice Pendant',
    category: 'gold',
    images: [
      { url: 'https://placehold.co/800x800/FFD700/1A1A1A?text=Solstice+Pendant' }
    ],
    price: 850,
    weight: '10g',
    purity: '14k',
    description: 'A contemporary pendant inspired by solar geometry.',
    inStock: true,
  },
  {
    name: 'Cascade Bracelet',
    category: 'silver',
    images: [
      { url: 'https://placehold.co/800x800/C0C0C0/1A1A1A?text=Cascade+Bracelet' }
    ],
    price: 480,
    weight: '12g',
    purity: 'Sterling Silver',
    description: 'A finely articulated bracelet with fluid movement.',
    inStock: false,
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing sample products (optional)
    await Product.deleteMany({ name: { $in: sampleProducts.map(p => p.name) } });

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log('Sample products seeded');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed products:', err);
    process.exit(1);
  }
};

seed();
