import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import "./renameModal.css"; // Import CSS

const RenameModal = forwardRef( function (props, ref) {
  const [newName, setNewName] = useState('');
//short bug in renaming file  

async function handleRename()  {
    if (!newName.trim()) {
      alert("File name cannot be empty!");
      return;
    }
    const response = await fetch(`http://${props.url}:4000/files/${props.filename}?action=rename`,
    {method:'PATCH',
      headers:{filename:newName, "Content-Type":"application/json"},
      body:JSON.stringify({newName})
    });
    console.log('rename dialog off')
    props.rename((prev)=>{return {...prev, showModal:false}})
    props.getDirectoryInfo()
    console.log(response.headers.filename)
    console.log(response.status)
    if(response.status == 200){
      const resText = await response.text();
      alert(resText);
    }
    else{
      alert('error occured')
    }
    

  }
 

  return (
    <dialog className="rename-modal-overlay" ref={ref}>
      <div className="rename-modal">
        <h2>Rename File</h2>
        <p>Current Name: <strong>{props.filename}</strong></p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new file name"
          className="rename-input"
        />
        <div className="button-group">
          <button className="rename-button" onClick={handleRename}>Rename</button>
          <button className="cancel-button" onClick={() => {props.rename((prev=>{return {...prev,showModal:false}}))}}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
}
);

export default RenameModal;
