import React from 'react';
import { useNavigate } from 'react-router';
import { 
  testUnauthorizedAccess, 
  testInvalidId, 
  testFileNotFound, 
  testFolderNotFound, 
  testNetworkError, 
  testWarning 
} from '../utils/testErrorHandler';

export default function ErrorTestButtons() {
  const navigate = useNavigate();

  const buttonStyle = {
    margin: '5px',
    padding: '8px 16px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const containerStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
        Error Test Panel
      </div>
      <button 
        style={buttonStyle} 
        onClick={() => testUnauthorizedAccess(navigate)}
      >
        Test Unauthorized
      </button>
      <button 
        style={buttonStyle} 
        onClick={testInvalidId}
      >
        Test Invalid ID
      </button>
      <button 
        style={buttonStyle} 
        onClick={testFileNotFound}
      >
        Test File Not Found
      </button>
      <button 
        style={buttonStyle} 
        onClick={testFolderNotFound}
      >
        Test Folder Not Found
      </button>
      <button 
        style={buttonStyle} 
        onClick={testNetworkError}
      >
        Test Network Error
      </button>
      <button 
        style={buttonStyle} 
        onClick={testWarning}
      >
        Test Warning
      </button>
    </div>
  );
}
