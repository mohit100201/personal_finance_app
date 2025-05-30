'use client';

import { use, useState } from 'react';
import React from 'react'
const Test = () => {
   const [status, setStatus] = useState<string>('');

   const handleCreateTransaction = async () => {
    try {
      const response = await fetch('/api/fetchAllTransaction/10', {
        method: 'GET',
       
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(`Error: ${data.error}`);
      } else {
        setStatus(`Transaction:  ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('Network error');
    }
  };

  //   const handleCreateTransaction = async () => {
  //   try {
  //     const response = await fetch('/api/createTransaction', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         title: 'Salary',
  //         amount: 3000,
  //         type: 'income',
  //         category: 'Job',
  //         date: '2025-05-29',
  //         userId: 1,
  //       }),
  //     });
    // const handleCreateTransaction = async () => {
    // try {
    //   const response = await fetch('/api/createCategory', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       name:'cat1',
    //       type: 'expense',
    //       userId: 1,
          
    //     }),
    //   });

    //   const data = await response.json();
    //   if (!response.ok) {
    //     setStatus(`Error: ${data.error}`);
    //   } else {
    //     setStatus(`Transaction created: ID ${data.id}`);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setStatus('Network error');
    // }
  return (
    <div>
      <button
        className="p-2 bg-blue-600 text-white rounded"
        onClick={handleCreateTransaction}
      >
        Create Transaction
      </button>
      <p>{status}</p>
    </div>
  );
}
export default Test
