import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from './Modal';


export default function AddFile() {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);

  async function handleAdd(e) {
    const file = e.target.files[0];
    if (!file) return;

    const response = await fetch('http://192.168.100.7:4000/storage?action=add', {
      method: 'POST',
      headers: { filename: file.name },
      body: file,
    });

    if (response.status === 200) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      {showModal
        ? createPortal(
            <Modal ref={ref} progress={showModal} />, 
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
