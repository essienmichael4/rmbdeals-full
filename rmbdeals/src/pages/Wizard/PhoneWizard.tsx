import logo from '@/assets/logo.jpg'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import useAuth from '@/hooks/useAuth'
import useAxiosToken from '@/hooks/useAxiosToken'
import { UserPhoneSchema, UserPhoneSchemaType } from '@/schema/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const PhoneWizard = () => {
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const from = "../dashboard"
    const {auth, dispatch} = useAuth()
    const form = useForm<UserPhoneSchemaType>({
        resolver:zodResolver(UserPhoneSchema),
        defaultValues:{
            phone:"",
        }
    })

    const addPhoneNumber = async (data:UserPhoneSchemaType) => {
        const response = await axios_instance_token.patch(`/users/phone`, {
            phone: data.phone
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addPhoneNumber,
        onSuccess: (data)=>{
            toast.success("Phone updated successfully", {
                id: "currency"
            })
            dispatch({type:"ADD_AUTH", payload: {...(auth ?? {
                    id: undefined,
                    name: "",
                    email: "",
                    role: "",
                    backendTokens: {
                        accessToken: "",
                        refreshToken: "",
                    },
                }),
                phone: data.phone,
            }});
            navigate(from, {replace:true})
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "currency"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "currency"
                })
            }
        }
    })

    const onCurrencySetup = (data:UserPhoneSchemaType)=>{
        toast.loading("Updating your phone number ...", {
            id: "currency"
        })
        mutate(data)
    }

    return (<div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto max-w-2xl flex-col items-center justify-between gap-4'>
                <div>
                    <h1 className='text-center text-3xl'> Welcome, <span className='ml-2 font-bold'>{auth?.name}</span></h1>
                    <h2 className="text-center mt-4 text-base text-muted-foreground">Let &apos;s setup your phone number</h2>
                    <h3 className="text-center text-sm text-muted-foreground mt-2">You can change this at any time</h3>
                </div>
                <Separator />
                <Card className='w-full'>
                    <CardHeader >
                        <CardTitle>Phone</CardTitle>
                        <CardDescription>Set your default phone number for transactions</CardDescription>
                    </CardHeader>
                    <CardContent >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onCurrencySetup)}>
                                <FormField 
                                    control={form.control}
                                    name="phone"
                                    render={({field}) =>(
                                        <FormItem className='flex flex-col w-full'>
                                            <FormLabel className='text-xs 2xl:text-sm font-bold'>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Separator />
                <Button className='w-full' onClick={form.handleSubmit(onCurrencySetup)}>
                    {!isPending && "I'm done! Take me to the dashboard"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>

                <div className="mt-8">
                    <img src={logo} alt="logo" className='w-24'/>    
                </div>
            </div>
        </div>
    )
}

export default PhoneWizard
