import { toast } from 'react-toastify';

/**
 * Handles API response errors and shows appropriate toast notifications
 * @param {Response} response - The fetch response object
 * @param {Object} data - The response data (if available)
 * @param {Function} navigate - React Router navigate function
 * @returns {boolean} - Returns true if error was handled, false if request was successful
 */
export const handleApiError = async (response, data = null, navigate = null) => {
  if (response.ok) {
    return false; // No error
  }

  // Try to get error message from response if data not provided
  if (!data) {
    try {
      data = await response.json();
    } catch (e) {
      data = { message: 'An unexpected error occurred' };
    }
  }

  const errorMessage = data.message || 'An unexpected error occurred';

  switch (response.status) {
    case 401:
      // Unauthorized access
      if (errorMessage.toLowerCase().includes('unauthorized')) {
        toast.error('🚫 Access denied! You don\'t have permission to access this resource.', {
          autoClose: 5000,
          className: 'toast-error-unauthorized'
        });
        
        // Redirect to login if navigate function is provided
        if (navigate) {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else if (errorMessage.toLowerCase().includes('invalid id')) {
        toast.error('⚠️ Invalid file or folder ID. Please check the link and try again.', {
          autoClose: 4000,
          className: 'toast-error-invalid'
        });
      } else if (errorMessage.toLowerCase().includes('file doesn\'t exist') || errorMessage.toLowerCase().includes('file not found')) {
        toast.error('📁 File or folder not found. It may have been deleted or moved.', {
          autoClose: 4000,
          className: 'toast-error-notfound'
        });
      } else {
        toast.error(`🚫 ${errorMessage}`, {
          autoClose: 4000,
          className: 'toast-error-auth'
        });
      }
      break;

    case 403:
      toast.error('🚫 Access forbidden! You don\'t have permission to perform this action.', {
        autoClose: 5000,
        className: 'toast-error-forbidden'
      });
      break;

    case 404:
      if (errorMessage.toLowerCase().includes('folder')) {
        toast.error('📁 Folder not found! It may have been deleted or you don\'t have access to it.', {
          autoClose: 4000,
          className: 'toast-error-notfound'
        });
      } else {
        toast.error('❌ Resource not found. Please check the URL and try again.', {
          autoClose: 4000,
          className: 'toast-error-notfound'
        });
      }
      break;

    case 500:
    case 501:
      toast.error('🔧 Server error occurred. Please try again later.', {
        autoClose: 5000,
        className: 'toast-error-server'
      });
      break;

    default:
      toast.error(`⚠️ ${errorMessage}`, {
        autoClose: 4000,
        className: 'toast-error-general'
      });
  }

  return true; // Error was handled
};

/**
 * Handles network errors (when fetch fails completely)
 * @param {Error} error - The error object
 */
export const handleNetworkError = (error) => {
  console.error('Network error:', error);
  toast.error('🌐 Network error. Please check your connection and try again.', {
    autoClose: 5000,
    className: 'toast-error-network'
  });
};

/**
 * Shows a warning toast for potentially risky actions
 * @param {string} message - The warning message
 */
export const showWarning = (message) => {
  toast.warn(`⚠️ ${message}`, {
    autoClose: 4000,
    className: 'toast-warning'
  });
};

/**
 * Shows a success toast
 * @param {string} message - The success message
 */
export const showSuccess = (message) => {
  toast.success(`✅ ${message}`, {
    autoClose: 3000,
    className: 'toast-success'
  });
};
