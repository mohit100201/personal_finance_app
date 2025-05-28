'use client'
import Image from "next/image";
import piggy from "./../../public/piggy.png";
import light from "./../../public/sun.png";
import dark from "./../../public/moon.png";
import person from "./../../public/people.png";
import increase from "./../../public/increase.png";
import decrease from "./../../public/decrease.png";
import wallet from "./../../public/wallet.png";
import { useEffect, useState } from "react";
import Transaction from "./components/transaction";
import Category from "./components/category";
import {fetchAllTransactions, fetchAndSetTransactions, TransactionDTO} from "../app/api/transaction"
import AnimatedNumber from "./components/animatedNumber";
import formatDatabaseDate from "./utils/formatDatabaseDate";
import * as echarts from "echarts";
import { getUsernameFromToken } from "./utils/getUsername";
import { getUserId ,getUserName} from "./utils/getUserId";
import { logout } from "./utils/logOut";
import logoutIcon from "./../../public/logout.png";
import { checkAuth, redirectToLogin } from "./utils/auth";
import CustomButton from "./components/CustomButton";
import Cards from "./components/Cards";
import Charts from "./components/Charts";



export default function Home() {
  // State variables
  const [theme, setTheme] = useState(false);
  const [showIncomeCard, setShowIncomeCard] = useState(false);
  const [showExpenseCard, setShowExpenseCard] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState<TransactionDTO[]>([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showCategoryCard,setShowCategoryCard]=useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);



  // Check authentication status and initialize user data
    useEffect(() => {

      const authStatus=checkAuth();
      setIsAuthenticated(authStatus);

      if (!authStatus) {
      redirectToLogin();
    } else {

    // Initialize user data
    const initialize = async () => {
      const id = await getUserId();
      const token =  localStorage.getItem('token');
      if (!token) return null;
      const name = getUsernameFromToken(token);
            
      setUsername(name !== null ? String(name) : null);

      if (id !== null) {
        setUserId(id);
        fetchAndSetTransactions({
            id: id,
            setTransaction: setTransaction,
            setIncome: setIncome,
            setExpense: setExpense,
            setBalance: setBalance,
            income: income, 
            expense: expense, 
            balance: balance, 
          });
      }
    };

    initialize();
  }}, []);

  
  if (isAuthenticated === null) {
    return null; 
  }

  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen w-full ${theme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     
     {/* Header Section */}
      <header className="w-full
                        border-b 
                        border-gray-300
                      dark:border-gray-700 
                        flex 
                        items-center 
                        justify-between 
                        p-4 
                        h-auto 
                        gap-x-4">
        
        <div className="flex 
                        items-center 
                        flex-shrink-0"> 
          <Image
            src={piggy}
            alt="piggy"
            className="w-10 
                      h-10 
                      sm:w-12 
                      sm:h-12"
          />
          
          <p className="ml-2
                        text-xl 
                        sm:text-2xl 
                        font-bold 
                        bg-gradient-to-r
                      from-amber-400 
                      to-orange-500 
                        text-transparent 
                        bg-clip-text 
                        whitespace-nowrap 
                        overflow-hidden 
                        text-ellipsis">
            Finance Tracker
          </p>

        </div>



        
        <div className="flex
                        items-center 
                        gap-x-4 
                        flex-shrink-0 
                        ml-auto"> 
          <button
            onClick={() => setTheme(t => !t)}
            className={`p-2
                        rounded-full
                        ${theme ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Image
              src={theme ? dark : light}
              alt="theme"
              className="w-5 h-5"
            />
          </button>


          <div className="w-8
                          h-18  
                          rounded-full 
                          flex items-center 
                          justify-center 
                          text-white font-bold">
            <Image
              src={logoutIcon}
              alt="Logout"
              className="w-8
                         h-8 "
              onClick={() => {
                logout();
              }}
              
            />
          </div>
        </div>

      


      </header>

     {/*Main Section */}
      <main className="p-4
                       max-w-7xl
                      mx-auto">
        
        <div className="flex
                        flex-col
                        md:flex-row
                        justify-between
                        items-start
                        md:items-center
                        mb-8">
          <div>
            <h1 className="text-2xl
                           sm:text-3xl
                           font-bold
                           mb-1"
                           >Hello, {username}! 👋
            </h1>
            <p className={`${theme ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and manage your finances effectively
            </p>
          </div>


         
          <div className="flex
                          flex-wrap
                          gap-3
                          mt-4
                          md:mt-0">

            <CustomButton setShowCategoryCard={setShowCategoryCard}
                          bgColor="bg-violet-500"
                          hoverColor="hover:bg-violet-600"
                          name="category"
            />

            <CustomButton setShowCategoryCard={setShowIncomeCard}
                          bgColor="bg-green-500" 
                          hoverColor="hover:bg-green-600"
                          name="income"
            />                   

            
            <CustomButton setShowCategoryCard={setShowExpenseCard}
                          bgColor="bg-red-500"
                          hoverColor="hover:bg-red-600"
                          name="expense"
            />
          </div>
        </div>
        

       
        <div className="grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4 mb-8">
          
          <Cards theme={theme} value={income} name="income"/>
          <Cards theme={theme} value={expense} name="expense"/>
          <Cards theme={theme} value={balance} name="balance"/>

        </div>

        
        <div className="grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-6 mb-8"
        >
         
        <Charts name="income" transaction={transaction}  theme={theme}/>
        <Charts name="expense" transaction={transaction} theme={theme}/>
        
        </div>

        

        <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className={`text-sm px-3 py-1 rounded-full ${theme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            >
              {showAllTransactions ? 'Show Less' : 'View All'}
            </button>
          </div>


          {transaction.length > 0 ? (
            <div className="space-y-3">

              {transaction
                .sort((a, b) => {
                  const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                  return dateDiff !== 0 ? dateDiff : b.id - a.id;
                })
                .slice(0, showAllTransactions ? transaction.length : 5) 
                .map((t) => (


                  <div  key={t.id} 
                        className={`p-3 
                                    rounded-lg 
                                    flex 
                                    items-center 
                                    justify-between 
                                    ${theme ? 'bg-gray-700' : 'bg-gray-50'}`
                                  }>

                    <div className="flex
                                    items-center
                                    gap-3">

                      <div className={`w-10
                                       h-10 
                                       rounded-full 
                                       flex 
                                       items-center 
                                       justify-center 
                                       ${t.type.toLowerCase() === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>


                        {t.type.toLowerCase() === 'income' ? (
                          <Image src={increase} 
                                 alt="income" 
                                 className="w-5 h-5" />
                        ) : (
                          <Image src={decrease} 
                                 alt="expense" 
                                 className="w-5 h-5" />
                        )}
                      </div>


                      <div>
                        <p className="font-medium">{t.title}</p>
                        <p className={`text-sm ${theme ? 'text-gray-400' : 'text-gray-600'}`}>
                          {t.date}
                        </p>
                      </div>


                    </div>
                    <div className={`font-medium ${t.type.toLowerCase() === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type.toLowerCase() === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </div>
                  </div>


                ))}
            </div>
            
          ) : (
            <div className={`h-40
                             flex
                            items-center
                            justify-center
                            ${theme ? 'text-gray-500' : 'text-gray-400'}`}>
              No transactions found
            </div>
          )}
        </div>


          {showIncomeCard && userId !== null && (
            <Transaction
              userId={userId}
              type="income"
              setShowCard={setShowIncomeCard}
              onTransactionCreated={() => fetchAndSetTransactions({
                id: userId,
                setTransaction: setTransaction,
                setIncome: setIncome,
                setExpense: setExpense,
                setBalance: setBalance,
                income: income, 
                expense: expense, 
                balance: balance, 
              })}
            />
          )}

        {showExpenseCard && userId !== null && (
            <Transaction userId={userId} type="expense" setShowCard={setShowExpenseCard} onTransactionCreated={() => fetchAndSetTransactions({
                id: userId,
                setTransaction: setTransaction,
                setIncome: setIncome,
                setExpense: setExpense,
                setBalance: setBalance,
                income: income, 
                expense: expense, 
                balance: balance, 
              })}
            />
          )}

          
          {
            showCategoryCard && userId !== null && (
              <Category userId={userId} setShowCard={setShowCategoryCard} onCategoryCreated={() => () => fetchAndSetTransactions({
                id: userId,
                setTransaction: setTransaction,
                setIncome: setIncome,
                setExpense: setExpense,
                setBalance: setBalance,
                income: income, 
                expense: expense, 
                balance: balance, 
              })} />
            )
          }

      </main>
    </div>
  );
}