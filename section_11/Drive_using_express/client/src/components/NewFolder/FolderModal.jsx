import React, { forwardRef, useEffect, useState } from "react";
import styles from "./folderModal.module.css";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const FolderModal = forwardRef(({ onClose, getDirectoryInfo }, ref) => {
  const [folderName, setFolderName] = useState({ name: '', sendRequest: false });
  const [isLoading, setIsLoading] = useState(false);
  const paths = useParams();
  const navigator = useNavigate();

  async function createFolder() {
    if (folderName.sendRequest && folderName.name.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/directory/${paths.id || ''}`, {
          method: "POST",
          headers: { 
            "content-type": "application/json", 
            "dirname": folderName.name.trim() 
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          navigator('/login');
          return;
        }

        const data = await response.json();
        
        if (response.ok) {
          toast.success(data.message || "Folder created successfully");
          // Refresh directory content
          if (getDirectoryInfo) {
            getDirectoryInfo();
          }
        } else {
          toast.error(data.message || "Failed to create folder");
        }
        
        setFolderName({ name: '', sendRequest: false });
        onClose();
      } catch (error) {
        toast.error("An error occurred while creating the folder");
        console.error('Create folder error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    createFolder();
  }, [folderName.sendRequest]);

  const handleClose = () => {
    if (!isLoading) {
      setFolderName({ name: '', sendRequest: false });
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && folderName.name.trim() && !isLoading) {
      setFolderName((prev) => ({ ...prev, sendRequest: true }));
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <dialog ref={ref} className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Create New Folder</h2>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter folder name..."
          value={folderName.name}
          onChange={(e) => setFolderName((prev) => ({ ...prev, name: e.target.value }))}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoFocus
        />
        <div className={styles.buttonGroup}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.createButton}
            onClick={() => {
              if (folderName.name.trim()) {
                setFolderName((prev) => ({ ...prev, sendRequest: true }));
              }
            }}
            disabled={!folderName.name.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default FolderModal;
