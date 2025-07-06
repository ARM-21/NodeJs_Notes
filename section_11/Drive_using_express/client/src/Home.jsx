import React, { useEffect, useRef, useState } from 'react';
import AddFile from './components/AddUserFile/AddFile.jsx';
import { Outlet, useNavigate, useParams } from 'react-router';
import Navbar from './components/Navbar/Navbar.jsx';
import { createPortal } from 'react-dom';
import FolderModal from './components/NewFolder/FolderModal.jsx';
import styles from './Home.module.css';
import { handleApiError, handleNetworkError, showSuccess } from './utils/errorHandler.js';

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
      
      // Handle API errors using the utility function
      const hasError = await handleApiError(response, data, navigator);
      if (hasError) {
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
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNo() {
    setDeleteModal((prev) => ({ ...prev, showModal: false, deleteFile: false, filename: '', _id: '', type: '', parentId: '' }));
    deleteModalRef.current?.close();
  }

  async function handleYes() {
    if (deleteModal._id && deleteModal.type) {
      try {
        // Use the correct API endpoint based on type
        const apiEndpoint = deleteModal.type === 'folder' ? 'directory' : 'file';
        
        const response = await fetch(`http://localhost:4000/${apiEndpoint}/${deleteModal._id}?action=delete`, {
          method: 'DELETE',
          headers: { 
            'dirid': deleteModal.parentId || paths.id || ''
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        
        // Handle API errors using the utility function
        const hasError = await handleApiError(response, data, navigator);
        if (hasError) {
          return;
        }
        
        // Show success toast
        showSuccess(`${deleteModal.type === 'file' ? 'File' : 'Folder'} deleted successfully!`);
        
        // Refresh the directory info
        getDirectoryInfo(paths.id || '');
        
      } catch (error) {
        handleNetworkError(error);
      }
    }
    
    setDeleteModal((prev) => ({ ...prev, showModal: false, deleteFile: false, filename: '', _id: '', type: '', parentId: '' }));
    deleteModalRef.current?.close();
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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
            New Folder
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
          currentFolder={currentFolder}
        />,
        document.getElementById('root')
      )}
    </div>
  );
}
