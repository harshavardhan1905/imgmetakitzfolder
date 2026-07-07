const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exiftool } = require('exiftool-vendored');
const fs = require('fs'); // RESTORED: Required for file cleanup
const path = require('path');
const os = require('os'); // NEW: Required to find Vercel's temporary directory

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// THE FIX: Tell Multer to save files to Vercel's allowed temporary folder
const upload = multer({ dest: os.tmpdir() });

app.post('/api/extract-metadata', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  // Because we used os.tmpdir(), req.file.path now contains a valid, temporary file path
  const filePath = req.file.path;

  try {
    const tags = await exiftool.read(filePath);

    const extractedData = {
      title: tags.Title || tags.XPTitle || '',
      subject: tags.Subject || tags.XPSubject || tags.Description || '',
      rating: tags.Rating || '',
      tags: Array.isArray(tags.Keywords) ? tags.Keywords.join(', ') : (tags.Keywords || tags.XPKeywords || ''),
      comments: tags.UserComment || tags.XPComment || '',
      authors: tags.Creator || tags.Artist || tags.XPAuthor || '',
      copyright: tags.Copyright || '',
      latitude: tags.GPSLatitude || 17.3850,
      longitude: tags.GPSLongitude || 78.4867
    };

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

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
  
  const { title, subject, rating, tags, comments, authors, copyright, latitude, longitude } = req.body;

  try {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/-/g, ':').replace('T', ' ').substring(0, 19);

    const tagsToWrite = {
      Title: title || '',
      Description: subject || '', 
      Subject: subject || '',    
      Rating: rating ? parseInt(rating) : 0,
      Keywords: tags ? tags.split(',').map(tag => tag.trim()) : [], 
      UserComment: comments || '',
      Creator: authors || '',
      Artist: authors || '',
      Copyright: copyright || '',
      GPSLatitude: latitude ? parseFloat(latitude) : undefined,
      GPSLongitude: longitude ? parseFloat(longitude) : undefined,
      XPTitle: title || '',
      XPSubject: subject || '',
      XPComment: comments || '',
      XPAuthor: authors || '',
      XPKeywords: tags || '',
      DateTimeOriginal: formattedDate,
      CreateDate: formattedDate,
      ModifyDate: formattedDate,
    };

    await exiftool.write(filePath, tagsToWrite);

    res.download(filePath, `optimized_${req.file.originalname}`, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      
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
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

process.on('SIGINT', () => {
  exiftool.end().then(() => process.exit());
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Metadata server running on http://localhost:${PORT}`);
  });
}

module.exports = app;