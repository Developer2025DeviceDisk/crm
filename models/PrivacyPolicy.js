const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
  // Page Header
  pageTitle: {
    type: String,
    default: 'Privacy Policy'
  },

  // Preamble Section
  preambleTitle: {
    type: String,
    default: 'Preamble'
  },
  preambleContent: {
    type: String,
    default: 'Voix & Vision Worx Pvt. Ltd. and its affiliated entities around the world (collectively "VVWorx", "we", or "us"), is committed to protecting the privacy of your personal information. This Privacy Policy details certain policies implemented throughout our company governing VVWorx\'s use of personal information about: visitors to our Internet website (the "Site") located at the URL: "https://www.vvworx.com/" and employees of our clients who use our services and/or products (collectively, services and products are: "Service" or "Services"). Where the Privacy Policy differs depending on whether you are using the Site or the Services, those distinctions will be noted in this Privacy Policy.'
  },

  // Information Collection Through Site Section
  infoCollectionTitle: {
    type: String,
    default: 'Information Collection Through the Site:'
  },
  infoCollectionContent: {
    type: [String],
    default: [
      'You can generally visit the Site without revealing any personal information about yourself. "Personal information" is any information that can be used to identify an individual, and may include name, address, email address, phone number, login information (account number, password), marketing preferences, or social media account information. However, in certain sections of the site we may invite you to contact us for information or questions, inquire about a job or apply for a job, or to obtain content we provide for informational and marketing purposes. In such situations, you may disclose to us your name, phone number, email address, title, company name, and certain employment-related information.',
      'We may track and store information such as the total number of visitors to our Site, the number of visitors to each page of our Site, your IP address, your browser type, the number of external web site (defined below) pages you have visited, and other browsing or computer data.'
    ]
  },

  // Through Services Section
  throughServicesTitle: {
    type: String,
    default: 'Through the Services:'
  },
  throughServicesContent: {
    type: String,
    default: 'When our clients use our Services, our clients may provide us with information about you, including personal information such as your name, address, email, phone number and IP address'
  },

  // Use of Information Section
  useOfInfoTitle: {
    type: String,
    default: 'Use of Information'
  },
  useOfInfoIntro: {
    type: String,
    default: 'We may use your personal information you submit to the Site to:'
  },
  useOfInfoList: {
    type: [String],
    default: [
      'Contact you to deliver certain information you have requested',
      'Verify your authority to enter our Site',
      'Consider your eligibility for employment',
      'Improve the content and general administration of the Site',
      'Address any queries or provide necessary information/resources',
      'Contact you in relation to your registration for an event/webinar',
      'Contact the users who have provided their information with respect to any service line'
    ]
  },
  useOfInfoConclusion: {
    type: String,
    default: 'Voix & Vision Worx uses the information it receives through our clients\' use of the Services to provide our Services to our clients under their direction and instruction.'
  },

  // Disclosure Section
  disclosureTitle: {
    type: String,
    default: 'Disclosure and Onward Transfer of Information'
  },
  disclosureContent: {
    type: String,
    default: 'We will not rent or sell your personal information to any company or organization. We may provide your personal information to our subsidiaries and affiliates. We may provide your personal information to vendors and service agencies that we may engage to assist us in providing our Services to our clients, or to assist us in verifying your eligibility for employment with VVWorx. Such third parties will be restricted from further distributing your personal information and must enter into a written confidentiality agreement with us. We will also disclose your personal information if we are required to do so by law, regulation or other government authority, or otherwise in cooperation with a bona-fide investigation of a governmental or other public authority, including to meet national security or law enforcement requirements, or to protect the safety of visitors to our Site. We may transfer your personal information to a successor entity upon a merger, consolidation or other corporate reorganization in which VVWorx participates or to a purchaser of all or substantially all of VVWorx\'s assets to which the Site and/or Services relate.'
  },

  // Third Party Links Section
  thirdPartyLinksTitle: {
    type: String,
    default: 'Links to Third Party Sites'
  },
  thirdPartyLinksContent: {
    type: String,
    default: 'The Site may provide links to other web sites or resources over which VVWorx does not have control ("External Web Sites"). Such links do not constitute an endorsement by VVWorx of those External Web Sites. You acknowledge that VVWorx is providing these links to you only as a convenience, and further agree that VVWorx is not responsible for the content of such External Web Sites. Your use of External Web Sites is subject to the terms of use and privacy policies located on the External Web Sites.'
  },

  // Limiting Use Section
  limitingUseTitle: {
    type: String,
    default: 'Limiting the Use of Personal Information Collected Through the Site and Services'
  },
  limitingUseContent: {
    type: String,
    default: 'You can limit our use of personal information that we obtain via our Services by managing your account at the respective client with whom you interact.'
  },

  // Reviewing/Correcting Section
  reviewingTitle: {
    type: String,
    default: 'Reviewing, Correcting and Deleting Personal Information Collected Through the Site'
  },
  reviewingContent: {
    type: String,
    default: 'Voix & Vision Worx provides you with the ability to review, correct, and delete your personal information that we have received if it is inaccurate or you wish us to delete it; provided, however, that VVWorx will retain a copy in its files of all personal information, even if corrected, necessary to resolve disputes. VVWorx retains personal information you submit through our Site for up to 4 years in connection with regulatory, tax, insurance or other requirements in the places in which it operates. VVWorx thereafter deletes or anonymizes such information in accordance with applicable laws. You have the right to review or delete the foregoing information, by contacting VVWorx at:'
  },

  // Contact Information
  contactInfo: {
    title: {
      type: String,
      default: 'General Counsel'
    },
    address: {
      type: String,
      default: '1203, B-3, Rosa Oasis, G. B. Road, Kasarvadavali, Thane, Maharashtra, 400615'
    },
    email: {
      type: String,
      default: 'reachus@vvworx.com'
    }
  },

  // Correction Section
  correctionTitle: {
    type: String,
    default: 'Correction'
  },
  correctionContent: {
    type: String,
    default: 'If VVWorx has information about you that you believe is inaccurate, you have the right to request correction of your information. Please see the section titled "Reviewing, Correcting and Deleting Personal Information Collected Through the Site" above for more information on correcting, or requesting correction of, your information.'
  },

  // Deletion Section
  deletionTitle: {
    type: String,
    default: 'Deletion'
  },
  deletionContent: {
    type: String,
    default: 'You may request deletion of your personal information at any time. We may retain certain information about you as required by law and for legitimate business purposes permitted by law. Please see the "Reviewing, Correcting and Deleting Personal Information Collected Through the Site" section above for more information regarding VVWorx\'s retention and deletion practices.'
  },

  // Security Section
  securityTitle: {
    type: String,
    default: 'Security'
  },
  securityContent: {
    type: [String],
    default: [
      'We employ procedural and technological measures that are reasonably designed to help protect your personally identifiable information from loss, unauthorized access, disclosure, alteration or destruction. VVWorx uses Transport Layer Security, firewalls, password protection and takes other physical and logical security measures and places internal restrictions on who within VVWorx may access your data to help prevent unauthorized access to your personally identifiable information. Our security is annually audited by a third party, under the ISO27001:2013 standard and additionally to comply with the PCI-DSS version 3.2 for specific client Services.',
      'The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Site, you are responsible for keeping that password confidential. We ask you not to share your password with anyone. You also acknowledge that your account is personal to you and agree not to provide any other person with access to this Site or portions of it using your user name, password or other security information. You agree to notify us immediately of any unauthorized access to or use of your user name or password or any other breach of security.',
      'Unfortunately, the transmission of information via the Internet is not completely secure. Although we do our best to protect your personal information, as described above, we cannot guarantee the security of your personal information transmitted to our Site. Any transmission of personal information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Site.'
    ]
  },

  // Children's Privacy Section
  childrenPrivacyTitle: {
    type: String,
    default: 'Children\'s Privacy'
  },
  childrenPrivacyContent: {
    type: [String],
    default: [
      'Voix & Vision Worx recognizes the privacy interests of children and we encourage parents and guardians to take an active role in their children\'s online activities and interests. The Site is not intended for children under the age of 13. VVWorx does not target the Site to children under 13. VVWorx does not knowingly collect personal information from children under the age of 13.',
      'If we learn that we have collected or received personal information from a child under 13 without verification or parental consent, we will delete that information. If you believe we might have any such information from or about a child under the age of 13, please contact us at: reachus@vvworx.com'
    ]
  },

  // Cookies Section
  cookiesTitle: {
    type: String,
    default: 'Cookies'
  },
  cookiesContent: {
    type: [String],
    default: [
      'In order to enhance your experience on our sites, our web pages use "cookies". Cookies are small text files that we place in your computer\'s browser to store your preferences. Cookies, by themselves, do not tell us your email address or other personal information unless you choose to provide this information to us by, for example, registering at our Site. Once you choose to provide a web page with personal information, this information may be linked to the data stored in the cookie. A cookie is like a unique identity card. It is unique to your computer and can only be read by the server that gave it to you.',
      'We use cookies to understand site usage and to improve the content and offerings on our Site. For example, we may use cookies to personalize your experience on our web pages (e.g. to recognize you by name when you return to our Site). We also may use cookies to offer you services.',
      'Cookies save you time as they help us to remember who you are. Cookies help us to be more efficient. We can learn about what content is important to you and what is not. If you are concerned about cookies, you can turn them off in your browser.',
      'The full details of all the cookies set by www.vvworx.com are below:',
      'Google Analytics – The cookies collect information in an anonymous form, but include data such as how you arrived at the Site, how often you\'ve visited, and which pages you looked at. We use the information to compile reports using Google Analytics. To opt out of being tracked by Google Analytics across all VVWorx websites, visit http://tools.google.com/dlpage/gaoptout.',
      'The following links explain how to block cookies in your browser:'
    ]
  },
  cookieBlockingLinks: {
    type: [String],
    default: [
      'How to block cookies in Internet Explorer – http://windows.microsoft.com/en-US/windows-vista/Block-or-allow-cookies',
      'How to block cookies in Chrome – https://support.google.com/chrome/bin/answer.py?hl=en&answer=95647&p=cpn_cookies',
      'How to block cookies in Firefox – http://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences',
      'How to block cookies in Safari – https://support.apple.com/en-in/guide/safari/sfri11471/mac'
    ]
  },

  // Privacy Policy Updates Section
  updatesTitle: {
    type: String,
    default: 'Privacy Policy Updates'
  },
  updatesContent: {
    type: String,
    default: 'Due to the Internet\'s rapidly evolving nature, VVWorx may need to update this Privacy Policy from time to time. If so, VVWorx will post a notice of the change and the updated Privacy Policy on our site located at https://www.vvworx.com. We may also send registered visitors of the Site e-mail notifications notifying such visitors of any changes to the Privacy Policy. If any change is unacceptable to you, you have the right to cease using this Site. If you do not cease using this Site, you will be deemed to have accepted VVWorx\'s then current Privacy Policy.'
  },
  updatesContact: {
    type: String,
    default: 'If you have any questions regarding this Privacy Policy please contact us via e-mail at: reachus@vvworx.com'
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  lastUpdatedBy: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
privacyPolicySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one active privacy policy at a time
privacyPolicySchema.pre('save', async function(next) {
  if (this.isActive && this.isNew) {
    // Deactivate all other policies when creating a new active one
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema);