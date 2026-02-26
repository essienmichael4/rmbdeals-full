import logo from '@/assets/logo.jpg'
import CurrencyUpdatePicker from '@/components/CurrencyUpdatePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useAuth from '@/hooks/useAuth'
import useAxiosToken from '@/hooks/useAxiosToken'
import { SetUserCurrencySchema, SetUserCurrencySchemaType } from '@/schema/currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Wizard = () => {
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const from = "../dashboard"
    const {auth} = useAuth()
    const form = useForm<SetUserCurrencySchemaType>({
        resolver:zodResolver(SetUserCurrencySchema),
        defaultValues:{
            currency:"GHS",
        }
    })

    const setUpCurrency = async (data:SetUserCurrencySchemaType) => {
        const response = await axios_instance_token.patch(`/users/currency`, {
            currency: data.currency
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: setUpCurrency,
        onSuccess: ()=>{
            toast.success("Currency added successfully", {
                id: "currency"
            })
            navigate(from, {replace:true})
        },onError: (err:any) => {
            console.log(err);
            
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

    const onCurrencySetup = (data:SetUserCurrencySchemaType)=>{
        toast.loading("Setting up your currency ...", {
            id: "currency"
        })
        mutate(data)
    }

    const handleCurrencyChange = useCallback((value:string)=>{
        form.setValue("currency", value)
    }, [form])

    return (<div className='container flex mx-auto w-full items-center justify-between'>
            <div className='flex mx-auto max-w-2xl flex-col items-center justify-between gap-4'>
                <div>
                    <h1 className='text-center text-3xl'> Welcome, <span className='ml-2 font-bold'>{auth?.name}</span></h1>
                    <h2 className="text-center mt-4 text-base text-muted-foreground">Let &apos;s get started by setting up your currency</h2>
                    <h3 className="text-center text-sm text-muted-foreground mt-2">You can change this settings at any time</h3>
                </div>
                <Separator />
                <Card className='w-full'>
                    <CardHeader >
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>Set your default currency for transactions</CardDescription>
                    </CardHeader>
                    <CardContent >
                    <CurrencyUpdatePicker onChange={handleCurrencyChange}/>
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

export default Wizard
