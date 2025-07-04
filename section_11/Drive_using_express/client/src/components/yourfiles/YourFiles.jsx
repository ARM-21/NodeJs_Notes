import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext, useNavigate } from "react-router";
import DeleteModal from "../delete/DeleteModal";
import RenameModal from "../rename/RenameModal";
import SearchBar from "../SearchBar/searchFile";
import FolderModal from "../NewFolder/FolderModal";
import styles from "./YourFiles.module.css";

export default function YourFiles() {
  const [newFolder, setNewFolder] = useState({ showModal: false });
  const [loadMessage, setLoadMessage] = useState("Getting your files...");
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Get values from parent with default fallbacks
  const {
    files = [],
    directoryFiles = [],
    getDirectoryInfo,
    handleYes,
    handleNo,
    deleteModalRef,
    deleteModal = { deleteFile: false, showModal: false, filename: '', type: '' },
    setDeleteModal,
    setRename,
    isRename = { filename: '', id: '', showModal: false, type: '' },
    renameRef,
    currentFolder = { name: 'My Files', id: null }
  } = useOutletContext();

  // New folder modal ref
  const newFolderModalRef = useRef(null);

  // Handle delete modal effect
  useEffect(() => {
    if (deleteModal?.showModal && deleteModalRef?.current) {
      deleteModalRef.current.showModal();
    }
  }, [deleteModal?.showModal]);

  // Handle file deletion
  useEffect(() => {
    if (deleteModal?.deleteFile) {
      handleDelete(deleteModal, deleteModal.type);
    }
  }, [deleteModal?.deleteFile]);

  // Handle rename modal effect
  useEffect(() => {
    if (isRename?.showModal && renameRef?.current) {
      renameRef.current.showModal();
    }
  }, [isRename?.showModal]);

  async function handleDelete(fileInfo, type) {
    try {
      const endpoint = type === 'file' ? 'file' : 'directory';
      const response = await fetch(`http://localhost:4000/${endpoint}/${fileInfo._id}?action=delete`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setLoadMessage("File deleted successfully");
        getDirectoryInfo();
      } else {
        setLoadMessage("Error deleting file");
      }
    } catch (error) {
      console.error('Delete error:', error);
      setLoadMessage("Error deleting file");
    }
  }

  function handleFileClick(file) {
    if (!file?._id) {
      console.error('File missing _id:', file);
      return;
    }
    
    if (file.type === 'folder') {
      navigate(`/drive/directory/${file._id}`);
    } else {
      // Handle file preview/download
      window.open(`http://localhost:4000/file/${file._id}`, '_blank');
    }
  }

  function handleContextMenu(e, item, type) {
    e.preventDefault();
    // Show context menu for rename/delete options
    setDeleteModal({
      showModal: true,
      deleteFile: false,
      filename: item.name,
      type: type,
      _id: item._id
    });
  }

  function getFileIcon(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconMap = {
      // Images
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'svg': '🖼️',
      // Documents
      'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📄',
      // Spreadsheets
      'xls': '📊', 'xlsx': '📊', 'csv': '📊',
      // Archives
      'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️',
      // Videos
      'mp4': '🎥', 'avi': '🎥', 'mov': '🎥', 'mkv': '🎥',
      // Audio
      'mp3': '🎵', 'wav': '🎵', 'flac': '🎵',
      // Code
      'js': '💻', 'jsx': '💻', 'ts': '💻', 'tsx': '💻', 'html': '💻', 'css': '💻', 'py': '💻',
    };
    return iconMap[extension] || '📄';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Search functionality
  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    setSearchTerm(inputValue);
  }

  // Filter files based on search term
  const displayFiles = searchTerm ? files.filter(file => 
    file.name.toLowerCase().includes(searchTerm)
  ) : files;
  
  const displayDirectoryFiles = searchTerm ? directoryFiles.filter(dir => 
    dir.name.toLowerCase().includes(searchTerm)
  ) : directoryFiles;

  const hasContent = (displayFiles && displayFiles.length > 0) || (displayDirectoryFiles && displayDirectoryFiles.length > 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{currentFolder?.name || 'My Files'}</h1>
          <span className={styles.count}>
            {(displayFiles?.length || 0) + (displayDirectoryFiles?.length || 0)} items
          </span>
        </div>
        
        <div className={styles.headerRight}>
          <SearchBar handleSearch={handleSearch} />
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {!hasContent ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📁</div>
          <h2 className={styles.emptyTitle}>No files yet</h2>
          <p className={styles.emptyMessage}>
            Upload your first file or create a folder to get started
          </p>
        </div>
      ) : (
        <div className={`${styles.content} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
          {/* Folders */}
          {displayDirectoryFiles.map((folder, index) => (
            <div
              key={`folder-${index}`}
              className={styles.item}
              onClick={() => {
                if (folder?._id) {
                  navigate(`/drive/directory/${folder._id}`);
                } else {
                  console.error('Folder missing _id:', folder);
                }
              }}
              onContextMenu={(e) => handleContextMenu(e, folder, 'folder')}
            >
              <div className={styles.itemIcon}>📁</div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{folder.name}</div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemType}>Folder</span>
                  {viewMode === 'list' && (
                    <span className={styles.itemDate}>
                      {formatDate(folder.createdAt || Date.now())}
                    </span>
                  )}
                </div>
              </div>
              {/* Always show action buttons for mobile users */}
              <div className={styles.itemActions}>
                <button
                  className={`${styles.actionButton} ${styles.openButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (folder?._id) {
                      navigate(`/drive/directory/${folder._id}`);
                    } else {
                      console.error('Folder missing _id:', folder);
                    }
                  }}
                  title="Open"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/>
                  </svg>
                  Open
                </button>
                <button
                  className={`${styles.actionButton} ${styles.renameButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRename({
                      showModal: true,
                      filename: folder.name,
                      id: folder._id,
                      type: 'folder'
                    });
                  }}
                  title="Rename"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Rename
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({
                      showModal: true,
                      deleteFile: false,
                      filename: folder.name,
                      _id: folder._id,
                      type: 'folder'
                    });
                  }}
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Files */}
          {displayFiles.map((file, index) => (
            <div
              key={`file-${index}`}
              className={styles.item}
              onClick={() => handleFileClick(file)}
              onContextMenu={(e) => handleContextMenu(e, file, 'file')}
            >
              <div className={styles.itemIcon}>
                {getFileIcon(file.name)}
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{file.name}</div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemSize}>
                    {formatFileSize(file.size || 0)}
                  </span>
                  {viewMode === 'list' && (
                    <span className={styles.itemDate}>
                      {formatDate(file.createdAt || Date.now())}
                    </span>
                  )}
                </div>
              </div>
              {/* Always show action buttons for mobile users */}
              <div className={styles.itemActions}>
                <button
                  className={`${styles.actionButton} ${styles.previewButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`http://localhost:4000/file/${file._id}?action=open`, '_blank');
                  }}
                  title="Preview"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview
                </button>
                <button
                  className={`${styles.actionButton} ${styles.downloadButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = `http://localhost:4000/file/${file._id}?action=download`;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  title="Download"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </button>
                <button
                  className={`${styles.actionButton} ${styles.renameButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRename({
                      showModal: true,
                      filename: file.name,
                      id: file._id,
                      type: 'file'
                    });
                  }}
                  title="Rename"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Rename
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal({
                      showModal: true,
                      deleteFile: false,
                      filename: file.name,
                      _id: file._id,
                      type: 'file'
                    });
                  }}
                  title="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {deleteModal?.showModal && createPortal(
        <DeleteModal
          ref={deleteModalRef}
          onConfirm={handleYes}
          onCancel={handleNo}
          filename={deleteModal?.filename}
          type={deleteModal?.type}
        />,
        document.getElementById('root')
      )}

      {isRename?.showModal && createPortal(
        <RenameModal
          ref={renameRef}
          filename={isRename}
          rename={setRename}
          getDirectoryInfo={getDirectoryInfo}
          url="localhost"
        />,
        document.getElementById('root')
      )}

      {newFolder?.showModal && createPortal(
        <FolderModal
          ref={newFolderModalRef}
          onClose={() => setNewFolder({ showModal: false })}
          getDirectoryInfo={getDirectoryInfo}
        />,
        document.getElementById('root')
      )}
    </div>
  );
}
