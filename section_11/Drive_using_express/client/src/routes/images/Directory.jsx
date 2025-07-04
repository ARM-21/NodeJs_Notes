import React, { useEffect, useState } from 'react';
import styles from './Directory.module.css';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import RenameModal from '../../components/rename/RenameModal';
import DeleteModal from '../../components/delete/DeleteModal';
import SearchBar from '../../components/SearchBar/searchFile';
import { createPortal } from 'react-dom';
import FolderModal from '../../components/NewFolder/FolderModal';
import { toast } from 'react-toastify';

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
    getDirectoryInfo, 
    setRename, 
    renameRef, 
    isRename, 
    url, 
    closeFolderModal, 
    newFolderModalRef, 
    newFolder, 
    setNewFolder 
  } = useOutletContext();
  
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const navigator = useNavigate();
  const params = useParams();

  // Build breadcrumb path from current folder
  useEffect(() => {
    const buildBreadcrumbs = async () => {
      if (!params.id) {
        setBreadcrumbs([{ name: 'My Files', id: null }]);
        return;
      }

      try {
        const response = await fetch(`http://${url}:4000/directory/${params.id}/breadcrumbs`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setBreadcrumbs(data.breadcrumbs || [{ name: 'My Files', id: null }]);
        } else {
          // Fallback: create simple breadcrumb
          setBreadcrumbs([
            { name: 'My Files', id: null },
            { name: 'Current Folder', id: params.id }
          ]);
        }
      } catch (error) {
        console.error('Error fetching breadcrumbs:', error);
        // Fallback: create simple breadcrumb
        setBreadcrumbs([
          { name: 'My Files', id: null },
          { name: 'Current Folder', id: params.id }
        ]);
      }
    };

    buildBreadcrumbs();
  }, [params.id, url]);

  // Only handle modal effects, don't make API calls since Home.jsx handles this
  useEffect(() => {
    if (deleteModal?.showModal && deleteModalRef?.current) {
      deleteModalRef.current.showModal();
    }
  }, [deleteModal?.showModal]);

  useEffect(() => {
    if (isRename?.showModal && renameRef?.current) {
      renameRef.current.showModal();
    }
  }, [isRename?.showModal]);

  async function handleDelete(list, type) {
    try {
      const response = await fetch(`http://${url}:4000/${type}/${list._id}?action=delete`, {
        method: 'DELETE',
        headers: { dirid: list.parentId },
        credentials: 'include'
      });
      
      if (response.status === 401) {
        navigator('/login');
        return;
      }
      
      if (response.ok) {
        toast.success(`${type === 'file' ? 'File' : 'Folder'} deleted successfully`);
        getDirectoryInfo(params.id);
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
      console.error('Delete error:', error);
    }
  }

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length > 0) {
      const originalFiles = files;
      const originalDirectories = directoryFiles;
      
      const filteredFiles = originalFiles.filter((file) =>
        file.name.toLowerCase().includes(inputValue)
      );
      const filteredDirectories = originalDirectories.filter((dir) =>
        dir.name.toLowerCase().includes(inputValue)
      );

      if (filteredFiles.length === 0 && filteredDirectories.length === 0) {
        setLoadingMessage("No matching items found");
      } else {
        setLoadingMessage("Loading...");
      }
      
      setFiles(filteredFiles);
      setDirectoryFiles(filteredDirectories);
    } else {
      // Reset search - reload data
      setLoadingMessage("Loading...");
      getDirectoryInfo(params.id);
    }
  }

  return (
    <div className={styles.container}>
      {/* Modals */}
      {deleteModal?.showModal &&
        createPortal(
          <DeleteModal
            onCancel={handleNo}
            onConfirm={handleYes}
            ref={deleteModalRef}
            filename={deleteModal?.filename}
            type={deleteModal?.type}
          />,
          document.getElementById("root")
        )}
      {isRename?.showModal &&
        createPortal(
          <RenameModal
            rename={setRename}
            ref={renameRef}
            filename={isRename}
            getDirectoryInfo={() => getDirectoryInfo(params.id)}
            url={url}
          />,
          document.getElementById("root")
        )}
      {newFolder?.showModal && 
        createPortal(
          <FolderModal
            ref={newFolderModalRef}
            onClose={closeFolderModal}
            getDirectoryInfo={() => getDirectoryInfo(params.id)}
          />,
          document.getElementById("root")
        )}

      {/* Search Section */}
      <div className={styles.searchSection}>
        <SearchBar handleSearch={handleSearch} />
      </div>

      {/* Breadcrumb Navigation */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.navigationControls}>
          <button
            className={styles.backButton}
            onClick={() => {
              if (breadcrumbs.length > 1) {
                const parentCrumb = breadcrumbs[breadcrumbs.length - 2];
                if (parentCrumb.id) {
                  navigator(`/drive/directory/${parentCrumb.id}`);
                } else {
                  navigator('/drive');
                }
              } else {
                navigator('/drive');
              }
            }}
          >
            <svg className={styles.backIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <nav className={styles.breadcrumbNav}>
            <svg className={styles.breadcrumbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <ol className={styles.breadcrumbList}>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.id || 'root'} className={styles.breadcrumbItem}>
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <button
                        className={styles.breadcrumbLink}
                        onClick={() => {
                          if (crumb.id) {
                            navigator(`/drive/directory/${crumb.id}`);
                          } else {
                            navigator('/drive');
                          }
                        }}
                      >
                        {crumb.name}
                      </button>
                      <svg className={styles.breadcrumbSeparator} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {/* Files Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h2 className={styles.sectionTitle}>Files</h2>
          </div>
          {files?.length > 0 ? (
            <ul className={styles.itemList}>
              {files.map(({ _id: id, name, extension, parentId }) => (
                <li key={id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className={styles.itemName}>
                      {name.includes(".") ? name : name + extension}
                    </p>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      className={`${styles.actionButton} ${styles.previewButton}`}
                      onClick={() => {
                        setIsProcessing(true);
                        // Use a direct link that opens in the same tab
                        window.location.href = `http://${url}:4000/file/${id}?action=open`;
                      }}
                      disabled={isProcessing}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      {isProcessing ? 'Opening...' : 'Preview'}
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.downloadButton}`}
                      onClick={() => {
                        setIsProcessing(true);
                        // Download should create a link and click it
                        const link = document.createElement('a');
                        link.href = `http://${url}:4000/file/${id}?action=download`;
                        link.download = name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => setIsProcessing(false), 1000);
                      }}
                      disabled={isProcessing}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      {isProcessing ? 'Downloading...' : 'Download'}
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.renameButton}`}
                      onClick={() =>
                        setRename(prev => ({ 
                          ...prev,
                          filename: name,
                          id: id,
                          showModal: true,
                          type: "file"
                        }))
                      }
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Rename
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() =>
                        setDeleteModal((prev) => ({
                          ...prev,
                          showModal: true,
                          filename: name, // Pass the actual name for display
                          id: id, // Pass the id for deletion
                          type: 'file',
                          parentId,
                        }))
                      }
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
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className={styles.emptyTitle}>No Files</h3>
              <p className={styles.emptyDescription}>{loadingMessage}</p>
            </div>
          )}
        </div>

        {/* Folders Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <svg className={styles.sectionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h2 className={styles.sectionTitle}>Folders</h2>
          </div>
          {directoryFiles?.length > 0 ? (
            <ul className={styles.itemList}>
              {directoryFiles.map(({ _id: id, name, parentId }) => (
                <li key={id} className={styles.itemCard}>
                  <div className={styles.itemInfo}>
                    <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <p className={styles.itemName}>{name}</p>
                  </div>
                  <div className={styles.itemActions}>
                    <button 
                      className={`${styles.actionButton} ${styles.openButton}`}
                      onClick={() => navigator(`/drive/directory/${id}`)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z"/>
                      </svg>
                      Open
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.renameButton}`}
                      onClick={() => setRename((prev) => ({
                        ...prev,
                        filename: name,
                        id: id,
                        showModal: true,
                        type: "directory"
                      }))}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Rename
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => setDeleteModal((prev) => ({
                        ...prev, 
                        showModal: true, 
                        filename: name, // Pass the actual name for display
                        id: id, // Pass the id for deletion
                        parentId,
                        type: 'directory' 
                      }))}
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
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h3 className={styles.emptyTitle}>No Folders</h3>
              <p className={styles.emptyDescription}>No folders available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
