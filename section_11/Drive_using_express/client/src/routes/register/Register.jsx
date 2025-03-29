import React, { useState } from 'react'
import styles from './register.module.css'
import { useNavigate } from 'react-router';

export default function Register() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '123' })
  const [isSuccess, setRegistrationStatus] = useState(false);
  const [error, setError] = useState(false);
  const [emptyField, setEmptyField] = useState({email:{ isEmpty: false }, password:{ isEmpty: false }, username:{  isEmpty: false }});
  const navigator = useNavigate()

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prev) => { return { ...prev, [name]: value } });
    setRegistrationStatus(false)
    setError(false)

  }
  async function handleSubmit(e) {
    e.preventDefault()
    for (let i=0;i<3;i++){

     if(e.target[i].value == ""){

      setEmptyField((prev)=>{
        return {...prev, [prev[e.target[i].id].isEmpty]:true}
      })
        emptyField[e.target[i].id].isEmpty = true;
     }
    }
    console.dir(e.target)

    if (userData.username.trim() == "" || userData.email.trim() == "" || userData.password.trim() == "") {
      return;
    }

    const response = await fetch('http://192.168.100.7:4000/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: userData })
    })
    const data = await response.json()

    setRegistrationStatus(true);
    if (data.error) {
      setError(data.error);
    }
    else if (response.status == 200) {
      setTimeout(() => {
        navigator('/login')
      }, 3000)
    }

  }

  return (
    <div className={styles.formContainer}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          {emptyField["email"].isEmpty ?<>  <span style={{ color: 'red' }}>Enter value for email</span></>:""}
          
          <input id="email" type="mail" className={styles.inputField} name="email" placeholder='Enter your email'required value={userData.email} onChange={(e) => handleChange(e)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          {emptyField["username"].isEmpty ? <> <span style={{ color: 'red' }}>Enter value for username</span></>:""}

          <input id="username" name="username" type="text" className={styles.inputField} value={userData.username} placeholder='Enter your username' onChange={(e) => handleChange(e)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          {emptyField["password"].isEmpty ? <><span style={{ color: 'red' }}>Enter value for password</span></>:""}

          <input id="password" type="password" className={styles.inputField} name="password" value={userData.password} placeholder='Enter your password' onChange={(e) => handleChange(e)} />

        </div>
        {error?<p>{error}</p>:''}
        
        <button type="submit" className={styles.submitBtn} >{isSuccess ? "Registration Successfull" : "Register"}</button>
        <br />
        <div className={styles.loginLink}>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </form>
    </div>
  )
}
