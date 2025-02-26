"use client"
import React, { useEffect } from 'react'
import Logo from './Logo'
import { UserButton, useUser } from '@clerk/nextjs'
import { checkAndAddUser } from '../server'

const Navbar = () => {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress

  useEffect(() => {

    const init = async () => {
      if (email && user?.fullName) {
        await checkAndAddUser(email, user.fullName)
      }
    }

    init()
  }, [user])

  return (
    <div className='px-5 md:px-[10%] pt-4'>
      <div className='flex justify-between items-center'>
        <Logo />
        <div>
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Navbar
