import { decrypt, encrypt } from "./encryptor";

const STORAGE_KEY = 'auth_token';

function saveToken(token: string): void {
  const encrypted = encrypt(token);
  localStorage.setItem(STORAGE_KEY, encrypted);
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const encrypted = localStorage.getItem(STORAGE_KEY);
  return encrypted ? decrypt(encrypted) : null;
}

function removeToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export { saveToken, getToken, removeToken };
