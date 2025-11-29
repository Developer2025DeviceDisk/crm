const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../services/email');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { fullName, companyName, phone, services, message } = req.body;
    
    // Validate required fields - only fullName and phone are required
    if (!fullName || !phone) {
      return res.status(400).json({ 
        error: 'Full name and phone are required',
        missingFields: {
          fullName: !fullName,
          phone: !phone
        }
      });
    }

    // Create new contact with proper field handling
    const newContact = new Contact({
      fullName,
      companyName: companyName || undefined, // Will not save if undefined
      phone,
      services: services || [], // Will default to empty array if not provided
      message: message || undefined // Will not save if empty
    });

    await newContact.save();
    
    // Send email (even if some fields are empty)
    await sendContactEmail(newContact);

    res.status(201).json({ 
      success: true,
      message: 'Contact form submitted successfully',
      contactId: newContact._id
    });
    
  } catch (error) {
    console.error('Contact submission error:', error);
    
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
      systemError: error.message // For debugging purposes
    });
  }
});

module.exports = router;