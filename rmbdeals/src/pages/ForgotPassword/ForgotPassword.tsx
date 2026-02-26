import logo from '@/assets/logo.jpg'
import { axios_instance } from "@/api/axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/schema/forgotPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "sonner"

const ForgotPassword = () => {
    const [isPending, setIsPending] = useState(false)
    const form = useForm<ForgotPasswordSchemaType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues:{
            email: ""
        }
    })

    const onSubmit = async (data:ForgotPasswordSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Submitting password reset request...", {
                id: "forgot"
            })

            const response = await axios_instance.post("/auth/forgot-password", {
                email: data.email
            })
            
            form.reset()
            setIsPending(false)
            toast.success(response.data.message, {
                id: "forgot"
            })
            
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "forgot"
                })
            }
        }
    }

    return (
        <>
            <header className='w-full py-4 border-b absolute z-50'>
                <nav className="container px-4 lg:px-0 mx-auto flex justify-between items-center py-2">
                <Link to={"../"} className='flex gap-2 items-center'>
                    <img src={logo} alt="logo" className='w-8 h-8'/>
                    <h1 className='text-3xl font-bold text-black'>RMB Deals</h1>
                </Link>
                </nav>
            </header>
            <div className='mx-auto container px-4 lg:px-0'>
                <div className='h-screen max-h-[800px] flex items-center justify-center sm:flex-col lg:flex-row'>
                    <Form {...form}>
                        <form className='p-4 lg:p-8 rounded-lg border' onSubmit={form.handleSubmit(onSubmit)}>
                            <h1 className='text-3xl lg:text-5xl mb-1 lg:mb-2'>Forgot Password?</h1>
                            <p className='text-xs mb-3 lg:mb-6 2xl:mb-8 text-gray-400' >Don't worry! It happens. Please enter the email address associated with your account and we'll send you reset instructions.</p>
                            
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col mb-8'>
                                        <FormLabel className='text-xs lg:text-sm font-bold'>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your email' {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">Please enter your accounts email address</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-4">
                                <button className='rounded-full flex items-center justify-center bg-black/90 px-12 text-white py-2 hover:bg-black' disabled={isPending}> 
                                    {!isPending && "Reset Password"}
                                    {isPending && <Loader2 className='animate-spin' /> }
                                </button>
                                <Link to={"../login"} className="flex items-center gap-2 hover:bg-[#FFDD6666] py-2 px-4 text-gray-700 rounded-full"> <ArrowLeft className="w-4 h-4" /> Back to log in</Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword
