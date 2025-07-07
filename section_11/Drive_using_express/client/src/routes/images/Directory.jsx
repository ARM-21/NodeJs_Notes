import React, { useEffect, useRef, useState } from 'react';
import styles from './Directory.module.css'; // Importing CSS file
import { useNavigate, useOutletContext, useParams } from 'react-router';
import RenameModal from '../../components/rename/RenameModal';
import DeleteModal from '../../components/delete/DeleteModal';
import { createPortal } from 'react-dom';
import FolderModal from '../../components/NewFolder/FolderModal';

export default function Directory() {
  const { 
    files, 
    directoryFiles,
    setDirectoryFiles,
    setFiles,
    deleteModal, 
    setDeleteModal,
    handleYes, 
    handleNo,
    deleteModalRef, 
    setRename, 
    renameRef, 
    isRename, 
    url, 
    closeFolderModal, 
    newFolderModalRef, 
    newFolder, 
    setNewFolder,
    currentFolder = { name: 'Directory', id: null },
    setCurrentFolder,
    getDirectoryInfo
  } = useOutletContext();

  const [load, setLoad] = useState("Loading...");
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const loadedDirRef = useRef(null);
  
  const navigator = useNavigate();
  const params = useParams();

  // Simple direct API call - no dependencies, no useCallback
  const fetchDirectoryData = async (dirId) => {
    try {
      const response = await fetch(`http://${url}:4000/directory/${dirId}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files);
        setDirectoryFiles(data.folders);
        setCurrentFolder({ name: data.name || 'Folder', id: dirId });
      } else {
        console.error('Error fetching directory:', data.message);
        if (response.status === 401) {
          navigator('/login');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  useEffect(() => {
    if (params.id && params.id !== loadedDirRef.current) {
      loadedDirRef.current = params.id;
      fetchDirectoryData(params.id);
    }
  }, [params.id]); // Only depend on params.id

  useEffect(() => {
    if (!directoryFiles.files) {
      setLoad('No Files Available');
    }
  }, [directoryFiles.files]);
  
  //useEffects for handling side effects
  useEffect(() => {
    if (deleteModal.showModal && deleteModalRef?.current) {
      deleteModalRef.current.showModal();
    }
  }, [deleteModal.showModal]);

  useEffect(() => {
    if (renameRef.current && isRename.showModal) {
      renameRef.current.showModal()
    }
  }, [isRename.showModal]) // Removed renameRef from dependency array

  // Filter files and directories based on search term
  const filteredFiles = files?.filter(file => 
    file.name.toLowerCase().includes(localSearchTerm.toLowerCase())
  ) || [];
  
  const filteredDirectories = directoryFiles?.filter(dir => 
    dir.name.toLowerCase().includes(localSearchTerm.toLowerCase())
  ) || [];

  const hasContent = (filteredFiles && filteredFiles.length > 0) || (filteredDirectories && filteredDirectories.length > 0);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get file icon based on extension
  const getFileIcon = (fileName) => {
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
  };

  // Get file extension color
  const getFileExtensionColor = (fileName) => {
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
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      {/* Modals */}
      {deleteModal.showModal &&
        createPortal(
          <DeleteModal
            onCancel={handleNo}
            onConfirm={handleYes}
            filename={deleteModal.filename}
            ref={deleteModalRef}
          />,
          document.getElementById("root")
        )}
      {isRename.showModal &&
        createPortal(
          <RenameModal
            rename={setRename}
            ref={renameRef}
            filename={isRename}
            url={url}
            getDirectoryInfo={getDirectoryInfo}
            currentDirectoryId={params.id}
          />,
          document.getElementById("root")
        )}
      {newFolder.showModal && 
        createPortal(
          <FolderModal
            ref={newFolderModalRef}
            setNewFolderModal={setNewFolder}
            onClose={closeFolderModal}
            getDirectoryInfo={getDirectoryInfo}
            currentFolder={currentFolder}
          />,
          document.getElementById("root")
        )}

      {/* Back Button */}
      <div className={styles.backSection}>
        <button
          className={styles.backButton}
          onClick={() => navigator(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
          Back
        </button>
      </div>

      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbItem}
          onClick={() => navigator('/drive')}
        >
          🏠 Home
        </button>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {currentFolder?.name || 'Directory'}
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
          <h1 className={styles.title}>{currentFolder?.name || 'Directory'}</h1>
          <h2 className={styles.sectionTitle}>Files & Folders</h2>
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
            {filteredDirectories.map((folder, index) => {
              const { _id: id, name, parentId } = folder;
              const uniqueKey = id || `folder-${index}`;
              return (
                <div
                  key={uniqueKey}
                  className={styles.item}
                  onClick={() => {
                    if (id) {
                      navigator(`/drive/directory/${id}`);
                    }
                  }}
                >
                  <div className={styles.itemIcon}>📁</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName} title={name}>
                      {name}
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
                  <div className={styles.itemActions}>
                    <button
                      className={`${styles.actionButton} ${styles.openButton}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (id) {
                          navigator(`/drive/directory/${id}`);
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
                        e.preventDefault();
                        e.stopPropagation();
                        setRename({
                          showModal: true,
                          filename: name,
                          id: id,
                          type: 'folder'
                        });
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
                          filename: name,
                          _id: id,
                          type: 'folder',
                          parentId: parentId
                        });
                      }}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6l-2,14a2,2 0 0 1-2,2H9a2,2 0 0 1-2-2L5,6"/>
                        <path d="M10,11v6"/>
                        <path d="M14,11v6"/>
                        <path d="M5,6l1,-5h12l1,5"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Files */}
            {filteredFiles.map((file, index) => {
              const { _id: id, name, extension, parentId, size, createdAt } = file;
              const uniqueKey = id || `file-${index}`;
              const displayName = name.includes(".") ? name : name + extension;
              const fileExtension = displayName.split('.').pop()?.toLowerCase() || 'file';
              const extensionColor = getFileExtensionColor(displayName);
              
              return (
                <div
                  key={uniqueKey}
                  className={styles.item}
                >
                  <div className={styles.itemIcon}>{getFileIcon(displayName)}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName} title={displayName}>
                      {displayName}
                    </div>
                    <div className={styles.itemMeta}>
                      <span 
                        className={styles.itemType}
                        style={{ 
                          color: extensionColor,
                          backgroundColor: `${extensionColor}15`,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          border: `1px solid ${extensionColor}30`
                        }}
                      >
                        {fileExtension}
                      </span>
                      {size && (
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
                          {formatFileSize(size)}
                        </span>
                      )}
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
                          {formatDate(createdAt || Date.now())}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={`${styles.actionButton} ${styles.previewButton}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`http://${url}:4000/file/${id}?action=open`, '_blank');
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
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`http://${url}:4000/file/${id}?action=download`, '_blank');
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
                          filename: name,
                          id: id,
                          type: 'file'
                        });
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
                          filename: displayName,
                          _id: id,
                          type: 'file',
                          parentId: parentId
                        });
                      }}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6l-2,14a2,2 0 0 1-2,2H9a2,2 0 0 1-2-2L5,6"/>
                        <path d="M10,11v6"/>
                        <path d="M14,11v6"/>
                        <path d="M5,6l1,-5h12l1,5"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
