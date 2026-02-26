import { useCallback, useState } from 'react'
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
import CurrencyUpdatePicker from './CurrencyUpdatePicker'
import { UpdateCurrencySchema, UpdateCurrencySchemaType } from '@/schema/currency'

interface Props{
    trigger?: React.ReactNode,
}

const UpdateCurrency = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const [id, setId] = useState("GHS")
    const axios_instance_token = useAxiosToken()

    const form = useForm<UpdateCurrencySchemaType>({
        resolver:zodResolver(UpdateCurrencySchema),
        defaultValues:{
            label: "",
            currency:"GHS",
            description: "",
        }
    })

    const updateCurrency = async (data:UpdateCurrencySchemaType)=>{
        console.log(data);
        
        const response = await axios_instance_token.patch(`/currencies/${id}`, {
            ...data
        },)

        return response.data
    }

    const handleCurrencyChange = useCallback((value:string)=>{
        form.setValue("currency", value)
        setId(value)
    }, [form])

    const {mutate, isPending} = useMutation({
        mutationFn: updateCurrency,
        onSuccess: ()=>{
            toast.success("Currency update successful", {
                id: "currency-update"
            })

            queryClient.invalidateQueries({queryKey: ["currencies-admin"]})

            form.reset({
                label: "",
                currency:"GHS",
                description: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "currency-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "currency-update"
                })
            }
        }
    })

    const onSubmit = (data:UpdateCurrencySchemaType)=>{
        toast.loading("Updating currency...", {
            id: "currency-update"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Update Currency
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <div className='flex mt-2 gap-2 w-full'>
                            <FormField 
                                control={form.control}
                                name="currency"
                                render={() =>(
                                    <FormItem className='flex flex-col w-full'>
                                        <FormLabel className='text-xs 2xl:text-sm'>Currency</FormLabel>
                                        <FormControl>
                                            <CurrencyUpdatePicker onChange={handleCurrencyChange}/>
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="rate"
                            render={({field}) =>(
                                <FormItem className='flex-1'>
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
                                <FormItem className='flex-1'>
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
                                <FormItem className='flex-1'>
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className=''
                    >
                        {!isPending && "Update Currency"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateCurrency
