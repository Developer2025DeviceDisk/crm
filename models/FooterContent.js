const mongoose = require('mongoose');

const footerContentSchema = new mongoose.Schema({
  // Company Information
  companyInfo: {
    name: { type: String, default: 'Voix & Vision Worx' },
    logo: { type: String, default: 'default-logo.svg' }, // SVG path or image URL
    description: { type: String, default: '' }
  },

  // Social Media Links
  socialLinks: {
    followText: { type: String, default: 'Follow Us:' },
    links: [{
      platform: { type: String, required: true }, // linkedin, facebook, instagram, behance, youtube
      url: { type: String, required: true },
      isActive: { type: Boolean, default: true }
    }]
  },

  // Navigation Menu
  navigationMenu: {
    title: { type: String, default: 'Quick Links' },
    links: [{
      text: { type: String, required: true },
      url: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      order: { type: Number, default: 0 }
    }]
  },

  // Office Locations
  officeLocations: [{
    city: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, default: '' },
      line3: { type: String, default: '' }
    },
    phone: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],

  // Footer Styling
  styling: {
    backgroundColor: { type: String, default: 'bg-gradient-to-r from-[#5F00F6] to-[#B933FF]' },
    textColor: { type: String, default: 'text-white' },
    fontFamily: { type: String, default: 'Outfit' }
  },

  // Metadata
  isActive: { type: Boolean, default: true },
  version: { type: String, default: '1.0' },
  lastUpdatedBy: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to ensure only one active content
footerContentSchema.pre('save', async function (next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  
  // Sort navigation links by order
  if (this.navigationMenu && this.navigationMenu.links) {
    this.navigationMenu.links.sort((a, b) => a.order - b.order);
  }
  
  // Sort office locations by order
  if (this.officeLocations) {
    this.officeLocations.sort((a, b) => a.order - b.order);
  }
  
  this.updatedAt = new Date();
  next();
});

// Set default data on first creation
footerContentSchema.pre('save', function (next) {
  if (this.isNew) {
    // Set default social links if not provided
    if (!this.socialLinks.links || this.socialLinks.links.length === 0) {
      this.socialLinks.links = [
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com/company/voix-vision-worx/',
          isActive: true
        },
        {
          platform: 'facebook', 
          url: 'https://www.facebook.com/people/Voix-Vision-Worx/61575858395596/',
          isActive: true
        },
        {
          platform: 'instagram',
          url: 'http://instagram.com/vvworx/',
          isActive: true
        },
        {
          platform: 'behance',
          url: 'https://www.behance.net/vvworx',
          isActive: true
        },
        {
          platform: 'youtube',
          url: 'http://www.youtube.com/@VVWorx',
          isActive: true
        }
      ];
    }

    // Set default navigation links if not provided
    if (!this.navigationMenu.links || this.navigationMenu.links.length === 0) {
      this.navigationMenu.links = [
        { text: 'Home', url: '/', isActive: true, order: 1 },
        { text: 'Services', url: '/services', isActive: true, order: 2 },
        { text: 'About Us', url: '/About', isActive: true, order: 3 },
        { text: 'Contact Us', url: '/contact', isActive: true, order: 4 },
        { text: 'Privacy Policy', url: '/privacy-policy', isActive: true, order: 5 }
      ];
    }

    // Set default office locations if not provided
    if (!this.officeLocations || this.officeLocations.length === 0) {
      this.officeLocations = [
        {
          city: 'Dubai',
          isActive: true,
          address: {
            line1: '14th Floor, Office No 1402, Burjuman',
            line2: 'Business Tower, Burjuman, Dubai.'
          },
          phone: '+971 56 189 9800',
          order: 1
        },
        {
          city: 'Mumbai',
          isActive: true,
          address: {
            line1: 'Unit No 711, A Wing, Centrum Business Square, Road No 16,',
            line2: 'Wagle Estate, Thane(W) - 400604'
          },
          phone: '+91 877 96 32312',
          order: 2
        },
        {
          city: 'Pune',
          isActive: true,
          address: {
            line1: 'Office 3B, 2nd Floor, Building 3, Cerebrum IT Park,',
            line2: 'Kalyaninagar, 411032.'
          },
          phone: '+91 797 67 48422',
          order: 3
        }
      ];
    }
  }
  next();
});

// Create indexes for better performance
footerContentSchema.index({ isActive: 1 });
footerContentSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('FooterContent', footerContentSchema);