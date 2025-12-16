const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./env');

async function createAdmin() {
  try {
    // Add connection event handlers
    mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'));
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));

    // Connect with timeout settings
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000 // 45 seconds socket timeout
    });

    const existingAdmin = await User.findOne({ username: 'admin' });

    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        password: 'admin123'
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
    } else {
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('ℹ️ Admin user exists. Password reset to admin123');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createAdmin();