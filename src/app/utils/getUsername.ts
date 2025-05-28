// getUsernameFromToken.ts

export function getUsernameFromToken(token: string): string | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Adjust the key if your token uses a different field for username
    return payload.sub || payload.username || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
