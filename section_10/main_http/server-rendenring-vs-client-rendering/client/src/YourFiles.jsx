import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router';
import Modal from './Modal';
import DeleteModal from './DeleteModal';
// Importing CSS file

export default function YourFiles() {
 //getting values sent from home all the state are up
  const {files,setFiles, getDirectoryInfo} = useOutletContext();
  const [deleteModal,setDeleteModal]= useState({deleteFile:false,showModal:false,filename:''});
  //delete modal ref
  const deleteModalRef = useRef(null)
 

  useEffect(() => {
     
      if(deleteModalRef && deleteModal.showModal){
        deleteModalRef.current.showModal()
      }
    return () => {
      console.log('cleaned up');
    };
  }, [deleteModal.showModal]);
  useEffect(()=>{
    getDirectoryInfo()
  })
  useEffect(()=>{
     
      if(deleteModal.deleteFile){
        console.log('deleting file', deleteModal.filename)
        handleDelete(deleteModal.filename)
      }
  },[deleteModal.deleteFile])
  
  function handleNo(){
    setDeleteModal((prev)=>{ return {...prev,showModal:false,deleteFile:false,filename:''}})
    deleteModalRef.current.close()
  }
  function handleYes (){
    setDeleteModal((prev)=>{ return {...prev,showModal:false,deleteFile:true}}) 
    
    
  }

  //alternative way to create delete 
  async function handleDelete(list){
    console.log("filename",list)
    const response = await fetch(`http://192.168.100.7:4000/storage/${list}?action=delete`,{
      method:'DELETE',
      headers:{filename:list}
    })
    getDirectoryInfo()

  }

  return <>
    {deleteModal.showModal? createPortal(<DeleteModal handleNo={handleNo} handleYes={handleYes} ref={deleteModalRef} />, document.getElementById('root'))
      : <div className='your-files'>
      <h1>Your Files</h1>
      <ul className='file-list'>
        {files.length > 0 ? (
          files.map((list, key) => (
            <div key={key} className='file-item'>
              <p className='file-name'>{list}</p>
              <div className='file-actions'>
                {list === 'images' ? (
                  <>
                    <a href={`/images`} className='file-btn'> <button>Preview</button></a>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a> 
                    <a  onClick={()=>{setDeleteModal((prev)=>{return {...prev,showModal:true,filename:list}})}} className='file-btn'> <button>Delete</button></a> 
                    {/* alternative */}
                    {/* href={`http://192.168.100.7:4000/storage/${list}?action=delete`} */}
                  </>
                ) : (
                  <>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=open`} className='file-btn'> <button>Preview</button></a>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a>   
                    <a onClick={()=>{setDeleteModal((prev)=>{return {...prev,showModal:true,filename:list}})}} className='file-btn'> <button>Delete</button></a>  
                      {/* alternative */} 
                    {/* href={`http://192.168.100.7:4000/storage/${list}?action=delete`}  */}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='loading-text'>Getting your files...</p>
        )}
      </ul>
    </div>
  
    }
    </>
    
  }
