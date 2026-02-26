import { Link, useNavigate } from 'react-router-dom'
import hero from '../../assets/hero.jpg'
import Footer from '@/components/Footer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, LoginSchemaType } from '@/schema/login'
import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import axios from 'axios'
import { axios_instance } from '@/api/axios'
import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import Header from '@/components/Header'

const Login = () => {
    const {dispatch} = useAuth()
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data:LoginSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Logging in...", {
                id: "login"
            })

            const response = await axios_instance.post("/auth/login", {
                email: data.email,
                password: data.password
            })
            
            dispatch({type: "ADD_AUTH", payload: response.data})
            form.reset()
            setIsPending(false)
            toast.success("Login successful", {
                id: "login"
            })
            
            if(!response.data.phone) {
                navigate("/wizard", {replace:true})
            }else{
                navigate("/dashboard", {replace:true})
            }
            
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "login"
                })
            }
        }
    }

  return (
    <>
        <Header />
        <div className='mx-auto container -mt-20'>
            <div className='h-screen max-h-[800px] flex items-center justify-between sm:flex-col lg:flex-row'>
                <div className='absolute rounded-t-3xl bottom-0 lg:relative w-full lg:w-[40%] pt-4 px-4 bg-white lg:px-0 lg:h-full  lg:mt-0 flex flex-col justify-end lg:justify-center gap-4 pb-4 lg:pb-0'>
                    <Form {...form}>
                        <form className='md:w-full xl:w-[80%]' onSubmit={form.handleSubmit(onSubmit)}>
                            <h1 className='text-3xl lg:text-5xl mb-1 lg:mb-2 2xl:mb-4'>Login</h1>
                            <p className='text-xs mb-3 lg:mb-6 2xl:mb-8 text-gray-400' >The faster you type, the faster you manage your stuff</p>
                            
                            <FormField 
                                control={form.control}
                                name="email"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col gap-2 mb-4'>
                                        <FormLabel className='text-xs lg:text-sm font-bold'>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your email' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="password"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col gap-2 mb-1'>
                                        <FormLabel className='text-xs lg:text-sm font-bold'>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput 
                                                className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your password'
                                                {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className='flex justify-between mt-1 mb-4'>
                                <p className='text-xs 2xl:text-sm text-gray-300 mb-0'>Minimum 8 characters</p>
                                <Link to={'../forgot-password'} className='text-blue-400 text-xs 2xl:text-sm'>forgot password</Link>
                            </div>
                            <button className='rounded-full flex items-center justify-center bg-blue-300 w-full text-white py-2 hover:bg-blue-500' disabled={isPending}> 
                                {!isPending && "Login"}
                                {isPending && <Loader2 className='animate-spin' /> }
                            </button>
                            <div className='flex gap-2 mb-3 mt-2'>
                                <p className='text-gray-400 text-xs 2xl:text-sm'>Don't have an account?</p>
                                <Link to={"../register"} className='text-xs 2xl:text-sm text-blue-300'>Register</Link>
                            </div>
                        </form>
                    </Form>
                </div>
                <div className='absolute w-full top-0 left-0 lg:left-20 -z-10 lg:relative lg:rounded-none lg:-right-20 lg:w-[60%] h-full bg-slate-500 flex bg-cover bg-center' style={{backgroundImage:`url(${hero})`}}>
                    <div className="overlay w-full h-full bg-black opacity-30 sm:hidden"></div>
                </div>
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Login
