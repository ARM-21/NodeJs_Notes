import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../uploadConfirm/Modal';
import UploadConfirm from '../uploadConfirm/UploadConfirm';
import './addfile.css'
import { useParams } from 'react-router';


export default function AddFile({getDirectoryInfo,getDirectoryData}) {
//states 
    //uplaod modal information store
  const [showModal, setShowModal] = useState(false);
    //progress value for upload section
  const [progress,setProgress] = useState(0);
   // store text for uloading
   const [uploadText, setUploadText] =useState('Uploading Your File')
    //storing files related information to track file
  const [fileDetails,setFileDetails] = useState({file:'',size:'',showModal:false,eventObject:null});
 //references for upload and delete modal
  const refModal = useRef(null)
   const uploadModalRef = useRef(null)
   const directoryName = useParams();
   //handling when user adds or change the files
   const addFileParams = useParams();
   console.log(addFileParams)
  async function handleAdd(e) {
    const file = e.target.files[0];
    const nestedDirectory = directoryName.name? '/'+directoryName.name:'';
    const multiLevelPath = directoryName['*']?'/'+directoryName['*']:'';
    setFileDetails({file:file.name,size:file.size/1024*1024,showModal:false})
    if (!file) return;
    //creating a xhr similar to fetch uses callback (older than fetch promise based)
    const xhr = new XMLHttpRequest();
    xhr.open('POST',`http://192.168.100.7:4000/files${nestedDirectory}${multiLevelPath}/${file.name}?action=add`,true)
    // xhr.setRequestHeader('filename',file.name)

   xhr.upload.addEventListener('progress',(prog)=>{
      const progValue = (prog.loaded/prog.total) * 100 
      setUploadText(uploadText) 
      if(progValue.toFixed() == '100'){
        setUploadText('File Uploaded Successfully')
       
      }
      setProgress(progValue)
   })
   xhr.addEventListener('load',()=>{
    setUploadText(xhr.response)
    setTimeout(()=>{

      setShowModal(false)
      getDirectoryInfo()
      if(addFileParams.name & addFileParams.paths){

        getDirectoryData(addFileParams)
      }
    },1000)
   })
  //  xhr.addEventListener('load',(e)=>{
  //   setUploadText(xhr.responseText)
  // })
    xhr.send(file)

    setShowModal(true)
    getDirectoryInfo()
  }

  //uplaod modal close
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //handling side effects
  useEffect(() => {
  
    if(fileDetails.showModal && uploadModalRef ){
      uploadModalRef.current.showModal()
    }
    else if(fileDetails.showModal){
      uploadModalRef.current.close()
    }
    
  }, [fileDetails.showModal]);

  useEffect(()=>{
    if (showModal && refModal.current) {
      refModal.current.showModal();
    }
    else if(showModal && refModal.current){
      refModal.current.close()
    }
  },[refModal.current])
  //handle upload yes in upload modal
  function handleUploadYes(){
    if(fileDetails.showModal && fileDetails.eventObject){
      handleAdd(fileDetails.eventObject)
    }
  }

  //on file upload change 
  function changeHandle(e){
    const file = e.target.files[0]
    setFileDetails((prev)=>{return {...prev,showModal:true,eventObject:e,file: file.name ,size:file.size}})
  }
   //handle upload No in upload modal
  function handleUploadNo(){
    setFileDetails((prev)=>{
      return {...prev, showModal:false}
    })
  }
  

  return (
    <>
      {fileDetails.showModal
        ? createPortal(
            <UploadConfirm 
              file={fileDetails.file} 
              onConfirm={handleUploadYes} 
              onCancel={handleUploadNo} 
              ref={uploadModalRef}
            />, 
            document.getElementById("root")
          )
        : showModal
        ? createPortal(
            <Modal progress={showModal} ref={refModal} value={progress} onclose= {handleCloseModal}  text = {uploadText} setShowModal={setShowModal} getDirectoryInfo={getDirectoryInfo} />, 
            document.getElementById('root')
          ):<div className='user-add-file'>
            <h1>Add Files</h1>
            <div className='file-upload'>
              <label htmlFor='userFile' className='file-label'>
                Choose a file
              </label>
              <input type='file' name='userFile' id='userFile' onChange={(e)=>{changeHandle(e)}} required hidden />
            </div>
          </div>
      }
    </>
  );
}
