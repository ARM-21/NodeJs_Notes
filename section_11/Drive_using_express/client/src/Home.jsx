import React, { useEffect, useRef, useState } from 'react';
import AddFile from './components/AddUserFile/AddFile.jsx';
import { Outlet, useNavigate, useParams } from 'react-router';
import Navbar from './components/Navbar/Navbar.jsx';
import { createPortal } from 'react-dom';
import FolderModal from './components/NewFolder/FolderModal.jsx';
import styles from './Home.module.css';

const url = 'localhost';

export default function Home() {
  const paths = useParams();
  const [files, setFiles] = useState([]);
  const [directoryFiles, setDirectoryFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({ name: 'My Files', id: null });
  const [deleteModal, setDeleteModal] = useState({ deleteFile: false, showModal: false, filename: '', type: '' });
  const [isRename, setRename] = useState({ filename: '', id: '', showModal: false, type: '' });
  const [newFolder, setNewFolder] = useState({ showModal: false });
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  const deleteModalRef = useRef(null);
  const renameRef = useRef(null);
  const newFolderModalRef = useRef(null);

  async function getDirectoryInfo(params = '') {
    setIsLoading(true);
    try {
      const response = await fetch(`http://${url}:4000/directory/${params}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.status === 401) {
        navigator("/login");
        return;
      }
      
      setFiles(data.files);
      setDirectoryFiles(data.folders);
      
      // Set current folder name
      if (params) {
        setCurrentFolder({ name: data.name || 'Folder', id: params });
      } else {
        setCurrentFolder({ name: 'My Files', id: null });
      }
    } catch (error) {
      console.error('Error fetching directory info:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNo() {
    setDeleteModal((prev) => ({ ...prev, showModal: false, deleteFile: false, filename: '', parentId: '', type: '' }));
    deleteModalRef.current?.close();
  }

  function handleYes() {
    setDeleteModal((prev) => ({ ...prev, showModal: false, deleteFile: true }));
    console.log("deleteFile");
  }

  const closeFolderModal = () => {
    newFolderModalRef.current?.close();
    setNewFolder({ showModal: false });
  };

  const openFolderModal = () => {
    setNewFolder({ showModal: true });
    newFolderModalRef.current?.showModal();
  };

  useEffect(() => {
    getDirectoryInfo();
  }, []);

  // Watch for route parameter changes to load directory content
  useEffect(() => {
    const folderId = paths.id || '';
    getDirectoryInfo(folderId);
  }, [paths.id]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <AddFile 
            getDirectoryInfo={getDirectoryInfo} 
            getDirectoryData={setDirectoryFiles} 
          />
          <button 
            onClick={openFolderModal}
            className={styles.newFolderButton}
          >
            📁 New Folder
          </button>
        </div>
        
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading files...</p>
            </div>
          ) : (
            <Outlet context={{ 
              files, 
              directoryFiles,
              setFiles,
              setDirectoryFiles, 
              setDeleteModal, 
              setRename, 
              getDirectoryInfo,
              deleteModal,
              isRename,
              handleNo,
              handleYes,
              deleteModalRef,
              renameRef,
              url,
              closeFolderModal,
              newFolderModalRef,
              newFolder,
              setNewFolder,
              currentFolder
            }} />
          )}
        </div>
      </div>

      {newFolder.showModal && createPortal(
        <FolderModal 
          ref={newFolderModalRef}
          onClose={closeFolderModal}
          getDirectoryInfo={getDirectoryInfo}
        />,
        document.getElementById('root')
      )}
    </div>
  );
}
