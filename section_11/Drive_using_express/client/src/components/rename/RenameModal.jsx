import React, { useState, forwardRef } from "react";
import styles from "./RenameModal.module.css";
import { useNavigate } from "react-router";
import { handleApiError, handleNetworkError, showSuccess, showWarning } from "../../utils/errorHandler";

const RenameModal = forwardRef(function (props, ref) {
  const [newName, setNewName] = useState(props.filename?.filename || '');
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigate();

  // Get the current filename for display
  const getCurrentName = () => {
    if (props.filename?.filename) {
      return props.filename.filename;
    }
    return 'Unknown';
  };

  async function handleRename() {
    if (!newName.trim()) {
      showWarning("File name cannot be empty!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://${props.url}:4000/${props.filename.type}/${props.filename.id}?action=rename`, {
        method: 'PATCH',
        headers: { 
          newname: newName.trim(), 
          "Content-Type": "application/json" 
        },
        credentials: "include"
      });

      const data = await response.json();
      
      // Handle API errors using the utility function
      const hasError = await handleApiError(response, data, navigator);
      if (hasError) {
        setIsLoading(false);
        return;
      }

      // Close modal
      props.rename((prev) => ({ 
        ...prev, 
        showModal: false, 
        id: '', 
        filename: '' 
      }));

      // Refresh directory content
      props.getDirectoryInfo();
      
      showSuccess("File renamed successfully!");
    } catch (error) {
      handleNetworkError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    props.rename((prev) => ({ 
      ...prev, 
      showModal: false, 
      id: '', 
      filename: "" 
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <dialog className={styles.modal} ref={ref}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <svg className={styles.editIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className={styles.title}>Rename Item</h2>
        <p className={styles.currentName}>
          Current name: <span className={styles.fileName}>{getCurrentName()}</span>
        </p>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter new name"
            className={styles.input}
            autoFocus
            disabled={isLoading}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button 
            className={styles.cancelButton} 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className={styles.renameButton} 
            onClick={handleRename}
            disabled={isLoading || !newName.trim()}
          >
            {isLoading ? 'Renaming...' : 'Rename'}
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default RenameModal;
