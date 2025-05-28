"use client";
import React, { useState } from "react";

// Define the props for the Category component
interface CategoryProps {
  setShowCard: (show: boolean) => void;
  userId: number;
  onCategoryCreated?: () => void; // Optional callback to refresh categories after creation
}

const Category = (props: CategoryProps) => {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("expense"); // Default to 'expense'
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle creating a new category
  const createCategory = async () => {
    setIsLoading(true); // Indicate loading state
    setSuccess(null); // Clear previous success/error messages

    try {
      const response = await fetch('http://localhost:8080/category', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include authorization token
        },
        // --- CORRECTED BODY PAYLOAD ---
        body: JSON.stringify({
          name: name,
          type: type,
          userId: props.userId
        })
        // ------------------------------
      });

      if (!response.ok) {
        // If response is not OK (e.g., 400, 500 status)
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      const data = await response.json();
      console.log("Category created:", data);

      // Call the optional callback if provided
      if (props.onCategoryCreated) {
        props.onCategoryCreated();
      }

      setSuccess("Category created successfully!");
      // Automatically close the card after a short delay
      setTimeout(() => {
        props.setShowCard(false);
      }, 1500); // Close after 1.5 seconds

    } catch (error: any) {
      console.error("Error creating category:", error.message);
      setSuccess(`Failed to create category: ${error.message}`);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    // Overlay to dim background and close card on click outside
    <div
      className="flex items-center justify-center min-h-screen bg-black/30 fixed inset-0 z-50"
      onClick={() => props.setShowCard(false)}
    >
      {/* Modal card */}
      <div
        className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
      >
        <div className="flex flex-col justify-center p-5 md:p-14">
          <h3 className="text-2xl font-semibold mb-4">
            Create new Category
          </h3>

          {/* Success/Error message display */}
          {success && (
            <div className={`mb-4 p-2 rounded-md text-center ${
              success.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {success}
            </div>
          )}

          {/* Category Name Input */}
          <div className="py-2">
            <span className="mb-2 text-md">Category Name</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Category Type Selection */}
          <div className="py-2 mb-4">
            <span className="mb-2 text-md">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row w-full justify-end gap-x-2">
            <button
              onClick={() => props.setShowCard(false)}
              className="bg-gray-100 font-medium p-2 text-md w-[25%] rounded-md text-black"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={createCategory}
              className="bg-black text-white font-medium p-2 text-md w-[25%] rounded-md flex items-center justify-center"
              disabled={isLoading || !name} // Disable if loading or name is empty
            >
              {isLoading ? (
                <span className="animate-spin mr-2">⟳</span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;