const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exiftool } = require('exiftool-vendored');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your React frontend
app.use(cors());

// Configure Multer to save uploaded files to a temporary 'uploads' directory
// const upload = multer({ dest: 'uploads/' });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.post('/api/extract-metadata', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const filePath = req.file.path;

  try {
    // 1. Read existing metadata using ExifTool
    const tags = await exiftool.read(filePath);

    // 2. Map the tags back to your frontend's format.
    // We check standard tags first, then fallback to Windows XP tags.
    const extractedData = {
      title: tags.Title || tags.XPTitle || '',
      subject: tags.Subject || tags.XPSubject || tags.Description || '',
      rating: tags.Rating || '',
      // ExifTool returns Keywords as an array if there are multiple, or string if one
      tags: Array.isArray(tags.Keywords) ? tags.Keywords.join(', ') : (tags.Keywords || tags.XPKeywords || ''),
      comments: tags.UserComment || tags.XPComment || '',
      authors: tags.Creator || tags.Artist || tags.XPAuthor || '',
      copyright: tags.Copyright || '',
      latitude: tags.GPSLatitude || 17.3850,
      longitude: tags.GPSLongitude || 78.4867
    };

    // 3. Cleanup the temporary file immediately since we only needed to read it
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // 4. Send data to frontend
    res.json(extractedData);

  } catch (error) {
    console.error("Error extracting metadata:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to extract metadata.' });
  }
});
app.post('/api/process-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const filePath = req.file.path;
  
  // Extract all the fields sent from the React frontend
  const { 
    title, 
    subject, 
    rating, 
    tags, 
    comments, 
    authors, 
    copyright, 
    latitude, 
    longitude 
  } = req.body;

    console.log("=================== INCOMING DATA ===================");
  console.log("Uploaded File Details:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: `${(req.file.size / 1024).toFixed(2)} KB`,
    tempPath: filePath
  });
  console.log("Metadata Payload Received:", {
    title, subject, rating, tags, comments, authors, copyright, latitude, longitude
  });
  console.log("=====================================================");

  try {
    // Generate the current date in the exact format EXIF expects: "YYYY:MM:DD HH:MM:SS"
    const now = new Date();
    const formattedDate = now.toISOString().replace(/-/g, ':').replace('T', ' ').substring(0, 19);

    // 1. Map the frontend data to ExifTool tags
    const tagsToWrite = {
      // --- Standard Cross-Platform Tags ---
      Title: title || '',
      Description: subject || '', // Standard EXIF description (often maps to Subject)
      Subject: subject || '',     // XMP Subject
      Rating: rating ? parseInt(rating) : 0,
      Keywords: tags ? tags.split(',').map(tag => tag.trim()) : [], // You sent commas in your console log, so using ',' instead of ';'
      UserComment: comments || '',
      Creator: authors || '',
      Artist: authors || '',
      Copyright: copyright || '',
      
      // --- GPS Tags ---
      GPSLatitude: latitude ? parseFloat(latitude) : undefined,
      GPSLongitude: longitude ? parseFloat(longitude) : undefined,

      // --- Windows Explorer Specific Tags ---
      // Windows specifically looks for these 'XP' tags for File Properties
      XPTitle: title || '',
      XPSubject: subject || '',
      XPComment: comments || '',
      XPAuthor: authors || '',
      XPKeywords: tags || '',

      // --- Current Date Tags ---
      DateTimeOriginal: formattedDate,
      CreateDate: formattedDate,
      ModifyDate: formattedDate,
    };

    // 2. Write the metadata to the image file
    // ExifTool will modify the file and automatically create a backup named 'filename_original'
    await exiftool.write(filePath, tagsToWrite);

    // 3. Send the modified file back to the React client
    res.download(filePath, `optimized_${req.file.originalname}`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      
      // 4. Cleanup: Delete the temporary files to save server space
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(`${filePath}_original`)) fs.unlinkSync(`${filePath}_original`);
      } catch (cleanupError) {
        console.error("Error cleaning up files:", cleanupError);
      }
    });

  } catch (error) {
    console.error("Error processing metadata:", error);
    res.status(500).json({ error: 'Failed to process image metadata.' });
    
    // Attempt cleanup on failure
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// Gracefully shut down the ExifTool child process when the server stops
process.on('SIGINT', () => {
  exiftool.end().then(() => process.exit());
});
if (process.env.NODE_ENV !== 'production') {
app.listen(PORT, () => {
  console.log(`Metadata server running on http://localhost:${PORT}`);
})}
module.exports = app;