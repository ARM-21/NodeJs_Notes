import React, { useEffect, useRef, useState } from 'react';
import './images.css'; // Importing CSS file
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
      setLoad('No FIles Available')
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

     

  

      <div className='directory-container'>
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
        <section className='file-folder-merge-section'>
        <section className="files-section">
          <h2>Your Files</h2>
          <ul className='file-list'>
            {files?.length > 0 ? (
              files.map(({ id, name, extension, parentId }) => (
                <li key={id} className="file-item">
                <p className="file-name">
                  {name.includes(".") ?name : name + extension}
                </p>
                <div className="file-actions">
                  <a href={`http://${url}:4000/file/${id}?action=open`} className="file-btn">
                    <button >Preview</button>
                  </a>
                  <a href={`http://${url}:4000/file/${id}?action=download`} className="file-btn">
                    <button className='download-btn'>Download</button>
                  </a>
                  <section className="file-btn">
                  <button className='delete-btn'
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
                  <span className="file-btn">
                  <button className='rename-btn'
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
              <p className='loading-text'>{load}</p>
            )}
          </ul>
        </section>

        {/* Folders Section */}
        <section className="folders-section">
          <h2>Your Folders</h2>
          <ul className='folder-list'>
            {directoryFiles?.length > 0 ? (
              directoryFiles.map(({ id, name, parentId }) => (
                <li key={id} className='folder-item'>
                  <p className='folder-name'>{name}</p>
                  <div className='folder-actions'>
                    <a href={`/directory/${id}`} className='folder-btn'>
                      <button className='action-btn open-btn'>Open</button>
                    </a>
                    <span className='folder-btn'>
                      <button
                        onClick={() => setRename((prev) => {return {...prev,filename: name,
                        id: id,
                        showModal: true,
                        type:"directory"}})}
                        className='action-btn rename-btn'
                      >
                        Rename
                      </button>
                    </span>
                    <span className='folder-btn'>
                      <button
                        onClick={() => setDeleteModal((prev) => {return { ...prev, showModal: true, filename: name, parentId,type:'directory' }})}
                        className='action-btn delete-btn'
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className='loading-text'>No folders available</p>
            )}
          </ul>
        </section>
        </section>
      </div>
    </>
  );

}
