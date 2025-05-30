import {cookies} from 'next/headers';
import { getUsernameFromToken  } from './utils/getUsername';
import { getUserIdServerSide } from './utils/getUserId';
import { fetchAllTransactions, calculateSummary, TransactionDTO } from './utils/transaction';
import Test from './components/test';
import Dashborad from "./components/Dashboard";


export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log("token: ", token);

  if (!token) {
   
    return null;
  }

  
  const userId = await getUserIdServerSide();
  const username = getUsernameFromToken(token!);

  console.log("userId: ", userId);
  console.log("username: ", username);

  
  const transactions:TransactionDTO[] = await fetchAllTransactions(userId!);

  
  const { income, expense, balance } = calculateSummary(transactions);
  console.log("icome: ", income);
  console.log("expense: ", expense);
  console.log("balance: ", balance);
  
  

  return (
    <Dashborad
      userName={username!}
      income={income}
      expense={expense}
      balance={balance}
      transaction={transactions}
      userId={userId!}
    
    
    />
    // <Test/>
   
  );
}

