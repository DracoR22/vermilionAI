'use client'

import * as z from 'zod'
import { Category, Companion } from "@prisma/client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { ImageUpload } from '@/components/ImageUpload'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Wand2 } from 'lucide-react'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface CompanionFormProps {
    initialData: Companion | null
    categories: Category[]

}

const formSchema = z.object({
    name: z.string().min(3, { message: 'Please provide a valid name'}),
    description: z.string().min(6, { message: 'Please provide a valid description'}),
    instructions: z.string().min(200, { message: 'Instructions require at least 200 characters'}),
    seed: z.string().min(200, { message: 'Seeds require at least 200 characters'}),
    src: z.string().min(1, { message: 'Please upload an image'}),
    categoryId: z.string().min(1, { message: 'Please provide a category'}),
})

const CompanionForm = ({categories, initialData}: CompanionFormProps) => {

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
        description: '',
        instructions: '',
        seed: '',
        src: '',
        categoryId: undefined
     }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      //Update AI
      if(initialData) {
        await axios.patch(`/api/companion/${initialData.id}`, values)
        toast({title: 'Success!', description: `Your AI ${values.name} has been updated!`})
      } else {
        //Create AI
        await axios.post('/api/companion', values)
        toast({title: 'Success!', description: `We created your AI ${values.name}`})
      }
      
      router.refresh()
      router.push('/')

    } catch (error) {
      toast({variant: 'destructive', description: 'Something went wrong!'})
    }
  }

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if(!isMounted) return null

  return (
    <div className='h-full p-4 space-y-2 max-w-3xl '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 pb-10'>
          <div className='space-y-2 w-full'>
            <div>
                <h3 className='text-lg font-medium'>
                  General Information
                </h3>
                <p className='text-sm text-muted-foreground'>
                  General information about your Ai
                </p>
            </div>
            <Separator className='bg-primary/10'/>
          </div>
          {/* IMAGE */}
          <FormField name='src' render={({ field }) => (
            <FormItem className='flex flex-col items-center justify-center space-y-4'>
              <FormControl>
                <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* NAME */}
            <FormField name='name' control={form.control} render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                   <FormLabel>Name</FormLabel>
                   <FormControl>
                     <Input disabled={isLoading} placeholder='Your AI' {...field}/>
                   </FormControl>
                   <FormDescription>
                     This is how your AI will be named
                   </FormDescription>
                   <FormMessage/>
                </FormItem>
            )}/>
            {/* DESCRIPTION */}
            <FormField name='description' control={form.control} render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                   <FormLabel>Description</FormLabel>
                   <FormControl>
                     <Input disabled={isLoading} placeholder='Ai description' {...field}/>
                   </FormControl>
                   <FormDescription>
                     Describe your AI
                   </FormDescription>
                   <FormMessage/>
                </FormItem>
            )}/>
            {/* CATEGORY */}
            <FormField name='categoryId' control={form.control} render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange}
                    value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='bg-background'>
                           <SelectValue defaultValue={field.value}
                            placeholder='Select a category'/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}
                             className='cursor-pointer'>
                              {category.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                        Select a category for your AI
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}/>
          </div>
          {/* PROMPT AI TEXTFIELD */}
          <div className='space-y-2 w-full'>
             <div>
                <h3 className='text-lg font-medium'>
                    Configuration
                </h3>
                <p className='text-sm text-muted-foreground'>
                    Detailed instructions for AI Behaviour
                </p>
             </div>
             <Separator className='bg-primary/10'/>
          </div> 
          <FormField name='instructions' control={form.control} render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                   <FormLabel>Instructions</FormLabel>
                   <FormControl>
                     <Textarea className='bg-background resize-none' rows={7} disabled={isLoading}
                      placeholder='Your AI details...' {...field}/>
                   </FormControl>
                   <FormDescription>
                     Describe in detail your AI&apos;s functionality and behaviour
                   </FormDescription>
                   <FormMessage/>
                </FormItem>
            )}/>  

              <FormField name='seed' control={form.control} render={({ field }) => (
                <FormItem className='col-span-2 md:col-span-1'>
                   <FormLabel>Example Conversation</FormLabel>
                   <FormControl>
                     <Textarea className='bg-background resize-none' rows={7} disabled={isLoading}
                      placeholder='Example conversation between a human and your AI' {...field}/>
                   </FormControl>
                   <FormDescription>
                     Describe in detail your AI&apos;s functionality and behaviour
                   </FormDescription>
                   <FormMessage/>
                </FormItem>
            )}/>  
            <div className='w-full flex justify-center'>
              <Button size='lg' disabled={isLoading}>
                 {initialData ? 'Edit your AI' : 'Create your AI'}
                 <Wand2 className='w-4 h-4 ml-2'/>
              </Button>
            </div>
        </form>
      </Form>
    </div>
  )
}

export default CompanionForm