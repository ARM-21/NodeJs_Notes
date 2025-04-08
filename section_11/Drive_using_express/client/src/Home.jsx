import React, { useEffect, useRef, useState } from 'react'
import AddFile from './components/AddUserFile/AddFile.jsx'
import { Outlet, useNavigate, useParams } from 'react-router'
// Importing CSS file
const url = 'localhost'
export default function Home() {
  const paths = useParams()
  const [files, setFiles] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ deleteFile: false, showModal: false, filename: '',type:'' });
  const [isRename, setRename] = useState({ filename: '', id :'',showModal: false, type:'' })
  const navigator = useNavigate()
  

  const deleteModalRef = useRef(null)
  const renameRef = useRef(null)
  
  async function getDirectoryInfo(params=''){
    const response = await  fetch(`http://${url}:4000/directory/${params}`,{
      credentials:'include'
    })
    const data = await response.json();  
    console.log("homejsx",response.status)  
      if(response.status == 401){
          navigator("/login")
          return;
      }
      setFiles(data.files);
      setDirectoryFiles(data.directories);

  }

      //handling delete modal confirm and rejection
  function handleNo() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false, filename: '', parentId:'',type:'' } })
    deleteModalRef.current.close()
  }
  function handleYes() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: true, } })
    console.log("deleteFile")
  }
  
  useEffect(()=>{
    getDirectoryInfo(paths.name)
  },[paths.name])
  return (
    <div>
      <AddFile getDirectoryInfo={getDirectoryInfo} getDirectoryData/>
      <Outlet context={{files,paths,setFiles,directoryFiles,setDirectoryFiles,getDirectoryInfo,url,deleteModal,setDeleteModal,handleNo,handleYes,deleteModalRef,setRename,isRename,renameRef}}/>
    </div>
  )
}
