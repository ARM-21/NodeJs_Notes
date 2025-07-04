import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import styles from './Register.module.css';

export default function Register() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
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

    // Validation
    if (userData.username.trim() === '' || userData.email.trim() === '' || userData.password.trim() === '') {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: userData }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed', { autoClose: 3000 });
        setIsLoading(false);
        return;
      }

      toast.success('Registration successful! Please login.', { autoClose: 2000 });
      setTimeout(() => {
        navigator('/login');
      }, 2000);

    } catch (err) {
      setError('Network error. Please try again.');
      toast.error('Network error. Please try again.', { autoClose: 3000 });
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us and start managing your files</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

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
              placeholder="Enter your password (min 6 characters)"
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Sign in
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
