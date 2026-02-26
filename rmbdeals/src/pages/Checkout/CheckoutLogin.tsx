import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../../components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { LoginSchemaType, LoginSchema } from '@/schema/login'
import { axios_instance } from '@/api/axios'
import { useMutation, useQueryClient} from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import axios from 'axios'

interface Props{
    trigger?: React.ReactNode,
    id:string,
    setForm: (name: string, email:string) => void
}

const CheckoutLogin = ({trigger, id, setForm}:Props) => {
    const {dispatch} = useAuth()
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    
    const form = useForm<LoginSchemaType>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    const checkoutLogin = async (data:LoginSchemaType)=>{
        const response = await axios_instance.post(`/orders/checkout/login/${id}`, {
            ...data
        })

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: checkoutLogin,
        onSuccess: (data)=>{
            console.log(data)
            toast.success("Login successful", {
                id: "login"
            })

            dispatch({type: "ADD_AUTH", payload: data})
            setForm(data?.name, data?.email)

            form.reset({
                email: "",
                password: ""
            })

            queryClient.invalidateQueries({queryKey: ["order"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "login"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "login"
                })
            }
        }
    })

    const onSubmit = (data:LoginSchemaType)=>{
        toast.loading("Logging in...", {
            id: "login"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Login
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password'/>
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
                            className='hover:bg-gray-300'
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='mb-2 lg:mb-0 bg-[#FFDD66] hover:bg-[#FFDD6676] text-black'
                    >
                        {!isPending && "Login"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CheckoutLogin
