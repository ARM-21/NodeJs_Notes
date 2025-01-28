import React, { forwardRef, useRef } from 'react'

const DeleteModal = forwardRef(function(props,ref) {

  return (
    <dialog ref={ref}>
      <h1>Do you want to delete?</h1>
      <button type="button" onClick={props.handleYes}>Yes</button>
      <button type="button" onClick={props.handleNo}>No</button>
    </dialog>
  )
})
export default DeleteModal;