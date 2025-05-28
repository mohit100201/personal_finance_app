"use client";
import React, { useEffect, useState } from "react";
import { CategoryDTO } from "../api/category";
import  {fetchAllCategories}  from "../api/category"; // Adjust the import path as necessary
import { getUserId } from "../utils/getUserId";

interface TransactionProps {
  type: string;
  setShowCard: (show: boolean) => void;
  userId:number;
  onTransactionCreated?: () => void;
}

const Transaction = (props: TransactionProps) => {
  const today: string = new Date().toISOString().split("T")[0];
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<string>(today);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchCategories = async (id:number) => {
    try{
      const data:CategoryDTO[]=await fetchAllCategories(id);
     const filterdata= data.filter(cat =>
  cat.type.toLowerCase() === props.type.toLowerCase()
);
      setCategories(filterdata);

    }
      catch (err) {
      setSuccess('Failed to load categories');
      console.error(err);
    }



  }
  

  useEffect(() => {
      const initialize = async () => {
        const id = await getUserId();
        if (id !== null) {
          setUserId(id);
          fetchCategories(id);
        }
      };
  
      initialize();
    }, []);
  
  

  const createTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/transaction', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          "title": description,
          "amount": Number(amount),
          "type": props.type,
          "category": category,
          "date": transactionDate,
          "userId": props.userId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const data = await response.json();
      console.log("Transaction created:", data);

      if(props.onTransactionCreated) {
        props.onTransactionCreated();
      }
      
      setSuccess("Transaction created successfully!");
      setTimeout(() => {
        props.setShowCard(false);
      }, 500); // Close after 1.5 seconds

    } catch (error) {
      console.error("Error:", error);
      setSuccess("Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black/30 fixed inset-0 z-50"
      onClick={() => props.setShowCard(false)}
    >
      <div
        className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col justify-center p-5 md:p-14">
          <h3 className="text-2xl font-semibold mb-4">
            Create new{" "}
            <span className={props.type === "income" ? "text-green-400" : "text-red-400"}>
              {props.type}
            </span>{" "}
            transaction
          </h3>

          {success && (
            <div className={`mb-4 p-2 rounded-md text-center ${
              success.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {success}
            </div>
          )}

          <div className="py-2">
            <span className="mb-2 text-md">Description</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-200 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="py-2 mb-2">
            <span className="mb-2 text-md">Amount</span>
            <div className="w-full flex flex-row border-2 items-center border-gray-200 rounded-md focus-within:border-black">
              <input
                type="number"
                className="p-2 w-full outline-none placeholder:font-light placeholder:text-gray-500"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex flex-row justify-between mb-2">
            <div className="py-2 flex flex-col w-[40%]">
              <span className="mb-1 text-md">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-md"
              >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
              </select>
            </div>

            <div className="py-2 flex flex-col w-[40%]">
              <span className="mb-1 text-md">Transaction date</span>
              <input
                type="date"
                className="p-2 w-full outline-none border border-gray-300 rounded-md"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row w-full justify-end gap-x-2">
            <button
              onClick={() => props.setShowCard(false)}
              className="bg-gray-100 font-medium p-2 text-md w-[25%] rounded-md mb-2 text-black"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              onClick={createTransaction}
              className="bg-black text-white font-medium p-2 text-md w-[25%] rounded-md mb-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">↻</span>
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

export default Transaction;