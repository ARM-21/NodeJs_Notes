import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../uploadConfirm/Modal';
import UploadConfirm from '../uploadConfirm/UploadConfirm';
import styles from './AddFile.module.css';
import { useParams } from 'react-router';
import FolderModal from '../NewFolder/FolderModal';
import { toast } from 'react-toastify';


export default function AddFile({ getDirectoryInfo, getDirectoryData }) {
  //states 
  //uplaod modal information store
  const [showModal, setShowModal] = useState(false);
  //progress value for upload section
  const [progress, setProgress] = useState(0);
  // store text for uloading
  const [uploadText, setUploadText] = useState('Uploading Your File')
  //storing files related information to track file
  const [fileDetails, setFileDetails] = useState({ file: '', size: '', showModal: false, eventObject: null });
  //state for new folder modal
  //references for upload and delete modal
  const refModal = useRef(null)
  const uploadModalRef = useRef(null)
  //ref for newfolder modal

  const directoryName = useParams();
  //handling when user adds or change the files

  async function handleAdd(e) {
    const file = e.target.files[0];
    setFileDetails({ file: file.name, size: file.size / (1024 * 1024), showModal: false });
    if (!file) return;

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://localhost:4000/file/${file.name}?action=add`, true);
      xhr.withCredentials = true;
      xhr.setRequestHeader('dirid', directoryName.name || '');

      xhr.upload.addEventListener('progress', (prog) => {
        const progValue = (prog.loaded / prog.total) * 100;
        setUploadText('Uploading Your File');
        if (progValue.toFixed() === '100') {
          setUploadText('File Uploaded Successfully');
        }
        setProgress(progValue);
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploadText('File Uploaded Successfully');
          toast.success('File uploaded successfully!');
        } else {
          setUploadText('Upload Failed');
          toast.error('Upload failed. Please try again.');
        }
        
        setTimeout(() => {
          setShowModal(false);
          getDirectoryInfo(directoryName.name);
        }, 1000);
      });

      xhr.addEventListener('error', () => {
        setUploadText('Upload Failed');
        toast.error('Upload failed. Please try again.');
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      });

      xhr.send(file);
      setShowModal(true);
    } catch (error) {
      toast.error('An error occurred during upload');
      console.error('Upload error:', error);
    }
  }

  //uplaod modal close
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //handling side effects
  useEffect(() => {

    if (fileDetails.showModal && uploadModalRef) {
      uploadModalRef.current.showModal()
    }
    else if (fileDetails.showModal) {
      uploadModalRef.current.close()
    }

  }, [fileDetails.showModal]);

  useEffect(() => {
    if (showModal && refModal.current) {
      refModal.current.showModal();
    }
    else if (showModal && refModal.current) {
      refModal.current.close()
    }
  }, [refModal.current])

  function handleUploadYes() {
    if (fileDetails.showModal && fileDetails.eventObject) {
      handleAdd(fileDetails.eventObject);
    }
  }

  function handleUploadNo() {
    setFileDetails((prev) => ({
      ...prev,
      showModal: false
    }));
  }

  function changeHandle(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 100MB.');
      return;
    }
    
    setFileDetails((prev) => ({ 
      ...prev, 
      showModal: true, 
      eventObject: e, 
      file: file.name, 
      size: file.size 
    }));
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
            <Modal progress={showModal} ref={refModal} value={progress} onclose={handleCloseModal} text={uploadText} setShowModal={setShowModal} getDirectoryInfo={getDirectoryInfo} />,
            document.getElementById('root')
          ) :
          <>
            <div className={styles.container}>
              <div className={styles.uploadSection}>
                <div className={styles.iconContainer}>
                  <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className={styles.title}>Upload Files</h2>
                <p className={styles.description}>
                  Select files to upload to your drive
                </p>
                <div className={styles.uploadArea}>
                  <label htmlFor='userFile' className={styles.fileLabel}>
                    <span className={styles.labelText}>Choose Files</span>
                    <span className={styles.labelSubtext}>or drag and drop</span>
                  </label>
                  <input 
                    type='file' 
                    name='userFile' 
                    id='userFile' 
                    onChange={(e) => { changeHandle(e) }} 
                    required 
                    hidden 
                  />
                </div>
              </div>
            </div>
          </>
      }
    </>
  );
}
