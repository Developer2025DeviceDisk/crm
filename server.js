// Use custom environment configuration
const config = require('./env');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// MongoDB Atlas connection
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    console.log('Cluster Host:', mongoose.connection.host);
    console.log('Database Name:', mongoose.connection.name);
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const servicesContentRoutes = require('./routes/servicesContent');
const privacyPolicyRoutes = require('./routes/privacyPolicy');
const aboutContentRoutes = require('./routes/aboutContent');
const aboutPageContentRoutes = require('./routes/aboutPageContent');
const footerContentRoutes = require('./routes/footerContent');
const contactContentRoutes = require('./routes/contactContent');
const imageUploadRoutes = require('./routes/imageUpload');
const videoUploadRoutes = require('./routes/videoUpload');
const ourWorkContentRoutes = require('./routes/ourWorkContent');
const clientContentRoutes = require('./routes/clientContent');

app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services-content', servicesContentRoutes);
app.use('/api/privacy-policy', privacyPolicyRoutes);
app.use('/api/about-content', aboutContentRoutes);
app.use('/api/about-page-content', aboutPageContentRoutes);
app.use('/api/footer-content', footerContentRoutes);
app.use('/api/contact-content', contactContentRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/videos', videoUploadRoutes);
app.use('/api/our-work-content', ourWorkContentRoutes);
app.use('/api/client-content', clientContentRoutes);
app.use('/api/instagram', require('./routes/instagram'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Redirect root to dashboard (with auth check)
app.get('/', (req, res) => {
  if (req.session.user) {  // Check if user is logged in
    res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'));
  } else {
    res.redirect('/login.html');  // Redirect to login if not authenticated
  }
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});