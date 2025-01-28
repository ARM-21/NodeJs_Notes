import React, { useState } from 'react'
import AddFile from './AddFile'
import { Outlet } from 'react-router'
import './yourfile.css'; 
import './addfile.css'; // Importing CSS file

export default function Home() {
  const [files, setFiles] = useState([]);
  function getDirectoryInfo(){
    fetch('http://192.168.100.7:4000')
    .then((res) => res.json())
    .then((data) => {
      setFiles(data);
    });
  }
  
  return (
    <div>
      <AddFile getDirectoryInfo={getDirectoryInfo}/>
      <Outlet context={{files,setFiles,getDirectoryInfo}}/>
    </div>
  )
}
