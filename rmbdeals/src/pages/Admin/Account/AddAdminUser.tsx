import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { RegisterAdminSchema, RegisterAdminSchemaType } from '@/schema/register'

interface Props{
    trigger?: React.ReactNode,
}

const AddAdminUser = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()

    const form = useForm<RegisterAdminSchemaType>({
        resolver:zodResolver(RegisterAdminSchema),
        defaultValues:{
            name: "",
            email: "",
        }
    })

    const addAdmin = async (data:RegisterAdminSchemaType)=>{
        const response = await axios_instance_token.post(`/auth/admin`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAdmin,
        onSuccess: ()=>{
            toast.success("Admin user added successfully", {
                id: "add-admin"
            })

            form.reset({
                name: "",
                email: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "add-admin"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-admin"
                })
            }
        }
    })

    const onSubmit = (data:RegisterAdminSchemaType)=>{
        toast.loading("Adding admin user...", {
            id: "add-admin"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Change Password
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
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
                        {/* <FormField 
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        /> */}
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-[#47C9D1] hover:bg-[#106981]'
                    >
                        {!isPending && "Add Admin"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAdminUser
