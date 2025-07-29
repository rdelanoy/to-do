function encrypt(text: string): string {
  return btoa(text);
}

function decrypt(text: string): string {
  return atob(text);
}

export { encrypt, decrypt };