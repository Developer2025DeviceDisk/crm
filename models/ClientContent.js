const mongoose = require('mongoose');

const clientContentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Our Client'
    },
    description: {
        type: String,
        default: "At VVWorx, we've had the opportunity to collaborate with brands across real estate, technology, and consumer verticals. Here are some of the amazing clients who trust our work."
    },
    clients: [{
        name: String,
        logo: String,
        order: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClientContent', clientContentSchema);
