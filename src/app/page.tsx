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
import {fetchAllTransactions} from "../app/api/transaction"
import AnimatedNumber from "./components/animatedNumber";
import formatDatabaseDate from "./utils/formatDatabaseDate";
import * as echarts from "echarts";
import { getUsernameFromToken } from "./utils/getUsername";
import { getUserId ,getUserName} from "./utils/getUserId";
import { logout } from "./utils/logOut";
import logoutIcon from "./../../public/logout.png";
import { checkAuth, redirectToLogin } from "./utils/auth";
interface TransactionProps {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    date: string;
    userId: number;
}

export default function Home() {
  const [theme, setTheme] = useState(false);
  const [showIncomeCard, setShowIncomeCard] = useState(false);
  const [showExpenseCard, setShowExpenseCard] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transaction, setTransaction] = useState<TransactionProps[]>([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const[showCategoryCard,setShowCategoryCard]=useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

    const fetchAndSetTransactions = async (id: number) => {
    try {
      const data: TransactionProps[] = await fetchAllTransactions(id);
      setTransaction(data);

      console.log("data")

      const calculatedIncome = data
        .filter(t => t.type.toLowerCase() === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const calculatedExpense = data
        .filter(t => t.type.toLowerCase() === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      setIncome(calculatedIncome);
      setExpense(calculatedExpense);
      setBalance(calculatedIncome - calculatedExpense);
    } catch (err) {
            console.error(err);
    }
  };


    useEffect(() => {

      const authStatus=checkAuth();
      setIsAuthenticated(authStatus);

      if (!authStatus) {
      redirectToLogin();
    } else {


    const initialize = async () => {
      const id = await getUserId();
      const token =  localStorage.getItem('token');
      if (!token) return null;
      const name = getUsernameFromToken(token);
        console.log("name",name);      
      console.log("id",id);      
      setUsername(name !== null ? String(name) : null);

      if (id !== null) {
        setUserId(id);
        fetchAndSetTransactions(id);
      }
    };

    initialize();
  }}, []);

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return null; // or return a loading spinner
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen w-full ${theme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     
      <header className="w-full border-b border-gray-300 dark:border-gray-700 flex items-center justify-between p-4 h-auto gap-x-4">
        
        <div className="flex items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
          <Image
            src={piggy}
            alt="piggy"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          
          <p className="ml-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text whitespace-nowrap overflow-hidden text-ellipsis">
            Finance Tracker
          </p>
        </div>
        
        <div className="flex items-center gap-x-4 flex-shrink-0 ml-auto"> {/* Added ml-auto to push to right */}
          <button
            onClick={() => setTheme(t => !t)}
            className={`p-2 rounded-full ${theme ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Image
              src={theme ? dark : light}
              alt="theme"
              className="w-5 h-5"
            />
          </button>
          <div className="w-8 h-18  rounded-full flex items-center justify-center text-white font-bold">
            <Image
              src={logoutIcon}
              alt="Logout"
              className="w-8 h-8 "
              onClick={() => {
                logout();
              }}
              
            />
          </div>
        </div>

      


      </header>

     
      <main className="p-4 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hello, {username}! 👋</h1>
            <p className={`${theme ? 'text-gray-400' : 'text-gray-600'}`}>
              Track and manage your finances effectively
            </p>
          </div>
         
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowCategoryCard(true)}
              className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>New Category</span>
              <span>😁</span>
            </button>

            <button
              onClick={() => setShowIncomeCard(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>New Income</span>
              <span>🤑</span>
            </button>
            <button
              onClick={() => setShowExpenseCard(true)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>New Expense</span>
              <span>😤</span>
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Image src={increase} alt="increase" className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm ${theme ? 'text-gray-400' : 'text-gray-600'}`}>Income</p>
                  <p className="text-2xl font-bold">
                    <AnimatedNumber value={income} duration={1500}  />
                  </p>
                </div>
              </div>

            </div>
          </div>

         
          <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Image src={decrease} alt="decrease" className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm ${theme ? 'text-gray-400' : 'text-gray-600'}`}>Expense</p>
                  <p className="text-2xl font-bold">
                    <AnimatedNumber value={expense} duration={1500} />
                  </p>
                </div>
              </div>

            </div>
          </div>

          
          <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Image src={wallet} alt="wallet" className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-sm ${theme ? 'text-gray-400' : 'text-gray-600'}`}>Balance</p>
                  <p className="text-2xl font-bold">
                    <AnimatedNumber value={balance} duration={1500}  />
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         
          <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-lg font-semibold mb-4">Income by Category</h2>
            <div
              id="income-chart"
              className="h-64 w-full"
              ref={(el) => {
                if (el && typeof window !== 'undefined') {
                  const chart = echarts.init(el);
                  const incomeData = transaction
                    .filter(t => t.type.toLowerCase() === 'income')
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>);

                  chart.setOption({
                    tooltip: {
                      trigger: 'item',
                      formatter: '{b}: ₹{c} ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      right: 10,
                      top: 'center',
                      textStyle: {
                        color: theme ? '#fff' : '#333'
                      }
                    },
                    series: [{
                      name: 'Income',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      center: ['40%', '50%'],
                      data: Object.entries(incomeData).map(([name, value]) => ({
                        value,
                        name,

                      })),
                      label: {
                        color: theme ? '#fff' : '#333'
                      },
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }],
                    backgroundColor: 'transparent'
                  });

                  const handleResize = () => chart.resize();
                  window.addEventListener('resize', handleResize);

                  return () => {
                    window.removeEventListener('resize', handleResize);
                    chart.dispose();
                  };
                }
              }}
            />
          </div>

         
          <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
            <div
              id="expense-chart"
              className="h-64 w-full"
              ref={(el) => {
                if (el && typeof window !== 'undefined') {
                  const chart = echarts.init(el);
                  const expenseData = transaction
                    .filter(t => t.type.toLowerCase() === 'expense')
                    .reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>);

                  chart.setOption({
                    tooltip: {
                      trigger: 'item',
                      formatter: '{b}: ₹{c} ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      right: 10,
                      top: 'center',
                      textStyle: {
                        color: theme ? '#fff' : '#333'
                      }
                    },
                    series: [{
                      name: 'Expense',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      center: ['40%', '50%'],
                      data: Object.entries(expenseData).map(([name, value]) => ({
                        value,
                        name,

                      })),
                      label: {
                        color: theme ? '#fff' : '#333'
                      },
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }],
                    backgroundColor: 'transparent'
                  });

                  const handleResize = () => chart.resize();
                  window.addEventListener('resize', handleResize);

                  return () => {
                    window.removeEventListener('resize', handleResize);
                    chart.dispose();
                  };
                }
              }}
            />
          </div>
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
                .slice(0, showAllTransactions ? transaction.length : 5) // Show all or just 5
                .map((t) => (
                  <div key={t.id} className={`p-3 rounded-lg flex items-center justify-between ${theme ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type.toLowerCase() === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {t.type.toLowerCase() === 'income' ? (
                          <Image src={increase} alt="income" className="w-5 h-5" />
                        ) : (
                          <Image src={decrease} alt="expense" className="w-5 h-5" />
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
            <div className={`h-40 flex items-center justify-center ${theme ? 'text-gray-500' : 'text-gray-400'}`}>
              No transactions found
            </div>
          )}
        </div>
          {showIncomeCard && userId !== null && (
            <Transaction userId={userId} type="income" setShowCard={setShowIncomeCard}  onTransactionCreated={() => fetchAndSetTransactions(userId)}/>
          )}

        {showExpenseCard && userId !== null && (
            <Transaction userId={userId} type="expense" setShowCard={setShowExpenseCard} onTransactionCreated={() => fetchAndSetTransactions(userId)} />
          )}

          
          {
            showCategoryCard && userId !== null && (
              <Category userId={userId} setShowCard={setShowCategoryCard} onCategoryCreated={() => fetchAndSetTransactions(userId)} />
            )
          }

           


      </main>
    </div>
  );
}