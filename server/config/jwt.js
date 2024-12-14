export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev_2024SecureToken!X9v$mK#pL@Q5r*N3',
  expiresIn: '24h',
  refreshExpiresIn: '7d',
  algorithm: 'HS512',
  issuer: 'redinnovacionfp.es'
};