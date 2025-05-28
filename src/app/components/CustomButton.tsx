import React, { SetStateAction } from 'react'

 interface CustomButtonProps {
    name: string;
    setShowCategoryCard: (value: SetStateAction<boolean>) => void;
    bgColor: string;
    hoverColor: string;
    }

const CustomButton = (props:CustomButtonProps) => {
  return (
    
       <button
              onClick={() => props.setShowCategoryCard(true)}
              className={`px-4
                         py-2
                       ${props.bgColor} 
                       ${props.hoverColor}
                       text-white 
                         font-medium 
                         rounded-lg 
                         flex 
                         items-center 
                         gap-2 
                         transition-colors`}
            >
              <span>New {props.name}</span>
              <span>
                {props.name === "category"
                  ? "😁"
                  : props.name === "income"
                  ? "🤑"
                  : "😤"}
              </span>
            </button>
    
  )
}

export default CustomButton
