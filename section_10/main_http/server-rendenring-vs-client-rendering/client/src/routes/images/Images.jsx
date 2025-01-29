import React, { useEffect, useState } from 'react';
import './images.css'; // Importing CSS file

export default function Images() {
    const [imagesFile, setImagesFile] = useState([]);
    
    useEffect(() => {
        fetch('http://192.168.100.7:4000/storage/images?action=open')
            .then((res) => res.json())
            .then((data) => {
                setImagesFile(data);
                console.log(data);
            });
    }, []);

    return (
        <div className='images-container'>
            <h1>Image Gallery</h1>
            <ul className='images-list'>
                {imagesFile.length > 0 ? (
                    imagesFile.map((list, key) => (
                        <li key={key} className='image-item'>
                            <p className='image-name'>{list}</p>
                            <div className='image-actions'>
                                <a href={`http://192.168.100.7:4000/storage/images/${list}?action=open`} className='image-btn'> <button>Preview</button></a>
                                <a href={`http://192.168.100.7:4000/storage/images/${list}?action=download`} className='image-btn'> <button>Download</button></a>  
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
