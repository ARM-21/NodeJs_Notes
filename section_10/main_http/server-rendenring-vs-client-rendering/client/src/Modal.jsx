import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal(prop,ref) {

  return (
    <>
    <dialog id="modal" ref={ref}>

     <h1>{prop.text}</h1>
     {prop.value?<p>{prop.value.toFixed(2)} %</p>:null}
   {prop.value == 100? <button id="closeModal" onClick={()=>{prop.onclose();prop.getDirectoryInfo() }}>Close</button>:null} 
  </dialog>
  </>
  )
})

export default Modal;
