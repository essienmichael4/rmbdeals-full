import { useState } from 'react'
import logo from '@/assets/logo.jpg'
import CheckoutLogin from './CheckoutLogin'
import Footer from '@/components/Footer'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from '../../components/ui/button'
import { Link, useParams, useNavigate, NavLink } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import { Order } from '@/lib/types'
import { Loader2, LogOut, Menu, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@/hooks/useAuth'
import axios from 'axios'
import { axios_instance } from '@/api/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { RegisterUserCheckoutSchema, RegisterUserCheckoutSchemaType } from '@/schema/checkout'
import useAxiosToken from '@/hooks/useAxiosToken'

const Checkout = () => {
    const {auth, dispatch} = useAuth()
    const axios_instance_token = useAxiosToken()
    const navigate = useNavigate()
    const {id} =useParams()
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
    const form = useForm<RegisterUserCheckoutSchemaType>({
        resolver:zodResolver(RegisterUserCheckoutSchema),
        defaultValues:{
            password:"",
            name: auth ? auth.name : "",
            notes: "",
            email: auth ? auth.email : "",
            whatsapp: auth ? auth?.phone : "",
            momoName: "",
        }
    })


    const toggleNavbar = ()=>{
      setMobileDrawerOpen(!mobileDrawerOpen)
    }
    
    const setForm = (name:string, email: string)=>{
        form.setValue("name", name)
        form.setValue("email", email)
    }

    const fetchOrder = async ()=>{
        if(auth){
            const response = await axios_instance_token.get(`/orders/checkout/info/${id}`)
            const order:Order = response.data
            return order
        }else{
            const response = await axios_instance.get(`/orders/checkout/info/nonuser/${id}`)
            const order:Order = response.data
            return order
        }
    }

    const order = useQuery<Order>({
        queryKey: ["order"],
        queryFn: async() => await fetchOrder()
    })

    const addBilling = async (data:RegisterUserCheckoutSchemaType) => {
        if(auth){
            const response = await axios_instance_token.post(`/orders/checkout/${id}`, {
                name: data.name,
                email: data.email,
                momoName: data.momoName,
                whatsapp: data.whatsapp,
                notes: data.notes
            },)

            return response.data
        }else{
            const response = await axios_instance.post(`/orders/checkout/register/${id}`, {
                name: data.name,
                email: data.email,
                momoName: data.momoName,
                whatsapp: data.whatsapp,
                notes: data.notes,
                password: data.password
            })

            dispatch({type: "ADD_AUTH", payload: response.data.user})

            return response.data
        }
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addBilling,
        onSuccess: (data)=>{
            toast.success(data.message, {
                id: "billing"
            })

            form.reset({
                password:"",
                name: auth ? auth.name : "",
                notes: "",
                email: auth ? auth.email : "",
                whatsapp: auth ? auth?.phone : "",
                momoName: "",
            })

            navigate("../dashboard")
        },
        onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "billing"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "billing"
                })
            }
        }
    })

    const onSubmit = (data:RegisterUserCheckoutSchemaType)=>{
        toast.loading("Adding billing information...", {
            id: "billing"
        })
        mutate(data)
    }

    return (
        <>
            <header className={`${!auth && 'py-4'} w-full border-b sticky top-0 z-50 bg-white`}>
                <nav className={`${!auth && 'py-2'} container px-4 lg:px-0 mx-auto flex justify-between items-center`}>
                    {auth ? 
                        <Link to={"../dashboard"} className='flex gap-2 items-center'>
                            <img src={logo} alt="logo" className='w-8 h-8'/>
                            <h1 className='text-3xl font-bold text-black'>RMB Deals</h1>
                        </Link>
                        :
                        <Link to={"../"} className='flex gap-2 items-center'>
                            <img src={logo} alt="logo" className='w-8 h-8'/>
                            <h1 className='text-3xl font-bold text-black'>RMB Deals</h1>
                        </Link>
                    }
                    {auth && 
                        <div className='hidden lg:flex gap-8 h-full items-center'>
                            <NavLink to={"../dashboard"} className={`inline-block py-10 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]`}>Dashboard</NavLink>
                            <NavLink to={"../orders"} className='inline-block py-10 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Orders</NavLink>
                            <NavLink to={"../account"} className='inline-block py-10 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Account</NavLink>
                        </div>
                    }

                    {auth &&
                        <div className='flex gap-2 md:gap-4 items-center'>
                            <Link className='py-2 px-4 lg:px-6 rounded-full text-md font-medium text-white bg-black' to={"buy"}>Buy</Link>
                            <div className="flex items-center">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className='w-12 h-12 rounded-full bg-white'><User className="h-8 w-8" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={()=>{
                                            dispatch({type:"REMOVE_AUTH",payload: undefined})
                                        }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="lg:hidden md:flex flex-col items-center justify-end">
                                <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
                            </div>
                        </div>
                    }
                    {!auth && 
                    <CheckoutLogin id={id as string} setForm={setForm} trigger={
                        <Button className='rounded-full text-black text-md font-medium bg-[#FFDD66] hover:bg-[#FFDD6676]'>Login</Button>} /> }
                </nav>
                {auth && mobileDrawerOpen && 
                    <div className="fixed right-0 z-20 w-full bg-white p-12 flex flex-col justify-center items-center lg:hidden border-y">
                    <ul>
                        <li className='py-2 text-center'>
                        <NavLink to={"dashboard"} className={`text-gray-500 hover:text-[#FFDD66]`}>Dashboard</NavLink>
                        </li>
                        <li className='py-2 text-center'>
                        <NavLink to={"orders"} className='text-gray-500 hover:text-[#FFDD66]'>Orders</NavLink>
                        </li>
                        <li className='py-2 text-center'>
                        <NavLink to={"account"} className='text-gray-500 hover:text-[#FFDD66]'>Account</NavLink>
                        </li>
                    </ul>
                    
                    </div>
                }
            </header>
            <div className='mx-auto container mt-4 mb-16 px-4 lg:px-0'>
                <h4 className="text-2xl lg:text-3xl font-bold  lg:mb-2">Checkout Order</h4>
                <p className="text-xs text-gray-400 mb-2">Fill in the details for your billing</p>
                <hr />
                <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
                <Form {...form}>
                    <form className='mx-auto mt-4 lg:mt-12 w-full space-y-4 lg:space-y-0 lg:w-3/4 flex flex-wrap' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='w-full lg:w-1/2 lg:px-2'>
                            <div className="w-full border rounded-2xl p-4">
                                <div className='flex flex-col justify-between mb-2'>
                                    <h5 className='text-xl font-bold'>Billing Details</h5>
                                    {!auth &&
                                    <div className="flex items-center gap-2">
                                        <span className='text-red-500 text-3xl'>&#9888;</span>
                                        <div>
                                            <p className='text-xs  text-gray-500'>
                                            Please <CheckoutLogin id={id as string} setForm={setForm} trigger={<button className='text-[#dab531] underline'>login</button>} /> if you already have an account. Otherwise, continue to fill the form.
                                            </p>
                                        </div>
                                    </div>
                                    }
                                </div>
                                <hr />
                                <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                <div className='mt-2 lg:mt-4 flex flex-col items-center lg:gap-4 gap-2 w-full'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) =>(
                                            <FormItem className='flex-1 flex flex-col w-full'>
                                                <FormLabel className='text-xs 2xl:text-sm font-bold'>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField 
                                        control={form.control}
                                        name="whatsapp"
                                        render={({field}) =>(
                                            <FormItem className='flex flex-col w-full'>
                                                <FormLabel className='text-xs 2xl:text-sm font-bold'>WhatsApp Number</FormLabel>
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
                                            <FormItem className='flex flex-col w-full'>
                                                <FormLabel className='text-xs 2xl:text-sm font-bold'>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                {!auth && <FormDescription>This email will be used to create an account for you.</FormDescription>}
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField 
                                        control={form.control}
                                        name="momoName"
                                        render={({field}) =>(
                                            <FormItem className='flex-1 flex flex-col w-full'>
                                                <FormLabel className='text-xs 2xl:text-sm font-bold'>Name on Momo Account</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )} 
                                    />

                                    {!auth &&
                                        <FormField 
                                            control={form.control}
                                            name="password"
                                            render={({field}) =>(
                                                <FormItem className='flex flex-col w-full'>
                                                    <FormLabel className='text-xs 2xl:text-sm font-bold'>Account Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <p className='text-xs 2xl:text-sm text-gray-300 mb-0'>Minimum 8 characters</p>
                                                    <FormDescription>This is the password that you will use to access your account to manage your orders</FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    }
                                </div>


                                <div className="mb-2 mt-4">
                                    <h5 className='text-xl font-bold'>Additional Notes</h5>
                                </div>
                                <hr />
                                <div className='h-1 w-36 relative hidden lg:block bg-[#FFDD66] -top-1'></div>

                                <FormField 
                                    control={form.control}
                                    name="notes"
                                    render={({field}) =>(
                                        <FormItem className='flex mt-4 flex-col'>
                                            <FormLabel className='mr-2 text-xs 2xl:text-sm font-bold'>Order Note (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormDescription>Special notes for delivery.</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='w-full lg:w-1/2 lg:px-2'>
                            <div className="w-full border rounded-2xl p-4">
                                <div className='flex justify-between mb-2'>
                                    <h5 className='text-xl font-bold'>Your Order ID: {id}</h5>
                                </div>
                                <hr />
                                <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                
                                <div>
                                    <div className='flex justify-between my-2'>
                                        <h4>PRODUCT</h4>
                                        <p>SUBTOTAL</p>
                                    </div>
                                    <div className='flex justify-between my-2'>
                                        <p>Name: <span className='font-bold'>{order.data?.product}</span></p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Rate</p>
                                        <p>{order.data?.rate}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>Amount in {order.data?.currency}</p>
                                        <p>{order.data?.currency} {order.data?.amount}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p>RMB Equivalence</p>
                                        <p>¥ {order.data?.rmbEquivalence}</p>
                                    </div>
                                    
                                    <div className='flex justify-between mb-4'>
                                        <p>Account Type: <span className='font-bold'>Personal</span></p>
                                    </div>
                                    <hr />
                                    <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                    
                                    <div className='flex justify-between my-4'>
                                        <p>Subtotal</p>
                                        <p className='font-bold'>{order.data?.currency} {order.data?.amount}</p>
                                    </div>
                                    <hr />
                                    <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                    <div className='flex justify-between my-4'>
                                        <p>Total</p>
                                        <p className='font-bold'>{order.data?.currency} {order.data?.amount}</p>
                                    </div>
                                    <hr />
                                    <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                </div>

                                <div className="mb-2 mt-4">
                                    <h5 className='text-xl font-bold mb-2'>Momo/Bank Payment Details</h5>

                                    <hr />
                                    <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className='text-red-500 mr-2 text-3xl'>&#9888;</span>
                                        <div>
                                            <p className='text-xs  text-gray-500'>
                                                Make your payment directly into our momo or bank account. 
                                            </p>
                                            <p className='text-xs  text-gray-500'>Please use your Order ID as the refrence.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2 mt-4 gap-2 flex flex-col">
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Momo Number</h4>
                                        <p className='text-sm'>+233 552-771-004</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Merchant ID <span className='font-normal'>(If using MTN Momo Pay & Pay Bill)</span></h4>
                                        <p className='text-sm'>725120</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Merchant Name</h4>
                                        <p className='text-sm'>CLIXMA TRADING ENTERPRISE</p>
                                    </div>
                                </div>
                                
                                <hr />
                                <div className='h-1 w-36 relative block bg-[#FFDD66] -top-1'></div>

                                <div className="mb-2 mt-4 gap-2 flex flex-col">
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Bank Name</h4>
                                        <p className='text-sm'>GCB PLC</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Account Number</h4>
                                        <p className='text-sm'>1391180001895</p>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h4 className='font-bold text-xs'>Account Name</h4>
                                        <p className='text-sm'>CLIXMA TRADING</p>
                                    </div>
                                </div>

                                <Button className='mt-4' disabled={isPending}>
                                    {!isPending && "Place Order"}
                                    {isPending && <Loader2 className='animate-spin' /> }
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
            <Footer />
        </>
    )
}

export default Checkout
