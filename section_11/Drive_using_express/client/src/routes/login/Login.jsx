import React, { useState } from 'react'
import styles from '../register/register.module.css';
import { useNavigate } from 'react-router';
import {toast, ToastContainer} from 'react-toastify'

export default function Login() {
const [userData,setUserData] = useState({email:'',password:''})
const navigator = useNavigate()
const [loginStatus,setLoginStatus] = useState(false)
const [error,setError]= useState('')

  function handleChange(e){
    const name = e.target.name;
    const value = e.target.value;
    setUserData((prev)=>{return {...prev, [name]:value}});
    setLoginStatus(false)
  }
 async function handleSubmit(e){
    e.preventDefault()
    console.dir(JSON.stringify(userData))
    if(userData.email.trim() == "" || userData.password.trim() == ""){
      alert("ENter all the values");
      return;
    }
    
   const response = await  fetch('http://localhost:4000/user/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({formData:userData}),
      credentials:'include'
    })
    const message = await response.json()
    console.log(message)
    if(message?.error){
      setLoginStatus(true)
      toast(message.error,{autoClose:1000})
      setError(message.error)
    }

    if(response.status == 200){
      // ${(await response.json()).userId}
      toast("Logging in",{autoClose:"1000"})
      setTimeout(()=>{

        navigator(`/user/${message.userDir}`)
      },2000)
     
    }

    // const data = await response.json()
    // alert(data.message)

  }

  let notify = () => toast('Login Successfully');
  return ( 
    <>
    <ToastContainer autoClose="2000"/>
    <div className={styles.formContainer}>
      <h2>Login Form</h2>
      <form method="post" action="/user" id='loginDetails' onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Email:</label>
          <input id="username" name="email" type="email" value={userData.email} onInput={(e)=>handleChange(e)} className={styles.inputField} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" className={styles.inputField} value={userData.password} onInput={(e)=>handleChange(e)} name="password" />
        </div>
        {loginStatus?<p style={{color:'red'}}>{error}</p>:''}
        <button type="submit" className={styles.submitBtn} href="/user/" >Login</button>
        <br />
         <div className={styles.loginLink}>
                  <p>Doesn't have an account? <a href="/register">Register here</a></p>
                </div>
      </form>
    </div>
    </>
  )
}
