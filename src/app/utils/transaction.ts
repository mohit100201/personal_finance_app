import { cookies } from 'next/headers';
import { Dispatch, SetStateAction } from 'react';

export interface TransactionDTO {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    date: string;
    userId: number;
}

export interface transactionProps{
    id: number;
    setTransaction: Dispatch<SetStateAction<TransactionDTO[]>>;
    income: number;
    setIncome: Dispatch<SetStateAction<number>>;
    expense: number;
    setExpense:  Dispatch<SetStateAction<number>>;
    balance: number;
    setBalance:Dispatch<SetStateAction<number>>;
}





export const fetchAllTransactions = async (userId: number): Promise<TransactionDTO[]> => {
   const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log("token in transaction: ", token);
 

  const response = await fetch(`http://localhost:8080/transaction/${userId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
};

export function calculateSummary(transactions: TransactionDTO[]): { income: number; expense: number; balance: number } {
  let income = 0;
  let expense = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expense += tx.amount;
    }
  });

  const balance = income - expense;
  return { income, expense, balance };
}


