const express = require('express');
const router = express.Router();
const ContactContent = require('../models/ContactContent');

// Public route - Get active contact content
router.get('/active', async (req, res) => {
  try {
    const activeContent = await ContactContent.findOne({ isActive: true });
    
    if (!activeContent) {
      // Return default content if none exists
      return res.json({
        success: true,
        data: {
          heroSection: {
            title: 'Reach Us',
            description: 'At Voix & Vision Worx, we are dedicated to transforming your aspirations into tangible achievements. We partner with businesses to navigate complex challenges and unlock new possibilities, leveraging our expertise to deliver innovative and impactful solutions. Our commitment is to your success, helping you connect, engage, and grow in an ever-evolving landscape. Contact us today to explore how our collaborative approach can help achieve your strategic goals.',
            formSectionTitle: 'I am interested in'
          },
          servicesList: [
            'Strategy',
            'Branding & Design', 
            'Content & Production',
            'Digital Marketing',
            'Agent Vua',
            'Agent Vision',
            'Agent XR'
          ],
          servicesLabel: 'Services',
          servicesSubtext: '(Select at least one)',
          mapSection: {
            title: 'Our Presence',
            locations: [
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
          },
          jobSection: {
            title: 'Looking For VUA Filling',
            subtitle: 'Current Opening',
            openings: [
              'Brand Manager',
              'UI Designer',
              'Marketing Intern', 
              'Senior Designer',
              'Animator',
              'Business Development'
            ],
            contactText: 'Work With Us:',
            contactEmail: 'hr@vvworx.com'
          },
          styling: {
            backgroundColor: '#EEF0FF',
            primaryColor: '#6210FF',
            secondaryColor: '#BE2FF4',
            textColor: '#000000'
          }
        }
      });
    }

    res.json({
      success: true,
      data: activeContent
    });
  } catch (error) {
    console.error('Error fetching active contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact content',
      error: error.message
    });
  }
});

// Admin route - Get all contact content with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder };

    const contents = await ContactContent.find()
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ContactContent.countDocuments();

    res.json({
      success: true,
      data: contents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact contents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact contents',
      error: error.message
    });
  }
});

// Admin route - Create new contact content
router.post('/', async (req, res) => {
  try {
    const {
      heroSection,
      servicesList,
      servicesLabel,
      servicesSubtext,
      mapSection,
      jobSection,
      styling,
      version,
      lastUpdatedBy
    } = req.body;

    const newContent = new ContactContent({
      heroSection,
      servicesList,
      servicesLabel,
      servicesSubtext,
      mapSection,
      jobSection,
      styling,
      version,
      lastUpdatedBy,
      isActive: true
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      message: 'Contact content created successfully',
      data: savedContent
    });
  } catch (error) {
    console.error('Error creating contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact content',
      error: error.message
    });
  }
});

// Admin route - Get specific contact content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await ContactContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contact content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact content',
      error: error.message
    });
  }
});

// Admin route - Update contact content
router.put('/:id', async (req, res) => {
  try {
    const updatedContent = await ContactContent.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Contact content not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact content',
      error: error.message
    });
  }
});

// Admin route - Activate specific contact content
router.post('/:id/activate', async (req, res) => {
  try {
    const content = await ContactContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contact content not found'
      });
    }

    // Deactivate all other contents
    await ContactContent.updateMany(
      { _id: { $ne: req.params.id } },
      { $set: { isActive: false } }
    );

    // Activate the selected content
    content.isActive = true;
    content.updatedAt = new Date();
    await content.save();

    res.json({
      success: true,
      message: 'Contact content activated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error activating contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating contact content',
      error: error.message
    });
  }
});

// Admin route - Delete contact content
router.delete('/:id', async (req, res) => {
  try {
    const content = await ContactContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contact content not found'
      });
    }

    // Prevent deleting active content
    if (content.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active contact content'
      });
    }

    await ContactContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Contact content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact content',
      error: error.message
    });
  }
});

module.exports = router;