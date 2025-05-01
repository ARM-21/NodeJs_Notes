import React, { forwardRef } from "react";
import "./uploadConfirm.css"; // Import CSS file

const UploadConfirm = forwardRef((props, ref) => {
  return (
    <dialog className="confirm-modal-overlay" ref={ref} >
      <div className="confirm-modal">
        <h2 className="confirm-title">Confirm Upload</h2>
        <p className="confirm-text">
          Are you sure you want to upload <strong>{props.file}</strong>?
        </p>
        <div className="button-group">
          <button className="confirm-button" onClick={props.onConfirm}>
            Yes
          </button>
          <button className="cancel-button" onClick={props.onCancel}>
            No
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default UploadConfirm;
