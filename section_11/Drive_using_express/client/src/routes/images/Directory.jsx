import React, { useEffect, useRef, useState } from 'react';
import styles from './Directory.module.css'; // Importing CSS file
import { useNavigate, useOutletContext, useParams } from 'react-router';
import RenameModal from '../../components/rename/RenameModal';
import DeleteModal from '../../components/delete/DeleteModal';
import SearchBar from '../../components/SearchBar/searchFile';
import { createPortal } from 'react-dom';
import FolderModal from '../../components/NewFolder/FolderModal';
import Navbar from '../../components/Navbar/Navbar';

export default function Directory() {
  const { files, 
    directoryFiles,
     setDirectoryFiles,
     setFiles,
      deleteModal, 
      setDeleteModal,
       handleYes, 
       handleNo,
        deleteModalRef, 
        getDirectoryInfo, setRename, renameRef, isRename, url, closeFolderModal, newFolderModalRef, newFolder, setNewFolder } = useOutletContext()
    const [load, setLoad] = useState("Loading...");
  
    const navigator = useNavigate()
  
  const params = useParams()
  useEffect(() => {
    getDirectoryInfo(params.name)
    // getData(params)
    if (!directoryFiles.files) {
      setLoad('No Files Available')
    }
  }, []);
  //useEffectes for handling side effects
 useEffect(() => {
    if (deleteModal.showModal && deleteModalRef?.current) {
      deleteModalRef.current.showModal();
    }
  }, [deleteModal.showModal]);

  useEffect(() => {
    if (deleteModal.deleteFile) {
      console.log('deleting file', deleteModal.filename)
      handleDelete(deleteModal,deleteModal.type)
    }
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false,type:'' } })
  }, [deleteModal.deleteFile])

  useEffect(() => {
    if (renameRef.current && isRename.showModal) {
      renameRef.current.showModal()
    }
  }, [isRename.showModal, renameRef])

  //alternative way to create delete 
  async function handleDelete(list,type) {
    console.log("filename", list)
    const response = await fetch(`http://${url}:4000/${type}/${list.filename}?action=delete`, {
      method: 'DELETE',
      headers: { dirid: list.parentId },
      credentials:'include'
    })
    console.log("homejsx",response.status)  
    if(response.status == 401){
      navigator('/login')
      return
    }
    getDirectoryInfo(params.name)
    // getData(params)

  }
  // Search functionality
  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length > 0) {
      const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(inputValue)
      );
      const directory = directoryFiles.filter((dir)=>{
        return dir.name.toLowerCase().includes(inputValue)
      })

      if (filteredFiles.length === 0) {
        setLoad("File Not Found");
      }
      setFiles(filteredFiles);
      setDirectoryFiles(directory)
      
    } else {
      getDirectoryInfo(params.name);
    }
  }

  return (
    <>

    
      {/* Modals remain same */}
      {deleteModal.showModal &&
        createPortal(
          <DeleteModal
            handleNo={handleNo}
            handleYes={handleYes}
            ref={deleteModalRef}
            getDirectoryInfo={getDirectoryInfo}
          />,
          document.getElementById("root")
        )}
      {isRename.showModal &&
        createPortal(
          <RenameModal
            rename={setRename}
            ref={renameRef}
            filename={isRename}
            getDirectoryInfo={getDirectoryInfo}
            url={url}
          />,
          document.getElementById("root")
        )}

     

  

      <div className={styles.directoryContainer}>
        <SearchBar handleSearch={handleSearch} />
        {newFolder.showModal && 
        createPortal(
        <FolderModal
          ref={newFolderModalRef}
          setNewFolderModal={setNewFolder}
          onClose={closeFolderModal}
        />
      ,document.getElementById("root"))}

        {/* Files Section */}
        <section className={styles.fileFolderMergeSection}>
        <section className={styles.filesSection}>
          <h2>Your Files</h2>
          <ul className={styles.fileList}>
            {files?.length > 0 ? (
              files.map(({ id, name, extension, parentId }) => (
                <li key={id} className={styles.fileItem}>
                <p className={styles.fileName}>
                  {name.includes(".") ?name : name + extension}
                </p>
                <div className={styles.fileActions}>
                  <a href={`http://${url}:4000/file/${id}?action=open`} className={styles.fileBtn}>
                    <button >Preview</button>
                  </a>
                  <a href={`http://${url}:4000/file/${id}?action=download`} className={styles.fileBtn}>
                    <button className={styles.downloadBtn}>Download</button>
                  </a>
                  <section className={styles.fileBtn}>
                  <button className={styles.deleteBtn}
                    onClick={() =>
                      setDeleteModal((prev)=>{
                        return {...prev,
                        showModal: true,
                        filename: id,
                        type:'file',
                        parentId,
                      }})
                      
                    }
                  >
                    Delete
                  </button>
                  </section>
                  <span className={styles.fileBtn}>
                  <button className={styles.renameBtn}
                    onClick={() =>
                      setRename(prev=>  { return {...prev,
                        filename: name,
                        id: id,
                        showModal: true,
                        type:"file"
                      }})
                    }
                  >
                    Rename
                  </button>
                  </span>
                </div>
              </li>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎒</div>
                <p className={styles.loadingText}>{load}</p>
                <p className={styles.emptyMessage}>Start filling your digital jhola with files!</p>
              </div>
            )}
          </ul>
        </section>

        {/* Folders Section */}
        <section className={styles.foldersSection}>
          <h2>Your Folders</h2>
          <ul className={styles.folderList}>
            {directoryFiles?.length > 0 ? (
              directoryFiles.map(({ id, name, parentId }) => (
                <li key={id} className={styles.folderItem}>
                  <p className={styles.folderName}>{name}</p>
                  <div className={styles.folderActions}>
                    <a href={`/directory/${id}`} className={styles.folderBtn}>
                      <button className={`${styles.actionBtn} ${styles.openBtn}`}>Open</button>
                    </a>
                    <span className={styles.folderBtn}>
                      <button
                        onClick={() => setRename((prev) => {return {...prev,filename: name,
                        id: id,
                        showModal: true,
                        type:"directory"}})}
                        className={`${styles.actionBtn} ${styles.renameBtn}`}
                      >
                        Rename
                      </button>
                    </span>
                    <span className={styles.folderBtn}>
                      <button
                        onClick={() => setDeleteModal((prev) => {return { ...prev, showModal: true, filename: name, parentId,type:'directory' }})}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎒</div>
                <p className={styles.loadingText}>No folders available</p>
                <p className={styles.emptyMessage}>Create your first folder to organize your jhola!</p>
              </div>
            )}
          </ul>
        </section>
        </section>
      </div>
    </>
  );

}
