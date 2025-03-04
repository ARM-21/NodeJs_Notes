import React, { useEffect, useState } from 'react';
import './images.css'; // Importing CSS file
import { Link, useOutletContext, useParams } from 'react-router';

export default function Directory() {
const {directoryFiles:imagesFile,getData}= useOutletContext()
console.log("from directory",useOutletContext())
    const params = useParams()

    
  
   

    useEffect(() => {
        params.paths = params['*'];
        getData(params)
    }, []);

    return (
        <div className='images-container'>
            <h1>Image Gallery</h1>
            <ul className='images-list'>
                {imagesFile.length >= 0 ? (
                    imagesFile.map((list, key) => (
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
                                <a href={`http://192.168.100.7:4000/files/${params.name}${params.paths ? `/${params.paths}` : ''}/${list.name}?action=open`} className='image-btn'> <button>Rename</button></a>

                            </div>
                        </li>
                    ))
                ) : (
                    <p className='loading-text'>Loading...</p>
                )}
            </ul>
        </div>
    );
}
