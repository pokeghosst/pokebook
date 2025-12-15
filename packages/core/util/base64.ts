export function encodeToBase64(bytes: Uint8Array) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

export function decodeFromBase64(base64: string): Uint8Array {
  return new Uint8Array([...atob(base64)].map((char) => char.charCodeAt(0)));
}
