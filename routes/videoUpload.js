const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory for videos
const uploadsDir = path.join(__dirname, '../public/uploads/videos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${extension}`);
  }
});

// File filter for video uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|mkv|webm|ogv|3gp|flv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, mov, avi, mkv, webm, ogv, 3gp, flv)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: fileFilter
});

// Upload video endpoint
router.post('/upload', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No video file uploaded' 
      });
    }
    
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Video uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: videoUrl,
        fullPath: req.file.path
      }
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
});

// List all uploaded videos
router.get('/list', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.ogv', '.3gp', '.flv'].includes(ext);
    });

    const videos = videoFiles.map(file => ({
      filename: file,
      url: `/uploads/videos/${file}`,
      uploadDate: fs.statSync(path.join(uploadsDir, file)).mtime,
      size: fs.statSync(path.join(uploadsDir, file)).size
    }));

    // Sort by upload date (newest first)
    videos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.json({ 
      success: true, 
      data: videos 
    });
  } catch (error) {
    console.error('List videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing videos',
      error: error.message
    });
  }
});

// Delete video endpoint
router.delete('/delete/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Video file not found'
      });
    }

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
});

module.exports = router;