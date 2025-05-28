'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import view from "./../../../../public/view.png"
import hide from "./../../../../public/hide.png"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';
import SignInUser from '../signIn/page';


const SignUpUser = () => {
   
   const [toggle,setToggle]=useState<boolean>(false);
   const [name,setName]=useState<string>("");
   const[password,setPassword]=useState<string>("");
   const [success,setSuccess]=useState<string| null>(null);

   const router=useRouter();

   const handleClick=()=>{
    router.push("/auth/signIn");

   }

   const SubmitUser=async()=>{
    const userData={
      name,
      password
    };

    try{
      const response= await fetch('http://localhost:8080/api/auth/signup',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          "username":userData.name,
          "password":userData.password
        })
        

      });
      

      if(!response.ok){
        console.log("Error occured: ");
        setSuccess("Login Failed!")
        return;
      }
     
    
      const data= await response.json();
      console.log("data: ",data);

      // console.log("token: ",data.token);
      // localStorage.setItem('token',data.token)
      setSuccess("User Created!");


    }
    catch(error){
      console.error("Error is : ",error)
    }




   }
   

  //   useEffect(() => {

  //   const token=localStorage.getItem('token');
  //   if(token){
  //     console.log("token exist");
  //   }


   
  // },[]); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
     
    }, 900);

    return () => clearTimeout(timer); 
  }, [success]); 

   

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row  md:space-y-0'>
            <div className='flex flex-col justify-center p-5 md:p-14'>
                <span className=' flex justify-center mb-2 text-4xl font-bold'>Welcome </span>
                <span className='flex justify-center font-light text-gray-400 mb-4'>Welcome! Please enter your details.</span>

                 <div className='py-2'>
                    <span className='mb-2 text-md'>Username</span>
                    <input
                    type='text'
                    className='w-full p-2 border   border-gray-200 rounded-md  placeholder:font-light placeholder:text-gray-500 '
                    name='UserName'
                    id='UserName'
                    defaultValue={name}
                    onChange={e=>setName(e.target.value)}
                    placeholder='Enter username'
                    >
                    
                    </input>


                </div>






                <div className='py-2 mb-2'>
                    <span className='mb-2 text-md'>Password</span>
                    <div className='w-full flex flex-row border-2 items-center border-gray-200 rounded-md focus-within:border-black justify-around'>
                      <input
                    type={toggle?"text":"password"}
                    className='w-[80%] p-2 outline-none   placeholder:font-light placeholder:text-gray-500'
                    name='Password'
                    id='Password'
                    placeholder='Enter password'
                    defaultValue={password}
                    onChange={e=>setPassword(e.target.value)}
                    
                    >
                      
                    
                    </input>
                    <Image src={toggle?hide:view}
                     alt='toggle image' 
                     className="w-5  h-5 object-contain cursor-pointer"
                     onClick={()=>setToggle(!toggle)}
                     ></Image>
                    </div>


                </div>

               
                <div>
                  <button onClick={SubmitUser} className='bg-black text-white font-medium cursor-pointer p-2 text-md w-full rounded-md mb-2 hover:bg-white hover:text-black hover:border hover:border-gray-300'>Sign up</button>
                </div>


                <div className='py-2 mb-2 flex flex-row gap-x-1 justify-center'>
                  <p className='text-gray-600'>Have an account? </p>
                  <p onClick={handleClick} className='font-medium cursor-pointer'>Sign in</p>
                </div>

                {success && <div className='py-2 text-green-500 mb-2 flex flex-row gap-x-1 justify-center'>
                  <p>{success}</p>
                </div>}

              

                

            </div>
           

        </div>
      
    </div>
  );
};

export default SignUpUser;
