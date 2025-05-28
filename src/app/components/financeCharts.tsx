// First, create a new component for the charts:
// components/FinanceCharts.tsx
'use client'
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface FinanceChartsProps {
  transactions: {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    date: string;
    userId: number;
  }[];
  theme: boolean;
}

const FinanceCharts = ({ transactions, theme }: FinanceChartsProps) => {
  const incomeChartRef = useRef<HTMLDivElement>(null);
  const expenseChartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!transactions.length) return;

    // Process data for charts
    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};
    const dailyData: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expense: 0 };
      }

      if (t.type.toLowerCase() === 'income') {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
        dailyData[date].income += t.amount;
      } else {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        dailyData[date].expense += t.amount;
      }
    });

    // Income by Category Pie Chart
    if (incomeChartRef.current) {
      const chart = echarts.init(incomeChartRef.current);
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          textStyle: {
            color: theme ? '#fff' : '#333'
          }
        },
        series: [{
          name: 'Income by Category',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: theme ? '#1f2937' : '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',
            color: theme ? '#fff' : '#333'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: theme ? '#fff' : '#333'
            }
          },
          labelLine: {
            show: false
          },
          data: Object.entries(incomeByCategory).map(([name, value]) => ({
            value,
            name
          }))
        }],
        backgroundColor: theme ? '#1f2937' : '#fff'
      });
    }

    // Expense by Category Pie Chart
    if (expenseChartRef.current) {
      const chart = echarts.init(expenseChartRef.current);
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          textStyle: {
            color: theme ? '#fff' : '#333'
          }
        },
        series: [{
          name: 'Expense by Category',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: theme ? '#1f2937' : '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center',
            color: theme ? '#fff' : '#333'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: theme ? '#fff' : '#333'
            }
          },
          labelLine: {
            show: false
          },
          data: Object.entries(expenseByCategory).map(([name, value]) => ({
            value,
            name
          }))
        }],
        backgroundColor: theme ? '#1f2937' : '#fff'
      });
    }

    return () => {
      if (incomeChartRef.current) echarts.dispose(incomeChartRef.current);
      if (expenseChartRef.current) echarts.dispose(expenseChartRef.current);
    };
  }, [transactions, theme]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-lg font-semibold mb-4">Income by Category</h2>
        <div 
          ref={incomeChartRef} 
          className="w-full h-64"
          style={{ minHeight: '300px' }}
        />
      </div>
      
      <div className={`p-4 rounded-xl ${theme ? 'bg-gray-800' : 'bg-white'} shadow-md border ${theme ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
        <div 
          ref={expenseChartRef} 
          className="w-full h-64"
          style={{ minHeight: '300px' }}
        />
      </div>
    </div>
  );
};

export default FinanceCharts;