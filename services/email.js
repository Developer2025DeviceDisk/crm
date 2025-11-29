const nodemailer = require('nodemailer');
const config = require('../env');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.ALERT_FROM,
    pass: config.EMAIL_PASSWORD,
  },
});

module.exports = {
  sendContactEmail: async (contact) => {
    try {
      const formattedDateTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p style="font-size: 16px;">You have received a new message from the contact us page with the following details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Full Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                contact.fullName
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Company Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                contact.companyName || 'N/A'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                contact.phone
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Services Interested:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                <ul style="margin: 0; padding-left: 20px;">
                  ${contact.services
                    .map((service) => `<li>${service}</li>`)
                    .join('')}
                </ul>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                contact.message || 'N/A'
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Submission Date & Time:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${formattedDateTime} (IST)</td>
            </tr>
          </table>
        </div>
      `;

      await transporter.sendMail({
        from: `"Contact Form" <${config.ALERT_FROM}>`,
        to: 'reachus@vvworx.com', // Your recipient email
        // to: 'shahbazthedeveloper@gmail.com', // Your recipient email
        subject: `Voix & Vision Worx: Contact Form Submission - ${formattedDateTime}`,
        html: emailContent,
      });

      console.log('Contact email sent successfully');
    } catch (error) {
      console.error('Error sending contact email:', error);
    }
  },
};
