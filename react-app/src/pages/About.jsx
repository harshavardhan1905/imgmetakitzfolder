import React from 'react';
import '../assets/css/Client.css'; // Reusing your existing global styles
import '../assets/css/About.css';  // A few specific styles for the author card

const About = () => {
  return (
    <div className="editor-container">
      <div className="editor-card wide-card about-card">
        
        <div className="editor-header">
          <h2>About The Project</h2>
          <p className="editor-subtitle">The story behind the Complete Image Metadata Editor.</p>
        </div>

        <div className="about-content">
          <div className="section-divider">
            <h3>How It Started</h3>
          </div>
          
          <div className="about-text">
            <p>
              Every great tool is born out of a real-world frustration. My journey building this platform started 
              during my final year as an engineering student. I recently graduated from the <strong>Institute of Aeronautical Engineering (IARE)</strong> in Hyderabad. 
              During my 4.2 semester, I landed an exciting opportunity to work as a Software Development Intern at <strong>Revuteck</strong>.
            </p>
            <p>
              While working on live projects and analyzing website traffic, I noticed a recurring bottleneck. Optimizing images 
              for SEO and lead generation was unnecessarily complex. Important metadata—like exact GPS coordinates, copyright info, 
              and descriptive tags—was often stripped away or too difficult to edit efficiently. 
            </p>
          </div>

          <div className="section-divider">
            <h3>The Solution</h3>
          </div>

          <div className="about-text">
            <p>
              I realized that missing image data was a massive missed opportunity for businesses. Search engines rely on this hidden metadata 
              to understand, rank, and index images, which ultimately drives valuable organic traffic and leads to a website. 
            </p>
            <p>
              I built the <strong>Complete Image Metadata Editor</strong> to solve this exact issue in one centralized place. 
              This tool empowers developers, marketers, and creators to easily inject SEO-friendly data, manage origin copyrights, 
              and pin precise geographical locations to their images before publishing—ensuring every digital asset is fully optimized for the web.
            </p>
          </div>
        </div>

        {/* AUTHOR SECTION */}
        <div className="section-divider author-divider">
          <h3>Meet the Creator</h3>
        </div>

        <div className="author-profile">
          <div className="author-image-container">
            {/* Replace this src with your actual image path later */}
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80" 
              alt="Author Profile" 
              className="author-image"
            />
          </div>
          
          <div className="author-details">
            <h4 className="author-name">Harsha</h4>
            <span className="author-role">Software Developer & Creator</span>
            
            <p className="author-bio">
              I am a passionate software engineer focused on building intuitive tools that bridge the gap between clean code and digital marketing. 
              When I'm not debugging or optimizing React components, I enjoy exploring new web technologies, contributing to open-source projects, 
              and finding creative solutions to everyday development problems.
            </p>
            
            <div className="author-socials">
              <a href="https://www.linkedin.com/in/harshavardhan05/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <a href="https://github.com/harshavardhan1905" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;