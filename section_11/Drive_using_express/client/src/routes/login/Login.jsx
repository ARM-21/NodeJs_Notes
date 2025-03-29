import React, { useState } from 'react'
import styles from '../register/register.module.css';

export default function Login() {
const [userData,setUserData] = useState({username:'',password:''})

  function handleChange(e){
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prev)=>{return {...prev, [name]:value}});
  }
 async function handleSubmit(e){
    e.preventDefault()
    console.dir(JSON.stringify(userData))
    if(userData.username.trim() == "" || userData.password.trim() == ""){
      alert("ENter all the values");
      return;
    }

   const response = await  fetch('http://192.168.100.7:4000/user/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({formData:userData})
    })
    if(response.status == 200){
      // ${(await response.json()).userId}
      window.location.href = `/user/${(await response.json()).userId}`
    }
    // const data = await response.json()
    // alert(data.message)

  }

  return (
    <div className={styles.formContainer}>
      <h2>Login Form</h2>
      <form method="post" action="/user" onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" onInput={(e)=>handleChange(e)} className={styles.inputField} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" className={styles.inputField} onInput={(e)=>handleChange(e)} name="password" />
        </div>

        <button type="submit" className={styles.submitBtn} href="/user/" >Login</button>
        <br />
         <div className={styles.loginLink}>
                  <p>Doesn't have an account? <a href="/register">Register here</a></p>
                </div>
      </form>
    </div>
  )
}
