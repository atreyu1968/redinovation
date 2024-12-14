// Browser-safe code generation
const REGISTRATION_CODE_LENGTH = 8;
const RECOVERY_CODE_LENGTH = 6;

// Custom alphabets for readable codes (no similar-looking characters)
const REGISTRATION_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const RECOVERY_ALPHABET = '0123456789';

const generateCode = (length: number, alphabet: string): string => {
  let result = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < length; i++) {
    result += alphabet[array[i] % alphabet.length];
  }
  
  return result;
};

export const generateRegistrationCode = () => generateCode(REGISTRATION_CODE_LENGTH, REGISTRATION_ALPHABET);
export const generateRecoveryCode = () => generateCode(RECOVERY_CODE_LENGTH, RECOVERY_ALPHABET);