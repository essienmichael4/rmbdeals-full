import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { CurrencySchema, CurrencySchemaType } from '@/schema/currency'

interface Props{
    trigger?: React.ReactNode,
}

const AddCurrency = ({trigger}:Props) => {
    const queryClient = useQueryClient()
    const axios_instance_token = useAxiosToken()
    const [open, setOpen] = useState(false)

    const form = useForm<CurrencySchemaType>({
        resolver:zodResolver(CurrencySchema),
        defaultValues:{
            label: "",
            currency:"",
            description: ""
        }
    })

    const addCurrency = async (data:CurrencySchemaType)=>{
        const response = await axios_instance_token.post(`/currencies`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addCurrency,
        onSuccess: ()=>{
            toast.success("Currency added successful", {
                id: "currency-add"
            })

            queryClient.invalidateQueries({queryKey: ["currencies-admin"]})

            form.reset({
                label: "",
                currency:"",
                description: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "currency-add"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "currency-add"
                })
            }
        }
    })

    const onSubmit = (data:CurrencySchemaType)=>{
        toast.loading("Adding new currency...", {
            id: "currency-add"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add New Currency
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="currency"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Currency</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="rate"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Rate</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='number' placeholder='0' />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="label"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />

                        <FormField 
                            control={form.control}
                            name="description"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-[#FFDD66] hover:bg-[#FFDD76] text-black'
                    >
                        {!isPending && "Add Currency"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddCurrency
