import Navbar from "@/components/Navbar"
import SideBar from "@/components/SideBar"
import { checkSubscription } from "@/lib/subscription"

const RootLayout = async ({ children }: {children: React.ReactNode}) => {

 const isPro = await checkSubscription()

    return (
        <div className="h-full">
            <Navbar/>
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
             <SideBar isPro={isPro}/>
            </div>
            <main className="md:pl-20 pt-16 h-full">
            {children}
            </main>
        </div>
    )
}

export default RootLayout