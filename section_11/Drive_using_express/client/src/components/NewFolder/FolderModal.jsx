import React, { forwardRef, useEffect, useState } from "react";
import styles from "./folderModal.module.css";
import { useNavigate, useParams } from "react-router";
import { handleApiError, handleNetworkError, showSuccess } from "../../utils/errorHandler";

const FolderModal = forwardRef(({ onClose, getDirectoryInfo, currentFolder, isRename = false, initialName = '' }, ref) => {
  const [folderName, setFolderName] = useState({ name: '', sendRequest: false });
  const [isLoading, setIsLoading] = useState(false);
  const paths = useParams();
  const navigator = useNavigate();

  // Reset input when modal opens
  useEffect(() => {
    if (isRename && initialName) {
      // For rename, show current name but clear input for new name
      setFolderName({ name: '', sendRequest: false });
    } else {
      setFolderName({ name: '', sendRequest: false });
    }
  }, [isRename, initialName]);

  async function handleFolderAction() {
    if (folderName.sendRequest && folderName.name.trim()) {
      setIsLoading(true);
      try {
        let response;
        
        if (isRename) {
          // Handle rename logic (you'll need to implement the API endpoint)
          response = await fetch(`http://localhost:4000/directory/${paths.id}/rename`, {
            method: "PUT",
            headers: { 
              "content-type": "application/json"
            },
            body: JSON.stringify({ newName: folderName.name.trim() }),
            credentials: 'include'
          });
        } else {
          // Handle create logic
          const url = paths.id ? 
            `http://localhost:4000/directory/${paths.id}` : 
            `http://localhost:4000/directory`;
          
          response = await fetch(url, {
            method: "POST",
            headers: { 
              "content-type": "application/json", 
              "dirname": folderName.name.trim() 
            },
            credentials: 'include'
          });
        }

        const data = await response.json();
        
        // Handle API errors using the utility function
        const hasError = await handleApiError(response, data, navigator);
        if (hasError) {
          setIsLoading(false);
          return;
        }
        
        showSuccess(data.message || `Folder ${isRename ? 'renamed' : 'created'} successfully`);
        // Refresh directory content
        if (getDirectoryInfo) {
          getDirectoryInfo(paths.id);
        }
        
        setFolderName({ name: '', sendRequest: false });
        onClose();
      } catch (error) {
        handleNetworkError(error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    handleFolderAction();
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
        <h2 className={styles.title}>
          {isRename ? 'Rename Folder' : 'Create New Folder'}
        </h2>
        {currentFolder && (
          <p className={styles.currentPath}>
            {isRename ? (
              <>
                Current name: <span className={styles.pathName}>{initialName || currentFolder.name}</span>
              </>
            ) : (
              <>
                Creating in: <span className={styles.pathName}>{currentFolder.name || 'My Files'}</span>
              </>
            )}
          </p>
        )}
        <input
          type="text"
          className={styles.input}
          placeholder={isRename ? "Enter new folder name..." : "Enter folder name..."}
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
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                {isRename ? 'Renaming...' : 'Creating...'}
              </>
            ) : (
              isRename ? 'Rename Folder' : 'Create Folder'
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default FolderModal;
