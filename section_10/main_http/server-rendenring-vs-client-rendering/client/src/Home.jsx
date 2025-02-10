import React, { useEffect, useState } from 'react'
import AddFile from './components/AddUserFile/AddFile.jsx'
import { Outlet } from 'react-router'
// Importing CSS file
const url = '192.168.1.114'
export default function Home() {
  const [files, setFiles] = useState([]);
  function getDirectoryInfo(){
    fetch(`http://${url}:4000`)
    .then((res) => res.json())
    .then((data) => {
      setFiles(data);
    });
  }
  
  useEffect(()=>{
    getDirectoryInfo()
  },[])
  return (
    <div>
      <AddFile getDirectoryInfo={getDirectoryInfo}/>
      <Outlet context={{files,setFiles,getDirectoryInfo,url}}/>
    </div>
  )
}
