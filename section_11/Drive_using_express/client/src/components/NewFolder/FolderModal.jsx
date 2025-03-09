import React, { forwardRef, useEffect, useState } from "react";
import styles from "./folderModal.module.css";
import { useParams } from "react-router";

const FolderModal = forwardRef(({ onClose,setNewFolderModal }, ref) => {
  const [folderName, setFolderName] = useState({name:'',sendRequest:false});
  const paths=useParams()

  async function createFolder() {
    
    if(folderName.sendRequest){
      const response = await fetch(`http://192.168.100.7:4000/directory${paths.name? "/"+paths.name:''}${paths["*"]? "/"+paths['*']:''}/${folderName.name}`,{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
          "filename":folderName.name,
          "foldername":paths.name?paths.name:''
        })
  
      })
      const data = await response.json();
      setFolderName((prev)=>{ return {...prev,sendRequest:false,name:''}})
      setNewFolderModal((prev)=>{return {...prev,showModal:false}})
      window.alert(data.message)
    }
   
   
  }

  useEffect(()=>{
    createFolder()
  },[folderName.sendRequest])

  return (
    <dialog ref={ref} className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Create New Folder</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter folder name..."
          value={folderName.name}
          onChange={(e) => setFolderName((prev)=>{ return {...prev,name:e.target.value}})}
        />
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.createButton}
            onClick={() => {
              if (folderName.name.trim()) {
                setFolderName((prev =>{ return {...prev,sendRequest:true}}));
                
              }
            }}
            disabled={!folderName.name.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default FolderModal;
