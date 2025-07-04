import React, { forwardRef } from "react";
import styles from "./DeleteModal.module.css";

const DeleteModal = forwardRef(function (props, ref) {
  return (
    <dialog ref={ref} className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <svg className={styles.warningIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.message}>
          Are you sure you want to delete <strong>"{props.filename}"</strong>? This action cannot be undone.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} type="button" onClick={props.onCancel}>
            Cancel
          </button>
          <button className={styles.deleteButton} type="button" onClick={props.onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default DeleteModal;
