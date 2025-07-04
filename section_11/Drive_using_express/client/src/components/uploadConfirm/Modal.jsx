import React, { forwardRef } from "react";
import styles from "./Modal.module.css";

const Modal = forwardRef(function Modal(prop, ref) {
  return (
    <dialog id="modal" ref={ref} className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h1 className={styles.title}>{prop.text}</h1>
        {prop.value !== undefined && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${prop.value}%` }}
              />
            </div>
            <p className={styles.progressText}>{prop.value.toFixed(1)}%</p>
          </div>
        )}
        {prop.value === 100 && (
          <button
            id="closeModal"
            className={styles.closeButton}
            onClick={() => {
              prop.onclose();
              prop.getDirectoryInfo();
            }}
          >
            Close
          </button>
        )}
      </div>
    </dialog>
  );
});

export default Modal;
