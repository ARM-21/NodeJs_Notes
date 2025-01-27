import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal';


export default function AddFile() {
  const [showModal, setShowModal] = useState(false);
  const refModal = useRef(null)
  const [progress,setProgress] = useState(0)
  const [uploadText, setUploadText] =useState('Uploading Your File')
  async function handleAdd(e) {
    const file = e.target.files[0];
    if (!file) return;
    // const response = await fetch('http://192.168.100.7:4000/storage?action=add', {
    //   method: 'POST',
    //   headers: { filename: file.name },
    //   body: file,
    // });

    //creating a xhr similar to fetch uses callback (older than fetch promise based)
    const xhr = new XMLHttpRequest();
    xhr.open('POST','http://192.168.100.7:4000/storage?action=add',true)
    xhr.setRequestHeader('filename',file.name)
   xhr.addEventListener("progress",()=>{
    console.log(xhr.progress)
   })
   xhr.upload.addEventListener('progress',(prog)=>{
      const progValue = (prog.loaded/prog.total) * 100  
      setProgress(progValue)
   })
   xhr.addEventListener('load',(e)=>{
    setUploadText(xhr.response)
  })
    xhr.send(file)
    
    
    
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (showModal && refModal.current) {
      refModal.current.showModal();
    }
    else if(showModal){
      refModal.current.close()
    }
    
  }, [showModal]);
  

  return (
    <>
      {showModal
        ? createPortal(
            <Modal progress={showModal} ref={refModal} value={progress} onclose= {handleCloseModal}  text = {uploadText} setShowModal={setShowModal} />, 
            document.getElementById('root')
          )
        : <div className='user-add-file'>
            <h1>Add Files</h1>
            <div className='file-upload'>
              <label htmlFor='userFile' className='file-label'>
                Choose a file
              </label>
              <input type='file' name='userFile' id='userFile' onChange={handleAdd} required hidden />
            </div>
          </div>
      }
    </>
  );
}
