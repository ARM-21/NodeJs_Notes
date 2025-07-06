// Demo scenarios for testing unauthorized access warnings
// These can be used to test the error handling system

export const testUnauthorizedAccess = async (navigate) => {
  const { handleApiError } = await import('../utils/errorHandler');
  
  // Test case 1: Unauthorized user (401)
  const mockResponse401 = {
    status: 401,
    ok: false
  };
  const mockData401 = {
    message: "unauthorized user"
  };
  
  console.log('Testing unauthorized access...');
  await handleApiError(mockResponse401, mockData401, navigate);
};

export const testInvalidId = async () => {
  const { handleApiError } = await import('../utils/errorHandler');
  
  // Test case 2: Invalid ID (401)
  const mockResponse = {
    status: 401,
    ok: false
  };
  const mockData = {
    message: "Invalid Id: 123"
  };
  
  console.log('Testing invalid ID...');
  await handleApiError(mockResponse, mockData);
};

export const testFileNotFound = async () => {
  const { handleApiError } = await import('../utils/errorHandler');
  
  // Test case 3: File not found (401)
  const mockResponse = {
    status: 401,
    ok: false
  };
  const mockData = {
    message: "file doesn't exists"
  };
  
  console.log('Testing file not found...');
  await handleApiError(mockResponse, mockData);
};

export const testFolderNotFound = async () => {
  const { handleApiError } = await import('../utils/errorHandler');
  
  // Test case 4: Folder not found (404)
  const mockResponse = {
    status: 404,
    ok: false
  };
  const mockData = {
    message: "Folder Not Found"
  };
  
  console.log('Testing folder not found...');
  await handleApiError(mockResponse, mockData);
};

export const testNetworkError = async () => {
  const { handleNetworkError } = await import('../utils/errorHandler');
  
  console.log('Testing network error...');
  handleNetworkError(new Error('Network connection failed'));
};

export const testWarning = async () => {
  const { showWarning } = await import('../utils/errorHandler');
  
  console.log('Testing warning message...');
  showWarning('This is a test warning message');
};
