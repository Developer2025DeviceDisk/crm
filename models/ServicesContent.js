const mongoose = require('mongoose');

const servicesContentSchema = new mongoose.Schema({
  // Header Section
  headerTitle: {
    type: String,
    default: 'Your 360° Growth Engine'
  },
  headerDescription: {
    type: String,
    default: 'We are India-UAE focused Tech-infused brand marketing agency offering an exhaustive services portfolio in Go-To-Market Strategy Development, Branding & Creative Solutions, AI-backed Performance & Social Media Marketing, and MarTech Automation. Founded by industry veterans, we are a passionate team offering scalable marketing solutions with a data-driven approach with presence in Mumbai, Pune and Dubai.'
  },

  // Strategy Section
  strategyTitle: {
    type: String,
    default: 'Strategy'
  },
  strategyDescription: {
    type: String,
    default: 'We translate your aspirations into a precise and actionable blueprint for achieving your goals.'
  },
  strategyServices: {
    type: [String],
    default: ['GTM Strategy', 'Brand Strategy', 'Brand Voice', 'Campaign Strategy', 'PR Strategy', 'Social Media Strategy']
  },

  // Branding & Design Section
  brandingTitle: {
    type: String,
    default: 'Branding & Design'
  },
  brandingDescription: {
    type: String,
    default: 'We transform your vision into a tangible and impactful brand experience.'
  },
  brandingServices: {
    type: [String],
    default: ['Brand Identity Design', 'Website Design', 'UI/UX Design', 'Event Branding', 'Office Branding', 'Print & Digital Creatives']
  },

  // Content & Production Section
  contentTitle: {
    type: String,
    default: 'Content & Production'
  },
  contentDescription: {
    type: String,
    default: 'We bring your story to life, crafting impactful content experiences that resonate.'
  },
  contentServices: {
    type: [String],
    default: ['Influencer Marketing', 'Blogs / Articles', 'Conceptualization of Content', 'Motion Graphics', 'Creative Copywriting', 'Reel Production', 'High Quality Video Production']
  },

  // Digital Marketing Section
  digitalTitle: {
    type: String,
    default: 'Digital Marketing'
  },
  digitalDescription: {
    type: String,
    default: 'We convert digital footprints into tangible results, connecting you with your audience and driving results.'
  },
  digitalServices: {
    type: [String],
    default: ['Growth Marketing', 'Social Media Management', 'SEO Optimization']
  },

  // Technological Solutions Section
  techSolutionsTitle: {
    type: String,
    default: 'Technological Solution'
  },
  techSolutionsDescription: {
    type: String,
    default: 'Your story deserves more than a slow, costly production cycle. With our AI video engine, you can turn sparks of inspiration into cinematic content-on demand. Whether you\'re crafting personalized ads or big brand moments, we help you scale creativity without compromise.'
  },
  techSolutionsTagline: {
    type: String,
    default: 'Less waiting. More wow.'
  },

  // Agent VUA Section
  agentVUATitle: {
    type: String,
    default: 'Agent VUA'
  },
  agentVUADescription: {
    type: String,
    default: 'AI Powered Calling Agent for all your Pre-Sales / Post-Sales & Customer Support Requirements'
  },
  agentVUAImpactTitle: {
    type: String,
    default: 'The Impact of Agent Vua'
  },
  agentVUAFeatures: {
    type: [String],
    default: ['AI Powered, Human like conversations', 'Real time objection handling', 'CRM Integrated', 'Available 24*7']
  },
  agentVUATagline: {
    type: String,
    default: 'Agent Vua can breakeven at the cost of just 5 Agents'
  },

  // Agent Vision Section
  agentVisionTitle: {
    type: String,
    default: 'Agent Vision'
  },
  agentVisionDescription: {
    type: String,
    default: 'Fast, affordable production quality films'
  },
  agentVisionVideoLabels: {
    launchVideos: {
      type: String,
      default: 'Launch Videos'
    },
    productionFilms: {
      type: String,
      default: 'Production & films'
    },
    reelContent: {
      type: String,
      default: 'Reel/content generation'
    },
    projectWalkthroughs: {
      type: String,
      default: 'Project walkthroughs'
    }
  },
  agentVisionStats: {
    type: [{
      value: { type: String, required: true },
      description: { type: String, required: true }
    }],
    default: [
      { value: '10%', description: 'Production\nBudget' },
      { value: '50X', description: 'Faster time\nto market' },
      { value: '100%', description: 'Realistic\nfootage' }
    ]
  },

  // Agent XR Section
  agentXRTitle: {
    type: String,
    default: 'Agent XR'
  },
  agentXRDescription: {
    type: String,
    default: 'Don\'t leave it to their imagination, immerse them in the experience'
  },
  agentXRServices: {
    type: [String],
    default: ['Virtual Reality', 'Digital twins', 'Mixed reality', 'Realistic renderings']
  },
  agentXRStats: {
    type: [{
      value: { type: String, required: true },
      label: { type: String, required: true }
    }],
    default: [
      { value: '90%', label: 'Cost Saving' },
      { value: '50X', label: 'Faster time to market' },
      { value: '400%', label: 'Increased Engagement' }
    ]
  },

  // Video URLs for different sections
  videos: {
    // Agent Vision Videos - Separated into 3 sections
    agentVisionVideoOne: {
      type: [String],
      default: ['/agentVision/1.mp4', '/agentVision/5.mp4']
    },
    agentVisionVideoTwo: {
      type: [String],
      default: ['/agentVision/2.mp4', '/agentVision/3.mp4']
    },
    agentVisionVideoThree: {
      type: [String],
      default: ['/agentVision/4.mp4', '/agentVision/6.mp4']
    },
    // VR Section Video
    vrVideo: {
      type: String,
      default: '/agentVision/2.mp4'
    }
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  lastUpdatedBy: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
servicesContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one active content at a time
servicesContentSchema.pre('save', async function(next) {
  if (this.isActive && this.isNew) {
    // Deactivate all other content when creating a new active one
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('ServicesContent', servicesContentSchema);