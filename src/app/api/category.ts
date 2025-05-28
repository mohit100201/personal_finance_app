// Define the interface for CategoryDTO
export interface CategoryDTO {
  id: number;
  name: string;
  type: string;
  userId: number;
}

export const fetchAllCategories = async (userId: number): Promise<CategoryDTO[]> => {
  const response = await fetch(`http://localhost:8080/category/${userId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Include authorization token
    }
  });

  if (!response.ok) {
    // Attempt to read error message from response body if available
    const errorBody = await response.text(); // Read as text first
    let errorMessage = `Failed to fetch categories. Status: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorBody);
      if (errorJson.message) {
        errorMessage = errorJson.message; // Use backend's error message
      } else if (errorJson.error) {
        errorMessage = errorJson.error; // Another common key for error messages
      }
    } catch (e) {
      // If parsing fails, use the default message or the raw text
      errorMessage = `${errorMessage}. Response: ${errorBody}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};