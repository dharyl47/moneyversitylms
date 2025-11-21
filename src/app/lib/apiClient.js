import { getAuthHeader, clearSession } from './authSession';

/**
 * Make an authenticated API request
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const authHeader = getAuthHeader();
  
  if (!authHeader) {
    // No token available, clear session
    clearSession();
    throw new Error('Not authenticated');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': authHeader,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear session
  if (response.status === 401) {
    clearSession();
    // Redirect to login would be handled by the component
  }

  return response;
}

