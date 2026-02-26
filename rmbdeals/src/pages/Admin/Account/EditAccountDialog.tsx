import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserUpdateSchema, UserUpdateSchemaType } from '@/schema/user'
import { useMutation } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'

interface Props{
    trigger?: React.ReactNode,
}

const EditAccountDialog = ({trigger}:Props) => {
    const {dispatch} = useAuth()
    const axios_instance_token = useAxiosToken()
    const [open, setOpen] = useState(false)

    const form = useForm<UserUpdateSchemaType>({
        resolver:zodResolver(UserUpdateSchema),
        defaultValues:{
            name: "",
            email: ""
        }
    })

    const updateUser = async (data:UserUpdateSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/account`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateUser,
        onSuccess: (data)=>{
            toast.success("Account update successful", {
                id: "user-update"
            })

            dispatch({type:"REMOVE_AUTH", payload: data})

            form.reset({
                email: "",
                name: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "user-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "user-update"
                })
            }
        }
    })

    const onSubmit = (data:UserUpdateSchemaType)=>{
        toast.loading("upadating account...", {
            id: "user-update"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Account
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Email</FormLabel>
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
                        {!isPending && "Edit Account"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAccountDialog
