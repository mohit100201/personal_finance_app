
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

interface transactionProps{
    id: number;
    setTransaction: Dispatch<SetStateAction<TransactionDTO[]>>;
    income: number;
    setIncome: Dispatch<SetStateAction<number>>;
    expense: number;
    setExpense:  Dispatch<SetStateAction<number>>;
    balance: number;
    setBalance:Dispatch<SetStateAction<number>>;
}

export const createTransaction = async (transactionData: {
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string; 
  userId: number;
}) => {
  const response = await fetch('http://localhost:8080/transaction', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(transactionData)
  });

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return await response.json();
};

export const fetchAllTransactions = async (userId: number): Promise<TransactionDTO[]> => {
  const response = await fetch(`http://localhost:8080/transaction/${userId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }

  return await response.json();
};


export  const fetchAndSetTransactions = async (props:transactionProps) => {
    try {
      const data: TransactionDTO[] = await fetchAllTransactions(props.id);
      props.setTransaction(data);

      console.log("data")

      const calculatedIncome = data
        .filter(t => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const calculatedExpense = data
        .filter(t => t.type.toLowerCase() === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      props.setIncome(calculatedIncome);
      props.setExpense(calculatedExpense);
      props.setBalance(calculatedIncome - calculatedExpense);
    } catch (err) {
      console.error(err);
    }
  };