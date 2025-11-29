const express = require('express');
const router = express.Router();
const PrivacyPolicy = require('../models/PrivacyPolicy');

// Get active privacy policy (public route)
router.get('/active', async (req, res) => {
  try {
    let policy = await PrivacyPolicy.findOne({ isActive: true });
    
    // If no active policy exists, create default policy
    if (!policy) {
      policy = new PrivacyPolicy({ isActive: true });
      await policy.save();
    }

    res.json({
      success: true,
      data: policy
    });
    
  } catch (error) {
    console.error('Error fetching active privacy policy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get all privacy policy versions (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const policies = await PrivacyPolicy
      .find()
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const totalCount = await PrivacyPolicy.countDocuments();
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: policies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching privacy policies:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create or update privacy policy
router.post('/', async (req, res) => {
  try {
    const {
      pageTitle,
      preambleTitle,
      preambleContent,
      infoCollectionTitle,
      infoCollectionContent,
      throughServicesTitle,
      throughServicesContent,
      useOfInfoTitle,
      useOfInfoIntro,
      useOfInfoList,
      useOfInfoConclusion,
      disclosureTitle,
      disclosureContent,
      thirdPartyLinksTitle,
      thirdPartyLinksContent,
      limitingUseTitle,
      limitingUseContent,
      reviewingTitle,
      reviewingContent,
      contactInfo,
      correctionTitle,
      correctionContent,
      deletionTitle,
      deletionContent,
      securityTitle,
      securityContent,
      childrenPrivacyTitle,
      childrenPrivacyContent,
      cookiesTitle,
      cookiesContent,
      cookieBlockingLinks,
      updatesTitle,
      updatesContent,
      updatesContact,
      lastUpdatedBy,
      version = '1.0'
    } = req.body;

    // Create new privacy policy (will automatically deactivate others)
    const newPolicy = new PrivacyPolicy({
      pageTitle,
      preambleTitle,
      preambleContent,
      infoCollectionTitle,
      infoCollectionContent,
      throughServicesTitle,
      throughServicesContent,
      useOfInfoTitle,
      useOfInfoIntro,
      useOfInfoList,
      useOfInfoConclusion,
      disclosureTitle,
      disclosureContent,
      thirdPartyLinksTitle,
      thirdPartyLinksContent,
      limitingUseTitle,
      limitingUseContent,
      reviewingTitle,
      reviewingContent,
      contactInfo,
      correctionTitle,
      correctionContent,
      deletionTitle,
      deletionContent,
      securityTitle,
      securityContent,
      childrenPrivacyTitle,
      childrenPrivacyContent,
      cookiesTitle,
      cookiesContent,
      cookieBlockingLinks,
      updatesTitle,
      updatesContent,
      updatesContact,
      lastUpdatedBy,
      version,
      isActive: true
    });

    await newPolicy.save();

    res.status(201).json({
      success: true,
      message: 'Privacy policy updated successfully',
      data: newPolicy
    });
    
  } catch (error) {
    console.error('Error creating privacy policy:', error);
    
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

// Get specific policy by ID
router.get('/:id', async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });
    
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update specific policy by ID
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    updateData.updatedAt = Date.now();

    const policy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Privacy policy updated successfully',
      data: policy
    });
    
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Activate specific policy version
router.post('/:id/activate', async (req, res) => {
  try {
    // Deactivate all policies
    await PrivacyPolicy.updateMany({}, { isActive: false });
    
    // Activate the selected policy
    const policy = await PrivacyPolicy.findByIdAndUpdate(
      req.params.id,
      { isActive: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Privacy policy activated successfully',
      data: policy
    });
    
  } catch (error) {
    console.error('Error activating privacy policy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete policy by ID
router.delete('/:id', async (req, res) => {
  try {
    const policy = await PrivacyPolicy.findById(req.params.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Privacy policy not found'
      });
    }

    // Don't allow deletion of active policy
    if (policy.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete active policy. Please activate another version first.'
      });
    }

    await PrivacyPolicy.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Privacy policy deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting privacy policy:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;