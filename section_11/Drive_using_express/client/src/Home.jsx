import React, { useEffect, useRef, useState } from 'react'
import AddFile from './components/AddUserFile/AddFile.jsx'
import { Outlet, useNavigate, useParams } from 'react-router'
import Navbar from './components/Navbar/Navbar.jsx'
import { createPortal } from 'react-dom'
import FolderModal from './components/NewFolder/FolderModal.jsx'
// Importing CSS file
const url = 'localhost'
export default function Home() {
  const paths = useParams()
  const [files, setFiles] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ deleteFile: false, showModal: false, filename: '', type: '' });
  const [isRename, setRename] = useState({ filename: '', id: '', showModal: false, type: '' })
  const navigator = useNavigate()


  const deleteModalRef = useRef(null)
  const renameRef = useRef(null)
  const [newFolder, setNewFolder] = useState({ showModal: false });
    const newFolderModalRef = useRef(null);

  async function getDirectoryInfo(params = '') {
    console.log("direc Params", params)
    const response = await fetch(`http://${url}:4000/directory/${params}`, {
      credentials: 'include'
    })
<<<<<<< HEAD
    const data = await response.json();
    console.log("homejsx", response.status)
    if (response.status == 401) {
      navigator("/login")
      return;
    }
    console.log(data)
    setFiles(data.files);
    setDirectoryFiles(data.folders);

=======
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setFiles(data.files);
      setDirectoryFiles(data.directories)
    });
>>>>>>> database-branch
  }

  //handling delete modal confirm and rejection
  function handleNo() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false, filename: '', parentId: '', type: '' } })
    deleteModalRef.current.close()
  }
  function handleYes() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: true, } })
    console.log("deleteFile")
  }
  const closeFolderModal = () => {
    newFolderModalRef.current?.close();
    setNewFolder({ showModal: false });
  };

  useEffect(() => {
    getDirectoryInfo(paths.name)
  }, [paths.name])
  return (

    <>
      <div className="main_container">
      <Navbar/>
      <div className="hero_section">
      <div className="Adding-section">
      <AddFile getDirectoryInfo={getDirectoryInfo} getDirectoryData />
      <div className="header-section">
          {/* <h1 className='directory-title'>Image Gallery</h1> */}
          <button
            className="new-folder-btn"
            onClick={() => setNewFolder({ showModal: true })}
          >
            <img src="/folder.svg" alt="folderIcon" />
            Create Folder
          </button>
        </div>

        </div>
      
      <Outlet context={{ files, paths, setFiles, directoryFiles, setDirectoryFiles, getDirectoryInfo, url, deleteModal, setDeleteModal, handleNo, handleYes, deleteModalRef, setRename, isRename, renameRef, closeFolderModal, setNewFolder, newFolder }} />
      </div>
      </div>
    {/* </div> */}
    </>
  )
}
