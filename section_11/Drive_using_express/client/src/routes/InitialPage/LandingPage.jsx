import { Link } from "react-router";
import { useState, useEffect } from "react";
import styles from "./landing.module.css";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-cycle through features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.container} ${isLoaded ? styles.loaded : ''}`}>
      {/* Animated Background */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>

      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <span className={styles.bagIcon}>🎒</span>
            </div>
            <span className={styles.logoText}>Jhola</span>
          </Link>
          <div className={styles.navLinks}>
            <Link to="/login" className={styles.navLink}>Sign In</Link>
            <Link to="/register" className={styles.navButton}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Your Files, <span className={styles.highlight}>Organized</span> in Your Digital <span className={styles.highlight}>Jhola</span>
            </h1>
            <p className={styles.heroDescription}>
              Experience the next generation of file management with Jhola - your personal digital bag. Store, organize, and access your files from anywhere with our powerful, intuitive platform.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>10GB</span>
                <span className={styles.statLabel}>Free Storage</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>99.9%</span>
                <span className={styles.statLabel}>Uptime</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>256-bit</span>
                <span className={styles.statLabel}>Encryption</span>
              </div>
            </div>
            <div className={styles.heroButtons}>
              <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
                <span>Start Free Trial</span>
                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
                <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.mockupControls}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className={styles.mockupTitle}>Jhola Dashboard</div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupSidebar}>
                    <div className={styles.mockupFolder}>
                      <div className={styles.folderIcon}>🎒</div>
                      <span>Documents</span>
                    </div>
                    <div className={styles.mockupFolder}>
                      <div className={styles.folderIcon}>🎒</div>
                      <span>Images</span>
                    </div>
                    <div className={styles.mockupFolder}>
                      <div className={styles.folderIcon}>�</div>
                      <span>Music</span>
                    </div>
                    <div className={styles.mockupFolder}>
                      <div className={styles.folderIcon}>🎒</div>
                      <span>Projects</span>
                    </div>
                  </div>
                  <div className={styles.mockupMain}>
                    <div className={styles.mockupFile}>
                      <div className={styles.fileIcon}>📄</div>
                      <span>Report.pdf</span>
                    </div>
                    <div className={styles.mockupFile}>
                      <div className={styles.fileIcon}>🖼️</div>
                      <span>Logo.png</span>
                    </div>
                    <div className={styles.mockupFile}>
                      <div className={styles.fileIcon}>📊</div>
                      <span>Data.xlsx</span>
                    </div>
                    <div className={styles.mockupFile}>
                      <div className={styles.fileIcon}>🎥</div>
                      <span>Video.mp4</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.floatingElements}>
                <div className={`${styles.floatingElement} ${styles.element1}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className={`${styles.floatingElement} ${styles.element2}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className={`${styles.floatingElement} ${styles.element3}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className={`${styles.floatingElement} ${styles.element4}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>Everything You Need to Manage Your Files</h2>
            <p className={styles.featuresDescription}>
              Powerful features designed to make file management effortless and secure
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: "Smart Organization",
                description: "Pack your files intelligently with our smart jhola system that automatically organizes your digital belongings"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Advanced Search",
                description: "Find any file instantly with our powerful search engine that understands context"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Bank-Grade Security",
                description: "Your files are protected with military-grade encryption and multi-factor authentication"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                ),
                title: "Easy Sharing",
                description: "Share files and folders with customizable permissions and expiration dates"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                ),
                title: "Bulk Operations",
                description: "Upload, download, and manage multiple files at once with our batch processing tools"
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Smart Insights",
                description: "Get insights into your storage usage, file types, and access patterns"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`${styles.featureCard} ${activeFeature === index ? styles.active : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsContent}>
          <div className={styles.testimonialsHeader}>
            <h2 className={styles.testimonialsTitle}>Trusted by Users Worldwide</h2>
            <p className={styles.testimonialsDescription}>
              See what our users are saying about Jhola
            </p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {"⭐".repeat(5)}
              </div>
              <p className={styles.testimonialText}>
                "Jhola has revolutionized how I manage my files. The smart organization feature saved me hours of manual sorting! It's like having a perfectly organized bag for all my digital stuff."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>JS</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>John Smith</span>
                  <span className={styles.authorRole}>Product Manager</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {"⭐".repeat(5)}
              </div>
              <p className={styles.testimonialText}>
                "The security features give me peace of mind. I can share files with clients knowing they're completely safe in my digital jhola."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>MJ</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>Maria Johnson</span>
                  <span className={styles.authorRole}>Freelance Designer</span>
                </div>
              </div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialRating}>
                {"⭐".repeat(5)}
              </div>
              <p className={styles.testimonialText}>
                "Best file management solution I've used. The interface is intuitive and the search function is lightning fast. My digital jhola is always organized!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>DW</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>David Wilson</span>
                  <span className={styles.authorRole}>Software Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>
            <span className={styles.bagIcon}>🎒</span>
          </div>
          <h2 className={styles.ctaTitle}>Ready to Pack Your Files Into Your Digital Jhola?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of users who have already made the switch to smarter file management with Jhola. Start organizing your digital belongings today - no credit card required.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/register" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
              <span>Start Your Free Trial</span>
              <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/login" className={`${styles.btn} ${styles.btnOutline} ${styles.btnLarge}`}>
              <span>Sign In</span>
            </Link>
          </div>
          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>10GB Free Storage</span>
            </div>
            <div className={styles.ctaFeature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
            <div className={styles.ctaFeature}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <span className={styles.bagIcon}>🎒</span>
              </div>
              <span className={styles.logoText}>Jhola</span>
            </Link>
            <p className={styles.footerDescription}>
              Your digital bag for modern file management - organize, secure, and access your files from anywhere
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerSection}>
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 Jhola. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}