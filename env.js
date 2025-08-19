// Environment Configuration
module.exports = {
  // Server Configuration
  PORT: 8000,

  // MongoDB Database


  // MONGODB_URI: 'mongodb+srv://abusayid693:8BLibUrL2UrbWcM0@cluster0.pl5c944.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  MONGODB_URI: 'mongodb+srv://sumit2004tiwari:unnH4rHNMTTeoF2j@cluster0.xutar1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',


  // Session Secret (for express-session)
  SESSION_SECRET: 'your-super-secret-session-key-here',

  // JWT Secret (for authentication tokens)
  JWT_SECRET: 'your-jwt-secret-key-here',

  // Email Configuration (Gmail)
  ALERT_FROM: 'your-email@gmail.com',
  EMAIL_PASSWORD: 'your-app-password-here',

  // Environment
  NODE_ENV: 'development'
};