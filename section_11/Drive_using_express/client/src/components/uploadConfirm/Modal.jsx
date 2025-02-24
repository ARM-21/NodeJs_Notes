import React, { forwardRef } from "react";
import "./uploadProgress.css"; // Import CSS file

const Modal = forwardRef(function Modal(prop, ref) {
  return (
    <>
      <dialog id="modal" ref={ref} className="custom-modal">
        <h1 className="modal-title">{prop.text}</h1>
        {prop.value ? <p className="modal-value">{prop.value.toFixed(2)} %</p> : null}
        {prop.value === 100 ? (
          <button
            id="closeModal"
            className="modal-button"
            onClick={() => {
              prop.onclose();
              prop.getDirectoryInfo();
            }}
          >
            Close
          </button>
        ) : null}
      </dialog>
    </>
  );
});

export default Modal;
