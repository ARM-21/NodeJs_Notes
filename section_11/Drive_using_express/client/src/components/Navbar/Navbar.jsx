import { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import styles from './Navbar.module.css';
// select list by default in mobile view for your files
// Create Search Context
export const SearchContext = createContext();

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

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
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, clearSearch }}>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🎒</div>
            <span className={styles.logoText}>Jhola</span>
          </div>

          <div className={styles.searchContainer}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={styles.clearButton}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              <button 
                className={styles.userButton}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className={styles.userAvatar}>
                  {userProfile.username?.charAt(0).toUpperCase()}
                </div>
                <span className={styles.userName}>{userProfile.username}</span>
                <svg className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className={styles.userDropdown}>
                  <div className={styles.dropdownItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <div className={styles.userInfo}>
                      <span className={styles.userDisplayName}>{userProfile.username}</span>
                      <span className={styles.userEmail}>{userProfile.email || 'user@example.com'}</span>
                    </div>
                  </div>
                  <div className={`${styles.dropdownItem} ${styles.disabledItem}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                    </svg>
                    <span>Settings</span>
                    <span className={styles.comingSoon}>(Coming Soon)</span>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <button 
                    className={`${styles.dropdownItem} ${styles.logoutButton}`}
                    onClick={handleLogout}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16,17 21,12 16,7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ToastContainer autoClose={2000} />
    </SearchContext.Provider>
  );
};

export default Navbar;