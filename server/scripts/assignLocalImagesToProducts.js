require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const connectDB = require('../src/config/db');

// Map product name (as seeded) to a local image filename in client/public/images
const mapping = {
  'Aurora Signet Ring': '/images/hero-poster.png',
  'Luna Drop Earrings': '/images/hero.png',
  'Solstice Pendant': '/images/marble-gold.png',
  'Cascade Bracelet': '/images/about-bg.png',
};

const assign = async () => {
  try {
    await connectDB();

    for (const [name, url] of Object.entries(mapping)) {
      const product = await Product.findOne({ name });
      if (!product) {
        console.warn(`Product not found: ${name}`);
        continue;
      }

      product.images = [{ url }];
      await product.save();
      console.log(`Updated ${name} -> ${url}`);
    }

    console.log('Image assignment complete');
    process.exit(0);
  } catch (err) {
    console.error('Failed to assign images:', err);
    process.exit(1);
  }
};

assign();
