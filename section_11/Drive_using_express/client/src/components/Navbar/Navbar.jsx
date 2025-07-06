import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [userProfile, setUserProfile] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      } else if (res.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
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
        toast.success("Logging out...", { autoClose: 1000 });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed. Please try again.");
    }
  }

  if (!userProfile?.username) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🎒</div>
            <span className={styles.logoText}>Jhola</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🎒</div>
            <span className={styles.logoText}>Jhola</span>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {userProfile.username?.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{userProfile.username}</span>
                <span className={styles.userEmail}>{userProfile.email || 'user@example.com'}</span>
              </div>
            </div>
            <div className={styles.userActions}>
              <button className={styles.actionButton} title="Settings (Coming Soon)" disabled>
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

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {userProfile.username?.charAt(0).toUpperCase() || 'U'}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.userAvatar}>
                  {userProfile.username?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{userProfile.username}</span>
                  <span className={styles.userEmail}>{userProfile.email || 'user@example.com'}</span>
                </div>
              </div>
              <div className={styles.mobileActions}>
                <button className={styles.mobileActionButton} disabled>
                  ⚙️ Settings (Coming Soon)
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
      </nav>
    <ToastContainer autoClose={2000} />
    </>
  );
};

export default Navbar;