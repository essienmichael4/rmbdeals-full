import logo from '@/assets/logo.jpg'
import { axios_instance } from "@/api/axios"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form"
import { ResetPasswordSchema, ResetPasswordSchemaType } from "@/schema/forgotPassword"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PasswordInput } from '@/components/ui/password-input'

const PasswordReset = () => {
    const navigate = useNavigate()
    const [account, setAccount] = useState<{id:string | null, email:string | null}>({id: null, email: null});
    const [isPending, setIsPending] = useState(false)
    const form = useForm<ResetPasswordSchemaType>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues:{
            password: "",
            confirmPassword: ""
        }
    })

    // useEffect(()=>{
        // const urlSearchString = window.location.search;
    
        // const params = new URLSearchParams(urlSearchString);
        // setAccount({id: params?.get('id'), email: params?.get('email')})
        // console.log(account.id)
        // console.log(account.email)
        // if(account.id === null || account.email === null ){
        //     navigate("../login")
        // }
    //   },[])

    const onSubmit = async (data:ResetPasswordSchemaType) =>{
        try{
            const urlSearchString = window.location.search;
    
            const params = new URLSearchParams(urlSearchString);
            setAccount({id: params?.get('id'), email: params?.get('email')})

            if(!account.id || !account.email){
                toast.error("A token ID and email is needed for this request. Please try resetting your account first.", {
                    id: "reset"
                })
                return
            }

            setIsPending(true)
            toast.loading("Resetting your account password...", {
                id: "reset"
            })

            const response = await axios_instance.post("/auth/reset-password", {
                ...data, token: account.id
            })
            
            form.reset()
            setIsPending(false)
            navigate("../login")
            toast.success(response.data.message, {
                id: "reset"
            })
            
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "reset"
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
                            <h1 className='text-3xl lg:text-5xl mb-1 lg:mb-2'>Reset Password?</h1>
                            <p className='text-xs mb-3 lg:mb-6 2xl:mb-8 text-gray-400' >Time for a fresh start! Go ahead and set a new passord for {account.email}.</p>
                            
                            <FormField 
                                control={form.control}
                                name="password"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col mb-8'>
                                        <FormLabel className='text-xs lg:text-sm font-bold'>New Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput 
                                                className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your password'
                                                {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">Must be at least 8 characters</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col mb-8'>
                                        <FormLabel className='text-xs lg:text-sm font-bold'>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput 
                                                className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please confirm your password'
                                                {...field} />
                                        </FormControl>
                                        
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

export default PasswordReset
