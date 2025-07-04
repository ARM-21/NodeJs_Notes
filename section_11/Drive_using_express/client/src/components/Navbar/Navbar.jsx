import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const res = await fetch('http://localhost:4000/user/', {
        credentials: 'include'
      });

      const data = await res.json();

      if (res.status === 200) {
        setUserProfile(data);
      } else {
        navigator('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigator('/login');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const resLog = await fetch('http://localhost:4000/user/logout', {
        credentials: 'include',
        method: 'POST'
      });

      const data = await resLog.json();

      if (resLog.status === 200) {
        toast.success('Logging out...', { autoClose: 1000 });
        setTimeout(() => {
          navigator('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  }

  if (isLoading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>📁</div>
          <span className={styles.logoText}>FileSpace</span>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search files and folders..."
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              🔍
            </button>
          </div>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {userProfile.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{userProfile.username}</span>
              <span className={styles.userEmail}>{userProfile.email}</span>
            </div>
          </div>

          <div className={styles.userActions}>
            <button className={styles.actionButton} title="Settings">
              ⚙️
            </button>
            <button 
              className={styles.actionButton} 
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileUserInfo}>
              <div className={styles.userAvatar}>
                {userProfile.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{userProfile.username}</span>
                <span className={styles.userEmail}>{userProfile.email}</span>
              </div>
            </div>
            <div className={styles.mobileActions}>
              <button className={styles.mobileActionButton}>
                ⚙️ Settings
              </button>
              <button 
                className={styles.mobileActionButton}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </nav>
  );
};

export default Navbar;