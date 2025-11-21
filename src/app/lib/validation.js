/**
 * Validate and sanitize input strings
 * @param {string} input - Input string to validate
 * @param {Object} options - Validation options
 * @returns {string|null} Sanitized string or null if invalid
 */
export function validateString(input, options = {}) {
  if (typeof input !== 'string') {
    return null;
  }

  const {
    minLength = 0,
    maxLength = 1000,
    allowEmpty = false,
    pattern = null,
  } = options;

  // Trim whitespace
  const trimmed = input.trim();

  if (!allowEmpty && trimmed.length === 0) {
    return null;
  }

  if (trimmed.length < minLength || trimmed.length > maxLength) {
    return null;
  }

  if (pattern && !pattern.test(trimmed)) {
    return null;
  }

  // Basic XSS prevention - escape HTML
  return trimmed.replace(/[<>]/g, '');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {string|null} Validated email or null
 */
export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateString(email, {
    minLength: 3,
    maxLength: 254,
    pattern: emailPattern,
  });
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {string|null} Validated username or null
 */
export function validateUsername(username) {
  return validateString(username, {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9@._-]+$/,
  });
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: 'Password is too long',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId format
 */
export function validateObjectId(id) {
  if (typeof id !== 'string') {
    return false;
  }
  return /^[0-9a-fA-F]{24}$/.test(id);
}

