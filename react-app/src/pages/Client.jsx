import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../assets/css/Client.css'; 

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-component to track click actions on the map
const LocationPicker = ({ position, setMetadata }) => {
  useMapEvents({
    click(e) {
      setMetadata(prev => ({ 
        ...prev, 
        latitude: e.latlng.lat, 
        longitude: e.latlng.lng 
      }));
    },
  });
  return <Marker position={position} />;
};

// Sub-component to ensure the map smoothly centers dynamically when coords change
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
};

const Client = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [metadata, setMetadata] = useState({
    title: '',
    subject: '',
    rating: '',
    tags: '',
    comments: '',
    authors: '',
    copyright: '',
    latitude: 17.3850, 
    longitude: 78.4867
  });

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  // Extracts metadata when the user selects a file and sets preview
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/extract-metadata', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        setMetadata({
          title: data.title || '',
          subject: data.subject || '',
          rating: data.rating || '',
          tags: data.tags || '',
          comments: data.comments || '',
          authors: data.authors || '',
          copyright: data.copyright || '',
          latitude: data.latitude || 17.3850,
          longitude: data.longitude || 78.4867
        });
      }
    } catch (error) {
      console.error("Error fetching existing metadata:", error);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    try {
      const response = await fetch('http://localhost:5000/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `SEO_Optimized_${image.name}`; 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process the image. Is the backend running?");
    }
  };

  // --- MAP FEATURES ---
  const handleMapSearch = async () => {
    if (!searchQuery) return;
    try {
      // Using OpenStreetMap's free Nominatim Geocoding API
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setMetadata(prev => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        }));
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleLiveLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMetadata(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          alert("Error getting location. Please ensure location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-card wide-card">
        
        <div className="editor-header">
          <h2>Complete Image Metadata Editor</h2>
          <p className="editor-subtitle">Modify Description, Origin, and GPS Data.</p>
        </div>

        <div className="editor-grid">
          
          {/* LEFT SIDE: Image Upload & Form Fields */}
          <div className="left-panel">
            
            {/* NEW PROFESSIONAL UPLOAD UI */}
            <div className="upload-section">
              <label htmlFor="file-upload" className="file-upload-label">
                <div className="file-upload-box">
                  <span className="file-icon">📁</span>
                  <div className="file-text">
                    <span className="upload-title">Select an Image</span>
                    <span className="upload-subtitle">{image ? image.name : 'Drag & drop or click to browse'}</span>
                  </div>
                </div>
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="hidden-input"
                />
              </label>

              {/* IMAGE PREVIEW */}
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                </div>
              )}
            </div>

            <div className="section-divider">
              <h3>Description</h3>
            </div>
            
            {/* 2-COLUMN FORM ROWS */}
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={metadata.title} onChange={handleInputChange} className="text-input" />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" name="subject" value={metadata.subject} onChange={handleInputChange} className="text-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input type="number" name="rating" min="1" max="5" value={metadata.rating} onChange={handleInputChange} className="text-input" />
              </div>
              <div className="form-group">
                <label>Tags (semicolon separated)</label>
                <input type="text" name="tags" placeholder="laptop; black; background" value={metadata.tags} onChange={handleInputChange} className="text-input" />
              </div>
            </div>

            <div className="form-group">
              <label>Comments</label>
              <textarea name="comments" value={metadata.comments} onChange={handleInputChange} className="text-input" rows="3" />
            </div>

            <div className="section-divider">
              <h3>Origin</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Authors</label>
                <input type="text" name="authors" value={metadata.authors} onChange={handleInputChange} className="text-input" />
              </div>
              <div className="form-group">
                <label>Copyright</label>
                <input type="text" name="copyright" value={metadata.copyright} onChange={handleInputChange} className="text-input" />
              </div>
            </div>

            <button 
              onClick={handleUploadAndProcess} 
              className="submit-button"
              disabled={!image}
            >
              Process & Download
            </button>
          </div>

          {/* RIGHT SIDE: Map & Coordinates (Sticky) */}
          <div className="right-panel">
            <div className="sticky-wrapper">
              <div className="section-divider map-header">
                <h3>Location (GPS)</h3>
                <p>Search a place, use live location, or click the map.</p>
              </div>
              
              {/* NEW MAP SEARCH & LIVE LOCATION CONTROLS */}
              <div className="map-search-controls">
                <input 
                  type="text" 
                  className="text-input search-input" 
                  placeholder="Search city, landmark..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                />
                <button className="map-btn search-btn" onClick={handleMapSearch}>🔍</button>
                <button className="map-btn live-btn" onClick={handleLiveLocation} title="Use My Location">📍</button>
              </div>

              <div className="map-container-style">
                <MapContainer 
                  center={[metadata.latitude, metadata.longitude]} 
                  zoom={10} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  <LocationPicker 
                    position={[metadata.latitude, metadata.longitude]} 
                    setMetadata={setMetadata} 
                  />
                  <MapRecenter lat={metadata.latitude} lng={metadata.longitude} />
                </MapContainer>
              </div>

              <div className="coordinates-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="text" value={metadata.latitude.toFixed(6)} readOnly className="text-input read-only" />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="text" value={metadata.longitude.toFixed(6)} readOnly className="text-input read-only" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Client;