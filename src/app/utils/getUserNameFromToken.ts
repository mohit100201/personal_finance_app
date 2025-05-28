// utils/getUsername.ts
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode v4+

interface DecodedToken {
  username?: string; // Or 'sub', or whatever key holds the username in your token
  sub?: string; // Add 'sub' property to match possible JWT payloads
  // Add other properties you expect in your token payload
}

export async function getUsernameFromToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    // This function runs client-side, so if window is undefined, we're on the server
    return null;
  }

  const token = localStorage.getItem('authToken'); // Adjust 'authToken' to your actual key

  if (!token) {
    console.warn('No authentication token found in localStorage.');
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    // Assuming 'username' is the key in your JWT payload that holds the username
    // You might need to change 'username' to 'sub' or another key depending on your JWT structure.
    if (decoded.username) {
      return decoded.username;
    } else if (decoded.sub) { // 'sub' is a common standard claim for subject (often user ID or username)
      return decoded.sub;
    }
    console.warn('Username not found in decoded token payload.');
    return null;
  } catch (error) {
    console.error('Error decoding token or token is invalid:', error);
    return null;
  }
}