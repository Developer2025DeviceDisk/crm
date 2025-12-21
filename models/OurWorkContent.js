const mongoose = require('mongoose');

const ourWorkContentSchema = new mongoose.Schema({
    // Header Section
    headerSection: {
        title: {
            type: String,
            default: 'Our Work'
        },
        description: {
            type: String,
            default: 'Lorem Ipsum Dolor Sit Amet, Consectetuer Adipiscing Elit, Sed Diam Nonummy Nibh Euismod Tincidunt Ut Laoreet Dolore Magna Aliquam Erat Volutpat.'
        },
        underlineColor: {
            type: String,
            default: '#007BFF'
        }
    },

    // Portfolio Items
    portfolioItems: {
        type: [{
            name: { type: String, required: true },
            category: { type: String, required: true },
            year: { type: String, required: true },
            image: { type: String, required: true },
            order: { type: Number, required: true },
            // Detail Page Fields
            detailTitle: { type: String },
            detailDescription: { type: String },
            tags: [String],
            galleryImages: [String],
            clientLogo: { type: String }
        }],
        default: [
            {
                name: 'Nutrafab',
                category: 'Product Design',
                year: '2024',
                image: '/portfolio-1.jpg',
                order: 1
            },
            {
                name: 'Shri Namahh',
                category: 'Branding',
                year: '2024',
                image: '/portfolio-2.jpg',
                order: 2
            },
            {
                name: 'Visionstone',
                category: 'Brand Identity',
                year: '2024',
                image: '/portfolio-3.jpg',
                order: 3
            }
        ]
    },

    // Footer Section
    footerSection: {
        buttonText: {
            type: String,
            default: 'See All Work'
        }
    },

    // Work Page Details (New Section)
    workPageSection: {
        bannerImage: {
            type: String,
            default: '/serviceVector.png'
        },
        mainTitle: {
            type: String,
            default: 'From Brief \n To Brilliance'
        },
        description: {
            type: String,
            default: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit...'
        },
        filters: {
            type: [String],
            default: ["All", "Branding & Design", "Strategy", "Content & Production", "AI Videos", "UI Design"]
        },
        galleryImages: {
            type: [String],
            default: []
        }
    },

    // Metadata
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdatedBy: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to ensure only one active content version
ourWorkContentSchema.pre('save', async function (next) {
    if (this.isActive) {
        // Deactivate all other active versions
        await this.constructor.updateMany(
            { _id: { $ne: this._id } },
            { $set: { isActive: false } }
        );
    }

    // Ensure portfolio items have proper order
    if (this.portfolioItems) {
        this.portfolioItems.forEach((item, index) => {
            if (!item.order) {
                item.order = index + 1;
            }
        });
    }

    this.updatedAt = new Date();
    next();
});

// Method to get portfolio items sorted by order
ourWorkContentSchema.methods.getSortedPortfolioItems = function () {
    return this.portfolioItems.sort((a, b) => a.order - b.order);
};

// Static method to get active content
ourWorkContentSchema.statics.getActiveContent = async function () {
    let activeContent = await this.findOne({ isActive: true });

    if (!activeContent) {
        // Create and save default content if none exists
        activeContent = new this();
        await activeContent.save();
    }

    return activeContent;
};

module.exports = mongoose.model('OurWorkContent', ourWorkContentSchema);
