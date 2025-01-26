import React, { useEffect, useState } from 'react'

export default function YourFiles() {
    const [files,setFiles]=useState([]);
    useEffect(()=>{
          fetch('http://192.168.100.7:4000').then((res)=>res.json())
          .then((data)=>{
            setFiles(data)
          })
          return ()=>{
            console.log('cleaned up')
          }
          
    },[])
  return (
    <div>
      <h1>Your Files</h1>
      <ul>
        {files?files.map((list,key)=>{
                return <div key={key}> 
                <li >{list}</li>
              <a href={`http://192.168.100.7:4000/storage/${list}?action=open`}> <button>Preview</button></a>
              <a href={`http://192.168.100.7:4000/storage/${list}?action=download`}> <button>Download</button></a>                
                </div>
            }):'getting your files.....'}{
            
        }
      </ul>
    </div>
  )
}
