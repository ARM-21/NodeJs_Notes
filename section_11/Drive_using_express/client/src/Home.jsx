import React, { useEffect, useRef, useState } from 'react'
import AddFile from './components/AddUserFile/AddFile.jsx'
import { Outlet } from 'react-router'
// Importing CSS file
const url = '192.168.100.7'
export default function Home() {
  const [files, setFiles] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ deleteFile: false, showModal: false, filename: '' });
  const [isRename, setRename] = useState({ filename: '', showModal: false })
  

  const deleteModalRef = useRef(null)
  const renameRef = useRef(null)
  
  function getDirectoryInfo(){
    fetch(`http://${url}:4000/directory`)
    .then((res) => res.json())
    .then((data) => {
      setFiles(data);
    });
  }
   async function getData(params) {
    console.log("home.jsx line17",params)
          const response = await fetch(`http://192.168.100.7:4000/directory${params.name?"/"+params.name:""}${params['*'] ? `/${params['*']}` : ''}`)
          const data = await response.json()
          setDirectoryFiles(data)
      }

      //handling delete modal confirm and rejection
  function handleNo() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false, filename: '' } })
    deleteModalRef.current.close()
  }
  function handleYes() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: true } })
  }
  
  useEffect(()=>{
    getDirectoryInfo()
  },[])
  return (
    <div>
      <AddFile getDirectoryInfo={getDirectoryInfo} getDirectoryData={getData}/>
      <Outlet context={{files,setFiles,setDirectoryFiles,getDirectoryInfo,url,directoryFiles,getData,deleteModal,setDeleteModal,handleNo,handleYes,deleteModalRef,setRename,isRename,renameRef}}/>
    </div>
  )
}
