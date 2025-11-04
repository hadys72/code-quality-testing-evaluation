// packages/frontend/src/utils/validation.js

// Email simple et robuste pour l'app (évite les \[ \] et les faux positifs ESLint)
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email || '').trim());
};

export const validatePassword = (password) => {
  const errors = [];
  const value = String(password || '');

  if (value.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(value)) errors.push('Password must contain uppercase');
  if (!/[a-z]/.test(value)) errors.push('Password must contain lowercase');
  if (!/[0-9]/.test(value)) errors.push('Password must contain number');

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUser = (user = {}) => {
  const errors = {};

  if (!user.firstname) errors.firstname = 'First name is required';
  if (!user.lastname) errors.lastname = 'Last name is required';
  if (!user.username) {
    errors.username = 'Username is required';
  } else if (user.username.length < 3) {
    errors.username = 'Username too short';
  }

  if (user.password != null) {
    const passwordValidation = validatePassword(user.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }
  } else {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProduct = (product = {}) => {
  let valid = true;
  const errors = {};

  // Name
  const name = String(product.name || '').trim();
  if (!name) {
    valid = false;
    errors.name = 'Name is required';
  }

  // Price (0 est valide)
  const price = Number(product.price);
  if (Number.isNaN(price)) {
    valid = false;
    errors.price = 'Valid price is required';
  } else if (price < 0) {
    valid = false;
    errors.price = 'Price must be positive';
  }

  // Stock (0 est valide)
  const stock = Number(product.stock);
  if (Number.isNaN(stock)) {
    valid = false;
    errors.stock = ['Stock must be a number'];
  } else if (stock < 0) {
    valid = false;
    errors.stock = ['Stock cannot be negative'];
  }

  return { valid, errors };
};
