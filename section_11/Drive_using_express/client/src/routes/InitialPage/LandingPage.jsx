import { Link } from "react-router";
import styles from "./landing.module.css"
export default function LandingPage() {
  return (// Assuming this is your CSS Module
  
        <div className={styles.container}>
          {/* Header Section */}
          <header className={styles.header}>
            <a href="#" className={styles.logo}>
              <div className={styles.logoIcon}></div>
              <span className={styles.logoText}>FileSpace</span>
            </a>
          </header>
    
          {/* Main Content */}
          <main>
            <section className={styles.hero}>
              <h1 className={styles.heroTitle}>Simple File Management</h1>
              <p className={styles.heroDescription}>
                Store, organize, and manage your files with our straightforward solution.
                Easy access from anywhere with basic security features.
              </p>
    
              <div className={styles.authButtons}>
                <a href="/register" className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</a>
                <a href="/login" className={`${styles.btn} ${styles.btnSecondary}`}>Sign In</a>
              </div>
            </section>
    
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h3>📁 Simple Organization</h3>
                <p>Create folders and manage files with our intuitive interface</p>
              </div>
    
              <div className={styles.featureCard}>
                <h3>🔍 Quick Search</h3>
                <p>Find your files instantly using name-based search</p>
              </div>
    
              <div className={styles.featureCard}>
                <h3>🛡 Basic Security</h3>
                <p>Direct access control for your important files</p>
              </div>
            </div>
          </main>
        </div>

    
  );
}