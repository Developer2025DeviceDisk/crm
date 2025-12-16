const express = require('express');
const router = express.Router();
const ClientContent = require('../models/ClientContent');

// Get active client content
router.get('/active', async (req, res) => {
    try {
        const content = await ClientContent.findOne({ isActive: true }).sort({ lastUpdated: -1 });
        if (!content) {
            return res.status(404).json({ success: false, message: 'No active content found' });
        }
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create new client content
router.post('/', async (req, res) => {
    try {
        // Deactivate previous content
        await ClientContent.updateMany({}, { isActive: false });

        const newContent = new ClientContent(req.body);
        const savedContent = await newContent.save();
        res.status(201).json({ success: true, data: savedContent });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update existing client content
router.put('/:id', async (req, res) => {
    try {
        const updatedContent = await ClientContent.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdated: Date.now() },
            { new: true }
        );
        res.json({ success: true, data: updatedContent });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
