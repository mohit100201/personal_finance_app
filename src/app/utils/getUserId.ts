import { cookies } from 'next/headers';
import { getUsernameFromToken } from "./getUsername";

export async function getUserIdServerSide(): Promise<number | null> {
   const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log("token in getUser: ", token);
  
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
