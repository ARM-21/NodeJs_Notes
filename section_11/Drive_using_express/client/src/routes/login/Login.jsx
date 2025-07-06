import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import styles from './Login.module.css';

export default function Login() {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigator = useNavigate();

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (userData.email.trim() === '' || userData.password.trim() === '') {
      setError('Please enter all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: userData }),
        credentials: 'include'
      });

      const message = await response.json();

      if (message?.error) {
        setError(message.error);
        toast.error(message.error, { autoClose: 3000 });
        setIsLoading(false);
        return;
      }

      if (response.status === 200) {
        toast.success('Login successful!', { autoClose: 2000 });
        setTimeout(() => {
          navigator(`/drive`);
        }, 2000);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.', { autoClose: 3000 });
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>🎒</div>
          <h2 className={styles.logoText}>Jhola</h2>
          <p className={styles.logoSubtext}>Your Personal Cloud Storage</p>
        </div>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access your digital jhola</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.loading : ''}`}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
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
    </div>
  );
}
