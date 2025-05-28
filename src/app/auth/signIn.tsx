'use client';
import Image from 'next/image';
import React from 'react';
import background from './../../../public/background.jpg';

import google from  "./../../../public/search.png"
import github from "./../../../public/github-sign.png"
import { useSession, signIn, signOut} from "next-auth/react"

const SignInUser = () => {
   
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className='relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row  md:space-y-0'>
            <div className='flex flex-col justify-center p-5 md:p-14'>
                <span className='mb-2 text-4xl font-bold'>Welcome back</span>
                <span className='font-light text-gray-400 mb-4'>Welcome back! Please enter your details.</span>

                <div className='py-2'>
                    <span className='mb-2 text-md'>Username</span>
                    <input
                    type='text'
                    className='w-full p-2 border  border-gray-200 rounded-md  placeholder:font-light placeholder:text-gray-500 '
                    name='Username'
                    id='Username'
                    placeholder='Enter username'
                    >
                    
                    </input>


                </div>

                <div className='py-2'>
                    <span className='mb-2 text-md'>Password</span>
                    <input
                    type='password'
                    className='w-full p-2 border border-gray-200 rounded-md  placeholder:font-light placeholder:text-gray-500'
                    name='Password'
                    id='Password'
                    placeholder='Enter password'
                    >
                    
                    </input>


                </div>

               

                <div>
                  <button className='bg-black text-white mt-3 font-medium p-2 text-md w-full rounded-md cursor-pointer mb-2 hover:bg-white hover:text-black hover:border hover:border-gray-300'>Sign in</button>
                </div>

               

                <div className='py-2 flex flex-row gap-x-1 justify-center'>
                  <p className='text-gray-600'>Don't have an account? </p>
                  <p className='font-medium cursor-pointer'>Sign up</p>
                </div>

                


                

            </div>
           

        </div>
      
    </div>
  );
};

export default SignInUser;
