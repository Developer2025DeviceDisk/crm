const express = require('express');
const router = express.Router();
const OurWorkContent = require('../models/OurWorkContent');

// GET - Get active our work content (Public endpoint)
router.get('/active', async (req, res) => {
    try {
        const activeContent = await OurWorkContent.getActiveContent();

        if (!activeContent) {
            return res.status(404).json({
                success: false,
                message: 'No active our work content found'
            });
        }

        res.json({
            success: true,
            data: activeContent
        });
    } catch (error) {
        console.error('Error fetching active our work content:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET - Get all our work content versions (Admin endpoint)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'updatedAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [content, total] = await Promise.all([
            OurWorkContent.find()
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            OurWorkContent.countDocuments()
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
        console.error('Error fetching our work content:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET - Get specific our work content by ID (Admin endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const content = await OurWorkContent.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Our work content not found'
            });
        }

        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        console.error('Error fetching our work content by ID:', error);

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

// POST - Create new our work content (Admin endpoint)
router.post('/', async (req, res) => {
    try {
        const {
            headerSection,
            portfolioItems,
            footerSection,
            workPageSection,
            lastUpdatedBy
        } = req.body;

        // Create new content
        const newContent = new OurWorkContent({
            headerSection,
            portfolioItems,
            footerSection,
            workPageSection,
            lastUpdatedBy,
            isActive: true // New content becomes active by default
        });

        // Save will trigger pre-save hook to deactivate other versions
        const savedContent = await newContent.save();

        res.status(201).json({
            success: true,
            message: 'Our work content created successfully',
            data: savedContent
        });
    } catch (error) {
        console.error('Error creating our work content:', error);

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

// PUT - Update specific our work content (Admin endpoint)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Always update the timestamp
        updateData.updatedAt = new Date();

        const updatedContent = await OurWorkContent.findByIdAndUpdate(
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
                message: 'Our work content not found'
            });
        }

        res.json({
            success: true,
            message: 'Our work content updated successfully',
            data: updatedContent
        });
    } catch (error) {
        console.error('Error updating our work content:', error);

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

// POST - Activate specific our work content version (Admin endpoint)
router.post('/:id/activate', async (req, res) => {
    try {
        const { id } = req.params;

        // First, deactivate all content
        await OurWorkContent.updateMany(
            {},
            { $set: { isActive: false } }
        );

        // Then activate the specified content
        const activatedContent = await OurWorkContent.findByIdAndUpdate(
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
                message: 'Our work content not found'
            });
        }

        res.json({
            success: true,
            message: 'Our work content activated successfully',
            data: activatedContent
        });
    } catch (error) {
        console.error('Error activating our work content:', error);

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

// DELETE - Delete our work content (Admin endpoint)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const content = await OurWorkContent.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Our work content not found'
            });
        }

        // Prevent deletion of active content
        if (content.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete active content. Please activate another version first.'
            });
        }

        await OurWorkContent.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Our work content deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting our work content:', error);

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

// POST - Add new portfolio item (Admin endpoint)
router.post('/:id/portfolio-items', async (req, res) => {
    try {
        const { id } = req.params;
        const { item } = req.body;

        if (!item) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio item data is required'
            });
        }

        const content = await OurWorkContent.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Our work content not found'
            });
        }

        // Set order if not provided
        if (!item.order) {
            const maxOrder = Math.max(...content.portfolioItems.map(i => i.order), 0);
            item.order = maxOrder + 1;
        }

        content.portfolioItems.push(item);
        content.updatedAt = new Date();

        await content.save();

        res.json({
            success: true,
            message: 'Portfolio item added successfully',
            data: content
        });
    } catch (error) {
        console.error('Error adding portfolio item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// PUT - Update portfolio item (Admin endpoint)
router.put('/:id/portfolio-items/:itemIndex', async (req, res) => {
    try {
        const { id, itemIndex } = req.params;
        const itemUpdates = req.body;

        const content = await OurWorkContent.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Our work content not found'
            });
        }

        const index = parseInt(itemIndex);

        if (index < 0 || index >= content.portfolioItems.length) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio item not found'
            });
        }

        // Update item
        Object.assign(content.portfolioItems[index], itemUpdates);
        content.updatedAt = new Date();

        await content.save();

        res.json({
            success: true,
            message: 'Portfolio item updated successfully',
            data: content
        });
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// DELETE - Remove portfolio item (Admin endpoint)
router.delete('/:id/portfolio-items/:itemIndex', async (req, res) => {
    try {
        const { id, itemIndex } = req.params;

        const content = await OurWorkContent.findById(id);

        if (!content) {
            return res.status(404).json({
                success: false,
                message: 'Our work content not found'
            });
        }

        const index = parseInt(itemIndex);

        if (index < 0 || index >= content.portfolioItems.length) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio item not found'
            });
        }

        content.portfolioItems.splice(index, 1);
        content.updatedAt = new Date();

        await content.save();

        res.json({
            success: true,
            message: 'Portfolio item removed successfully',
            data: content
        });
    } catch (error) {
        console.error('Error removing portfolio item:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

module.exports = router;
