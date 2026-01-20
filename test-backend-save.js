const mongoose = require('mongoose');
const config = require('./env');
const OurWorkContent = require('./models/OurWorkContent');

async function testBackendSave() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected.');

        console.log('Fetching active content...');
        const activeContent = await OurWorkContent.getActiveContent();
        if (!activeContent) {
            console.log('No active content found.');
            return;
        }

        console.log('Original Item 1 Description:', activeContent.portfolioItems[0].description);

        // Update the first item
        console.log('Updating first item description...');
        activeContent.portfolioItems[0].description = "Test Description from Debug Script " + new Date().toISOString();

        await activeContent.save();
        console.log('Saved.');

        // Re-fetch to verify
        const validationContent = await OurWorkContent.findOne({ _id: activeContent._id });
        console.log('Re-fetched Item 1 Description:', validationContent.portfolioItems[0].description);

        if (validationContent.portfolioItems[0].description) {
            console.log('SUCCESS: Description field is persisting.');
        } else {
            console.log('FAILURE: Description field did NOT persist.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

testBackendSave();
