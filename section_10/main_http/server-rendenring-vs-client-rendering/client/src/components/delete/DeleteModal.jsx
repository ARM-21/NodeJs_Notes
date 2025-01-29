import React, { forwardRef } from "react";
import "./deleteModal.css"; // Import the CSS file

const DeleteModal = forwardRef(function (props, ref) {
  return (
    <dialog ref={ref} className="delete-modal">
      <div className="modal-content">
        <h1>Do you want to delete?</h1>
        <div className="button-group">
          <button className="yes-button" type="button" onClick={props.handleYes}>
            Yes
          </button>
          <button className="no-button" type="button" onClick={props.handleNo}>
            No
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default DeleteModal;
