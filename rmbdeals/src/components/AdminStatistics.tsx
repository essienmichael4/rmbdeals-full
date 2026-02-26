import useAxiosToken from '@/hooks/useAxiosToken'
import { Currency, Revenue, RevenueCurrency, Stats } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowBigDown, Edit, Plus } from 'lucide-react'
import UpdateCurrency from './UpdateCurrency'
import AddCurrency from './AddCurrency'

interface Props{
    from: Date,
    to:Date
}

const AdminStatistics = ({from, to}:Props) => {
    const axios_instance_token = useAxiosToken()

    const stats = useQuery<Stats>({
        queryKey: ["summary-admin", from, to],
        queryFn: async() => await axios_instance_token.get(`/stats/statistics-admin?from=${from}&to=${to}`).then(res => {
            console.log(res.data);
            
            return res.data})
    })

    const currencies = useQuery<Currency[]>({
        queryKey: ["currencies-admin"],
        queryFn: async() => await axios_instance_token.get(`/currencies`).then(res => res.data)
    })
    
    const revenue = useQuery<Revenue>({
        queryKey: ["revenue", from, to],
        queryFn: async() => await axios_instance_token.get(`/orders/admin/revenue?from=${from}&to=${to}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    return (
        <>
            <div className="flex items-center flex-wrap">
                <div className="flex items-center flex-wrap w-full mt-4">
                    <div className="w-full sm:w-1/2 xl:w-1/3 p-2">
                        <div className="flex flex-col px-4 rounded-2xl ">
                            <div className="rounded-xl mb-4 flex justify-between items-center">
                                <h4 className="font-bold text-2xl">Current Rates</h4>
                                <div className='flex items-center gap-2'> 
                                    <UpdateCurrency trigger={
                                        <button className=' bg-black rounded-full p-2 hover:bg-black/70'><Edit className='text-white' /></button>
                                    } />
                                    
                                    <AddCurrency trigger={
                                        <button className=' border border-black rounded-full p-2 hover:bg-gray-300'><Plus className='text-black' /></button>
                                    } />
                                </div>
                            </div>
                            <hr/>
                            <div className='mt-4 flex flex-col gap-4'>
                                {currencies.data?.map((currency:Currency)=>{
                                    return (
                                        <div key={currency.currency} className='flex items-center justify-between'>
                                            {/* <h5 className='text-lg'>{currency.description}</h5> */}
                                            <div className='flex gap-2 w-full'>
                                                <div className='w-8 h-8 flex flex-1 justify-center text-sm lg:text-lg items-center bg-emerald-300 rounded-sm'>{currency.label}</div>
                                                <div className='flex items-center justify-center text-lg px-2 bg-black text-white rounded-sm'>{currency.rate}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 xl:w-1/3 p-2">
                        <div className="flex flex-col px-4 rounded-2xl ">
                            <div className="rounded-xl mb-4 flex justify-between items-center">
                                <h4 className="font-bold text-2xl">Total Revenue</h4>
                                <div className='w-10 h-10  rounded-full'></div>
                            </div>
                            <hr/>
                            <div className='mt-4 flex flex-col gap-4'>
                                {
                                    revenue.data?.completedRevenue.map((revenue:RevenueCurrency, i:number) =>{
                                        // const currency = currencies.data?.find(val => revenue.currency === val.currency)
                                        return (
                                            <div key={i} className='flex items-center justify-between'>
                                                <h5 className='text-lg'>{revenue.currency}</h5>
                                                <div className='flex gap-2'>
                                                    {/* <div className='w-8 h-8 flex justify-center text-lg items-center bg-emerald-300 rounded-sm'>{currency?.label}</div> */}
                                                    <div className='flex items-center justify-center text-lg px-2 bg-black text-white rounded-sm'>{revenue.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 xl:w-1/3 p-2">
                        <div className="flex flex-col bg-black px-4 py-4 rounded-2xl ">
                            <div className="rounded-xl mb-4 flex justify-between items-center">
                                <h4 className="font-bold text-white text-2xl">Unprocessed Revenue</h4>
                                <div className='w-10 h-10 rounded-full'></div>
                            </div>
                            <hr/>
                            <div className='mt-4 flex flex-col gap-4'>
                                {
                                    revenue.data?.heldRevenue.map((revenue:RevenueCurrency, i:number) =>{
                                        // const currency = currencies.data?.find(val => revenue.currency === val.currency)
                                        return (
                                            <div key={i} className='flex items-center justify-between'>
                                                <h5 className='text-lg text-white'>{revenue.currency}</h5>
                                                <div className='flex gap-2'>
                                                    {/* <div className='w-8 h-8 flex justify-center text-lg items-center bg-emerald-300 rounded-sm'>{currency?.label}</div> */}
                                                    <div className='flex items-center justify-center text-lg px-2 bg-white text-black rounded-sm'>{revenue?.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="flex items-center flex-wrap mt-8">
                <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
                    <div className="flex flex-col  rounded-2xl bg-gray-500">
                        <div className="bg-black text-[#FFDD66] rounded-xl p-4">
                        <ArrowBigDown className="w-10 h-10 mb-4"/>
                        <h4 className="font-bold text-sm">Total Revenue</h4>
                        <p className="text-xl">{stats.data?.successfulExpense || 0}</p>
                        </div>
                        <div className="p-4 text-black">
                        <h4 className=" font-bold text-sm">Cancelled Orders</h4>
                        <p className="text-lg">{stats.data?.cancelledOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
                    <div className="flex flex-col p-[2px] rounded-2xl bg-gray-200">
                        <div className="bg-white rounded-2xl p-4">
                        <ArrowBigDown className="w-8 h-8 mb-4"/>
                        <h4 className="font-bold text-sm">Total Orders</h4>
                        <p className="text-lg">{stats.data?.totalOrders}</p>
                        </div>
                        <div className="p-4 mt-2">
                            <h4 className="font-bold text-sm">Projected Revenue</h4>
                            <p className="text-lg">{stats.data?.projectedExpense || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
                    <div className="flex flex-col p-[2px] rounded-2xl bg-gray-200">
                        <div className="bg-white rounded-2xl p-4">
                        <ArrowBigDown className="w-8 h-8 mb-4"/>
                        <h4 className="font-bold text-sm">Successful Orders</h4>
                        <p className="text-lg">{stats.data?.successfulOrders}</p>
                        </div>
                        <div className="p-4 mt-2">
                            <h4 className=" font-bold text-sm">Successful Revenue</h4>
                            <p className="text-lg">{stats.data?.successfulExpense || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 xl:w-1/4 p-2">
                    <div className="flex flex-col p-[2px] rounded-2xl bg-gray-200">
                        <div className="bg-white rounded-2xl p-4">
                            <ArrowBigDown className="w-8 h-8 mb-4"/>
                            <h4 className="font-bold text-sm">Held Orders</h4>
                            <p className="text-lg">{stats.data?.heldOrders}</p>
                        </div>
                        <div className="p-4 mt-2">
                            <h4 className="font-bold text-sm">Held Revenue</h4>
                            <p className="text-lg">{stats.data?.heldExpense || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminStatistics
