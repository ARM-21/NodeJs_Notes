import React, { useEffect, useState } from 'react';
// Importing CSS file

export default function YourFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch('http://192.168.100.7:4000')
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      });
    return () => {
      console.log('cleaned up');
    };
  }, []);

  return (
    <div className='your-files'>
      <h1>Your Files</h1>
      <ul className='file-list'>
        {files.length > 0 ? (
          files.map((list, key) => (
            <div key={key} className='file-item'>
              <p className='file-name'>{list}</p>
              <div className='file-actions'>
                {list === 'images' ? (
                  <>
                    <a href={`/images`} className='file-btn'> <button>Preview</button></a>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a> 
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=delete`} className='file-btn'> <button>Delete</button></a> 
                  </>
                ) : (
                  <>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=open`} className='file-btn'> <button>Preview</button></a>
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=download`} className='file-btn'> <button>Download</button></a>   
                    <a href={`http://192.168.100.7:4000/storage/${list}?action=delete`} className='file-btn'> <button>Delete</button></a>   
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='loading-text'>Getting your files...</p>
        )}
      </ul>
    </div>
  );
}
