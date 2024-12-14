import crypto from 'crypto';

// Generate secure random string
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash password
export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

// Verify password
export const verifyPassword = async (password, hash) => {
  const [salt, key] = hash.split(':');
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
};

// Sanitize user object for response
export const sanitizeUser = (user) => {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
};