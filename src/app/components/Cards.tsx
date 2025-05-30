import React from 'react'
import increase from "./../../../public/increase.png";
import decrease from "./../../../public/decrease.png";
import wallet from "./../../../public/wallet.png";
import Image from "next/image";
import AnimatedNumber from './AnimatedNumber';
interface CardsProps {
    theme: boolean;
    value:number;
    name:string;



}
const Cards = (props:CardsProps) => {
    
  return (
    <div className={`
                          p-4 
                          rounded-xl 
                          ${props.theme ? 'bg-gray-800' : 'bg-white'} 
                          shadow-md border 
                          ${props.theme ? 'border-gray-700' : 'border-gray-200'}
                          `}>

            <div className="flex 
                            items-center 
                            justify-between"
                            >

              <div className="flex
                              items-center
                              gap-3"
                              >

                <div className="w-10
                                h-10
                              bg-green-100
                              dark:bg-green-900/30
                                rounded-lg
                                flex
                                items-center
                                justify-center">
                  <Image src={props.name === "income" ? increase : props.name === "expense" ? decrease : wallet} 
                         alt={props.name} 
                         className="w-6 
                                    h-6" 
                  />

                </div>
                <div>
                  <p className={`text-sm 
                                ${props.theme ? 'text-gray-400' : 'text-gray-600'}`
                                }>
                                  {props.name}
                  </p>

                  <p className="text-2xl
                                font-bold">
                    <AnimatedNumber value={props.value} 
                                    duration={1500}  
                    />
                    
                  </p>
                </div>
              </div>

            </div>
          </div>
  )
}

export default Cards
