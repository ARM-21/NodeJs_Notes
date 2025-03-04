import React, { useEffect, useState } from 'react'
import AddFile from './components/AddUserFile/AddFile.jsx'
import { Outlet } from 'react-router'
// Importing CSS file
const url = '192.168.100.7'
export default function Home() {
  const [files, setFiles] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  function getDirectoryInfo(){
    fetch(`http://${url}:4000/directory`)
    .then((res) => res.json())
    .then((data) => {
      setFiles(data);
    });
  }
   async function getData(params) {
    console.log("home.jsx line17",params)
          const response = await fetch(`http://192.168.100.7:4000/directory/${params.name}${params.paths ? `/${params.paths}` : ''}`)
          const data = await response.json()
          setDirectoryFiles(data)
      }
  
  useEffect(()=>{
    getDirectoryInfo()
  },[])
  return (
    <div>
      <AddFile getDirectoryInfo={getDirectoryInfo} getDirectoryData={getData}/>
      <Outlet context={{files,setFiles,getDirectoryInfo,url,directoryFiles,getData}}/>
    </div>
  )
}
