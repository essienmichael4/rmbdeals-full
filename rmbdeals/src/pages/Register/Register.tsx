import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import hero from '../../assets/hero.jpg'
// import logo from '@/assets/logo.jpg'
import Footer from '@/components/Footer'
import useAuth from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios from 'axios'
import { axios_instance } from '@/api/axios'
import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterSchemaType, RegisterSchema } from '@/schema/register'
import { PasswordInput } from '@/components/ui/password-input'
import Header from '@/components/Header'

const Register = () => {
    const {dispatch} = useAuth()
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()
    const from = "../wizard"
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data:RegisterSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Creating Account...", {
                id: "register"
            })

            const response = await axios_instance.post("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword
            })
            
            dispatch({type: "ADD_AUTH", payload: response.data})
            form.reset()
            setIsPending(false)
            toast.success("Account created successfully", {
                id: "register"
            })
            navigate(from, {replace:true})
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "register"
                })
            }
        }
    }

  return (
    <>
        <Header />
        <div className='mx-auto container -mt-20'>
            <div className='h-screen max-h-[800px] flex items-center justify-between sm:flex-col lg:flex-row'>
                <div className='absolute rounded-t-3xl bottom-0 lg:relative w-full lg:w-[40%] pt-4 px-4 bg-white lg:px-0 lg:h-full lg:mt-0 flex flex-col justify-end lg:justify-center gap-4 pb-4 lg:pb-0'>
                    <Form {...form}>
                        <form className='md:w-full xl:w-[80%] lg:pt-12' onSubmit={form.handleSubmit(onSubmit)}>
                            <h1 className='text-2xl lg:text-4xl mb-0 2xl:mb-2'>Register</h1>
                            <p className='text-xs mb-3 2xl:mb-6 text-gray-400' >The faster you type, the faster you manage your stuff</p>
                            
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col 2xl:gap-2 mb-2'>
                                        <FormLabel className='text-xs 2xl:text-sm font-bold'>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='py-1 px-2 text-xs 2xl:text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your name' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="email"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col 2xl:gap-2 mb-2'>
                                        <FormLabel className='text-xs 2xl:text-sm font-bold'>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='py-1 px-2 text-xs 2xl:text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your email' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="password"
                                render={({field}) =>(
                                    <FormItem className='flex flex-col 2xl:gap-2 mb-1'>
                                        <FormLabel className='text-xs 2xl:text-sm font-bold'>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput 
                                                className='py-1 px-2 text-xs 2xl:text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please enter your password' {...field} 
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-between mt-1 mb-1'>
                                <p className='text-xs 2xl:text-sm text-gray-300 mb-0'>Minimum 8 characters</p>
                            </div>
                            
                            <FormField 
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) =>(
                                    <FormItem className='form-control flex flex-col 2xl:gap-2 mb-2 2xl:mb-3'>
                                        <FormLabel className='text-xs 2xl:text-sm font-bold'>Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput 
                                                className='py-1 px-2 text-xs 2xl:text-sm rounded border border-slate-200 w-full' 
                                                placeholder='Please confirm your password'
                                                 {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <button className='rounded-full flex items-center justify-center bg-blue-300 w-full mt-2 text-white py-1 2xl:py-2 hover:bg-blue-500' disabled={isPending}>
                                {!isPending && 'Register'}
                                {isPending && <Loader2 className='animate-spin' /> }
                            </button>
                            <div className='flex gap-2 lg:mb-3 mt-2'>
                                <p className='text-gray-400 text-xs 2xl:text-sm'>Already have an account?</p>
                                <Link to={"../login"} className='text-xs 2xl:text-sm text-blue-300'>Login</Link>
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

export default Register
