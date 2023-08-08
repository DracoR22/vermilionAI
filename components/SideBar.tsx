'use client'

import { cn } from '@/lib/utils'
import { Home, Plus, Settings } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'
import { useProModal } from '@/hooks/useProModal'

interface SideBarProps {
  isPro: boolean
}

const SideBar = ({isPro}: SideBarProps) => {

 const pathname = usePathname()
 const router = useRouter()
 const proModal = useProModal()

 const routes = [
    {
        icon: Home,
        href: '/',
        label: 'Home',
        pro: false
    },
    {
        icon: Plus,
        href: '/companion/new',
        label: 'Create',
        pro: true
    },
    {
        icon: Settings,
        href: '/settings',
        label: 'Settings',
        pro: false
    },
 ]

 const onNavigate = (url: string, pro: boolean) => {
   if(pro && !isPro) {
    return proModal.onOpen()
   }

  return router.push(url)
 }

  return (
    <div className="space-y-4 flex flex-col h-full w-[200px] text-primary bg-secondary">
      <div className="p-3 flex flex-1 pt-6">
        <div className="space-y-2 w-full">
          {routes.map((route) => (
            <div key={route.href} onClick={() => onNavigate(route.href, route.pro)}
             className={cn(`text-muted-foreground text-xs group flex p-3 w-full justify-start
             font-medium cursor-pointer hover:text-primary hover:bg-primary/10
              rounded-lg transition`, pathname === route.href && 'bg-primary/10 text-primary')}>
               <div className='flex gap-y-2 items-center flex-1'>
                 <route.icon className='h-5 w-5 mr-4'/>
                <p className='pt-1'>{route.label}</p>
               </div>
            </div>
          ))}

           <hr className='py-2 border-t border-primary/10'/>

          <div>
            {!isPro && (
               <Button size='sm' onClick={proModal.onOpen}
               className="bg-[#FA292A] hover:bg-[#f52121] transition text-white">
                Upgrade to plus
                <Sparkles className="h-4 w-4 fill-orange-500 text-yellow-500 ml-2"/>
               </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar