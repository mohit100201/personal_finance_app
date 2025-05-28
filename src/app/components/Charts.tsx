import React from 'react'
import * as echarts from "echarts";
import { TransactionDTO } from '../api/transaction';

interface ChartsProps{
    theme:boolean;
    transaction:TransactionDTO[];
    name:string;
}
const Charts = (props:ChartsProps) => {
  return (
     <div className={`p-4
                             rounded-xl
                             ${props.theme ? 'bg-gray-800' : 'bg-white'} 
                             shadow-md border 
                             ${props.theme ? 'border-gray-700' : 'border-gray-200'}`
                             }>
    
                <h2 className="text-lg
                               font-semibold
                               mb-4">
                                {props.name==="income"?"Income":"Expense"} by Category
                </h2>
    
                <div
                  id={`${props.name}-chart`}
                  className="h-64 
                             w-full"
                  ref={(el) => {
                    if (el && typeof window !== 'undefined') {
                      const chart = echarts.init(el);
                      const Data = props.transaction
                        .filter(t => t.type.toLowerCase() === props.name)
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
                            color: props.theme ? '#fff' : '#333'
                          }
                        },
                        series: [{
                          name: props.name,
                          type: 'pie',
                          radius: ['40%', '70%'],
                          center: ['40%', '50%'],
                          data: Object.entries(Data).map(([name, value]) => ({
                            value,
                            name,
    
                          })),
                          label: {
                            color: props.theme ? '#fff' : '#333'
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
    
  )
}

export default Charts
