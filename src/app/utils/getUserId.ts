// services/getUserId.ts
import { getUsernameFromToken } from "./getUsername";

export async function getUserId(): Promise<number | null> {
  if (typeof window === 'undefined') return null; // Ensure this only runs in the browser

  const token = localStorage.getItem('token');
  if (!token) return null;

  const username = getUsernameFromToken(token);
  if (!username) return null;

  try {
    const response = await fetch(`http://localhost:8080/api/auth/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user ID');
    }

    const data = await response.json();
    return data.id;
  } catch (err) {
    console.error("Error fetching user ID:", err);
    return null;
  }
}

export async function getUserName(): Promise<number | null> {
  if (typeof window === 'undefined') return null; // Ensure this only runs in the browser

  const token = localStorage.getItem('token');
  if (!token) return null;

  const username = getUsernameFromToken(token);
  console.log("Username from token:", username);
  if (!username) return null;

  try {
    const response = await fetch(`http://localhost:8080/api/auth/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user ID');
    }

    const data = await response.json();
    return data.username;
  } catch (err) {
    console.error("Error fetching user ID:", err);
    return null;
  }
}
