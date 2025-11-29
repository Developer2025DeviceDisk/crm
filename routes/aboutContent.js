const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');

// GET - Get active about content (Public endpoint)
router.get('/active', async (req, res) => {
  try {
    const activeContent = await AboutContent.getActiveContent();
    
    if (!activeContent) {
      return res.status(404).json({
        success: false,
        message: 'No active about content found'
      });
    }

    res.json({
      success: true,
      data: activeContent
    });
  } catch (error) {
    console.error('Error fetching active about content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET - Get all about content versions (Admin endpoint)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    const [content, total] = await Promise.all([
      AboutContent.find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      AboutContent.countDocuments()
    ]);

    res.json({
      success: true,
      data: content,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET - Get specific about content by ID (Admin endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await AboutContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching about content by ID:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST - Create new about content (Admin endpoint)
router.post('/', async (req, res) => {
  try {
    const {
      heroSection,
      parallaxSection,
      servicesSection,
      foundationSection,
      videoSection,
      lastUpdatedBy
    } = req.body;

    // Create new content
    const newContent = new AboutContent({
      heroSection,
      parallaxSection,
      servicesSection,
      foundationSection,
      videoSection,
      lastUpdatedBy,
      isActive: true // New content becomes active by default
    });

    // Save will trigger pre-save hook to deactivate other versions
    const savedContent = await newContent.save();

    res.status(201).json({
      success: true,
      message: 'About content created successfully',
      data: savedContent
    });
  } catch (error) {
    console.error('Error creating about content:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT - Update specific about content (Admin endpoint)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Always update the timestamp
    updateData.updatedAt = new Date();

    const updatedContent = await AboutContent.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    res.json({
      success: true,
      message: 'About content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating about content:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST - Activate specific about content version (Admin endpoint)
router.post('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, deactivate all content
    await AboutContent.updateMany(
      {},
      { $set: { isActive: false } }
    );
    
    // Then activate the specified content
    const activatedContent = await AboutContent.findByIdAndUpdate(
      id,
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
        message: 'About content not found'
      });
    }

    res.json({
      success: true,
      message: 'About content activated successfully',
      data: activatedContent
    });
  } catch (error) {
    console.error('Error activating about content:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE - Delete about content (Admin endpoint)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await AboutContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }
    
    // Prevent deletion of active content
    if (content.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active content. Please activate another version first.'
      });
    }
    
    await AboutContent.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'About content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about content:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid content ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST - Add new service card (Admin endpoint)
router.post('/:id/cards', async (req, res) => {
  try {
    const { id } = req.params;
    const { card } = req.body;
    
    if (!card) {
      return res.status(400).json({
        success: false,
        message: 'Card data is required'
      });
    }
    
    const content = await AboutContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }
    
    // Generate a unique ID for the card
    card.id = card.id || `card-${Date.now()}`;
    
    // Set order if not provided
    if (!card.order) {
      const maxOrder = Math.max(...content.servicesSection.cards.map(c => c.order), 0);
      card.order = maxOrder + 1;
    }
    
    content.servicesSection.cards.push(card);
    content.updatedAt = new Date();
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Service card added successfully',
      data: content
    });
  } catch (error) {
    console.error('Error adding service card:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT - Update service card (Admin endpoint)
router.put('/:id/cards/:cardId', async (req, res) => {
  try {
    const { id, cardId } = req.params;
    const cardUpdates = req.body;
    
    const content = await AboutContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }
    
    const cardIndex = content.servicesSection.cards.findIndex(card => card.id === cardId);
    
    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service card not found'
      });
    }
    
    // Update card
    Object.assign(content.servicesSection.cards[cardIndex], cardUpdates);
    content.updatedAt = new Date();
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Service card updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Error updating service card:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE - Remove service card (Admin endpoint)
router.delete('/:id/cards/:cardId', async (req, res) => {
  try {
    const { id, cardId } = req.params;
    
    const content = await AboutContent.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }
    
    const cardIndex = content.servicesSection.cards.findIndex(card => card.id === cardId);
    
    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service card not found'
      });
    }
    
    content.servicesSection.cards.splice(cardIndex, 1);
    content.updatedAt = new Date();
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Service card removed successfully',
      data: content
    });
  } catch (error) {
    console.error('Error removing service card:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;