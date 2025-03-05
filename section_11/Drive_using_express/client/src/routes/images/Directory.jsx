import React, { useEffect, useState } from 'react';
import './images.css'; // Importing CSS file
import { Link, useOutletContext, useParams } from 'react-router';
import RenameModal from '../../components/rename/RenameModal';
import DeleteModal from '../../components/delete/DeleteModal';
import { createPortal } from 'react-dom';

export default function Directory() {
const {directoryFiles,setDirectoryFiles,getData,deleteModal,setDeleteModal,handleYes,handleNo,deleteModalRef,getDirectoryInfo,setRename,renameRef,isRename,url}= useOutletContext()
console.log("from directory",useOutletContext())
const [load,setLoad] = useState("Loading...");
    const params = useParams()
    useEffect(() => {
        getData(params)
    }, []);
    //useEffectes for handling side effects
      useEffect(() => {
        if (deleteModalRef && deleteModal.showModal) {
          deleteModalRef.current.showModal()
        }
        return () => {
          console.log('cleaned up');
        };
      }, [deleteModal.showModal]);
    
      useEffect(() => {
        if (deleteModal.deleteFile) {
          console.log('deleting file', deleteModal.filename)
          handleDelete(deleteModal.filename)
        }
        setDeleteModal((prev) => { return { ...prev, showModal: false, deleteFile: false } })
      }, [deleteModal.deleteFile])
    
      useEffect(() => {
        if (renameRef.current && isRename.showModal) {
          renameRef.current.showModal()
        }
      }, [isRename.showModal, renameRef])

       //alternative way to create delete 
  async function handleDelete(list) {
    console.log("filename", list)
    const response = await fetch(`http://${url}:4000/files/${params.name}${params['*']?"/"+params['*']:""}/${list}?action=delete`, {
      method: 'DELETE',
      // headers: { filename: list }
    })
    getDirectoryInfo()
    getData(params)

  }
  function handleSearch(e) {
    const inputValue = e.target.value;
    console.log(inputValue)
    // setSearch(e.target.value)
    if (inputValue.length >= 1) {
      const filteredFiles = directoryFiles.filter((file) => {
        return file.name.toLowerCase().includes(inputValue.toLowerCase())
      })
      console.log('from inside', filteredFiles)
      if (filteredFiles.length == 0) {
        setLoad('File Not Found')
      }
      setDirectoryFiles(filteredFiles)
    }
    else {
      // setFiles( files)
      getData(params)
    }

  }
    return (
        isRename.showModal ?
      createPortal(<RenameModal rename={setRename} ref={renameRef} filename={isRename.filename} getDirectoryInfo={getDirectoryInfo} getData={getData} url={url} params={params}/>,
        document.getElementById('root')) :
        deleteModal.showModal ?
        createPortal(<DeleteModal handleNo={handleNo} handleYes={handleYes} ref={deleteModalRef} getDirectoryInfo={getDirectoryInfo} />,
          document.getElementById('root'))
        :
        <div className='images-container'>
        <div className='your-files' style={{ display: 'flex', flexDirection: 'column' }}>
        <input type='text' placeholder='Enter Name for Search' onChange={(e) => { handleSearch(e) }} style={{ marginInline: 'auto', padding: '5px 2px 2px 8px', borderRadius: '5px' }} />
        </div>
            <h1>Image Gallery</h1>
            
            <ul className='images-list'>
                {directoryFiles.length >= 0 ? (
                    directoryFiles.map((list, key) => (
                        <li key={key} className='image-item'>
                            <p className='image-name'>{list.name}</p>
                            <div className='image-actions'>
                                {/* <Link to={`${list.name}`}>Preview</Link> */}
                                {list.isDirectory ?
                                    <a href={`/${params.name}/${list.name}`} className='image-btn'> <button>Preview</button></a>


                                    :
                                    <a href={`http://192.168.100.7:4000/files/${params.name}${params.paths ? `/${params.paths}` : ''}/${list.name}?action=open`} className='image-btn'> <button>Preview</button></a>

                                }
                                {
                                    !list.isDirectory && <a href={`http://192.168.100.7:4000/files/${params.name}${params.paths ? `/${params.paths}` : ''}/${list.name}?action=download`} className='image-btn'> <button>Download</button></a>

                                }
                                <a onClick={() => {
                          setRename((prev) => {
                            return { filename: list.name, showModal: true }
                          }) }}className='image-btn'> <button>Rename</button></a>
                                <a onClick={() => { setDeleteModal((prev) => { return { ...prev, showModal: true, filename: list.name } }) }} className='image-btn'> <button>Delete</button></a>

                            </div>
                        </li>
                    ))
                ) : (
                    <p className='loading-text'>{load}</p>
                )}
            </ul>
        </div>
    );
}
