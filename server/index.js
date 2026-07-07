const express = require('express');
const cors = require('cors');
const multer = require('multer');
const piexif = require("piexifjs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// We are back to purely using RAM! No more file system crashes.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Helper function to convert GPS Coordinates for EXIF ---
const gpsHelper = (coordinate) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60 * 100);
    return [[degrees, 1], [minutes, 1], [seconds, 100]];
};

// 1. EXTRACT METADATA
app.post('/api/extract-metadata', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

    try {
        // Read the image from RAM
        const imgString = req.file.buffer.toString('binary');
        const exifData = piexif.load(imgString);

        // Safely extract tags (converting from binary strings to normal text)
        const getTag = (ifd, tag) => {
            return exifData[ifd] && exifData[ifd][tag] ? exifData[ifd][tag].toString() : '';
        };

        let lat = 17.3850;
        let lng = 78.4867;
        
        // Basic GPS parsing if it exists
        if (exifData.GPS && exifData.GPS[piexif.GPSIFD.GPSLatitude]) {
            const latRef = getTag("GPS", piexif.GPSIFD.GPSLatitudeRef) || 'N';
            const latData = exifData.GPS[piexif.GPSIFD.GPSLatitude];
            lat = (latData[0][0]/latData[0][1]) + (latData[1][0]/latData[1][1])/60 + (latData[2][0]/latData[2][1])/3600;
            if (latRef === 'S') lat = lat * -1;
        }

        if (exifData.GPS && exifData.GPS[piexif.GPSIFD.GPSLongitude]) {
            const lngRef = getTag("GPS", piexif.GPSIFD.GPSLongitudeRef) || 'E';
            const lngData = exifData.GPS[piexif.GPSIFD.GPSLongitude];
            lng = (lngData[0][0]/lngData[0][1]) + (lngData[1][0]/lngData[1][1])/60 + (lngData[2][0]/lngData[2][1])/3600;
            if (lngRef === 'W') lng = lng * -1;
        }

        const extractedData = {
            title: getTag("0th", piexif.ImageIFD.ImageDescription),
            subject: getTag("0th", piexif.ImageIFD.ImageDescription), 
            rating: '', 
            tags: getTag("0th", piexif.ImageIFD.Software), // Often used as a fallback for tags in piexif
            comments: getTag("Exif", piexif.ExifIFD.UserComment),
            authors: getTag("0th", piexif.ImageIFD.Artist),
            copyright: getTag("0th", piexif.ImageIFD.Copyright),
            latitude: lat,
            longitude: lng
        };

        res.json(extractedData);
    } catch (error) {
        console.error("Error extracting metadata:", error);
        res.status(500).json({ error: 'Failed to extract metadata. Ensure it is a valid JPEG.' });
    }
});

// 2. PROCESS AND WRITE METADATA
app.post('/api/process-image', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });

    const { title, subject, comments, authors, copyright, latitude, longitude } = req.body;

    try {
        const imgString = req.file.buffer.toString('binary');
        
        // Initialize an empty EXIF object
        const zeroth = {};
        const exif = {};
        const gps = {};

        // Map your React data to standard EXIF tags
        if (title || subject) zeroth[piexif.ImageIFD.ImageDescription] = title || subject;
        if (authors) zeroth[piexif.ImageIFD.Artist] = authors;
        if (copyright) zeroth[piexif.ImageIFD.Copyright] = copyright;
        if (comments) exif[piexif.ExifIFD.UserComment] = comments;

        // Map GPS Data
        if (latitude && longitude) {
            const latFloat = parseFloat(latitude);
            const lngFloat = parseFloat(longitude);
            
            gps[piexif.GPSIFD.GPSLatitudeRef] = latFloat >= 0 ? "N" : "S";
            gps[piexif.GPSIFD.GPSLatitude] = gpsHelper(latFloat);
            
            gps[piexif.GPSIFD.GPSLongitudeRef] = lngFloat >= 0 ? "E" : "W";
            gps[piexif.GPSIFD.GPSLongitude] = gpsHelper(lngFloat);
        }

        // Generate the new EXIF string
        const exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
        const exifBytes = piexif.dump(exifObj);
        
        // Insert it into the image
        const newImgString = piexif.insert(exifBytes, imgString);
        
        // Convert back to a buffer and send to frontend
        const newImgBuffer = Buffer.from(newImgString, 'binary');

        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="optimized_${req.file.originalname}"`
        });
        
        res.send(newImgBuffer);

    } catch (error) {
        console.error("Error processing metadata:", error);
        res.status(500).json({ error: 'Failed to process image metadata.' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;