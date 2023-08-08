'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { ThemeToggle } from "./ThemeToggle"
import MobileSidebar from './MobileSidebar'

interface NavbarBarProps {
  isPro: boolean
}


const Navbar = ({isPro}: NavbarBarProps) => {
  return (
    <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4
     border-b border-primary/10 bg-secondary">
       <div className="flex items-center">
         <MobileSidebar isPro={isPro}/>
         <Link href='/' className="mx-2">
            <Image src='/vermilionAIHD.png' alt="logo" height='60' width='60'/>
         </Link>
       </div>
       <div className="flex items-center gap-3">
        <ThemeToggle/>
        <UserButton afterSignOutUrl="/"/>
       </div>
    </div>
  )
}

export default Navbar