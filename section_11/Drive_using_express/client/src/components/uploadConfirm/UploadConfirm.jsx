import React, { forwardRef } from "react";
import styles from "./UploadConfirm.module.css";

const UploadConfirm = forwardRef((props, ref) => {
  return (
    <dialog className={styles.modal} ref={ref}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className={styles.title}>Confirm Upload</h2>
        <p className={styles.message}>
          Are you sure you want to upload <span className={styles.fileName}>{props.file}</span>?
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={props.onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={props.onConfirm}>
            Upload
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default UploadConfirm;
