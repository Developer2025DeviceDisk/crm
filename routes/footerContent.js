const express = require('express');
const router = express.Router();
const FooterContent = require('../models/FooterContent');

// GET /api/footer-content/active - Get active footer content (public)
router.get('/active', async (req, res) => {
  try {
    const activeContent = await FooterContent.findOne({ isActive: true });
    
    if (!activeContent) {
      // Return default content if no active content exists
      const defaultContent = {
        companyInfo: {
          name: 'Voix & Vision Worx',
          logo: 'default-logo.svg',
          description: ''
        },
        socialLinks: {
          followText: 'Follow Us:',
          links: [
            { platform: 'linkedin', url: 'https://www.linkedin.com/company/voix-vision-worx/', isActive: true },
            { platform: 'facebook', url: 'https://www.facebook.com/people/Voix-Vision-Worx/61575858395596/', isActive: true },
            { platform: 'instagram', url: 'http://instagram.com/vvworx/', isActive: true },
            { platform: 'behance', url: 'https://www.behance.net/vvworx', isActive: true },
            { platform: 'youtube', url: 'http://www.youtube.com/@VVWorx', isActive: true }
          ]
        },
        navigationMenu: {
          title: 'Quick Links',
          links: [
            { text: 'Home', url: '/', isActive: true, order: 1 },
            { text: 'Services', url: '/services', isActive: true, order: 2 },
            { text: 'About Us', url: '/About', isActive: true, order: 3 },
            { text: 'Contact Us', url: '/contact', isActive: true, order: 4 },
            { text: 'Privacy Policy', url: '/privacy-policy', isActive: true, order: 5 }
          ]
        },
        officeLocations: [
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
        ],
        styling: {
          backgroundColor: 'bg-gradient-to-r from-[#5F00F6] to-[#B933FF]',
          textColor: 'text-white',
          fontFamily: 'Outfit'
        }
      };
      
      return res.json({
        success: true,
        data: defaultContent,
        message: 'Default footer content returned (no active content found)'
      });
    }

    res.json({
      success: true,
      data: activeContent
    });
  } catch (error) {
    console.error('Error fetching active footer content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active footer content',
      error: error.message
    });
  }
});

// GET /api/footer-content - Get all footer content versions (admin)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const content = await FooterContent.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await FooterContent.countDocuments();

    res.json({
      success: true,
      data: content,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching footer content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching footer content',
      error: error.message
    });
  }
});

// POST /api/footer-content - Create new footer content (admin)
router.post('/', async (req, res) => {
  try {
    const {
      companyInfo,
      socialLinks,
      navigationMenu,
      officeLocations,
      styling,
      version,
      lastUpdatedBy
    } = req.body;

    const newContent = new FooterContent({
      companyInfo,
      socialLinks,
      navigationMenu,
      officeLocations,
      styling,
      version,
      lastUpdatedBy,
      isActive: true // New content becomes active by default
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      data: savedContent,
      message: 'Footer content created successfully'
    });
  } catch (error) {
    console.error('Error creating footer content:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating footer content',
      error: error.message
    });
  }
});

// GET /api/footer-content/:id - Get specific footer content by ID (admin)
router.get('/:id', async (req, res) => {
  try {
    const content = await FooterContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching footer content by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching footer content',
      error: error.message
    });
  }
});

// PUT /api/footer-content/:id - Update footer content (admin)
router.put('/:id', async (req, res) => {
  try {
    const {
      companyInfo,
      socialLinks,
      navigationMenu,
      officeLocations,
      styling,
      version,
      lastUpdatedBy,
      isActive
    } = req.body;

    const updatedContent = await FooterContent.findByIdAndUpdate(
      req.params.id,
      {
        companyInfo,
        socialLinks,
        navigationMenu,
        officeLocations,
        styling,
        version,
        lastUpdatedBy,
        isActive,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    res.json({
      success: true,
      data: updatedContent,
      message: 'Footer content updated successfully'
    });
  } catch (error) {
    console.error('Error updating footer content:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating footer content',
      error: error.message
    });
  }
});

// POST /api/footer-content/:id/activate - Activate specific footer content version (admin)
router.post('/:id/activate', async (req, res) => {
  try {
    // First, deactivate all other versions
    await FooterContent.updateMany({}, { $set: { isActive: false } });
    
    // Then activate the specified version
    const activatedContent = await FooterContent.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          isActive: true,
          updatedAt: new Date()
        } 
      },
      { new: true }
    );

    if (!activatedContent) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    res.json({
      success: true,
      data: activatedContent,
      message: 'Footer content activated successfully'
    });
  } catch (error) {
    console.error('Error activating footer content:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating footer content',
      error: error.message
    });
  }
});

// DELETE /api/footer-content/:id - Delete footer content (admin)
router.delete('/:id', async (req, res) => {
  try {
    const content = await FooterContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    // Prevent deletion of active content
    if (content.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active footer content. Please activate another version first.'
      });
    }

    await FooterContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Footer content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting footer content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting footer content',
      error: error.message
    });
  }
});

// POST /api/footer-content/:id/social-links - Add social link to footer content (admin)
router.post('/:id/social-links', async (req, res) => {
  try {
    const { platform, url, isActive } = req.body;
    
    const content = await FooterContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    content.socialLinks.links.push({ platform, url, isActive });
    await content.save();

    res.json({
      success: true,
      data: content,
      message: 'Social link added successfully'
    });
  } catch (error) {
    console.error('Error adding social link:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding social link',
      error: error.message
    });
  }
});

// POST /api/footer-content/:id/navigation-links - Add navigation link to footer content (admin)
router.post('/:id/navigation-links', async (req, res) => {
  try {
    const { text, url, isActive, order } = req.body;
    
    const content = await FooterContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    content.navigationMenu.links.push({ text, url, isActive, order });
    await content.save();

    res.json({
      success: true,
      data: content,
      message: 'Navigation link added successfully'
    });
  } catch (error) {
    console.error('Error adding navigation link:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding navigation link',
      error: error.message
    });
  }
});

// POST /api/footer-content/:id/office-locations - Add office location to footer content (admin)
router.post('/:id/office-locations', async (req, res) => {
  try {
    const { city, isActive, address, phone, order } = req.body;
    
    const content = await FooterContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Footer content not found'
      });
    }

    content.officeLocations.push({ city, isActive, address, phone, order });
    await content.save();

    res.json({
      success: true,
      data: content,
      message: 'Office location added successfully'
    });
  } catch (error) {
    console.error('Error adding office location:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding office location',
      error: error.message
    });
  }
});

module.exports = router;