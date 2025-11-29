const mongoose = require('mongoose');

const aboutPageContentSchema = new mongoose.Schema({
  // Header Section
  headerSection: {
    titleLine1: { type: String, default: 'Your Voice In' },
    titleLine2: { type: String, default: 'The Future Of' },
    titleLine3: { type: String, default: 'Marketing.' },
    backgroundGradient: { type: String, default: 'from-[#6210FF] to-[#BE2FF4]' },
    heroImage: { type: String, default: '/Marketingwoman.png' },
    decorativeImage: { type: String, default: '/Markofinnovation.png' }
  },

  // About Us Section (SVG Text Section)
  aboutUsSection: {
    mainTextLine1: { 
      type: String, 
      default: "'Vua' is the Voice that will lead the dialogue" 
    },
    mainTextLine2: { 
      type: String, 
      default: "for a future-forward world of Marketing." 
    },
    textColor: { type: String, default: '#6210FF' },
    backgroundColor: { type: String, default: '#EEF0FF' }
  },

  // Who Are We Section
  whoAreWeSection: {
    title: { type: String, default: 'Who Are We?' },
    backgroundImage: { type: String, default: '/Whoarewe.png' },
    leftImages: {
      decorativeArc: { type: String, default: '/Layer_1.png' },
      astronaut: { type: String, default: '/astro.png' }
    },
    content: {
      paragraph1: { 
        type: String, 
        default: 'We are a future-focused Marketing agency that aims to help brands leverage the latest in marketing creativity and technology to achieve their Growth KPIs.' 
      },
      highlightText: { 
        type: String, 
        default: 'Our 360-degree service portfolio of creative, digital and Mar-Tech solutions' 
      },
      paragraph1Continuation: { 
        type: String, 
        default: 'empowers brands to lead, not follow, in a world shaped by innovation.' 
      },
      paragraph2: { 
        type: String, 
        default: 'VUA is more than a brand-it\'s a movement for those who seek to lead the next era of change.' 
      }
    }
  },

  // Foundation Section (Fixed 4 items)
  foundationSection: {
    title: { type: String, default: 'Our Foundation' },
    backgroundColor: { type: String, default: '#6310FF' },
    foundations: {
      type: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        order: { type: Number, required: true }
      }],
      validate: {
        validator: function(v) { return v.length === 4; },
        message: 'Foundation section must have exactly 4 foundation items'
      },
      default: [
        { title: 'Creativity', description: 'Creativity that inspires', order: 1 },
        { title: 'Innovation', description: 'Technology that keeps You ahead', order: 2 },
        { title: 'Strategic Thinking', description: 'Strategy that always makes you win', order: 3 },
        { title: 'Customer Centricity', description: 'Everything is about "You"', order: 4 }
      ]
    }
  },

  // Director Section (Dynamic - unlimited directors)
  directorSection: {
    sectionTitle: { type: String, default: 'Director' },
    backgroundColor: { type: String, default: '#EEF0FF' },
    directors: {
      type: [{
        name: { type: String, required: true },
        role: { type: String, default: '' },
        image: { type: String, required: true },
        description: { type: String, required: true },
        order: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
      }],
      default: [
        {
          name: 'Vishal Sharma',
          role: '',
          image: '/Vishal-Sharma.png',
          description: 'A seasoned leader with over 25 Years of diverse industry experience spanning Media, Telecom, Real Estate, Infrastructure, and Utilities, Vishal is recognized for his ability to develop and implement winning, comprehensive Marketing Communication and Branding Strategies in complex environments. His expertise as a brand marketing leader encompasses cross-functional knowledge of both Domestic and Global Markets.\n\nPrior to his entrepreneurial ventures, Vishal held Senior Managerial Positions leading Branding & Communications at prestigious organizations including Bharti Airtel, Vodafone, Reliance, Etisalat, Essel Group, Anarock, GreenCell Mobility, and PropertyPistol.',
          order: 1,
          isActive: true
        },
        {
          name: 'Shivendra Singh',
          role: '',
          image: '/Shivendra-Singh.png',
          description: 'A seasoned business leader with over 17 Years of experience in the Real Estate Industry across India and international markets, including the GCC, Europe, and North America. He has held key positions in prestigious organizations such as AllCheckDeals (InfoEdge), Proptiger.com, JLL, ANAROCK, and PropertyPistol. He has been instrumental in successfully managing both Indian and international portfolios, showcasing a proven ability to navigate diverse market dynamics.',
          order: 2,
          isActive: true
        }
      ]
    }
  },

  // Team Section
  teamSection: {
    sectionTitle: { type: String, default: 'Our Team' },
    backgroundColor: { type: String, default: 'black' },
    titleGradient: { type: String, default: 'from-[#6210FF] to-[#BE2FF4]' },
    teamMembers: {
      type: [{
        name: { type: String, required: true },
        role: { type: String, required: true },
        image: { type: String, required: true },
        order: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
      }],
      default: [
        { name: 'Gourav Bhatt', role: 'Digital Marketing', image: '/Group 30.png', order: 1, isActive: true },
        { name: 'Dishank Shah', role: 'Chief Business Officer', image: '/Group 32.png', order: 2, isActive: true },
        { name: 'Heramb Gharat', role: 'Creative Head', image: '/Group 33.png', order: 3, isActive: true },
        { name: 'Dishank Shah', role: 'Chief Business Officer', image: '/Group 32.png', order: 4, isActive: true }
      ]
    }
  },

  // Metadata
  isActive: { type: Boolean, default: true },
  version: { type: String, default: '1.0' },
  lastUpdatedBy: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook for validation and content management
aboutPageContentSchema.pre('save', async function (next) {
  // Ensure only one active content version
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  
  // Ensure exactly 4 foundation items with proper order
  if (this.foundationSection && this.foundationSection.foundations) {
    const defaultFoundations = [
      { title: 'Creativity', description: 'Creativity that inspires', order: 1 },
      { title: 'Innovation', description: 'Technology that keeps You ahead', order: 2 },
      { title: 'Strategic Thinking', description: 'Strategy that always makes you win', order: 3 },
      { title: 'Customer Centricity', description: 'Everything is about "You"', order: 4 }
    ];
    
    if (this.foundationSection.foundations.length > 4) {
      this.foundationSection.foundations = this.foundationSection.foundations.slice(0, 4);
    } else if (this.foundationSection.foundations.length < 4) {
      const missingCount = 4 - this.foundationSection.foundations.length;
      const missingItems = defaultFoundations.slice(-missingCount);
      this.foundationSection.foundations.push(...missingItems);
    }
    
    this.foundationSection.foundations.forEach((foundation, index) => {
      foundation.order = index + 1;
    });
  }

  // Ensure directors have proper order (dynamic count)
  if (this.directorSection && this.directorSection.directors) {
    this.directorSection.directors.forEach((director, index) => {
      if (!director.order) {
        director.order = index + 1;
      }
      if (director.isActive === undefined) {
        director.isActive = true;
      }
    });
  }
  
  this.updatedAt = new Date();
  next();
});

// Add indexes for better performance
aboutPageContentSchema.index({ isActive: 1 });
aboutPageContentSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('AboutPageContent', aboutPageContentSchema);