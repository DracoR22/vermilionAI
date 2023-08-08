import prismadb from "@/lib/prismadb"
import CompanionForm from "./components/CompanionForm"
import { auth, redirectToSignIn } from "@clerk/nextjs"

interface CompanionIdPageProps {
    params: {
        companionId: string
    }
}

const CompanionIdPage = async ({params}: CompanionIdPageProps) => {

  const {userId} = auth()

 //TODO: Check subscription

 if(!userId) {
  return redirectToSignIn()
 }

 const companion = await prismadb.companion.findUnique({
    where: {
        id: params.companionId
    }
 })

 const categories = await prismadb.category.findMany()

  return (
    <div className="h-full p-4 space-y-2 md:ml-[130px] mt-2">
       <CompanionForm initialData={companion} categories={categories}/>
    </div>
  )
}

export default CompanionIdPage