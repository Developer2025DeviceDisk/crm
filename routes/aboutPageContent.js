const express = require('express');
const AboutPageContent = require('../models/AboutPageContent');
const router = express.Router();

// Helper function to ensure authentication for admin routes
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  next();
};

// Public route: Get active about page content
router.get('/active', async (req, res) => {
  try {
    const activeContent = await AboutPageContent.findOne({ isActive: true }).sort({ updatedAt: -1 });
    
    if (!activeContent) {
      // Return default content if no active content found
      const defaultContent = new AboutPageContent();
      return res.json({
        success: true,
        data: defaultContent
      });
    }

    res.json({
      success: true,
      data: activeContent
    });
  } catch (error) {
    console.error('Error fetching active about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about page content',
      error: error.message
    });
  }
});

// Admin route: Get all about page content with pagination
router.get('/', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const content = await AboutPageContent.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await AboutPageContent.countDocuments();

    res.json({
      success: true,
      data: {
        content,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about page content',
      error: error.message
    });
  }
});

// Admin route: Create new about page content
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      headerSection,
      aboutUsSection,
      whoAreWeSection,
      foundationSection,
      directorSection,
      teamSection,
      isActive,
      version,
      lastUpdatedBy
    } = req.body;

    const newContent = new AboutPageContent({
      headerSection,
      aboutUsSection,
      whoAreWeSection,
      foundationSection,
      directorSection,
      teamSection,
      isActive: isActive !== undefined ? isActive : true,
      version: version || '1.0',
      lastUpdatedBy: lastUpdatedBy || req.session.user.username || 'Admin'
    });

    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      message: 'About page content created successfully',
      data: savedContent
    });
  } catch (error) {
    console.error('Error creating about page content:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating about page content',
      error: error.message
    });
  }
});

// Admin route: Get specific about page content by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const content = await AboutPageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching about page content',
      error: error.message
    });
  }
});

// Admin route: Update specific about page content
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const {
      headerSection,
      aboutUsSection,
      whoAreWeSection,
      foundationSection,
      directorSection,
      teamSection,
      isActive,
      version,
      lastUpdatedBy
    } = req.body;

    const updateData = {
      headerSection,
      aboutUsSection,
      whoAreWeSection,
      foundationSection,
      directorSection,
      teamSection,
      isActive,
      version,
      lastUpdatedBy: lastUpdatedBy || req.session.user.username || 'Admin',
      updatedAt: new Date()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const updatedContent = await AboutPageContent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    // If this content is being activated, deactivate all others
    if (isActive) {
      await AboutPageContent.updateMany(
        { _id: { $ne: req.params.id } },
        { $set: { isActive: false } }
      );
    }

    res.json({
      success: true,
      message: 'About page content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating about page content:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating about page content',
      error: error.message
    });
  }
});

// Admin route: Activate specific about page content version
router.post('/:id/activate', requireAuth, async (req, res) => {
  try {
    const content = await AboutPageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    // Deactivate all other content
    await AboutPageContent.updateMany(
      { _id: { $ne: req.params.id } },
      { $set: { isActive: false } }
    );

    // Activate this content
    content.isActive = true;
    content.lastUpdatedBy = req.session.user.username || 'Admin';
    await content.save();

    res.json({
      success: true,
      message: 'About page content activated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error activating about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating about page content',
      error: error.message
    });
  }
});

// Admin route: Delete about page content
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const content = await AboutPageContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    // Prevent deletion of active content
    if (content.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active about page content. Please activate another version first.'
      });
    }

    await AboutPageContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'About page content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about page content:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting about page content',
      error: error.message
    });
  }
});

// Admin route: Add team member
router.post('/:id/team-members', requireAuth, async (req, res) => {
  try {
    const { name, role, image, order } = req.body;
    
    const content = await AboutPageContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    const newTeamMember = {
      name: name || '',
      role: role || '',
      image: image || '',
      order: order || (content.teamSection.teamMembers.length + 1),
      isActive: true
    };

    content.teamSection.teamMembers.push(newTeamMember);
    content.lastUpdatedBy = req.session.user.username || 'Admin';
    
    const updatedContent = await content.save();

    res.json({
      success: true,
      message: 'Team member added successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding team member',
      error: error.message
    });
  }
});

// Admin route: Update team member
router.put('/:id/team-members/:memberId', requireAuth, async (req, res) => {
  try {
    const { name, role, image, order, isActive } = req.body;
    
    const content = await AboutPageContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    const teamMember = content.teamSection.teamMembers.id(req.params.memberId);
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    if (name !== undefined) teamMember.name = name;
    if (role !== undefined) teamMember.role = role;
    if (image !== undefined) teamMember.image = image;
    if (order !== undefined) teamMember.order = order;
    if (isActive !== undefined) teamMember.isActive = isActive;

    content.lastUpdatedBy = req.session.user.username || 'Admin';
    const updatedContent = await content.save();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
});

// Admin route: Remove team member
router.delete('/:id/team-members/:memberId', requireAuth, async (req, res) => {
  try {
    const content = await AboutPageContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About page content not found'
      });
    }

    content.teamSection.teamMembers.id(req.params.memberId).remove();
    content.lastUpdatedBy = req.session.user.username || 'Admin';
    
    const updatedContent = await content.save();

    res.json({
      success: true,
      message: 'Team member removed successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing team member',
      error: error.message
    });
  }
});

module.exports = router;