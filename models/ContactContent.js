const mongoose = require('mongoose');

const contactContentSchema = new mongoose.Schema({
  // First Section - Hero Content
  heroSection: {
    title: { type: String, default: 'Reach Us' },
    description: { 
      type: String, 
      default: 'At Voix & Vision Worx, we are dedicated to transforming your aspirations into tangible achievements. We partner with businesses to navigate complex challenges and unlock new possibilities, leveraging our expertise to deliver innovative and impactful solutions. Our commitment is to your success, helping you connect, engage, and grow in an ever-evolving landscape. Contact us today to explore how our collaborative approach can help achieve your strategic goals.'
    },
    formSectionTitle: { type: String, default: 'I am interested in' }
  },

  // Services Selection (for form display)
  servicesList: {
    type: [String],
    default: [
      'Strategy',
      'Branding & Design',
      'Content & Production',
      'Digital Marketing',
      'Agent Vua',
      'Agent Vision',
      'Agent XR'
    ]
  },
  servicesLabel: { type: String, default: 'Services' },
  servicesSubtext: { type: String, default: '(Select at least one)' },

  // Map Section
  mapSection: {
    title: { type: String, default: 'Our Presence' },
    locations: {
      type: [{
        cx: { type: Number, required: true },
        cy: { type: Number, required: true },
        city: { type: String, required: true, trim: true },
        address: { type: [String], required: true },
        phone: { type: String, required: true, trim: true },
        id: { type: String, required: true, unique: false, trim: true },
        order: { type: Number, required: true },
        isActive: { type: Boolean, default: true }
      }],
      default: [
        {
          cx: 1087.93,
          cy: 361.869,
          city: "Mumbai",
          address: [
            "Unit No 711, A Wing",
            "Centrum Business Square",
            "Road No 16, Wagle Estate",
            "Thane(W) - 400604"
          ],
          phone: "+91 877 96 32312",
          id: "mumbai",
          order: 1,
          isActive: true
        },
        {
          cx: 985.556,
          cy: 330.369,
          city: "Dubai",
          address: [
            "14th Floor, Office No 1402",
            "Burjuman Business Tower",
            "Burjuman, Dubai"
          ],
          phone: "+971 56 189 9800",
          id: "dubai",
          order: 2,
          isActive: true
        },
        {
          cx: 1103.68,
          cy: 367.381,
          city: "Pune",
          address: [
            "Office 3B, 2nd Floor",
            "Building 3, Cerebrum IT Park",
            "Kalyaninagar, 411032"
          ],
          phone: "+91 797 67 48422",
          id: "pune",
          order: 3,
          isActive: true
        }
      ]
    }
  },

  // Job Openings Section
  jobSection: {
    title: { type: String, default: 'Looking For VUA Filling' },
    subtitle: { type: String, default: 'Current Opening' },
    openings: {
      type: [String],
      default: [
        'Brand Manager',
        'UI Designer',
        'Marketing Intern',
        'Senior Designer',
        'Animator',
        'Business Development'
      ]
    },
    contactText: { type: String, default: 'Work With Us:' },
    contactEmail: { type: String, default: 'hr@vvworx.com' }
  },

  // Styling Configuration
  styling: {
    backgroundColor: { type: String, default: '#EEF0FF' },
    primaryColor: { type: String, default: '#6210FF' },
    secondaryColor: { type: String, default: '#BE2FF4' },
    textColor: { type: String, default: '#000000' }
  },

  // Metadata
  isActive: { type: Boolean, default: true },
  version: { type: String, default: '1.0' },
  lastUpdatedBy: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to ensure only one active content at a time
contactContentSchema.pre('save', async function (next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  
  // Ensure we have at least 6 job openings for proper layout
  if (this.jobSection && this.jobSection.openings) {
    const defaultOpenings = [
      'Brand Manager',
      'UI Designer', 
      'Marketing Intern',
      'Senior Designer',
      'Animator',
      'Business Development'
    ];
    
    if (this.jobSection.openings.length < 6) {
      const needed = 6 - this.jobSection.openings.length;
      const additional = defaultOpenings.slice(-needed);
      this.jobSection.openings.push(...additional);
    }
  }
  
  this.updatedAt = new Date();
  next();
});

// Add indexes for better query performance
contactContentSchema.index({ isActive: 1 });
contactContentSchema.index({ createdAt: -1 });

const ContactContent = mongoose.model('ContactContent', contactContentSchema);

module.exports = ContactContent;