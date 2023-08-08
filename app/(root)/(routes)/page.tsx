import Categories from "@/components/Categories"
import Companions from "@/components/Companions"
import SearchInput from "@/components/SearchInput"
import prismadb from "@/lib/prismadb"

interface RootPageProps {
  searchParams: {
    categoryId: string
    name: string
  }
}

const Home = async ({searchParams}: RootPageProps) => {

 const data = await prismadb.companion.findMany({
  where: {
    categoryId: searchParams.categoryId,
    name: {
      contains: searchParams.name
    }
  },
  orderBy: {
    createdAt: 'desc'
  },
  include: {
    _count: {
      select: {
        messages: true
      }
    }
  }
 })

 const categories = await prismadb.category.findMany()

    return (
      <div className="h-full p-4 space-y-2 md:ml-[130px] mt-2">
        <SearchInput/>
        <Categories data={categories}/>
        <Companions data={data}/>
      </div>
    )
  }
  
  export default Home