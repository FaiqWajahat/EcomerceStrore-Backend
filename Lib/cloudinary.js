const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Validate environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_CLOUD_SECRET) {
  throw new Error('Missing Cloudinary configuration in environment variables');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
  secure: true
});

// Test the configuration (without top-level await)
cloudinary.api.ping()
  .then(() => console.log('Cloudinary configured successfully'))
  .catch(err => {
    console.error('Cloudinary configuration failed:', err);
    process.exit(1);
  });

module.exports = cloudinary;