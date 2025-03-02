export function encodeToBase64(bytes: Uint8Array) {
	return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
}
