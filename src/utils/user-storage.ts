import { User } from "@/types/types";
import { decrypt, encrypt } from "./encryptor";

const STORAGE_KEY = 'auth_user';

function saveUser(user: User): void {
  const encrypted = encrypt(JSON.stringify(user));
  localStorage.setItem(STORAGE_KEY, encrypted);
}

function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const encrypted = localStorage.getItem(STORAGE_KEY);
  const json = decrypt(encrypted!);
  return encrypted ? JSON.parse(json) : null;
}

function removeUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export { saveUser, getUser, removeUser };