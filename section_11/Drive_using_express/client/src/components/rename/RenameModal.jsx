import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import "./renameModal.css"; // Import CSS
import { useNavigate } from "react-router";

const RenameModal = forwardRef( function (props, ref) {
  const [newName, setNewName] = useState('');
  const navigator = useNavigate()
  const params = props.params;

//short bug in renaming file  

async function handleRename()  {
    if (!newName.trim()) {
      alert("File name cannot be empty!");
      return;
    }
    const response = await fetch(`http://${props.url}:4000/${props.filename.type}/${props.filename.id}?action=rename`,
    {method:'PATCH',
      headers:{newname:newName, "Content-Type":"application/json"},
      credentials:"include"
    });
    console.log('rename dialog off')
    props.rename((prev)=>{return {...prev, showModal:false,id:'',filename:''}})
    console.log(response.headers.get('id'))
    props.getDirectoryInfo(response.headers.get('id'))
    // props.getData(params)
    if(response.status == 401){
      navigator('/login')
    }

      const resText = await response.text();
      alert(resText);

  }
 

  return (
    <dialog className="rename-modal-overlay" ref={ref}>
      <div className="rename-modal">
        <h2>Rename File</h2>
        <p>Current Name: <strong>{props.filename.filename}</strong></p>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new file name"
          className="rename-input"
        />
        <div className="button-group">
          <button className="rename-button" onClick={handleRename}>Rename</button>
          <button className="cancel-button" onClick={() => {props.rename((prev=>{return {...prev,showModal:false,id:'',filename:""}}))}}>Cancel</button>
        </div>
      </div>
    </dialog>
  );
}
);

export default RenameModal;
