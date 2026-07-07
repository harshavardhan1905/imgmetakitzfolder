import React from 'react';
import '../assets/css/Client.css'; 

const HowItWorks = () => {
  return (
    <div className="editor-container">
      <div className="editor-card wide-card">
        
        <div className="editor-header">
          <h2>How to Use the Metadata Editor</h2>
          <p className="editor-subtitle">Optimize your images for SEO and digital marketing in 5 simple steps.</p>
        </div>

        <div className="guide-content">
          
          {/* STEP 1 */}
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-details">
              <h3>Upload Your Image</h3>
              <p>
                Start by clicking the <strong>"Select an Image"</strong> box or dragging and dropping your file into the upload area. 
                A small thumbnail preview will appear to confirm your image is loaded and ready to go.
              </p>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* STEP 2 */}
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-details">
              <h3>Auto-Extract Existing Data</h3>
              <p>
                You don't have to start from scratch! The moment you upload an image, our tool automatically scans the file for any hidden EXIF or XMP data. 
                If your camera or smartphone previously saved details like titles, authors, or GPS coordinates, those fields will instantly auto-fill on your screen.
              </p>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* STEP 3 */}
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-details">
              <h3>Edit & Optimize Details</h3>
              <p>
                Now it is time to make your image SEO-friendly. Fill out the text fields on the left side of the dashboard:
              </p>
              <ul className="feature-list">
                <li><strong>Title & Subject:</strong> Add clear, descriptive names to help search engines understand the image.</li>
                <li><strong>Tags:</strong> Add keywords separated by semicolons (e.g., <em>laptop; office; marketing</em>) to boost discoverability.</li>
                <li><strong>Author & Copyright:</strong> Protect your digital assets by hardcoding your name and copyright year directly into the file.</li>
              </ul>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* STEP 4 */}
          <div className="guide-step">
            <div className="step-number">4</div>
            <div className="step-details">
              <h3>Pinpoint Your Location</h3>
              <p>
                Local SEO relies heavily on location data. Use the interactive map on the right side of the screen to geotag your image:
              </p>
              <ul className="feature-list">
                <li><strong>Search:</strong> Type a city, landmark, or address into the search bar.</li>
                <li><strong>Live Location:</strong> Click the <strong>📍 icon</strong> to instantly pin your current physical location.</li>
                <li><strong>Manual Pin:</strong> Simply click anywhere on the map to drop a pin precisely where you want it.</li>
              </ul>
            </div>
          </div>

          <div className="section-divider"></div>

          {/* STEP 5 */}
          <div className="guide-step">
            <div className="step-number">5</div>
            <div className="step-details">
              <h3>Process & Download</h3>
              <p>
                Once you are happy with your data, click the blue <strong>"Process & Download"</strong> button. 
                Our system will securely permanently write your new information into the image file's DNA and download it straight to your device with an <em>"SEO_Optimized_"</em> prefix. 
                Your image is now fully prepped to rank higher on search engines and drive traffic to your website!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HowItWorks;