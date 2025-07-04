import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router';
import DeleteModal from '../delete/DeleteModal';
import RenameModal from '../rename/RenameModal'


// Importing CSS file
import './yourfile.css'
export default function YourFiles() {
  //getting values sent from home all the state are up
  const { files, setFiles, getDirectoryInfo,url } = useOutletContext();
  const [deleteModal, setDeleteModal] = useState({ deleteFile: false, showModal: false, filename: '' });
  const [isRename, setRename] = useState({filename:'',showModal:false})
  const [search,setSearch] = useState('');
  const [load,setLoad] = useState('Getting your files...')
  //delete modal ref
  const deleteModalRef = useRef(null)
  const renameRef = useRef(null)

  //useEffectes for handling side effects
  useEffect(() => {
    if (deleteModalRef && deleteModal.showModal) {
      deleteModalRef.current.showModal()
    }
    return () => {
      console.log('cleaned up');
    };
  }, [deleteModal.showModal]);

  useEffect(() => {
    if (deleteModal.deleteFile) {
      console.log('deleting file', deleteModal.filename)
      handleDelete(deleteModal.filename)
    }
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false } })
  }, [deleteModal.deleteFile])

  useEffect(() => {
    if (renameRef.current && isRename.showModal) {
      renameRef.current.showModal()
    }
  }, [isRename.showModal,renameRef])


  //handling delete modal confirm and rejection
  function handleNo() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false, filename: '' } })
    deleteModalRef.current.close()
  }
  function handleYes() {
    setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: true } })
  }

  //alternative way to create delete 
  async function handleDelete(list) {
    console.log("filename", list)
    const response = await fetch(`http://${url}:4000/storage/${list}?action=delete`, {
      method: 'DELETE',
      headers: { filename: list }
    })
    getDirectoryInfo()

  }
  function handleSearch(e){
    const inputValue = e.target.value;
    console.log(inputValue)
    setSearch(e.target.value)
    if(inputValue.length > 1){
      const filteredFiles = files.filter((file)=>{
        return file.includes(inputValue)})
      console.log('from inside',filteredFiles)
      if(filteredFiles.length == 0){
        setLoad('File Not Found')
      }
      setFiles(filteredFiles)
    }
    else{
      // setFiles( files)
      getDirectoryInfo()
    }
   
  }

  return <>


    {  isRename.showModal? createPortal(<RenameModal  rename={setRename} ref={renameRef} filename={isRename.filename} getDirectoryInfo={getDirectoryInfo} url={url}/>,
      document.getElementById('root')) :
      deleteModal.showModal ? 
    createPortal(<DeleteModal handleNo={handleNo} handleYes={handleYes} ref={deleteModalRef} getDirectoryInfo={getDirectoryInfo}/>, 
    document.getElementById('root'))
      : 
      
      <div className='your-files' style={{display:'flex',flexDirection:'column'}}>
          <input type='text' placeholder='Enter Name for Search' onChange={(e)=>{handleSearch(e)}} style={{marginInline:'auto',padding:'5px 2px 2px 8px',borderRadius:'5px'}}/>
        <h1>Your Files</h1>
        <ul className='file-list'>
          {/* reading list of available files from storage folder */}
          {files.length > 0 ? (
            files.map((list, key) => (
              <div key={key} className='file-item'>
                <p className='file-name'>{list}</p>
                <div className='file-actions'>
                  {list === 'images' ? (
                    <>
                      <a href={`/images`} className='file-btn'> <button>Preview</button></a>
                      <a href={`http://${url}:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a>
                      <a onClick={() => { setDeleteModal((prev) => { return { ...prev, showModal: true, filename: list } }) }} className='file-btn'> <button>Delete</button></a>
                      <a onClick={() => { setRename(true) }} className='file-btn'> <button>Rename</button></a>
                      {/* alternative */}
                      {/* href={`http://192.168.1.114:4000/storage/${list}?action=delete`} */}
                    </>
                  ) : (
                    <>
                      <a href={`http://${url}:4000/storage/${list}?action=open`} className='file-btn'> <button>Preview</button></a>
                      <a href={`http://${url}:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a>
                      <a onClick={() => { setDeleteModal((prev) => { return { ...prev, showModal: true, filename: list } }) }} className='file-btn'> <button>Delete</button></a>
                      <a onClick={() => { setRename((prev)=>{return {filename:list,showModal:true}
                      }) }} className='file-btn'> <button>Rename</button></a>
                      {/* alternative */}
                      {/* href={`http://192.168.100.7:4000/storage/${list}?action=delete`}  */}
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='loading-text'>{load}</p>
          )}
        </ul>
      </div>

    }
  </>

}
