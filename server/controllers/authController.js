import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { findUserByEmail, createUser } from '../services/userService.js';
import { validateRegistrationCode } from '../services/registrationService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || password !== user.medusaCode) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokens = generateTokens(user);
    res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { code, email, password, name, lastName, phone, center, medusaCode } = req.body;

    const validCode = await validateRegistrationCode(code);
    if (!validCode) {
      return res.status(400).json({ error: 'Invalid registration code' });
    }

    const user = await createUser({
      name,
      lastName,
      email,
      phone,
      center,
      medusaCode,
      password,
      role: 'manager'
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      network: user.network,
      center: user.center
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    jwtConfig.secret,
    { expiresIn: jwtConfig.refreshExpiresIn }
  );

  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  network: user.network,
  center: user.center,
  imageUrl: user.imageUrl,
  passwordChangeRequired: user.passwordChangeRequired === 1
});