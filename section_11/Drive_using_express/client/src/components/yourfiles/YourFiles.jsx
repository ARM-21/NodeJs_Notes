import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router";
import DeleteModal from "../delete/DeleteModal";
import RenameModal from "../rename/RenameModal";
import SearchBar from "../SearchBar/searchFile";
import FolderModal from "../NewFolder/FolderModal";

// Importing CSS file
import "./yourfile.css";

export default function YourFiles() {
  const [newFolder, setNewFolder] = useState({ showModal: false });

  // Get values from parent
  const {
    files,
    paths,
    setFiles,
    setDirectoryFiles,
    directoryFiles,
    getDirectoryInfo,
    url,
    handleYes,
    handleNo,
    deleteModalRef,
    deleteModal,
    setDeleteModal,
    setRename,
    isRename,
    renameRef,
  } = useOutletContext();

  const [loadMessage, setLoadMessage] = useState("Getting your files...");

  // New folder modal ref
  const newFolderModalRef = useRef(null);

  // Handle delete modal effect
  useEffect(() => {
    if (deleteModal.showModal && deleteModalRef?.current) {
      deleteModalRef.current.showModal();
    }
  }, [deleteModal.showModal]);

  // Handle file deletion
  useEffect(() => {
    if (deleteModal.deleteFile) {
      console.log("activating delete")
      handleDelete(deleteModal, deleteModal.type);
      setDeleteModal({ showModal: false, deleteFile: false, parentId: "", type: '' });
    }
  }, [deleteModal.deleteFile]);



  // Handle rename modal
  useEffect(() => {
    if (isRename.showModal && renameRef.current) {
      renameRef.current.showModal();
    }
  }, [isRename.showModal]);

  // Handle new folder modal
  useEffect(() => {
    if (newFolder.showModal && newFolderModalRef.current) {
      newFolderModalRef.current.showModal();
    }
  }, [newFolder.showModal]);

  // Delete file
  async function handleDelete(file, type) {
    console.log("Deleting file:", file);
    await fetch(`http://${url}:4000/${type}/${file.filename}?action=delete`, {
      method: "DELETE",
      headers: { dirid: file.parentId },
    });
    getDirectoryInfo(paths.name);
  }

  // Search functionality
  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length > 0) {
      const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(inputValue)
      );
      const directory = directoryFiles.filter((dir) => {
        return dir.name.toLowerCase().includes(inputValue)
      })

      if (filteredFiles.length === 0) {
        setLoadMessage("File Not Found");
      }
      setFiles(filteredFiles);
      setDirectoryFiles(directory)

    } else {
      getDirectoryInfo(paths.name);
    }
  }

  // Close new folder modal
  const closeFolderModal = () => {
    newFolderModalRef.current?.close();
    setNewFolder({ showModal: false });
  };

  return (
    <>
      {/* Render Modals using createPortal */}
      {isRename.showModal &&
        createPortal(
          <RenameModal
            rename={setRename}
            ref={renameRef}
            filename={isRename}
            getDirectoryInfo={getDirectoryInfo}
            url={url}
          />,
          document.getElementById("root")
        )}

      {deleteModal.showModal &&
        createPortal(
          <DeleteModal
            handleNo={handleNo}
            handleYes={handleYes}
            ref={deleteModalRef}
            getDirectoryInfo={getDirectoryInfo}
          />,
          document.getElementById("root")
        )}

      {newFolder.showModal && createPortal(
        <FolderModal
          ref={newFolderModalRef}
          setNewFolderModal={setNewFolder}
          onClose={closeFolderModal}
        />
      ,document.getElementById('root'))}

      {/* File Manager Section */}
      <div className="your-files">
        <SearchBar handleSearch={handleSearch} />

        {/* Create Folder Button */}
        <button
          className="new-folder-btn"
          onClick={() => setNewFolder({ showModal: true })}
        >
          <img src="/folder.svg" alt="folderIcon" />
          Create Folder
        </button>
        <section className="file-folder-merge-section">
        <section className="files-section">
        <h1>Your Files</h1>

        <ul className="file-list">
          {files?.length > 0 ? (
            files.map(({ id, name, extension, parentId }) => (
              <li key={id} className="file-item">
                <p className="file-name">
                  {name.includes(".") ? name : name + extension}
                </p>
                <div className="file-actions">
                  <a href={`http://${url}:4000/file/${id}?action=open`} className="file-btn">
                    <button>Preview</button>
                  </a>
                  <a href={`http://${url}:4000/file/${id}?action=download`} className="file-btn">
                    <button className="download-btn">Download</button>
                  </a>
                  <section className="file-btn">
                    <button className="action-btn delete-btn"
                      onClick={() =>
                        setDeleteModal((prev) => {
                          return {
                            ...prev,
                            showModal: true,
                            filename: id,
                            parentId,
                            type: 'file'
                          }
                        })

                      }
                    >
                      Delete
                    </button>
                  </section>
                  <span className="file-btn">
                    <button className="rename-btn"
                      onClick={() =>
                        setRename({
                          filename: name,
                          id: id,
                          showModal: true,
                          type: "file"
                        })
                      }
                    >
                      Rename
                    </button>
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="loading-text">{loadMessage}</p>
          )}
        </ul>
        </section>

        {/* Folder Section */}
        <section className="folders-section">
          {directoryFiles?.length > 0 && <h1>Your Folders</h1>}
          <ul className="folder-list">
            {directoryFiles?.length > 0 ? (
              directoryFiles.map(({ id, name, parentId }) => (
                <li key={id} className="folder-item">
                  <p className="folder-name">{name}</p>
                  <div className="folder-actions">
                    <a href={`/${id}`} className="folder-btn">
                      <button className="action-btn open-btn">Open</button>
                    </a>
                    <span className="folder-btn">
                      <button className="action-btn delete-btn"
                        onClick={() =>
                          setDeleteModal({
                            showModal: true,
                            filename: id,
                            parentId,
                            type: 'directory'
                          })
                        }
                      >
                        Delete
                      </button>
                    </span>
                    <span className="folder-btn">
                      <button className="action-btn rename-btn"
                        onClick={() =>
                          setRename({
                            filename: name,
                            id: id,
                            showModal: true,
                            type: "directory"
                          })
                        }
                      >
                        Rename
                      </button>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="loading-text">No folder available</p>
            )}
          </ul>
        </section>
        </section>
      </div>

    </>
    
  );
}
