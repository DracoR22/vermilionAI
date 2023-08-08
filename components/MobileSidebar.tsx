'use client'

import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SideBar from './SideBar'
import { useEffect, useState } from 'react';


const MobileSidebar = ({isPro}: {isPro: boolean}) => {

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, [])
  
    if (!hasMounted) return null;
  
  return (
    <Sheet>
        <SheetTrigger className='md:hidden pr-4'>
          <Menu/>
        </SheetTrigger>
        <SheetContent side='left' className='p-0 bg-secondary pt-10 w-[200px]'>
          <SideBar isPro={isPro}/>
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar