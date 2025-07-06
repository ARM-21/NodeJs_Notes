import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useOutletContext, useNavigate } from "react-router";
import DeleteModal from "../delete/DeleteModal";
import RenameModal from "../rename/RenameModal";
import FolderModal from "../NewFolder/FolderModal";
import styles from "./YourFiles.module.css";
import { handleApiError, handleNetworkError, showSuccess } from "../../utils/errorHandler";

export default function YourFiles() {
  const [newFolder, setNewFolder] = useState({ showModal: false });
  const [loadMessage, setLoadMessage] = useState("Getting your files...");
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const navigate = useNavigate();

  // Get values from parent with default fallbacks
  const {
    files = [],
    directoryFiles = [],
    setFiles,
    setDirectoryFiles,
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
  }, [deleteModal?.deleteFile]);  // Filter files and directories based on search term
  const filteredFiles = localSearchTerm 
    ? files?.filter(file => file.name.toLowerCase().includes(localSearchTerm.toLowerCase())) || []
    : files || [];
    
  const filteredDirectories = localSearchTerm 
    ? directoryFiles?.filter(dir => dir.name.toLowerCase().includes(localSearchTerm.toLowerCase())) || []
    : directoryFiles || [];

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

      const data = await response.json();
      
      // Handle API errors using the utility function
      const hasError = await handleApiError(response, data, navigate);
      if (hasError) {
        return;
      }

      showSuccess(`${type === 'file' ? 'File' : 'Folder'} deleted successfully`);
      getDirectoryInfo();
    } catch (error) {
      handleNetworkError(error);
    }
  }

  async function handleFileClick(file) {
    if (!file?._id) {
      console.error('File missing _id:', file);
      return;
    }
    
    if (file.type === 'folder') {
      navigate(`/drive/directory/${file._id}`);
    } else {
      // Handle file preview/download with error handling
      try {
        const response = await fetch(`http://localhost:4000/file/${file._id}`, {
          method: 'HEAD', // Check if file is accessible before opening
          credentials: 'include'
        });
        
        if (response.ok) {
          window.open(`http://localhost:4000/file/${file._id}`, '_blank');
        } else {
          // Handle unauthorized access or other errors
          const data = { message: 'Unable to access file' };
          await handleApiError(response, data, navigate);
        }
      } catch (error) {
        handleNetworkError(error);
      }
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
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'svg': '🖼️', 'webp': '🖼️',
      // Documents
      'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📄', 'rtf': '📄',
      // Spreadsheets
      'xls': '📊', 'xlsx': '📊', 'csv': '📊',
      // Presentations
      'ppt': '📊', 'pptx': '📊',
      // Archives
      'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️', 'tar': '🗜️', 'gz': '🗜️',
      // Videos
      'mp4': '🎥', 'avi': '🎥', 'mov': '🎥', 'mkv': '🎥', 'wmv': '🎥', 'flv': '🎥',
      // Audio
      'mp3': '🎵', 'wav': '🎵', 'flac': '🎵', 'aac': '🎵', 'ogg': '🎵',
      // Code
      'js': '💻', 'jsx': '💻', 'ts': '💻', 'tsx': '💻', 'html': '💻', 'css': '💻', 'py': '💻', 'java': '💻', 'cpp': '💻', 'c': '💻',
      // Others
      'exe': '⚙️', 'msi': '⚙️', 'deb': '⚙️', 'rpm': '⚙️',
    };
    return iconMap[extension] || '📄';
  }

  // Get file extension color
  function getFileExtensionColor(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const colorMap = {
      // Images - Blue tones
      'jpg': '#3B82F6', 'jpeg': '#3B82F6', 'png': '#3B82F6', 'gif': '#3B82F6', 'svg': '#3B82F6', 'webp': '#3B82F6',
      // Documents - Green tones
      'pdf': '#10B981', 'doc': '#10B981', 'docx': '#10B981', 'txt': '#10B981', 'rtf': '#10B981',
      // Spreadsheets - Yellow tones
      'xls': '#F59E0B', 'xlsx': '#F59E0B', 'csv': '#F59E0B',
      // Presentations - Orange tones
      'ppt': '#F97316', 'pptx': '#F97316',
      // Archives - Purple tones
      'zip': '#8B5CF6', 'rar': '#8B5CF6', '7z': '#8B5CF6', 'tar': '#8B5CF6', 'gz': '#8B5CF6',
      // Videos - Red tones
      'mp4': '#EF4444', 'avi': '#EF4444', 'mov': '#EF4444', 'mkv': '#EF4444', 'wmv': '#EF4444', 'flv': '#EF4444',
      // Audio - Pink tones
      'mp3': '#EC4899', 'wav': '#EC4899', 'flac': '#EC4899', 'aac': '#EC4899', 'ogg': '#EC4899',
      // Code - Cyan tones
      'js': '#06B6D4', 'jsx': '#06B6D4', 'ts': '#06B6D4', 'tsx': '#06B6D4', 'html': '#06B6D4', 'css': '#06B6D4', 'py': '#06B6D4', 'java': '#06B6D4', 'cpp': '#06B6D4', 'c': '#06B6D4',
      // Others - Gray tones
      'exe': '#6B7280', 'msi': '#6B7280', 'deb': '#6B7280', 'rpm': '#6B7280',
    };
    return colorMap[extension] || '#6B7280';
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

  // Filter files based on search term from navbar context
  const displayFiles = files;
  const displayDirectoryFiles = directoryFiles;

  const hasContent = (filteredFiles && filteredFiles.length > 0) || (filteredDirectories && filteredDirectories.length > 0);

  return (
    <div className={styles.container}>
    

      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbItem}
          onClick={() => navigate('/drive')}
        >
          🏠 Home
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {currentFolder?.name || 'My Files'}
        </span>
      </nav>

      {/* Search and Controls Section */}
      <div className={styles.contentHeader}>
        <div className={styles.searchSection}>
          <h2 className={styles.sectionTitle}>Search & Filter</h2>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search files and folders..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <div className={styles.searchIcon}>🔍</div>
          </div>
        </div>
        
        <div className={styles.viewControls}>
          <h3 className={styles.viewLabel}>View Options</h3>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Grid
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              List
            </button>
          </div>
        </div>
      </div>

    

      {/* Files and Folders Content */}
      <div className={styles.filesSection}>
        <div className={styles.sectionHeader}>
          {/* Current Folder Name */}
      {/* <div className={styles.folderName}> */}
       
      {/* </div> */}
       <h1 className={styles.title}>{currentFolder?.name || 'My Files'}</h1>
          <h2 className={styles.sectionTitle}>  
          Files & Folders</h2>
          <span className={styles.itemCount}>
            {(filteredFiles?.length || 0) + (filteredDirectories?.length || 0)} items
          </span>
        </div>

        {!hasContent ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              {localSearchTerm ? '🔍' : '🎒'}
            </div>
            <h2 className={styles.emptyTitle}>
              {localSearchTerm ? 'No matching files found' : 'Your jhola is empty'}
            </h2>
            <p className={styles.emptyMessage}>
              {localSearchTerm 
                ? `No files or folders match "${localSearchTerm}". Try a different search term.`
                : 'Start filling your digital jhola by uploading files or creating folders'
              }
            </p>
            {localSearchTerm && (
              <button 
                className={styles.clearSearchButton}
                onClick={() => setLocalSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={`${styles.content} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
            {/* Folders */}
            {filteredDirectories.map((folder, index) => (
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
                  <div className={styles.itemName} title={folder.name}>
                    {folder.name}
                  </div>
                  <div className={styles.itemMeta}>
                    <span 
                      className={styles.itemType}
                      style={{ 
                        color: '#F59E0B',
                        backgroundColor: '#F59E0B15',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        border: '1px solid #F59E0B30'
                      }}
                    >
                      Folder
                    </span>
                    {viewMode === 'list' && (
                      <span 
                        className={styles.itemDate}
                        style={{ 
                          color: '#8B5CF6',
                          backgroundColor: '#8B5CF615',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          border: '1px solid #8B5CF630'
                        }}
                      >
                        {formatDate(folder.createdAt || Date.now())}
                      </span>
                    )}
                  </div>
                </div>
                {/* Action buttons positioned better for list view */}
                <div className={styles.itemActions}>
                  <button
                    className={`${styles.actionButton} ${styles.openButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (folder?._id) {
                        navigate(`/drive/directory/${folder._id}`);
                      } else {
                        console.error('Folder missing _id:', folder);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
                      e.preventDefault();
                      e.stopPropagation();
                      setRename({
                        showModal: true,
                        filename: folder.name,
                        id: folder._id,
                        type: 'folder'
                      });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    title="Rename"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Rename
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteModal({
                        showModal: true,
                        deleteFile: false,
                        filename: folder.name,
                        _id: folder._id,
                        type: 'folder'
                      });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
            {filteredFiles.map((file, index) => (
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
                  <div className={styles.itemName} title={file.name}>
                    {file.name}
                  </div>
                  <div className={styles.itemMeta}>
                    <span 
                      className={styles.itemType}
                      style={{ 
                        color: getFileExtensionColor(file.name),
                        backgroundColor: `${getFileExtensionColor(file.name)}15`,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        border: `1px solid ${getFileExtensionColor(file.name)}30`
                      }}
                    >
                      {file.name.split('.').pop()?.toLowerCase() || 'file'}
                    </span>
                    <span 
                      className={styles.itemSize}
                      style={{ 
                        color: '#10B981',
                        backgroundColor: '#10B98115',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        border: '1px solid #10B98130'
                      }}
                    >
                      {formatFileSize(file.size || 0)}
                    </span>
                    {viewMode === 'list' && (
                      <span 
                        className={styles.itemDate}
                        style={{ 
                          color: '#8B5CF6',
                          backgroundColor: '#8B5CF615',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          border: '1px solid #8B5CF630'
                        }}
                      >
                        {formatDate(file.createdAt || Date.now())}
                      </span>
                    )}
                  </div>
                </div>
                {/* Action buttons positioned better for list view */}
                <div className={styles.itemActions}>
                  <button
                    className={`${styles.actionButton} ${styles.previewButton}`}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        const response = await fetch(`http://localhost:4000/file/${file._id}?action=open`, {
                          method: 'HEAD',
                          credentials: 'include'
                        });
                        
                        if (response.ok) {
                          window.open(`http://localhost:4000/file/${file._id}?action=open`, '_blank');
                        } else {
                          const data = { message: 'Unable to preview file' };
                          await handleApiError(response, data, navigate);
                        }
                      } catch (error) {
                        handleNetworkError(error);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      try {
                        const response = await fetch(`http://localhost:4000/file/${file._id}?action=download`, {
                          method: 'HEAD',
                          credentials: 'include'
                        });
                        
                        if (response.ok) {
                          const link = document.createElement('a');
                          link.href = `http://localhost:4000/file/${file._id}?action=download`;
                          link.download = file.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          const data = { message: 'Unable to download file' };
                          await handleApiError(response, data, navigate);
                        }
                      } catch (error) {
                        handleNetworkError(error);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
                      e.preventDefault();
                      e.stopPropagation();
                      setRename({
                        showModal: true,
                        filename: file.name,
                        id: file._id,
                        type: 'file'
                      });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    title="Rename"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Rename
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDeleteModal({
                        showModal: true,
                        deleteFile: false,
                        filename: file.name,
                        _id: file._id,
                        type: 'file'
                      });
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
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
      </div>

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
          currentDirectoryId=""
          url="localhost"
        />,
        document.getElementById('root')
      )}

      {newFolder?.showModal && createPortal(
        <FolderModal
          ref={newFolderModalRef}
          onClose={() => setNewFolder({ showModal: false })}
          getDirectoryInfo={getDirectoryInfo}
          currentFolder={currentFolder}
        />,
        document.getElementById('root')
      )}
    </div>
  );
}
