import { useEffect, useState } from 'react';
import {
  FolderIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  UserIcon,
  Bell,
  X,
  Settings,
  LogOut
} from 'lucide-react';
import styles from './Navbar.module.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile,setUserProfile] = useState('');
  const navigator = useNavigate()
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(()=>{
    getUser()
  },[])
async function getUser(){
  const res = await fetch('http://localhost:4000/user/',{
    credentials:'include'
  })

  const data = await res.json();

  if(res.status == 200){
    setUserProfile(data)
  }


}



  async function handleLogout() {
    const resLog = await fetch('http://localhost:4000/user/logout',
      { credentials: 'include', method:'POST' }
    )
    const data = await resLog.json()
    console.log(resLog.status)
    if(resLog.status == 200){
       toast("Logging Out",{autoClose:"1000"})
            setTimeout(()=>{
              navigator(`/login`)
            },2000)
    }
  }

  return (
    <>
    <ToastContainer autoClose="2000"/>
    <div className={styles.header_container}>
      <header className={styles.navbar}>
        <div className={styles.container}>
          <a href="/" className={styles.logo}>
            <FolderIcon />
            <span>Bhandrand</span>
          </a>


          {/* Desktop Navigation */}
          <nav className={styles.navLinks}>
            <a href="#" className={styles.navLink}>Dashboard</a>
            <a href="#" className={styles.navLink}>My Files</a>
            <a href="#" className={styles.navLink}>Shared</a>
            <a href="#" className={styles.navLink}>Recent</a>
          </nav>

          <div className={styles.rightSection}>
            <div className={styles.searchContainer}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search files..."
                className={styles.searchInput}
              />
            </div>

            <button className={styles.button}>
              <Bell />
            </button>

            
            <div className={styles.profileContainer}>
              <button className={`${styles.button} ${styles.profileButton}`} disabled={!userProfile.username} >
                <UserIcon />
              </button>
              <div className={styles.profileDropdown}>
                <div className={styles.profileDropdownItem}>
                  <UserIcon size={16} className={styles.dropdownIcon} />
                  <a href='#'>{userProfile.username}</a>
                </div>
                <div className={styles.profileDropdownItem}>
                  <Settings size={16} className={styles.dropdownIcon} />
                  <a href='#'>Settings</a>
                </div>
                <div className={styles.profileDropdownItem}>
                  <LogOut size={16} className={styles.dropdownIcon} />
                  <span onClick={handleLogout}>Sign out</span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`${styles.mobileMenuButton} ${styles.button}`}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
          <nav className={styles.mobileNavLinks}>
            <a href="#" className={styles.navLink}>Dashboard</a>
            <a href="#" className={styles.navLink}>My Files</a>
            <a href="#" className={styles.navLink}>Shared</a>
            <a href="#" className={styles.navLink}>Recent</a>
          </nav>
        </div>
      </header>
    </div>
    </>
  );
};

export default Navbar;