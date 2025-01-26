import React, { forwardRef, useImperativeHandle, useRef } from 'react'

const Modal = forwardRef(function Modal(ref,prop) {
    const inputRef = useRef(null);
    useImperativeHandle(ref,()=>{
       
       return{
        showModal(){
            inputRef.current.showModal()
        }
       } 
    },[])

  return (
    <>
    <dialog id="modal"  ref={inputRef}>
    {prop.progress? <h1>Uploading your file</h1>: <h1>file Uploded sucessfully</h1>}
   
    <button id="closeModal">Close modal</button>
  </dialog>
  <button id="openModal">Show modal</button>
  </>
  )
})

export default Modal;
