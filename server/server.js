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
const upload = multer({ dest: 'uploads/' });

// Create the uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


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
    // 1. Map the frontend data to ExifTool tags
    const tagsToWrite = {
      Title: title || '',
      Subject: subject || '',
      Rating: rating ? parseInt(rating) : 0,
      // ExifTool expects Keywords as an array of strings
      Keywords: tags ? tags.split(';').map(tag => tag.trim()) : [],
      UserComment: comments || '',
      Creator: authors || '',
      Copyright: copyright || '',
      GPSLatitude: latitude ? parseFloat(latitude) : undefined,
      GPSLongitude: longitude ? parseFloat(longitude) : undefined,
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

app.listen(PORT, () => {
  console.log(`Metadata server running on http://localhost:${PORT}`);
});