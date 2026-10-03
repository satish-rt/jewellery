require('dotenv').config();
const connectDB = require('../src/config/db');
const Admin = require('../src/models/Admin');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const out = {};
  args.forEach((a) => {
    const eq = a.indexOf('=');
    if (eq > -1) {
      const key = a.slice(0, eq).replace(/^--/, '');
      const val = a.slice(eq + 1);
      out[key] = val;
    }
  });
  return out;
};

const run = async () => {
  const { email, password } = parseArgs();
  if (!email || !password) {
    console.error('Usage: node resetAdminPassword.js --email=you@domain.com --password=NewPass123');
    process.exit(1);
  }

  try {
    await connectDB();

    let admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      console.log('Admin not found — creating new admin');
      admin = new Admin({ email, hashedPassword: password });
    } else {
      admin.hashedPassword = password;
    }

    await admin.save();
    console.log(`Admin password set for ${admin.email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err.message || err);
    process.exit(1);
  }
};

run();
