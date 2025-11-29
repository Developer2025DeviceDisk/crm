const express = require('express');
const router = express.Router();
const ServicesContent = require('../models/ServicesContent');

// Get active services content (public route)
router.get('/active', async (req, res) => {
  try {
    let content = await ServicesContent.findOne({ isActive: true });
    
    // If no active content exists, create default content
    if (!content) {
      content = new ServicesContent({ isActive: true });
      await content.save();
    }

    res.json({
      success: true,
      data: content
    });
    
  } catch (error) {
    console.error('Error fetching active services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get all services content versions (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contents = await ServicesContent
      .find()
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const totalCount = await ServicesContent.countDocuments();
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: contents,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create or update services content
router.post('/', async (req, res) => {
  try {
    const {
      headerTitle,
      headerDescription,
      strategyTitle,
      strategyDescription,
      strategyServices,
      brandingTitle,
      brandingDescription,
      brandingServices,
      contentTitle,
      contentDescription,
      contentServices,
      digitalTitle,
      digitalDescription,
      digitalServices,
      techSolutionsTitle,
      techSolutionsDescription,
      techSolutionsTagline,
      agentVUATitle,
      agentVUADescription,
      agentVUAImpactTitle,
      agentVUAFeatures,
      agentVUATagline,
      agentVisionTitle,
      agentVisionDescription,
      agentVisionVideoLabels,
      agentVisionStats,
      agentXRTitle,
      agentXRDescription,
      agentXRServices,
      agentXRStats,
      videos,
      lastUpdatedBy,
      version = '1.0'
    } = req.body;

    // Create new content (will automatically deactivate others)
    const newContent = new ServicesContent({
      headerTitle,
      headerDescription,
      strategyTitle,
      strategyDescription,
      strategyServices,
      brandingTitle,
      brandingDescription,
      brandingServices,
      contentTitle,
      contentDescription,
      contentServices,
      digitalTitle,
      digitalDescription,
      digitalServices,
      techSolutionsTitle,
      techSolutionsDescription,
      techSolutionsTagline,
      agentVUATitle,
      agentVUADescription,
      agentVUAImpactTitle,
      agentVUAFeatures,
      agentVUATagline,
      agentVisionTitle,
      agentVisionDescription,
      agentVisionVideoLabels,
      agentVisionStats,
      agentXRTitle,
      agentXRDescription,
      agentXRServices,
      agentXRStats,
      videos,
      lastUpdatedBy,
      version,
      isActive: true
    });

    await newContent.save();

    res.status(201).json({
      success: true,
      message: 'Services content updated successfully',
      data: newContent
    });
    
  } catch (error) {
    console.error('Error creating services content:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const errorDetails = {};
      Object.keys(error.errors).forEach(key => {
        errorDetails[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errorDetails
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get specific content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await ServicesContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Services content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
    
  } catch (error) {
    console.error('Error fetching services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update specific content by ID
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    updateData.updatedAt = Date.now();

    const content = await ServicesContent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Services content not found'
      });
    }

    res.json({
      success: true,
      message: 'Services content updated successfully',
      data: content
    });
    
  } catch (error) {
    console.error('Error updating services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Activate specific content version
router.post('/:id/activate', async (req, res) => {
  try {
    // Deactivate all content
    await ServicesContent.updateMany({}, { isActive: false });
    
    // Activate the selected content
    const content = await ServicesContent.findByIdAndUpdate(
      req.params.id,
      { isActive: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Services content not found'
      });
    }

    res.json({
      success: true,
      message: 'Services content activated successfully',
      data: content
    });
    
  } catch (error) {
    console.error('Error activating services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete content by ID
router.delete('/:id', async (req, res) => {
  try {
    const content = await ServicesContent.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Services content not found'
      });
    }

    // Don't allow deletion of active content
    if (content.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete active content. Please activate another version first.'
      });
    }

    await ServicesContent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Services content deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting services content:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;