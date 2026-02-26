import { useState } from 'react'
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import { cn } from '../lib/utils'
import { useQuery } from '@tanstack/react-query'
import HistoryPeriodSelector from './HistoryPeriodSelector'
import useAxiosToken from '@/hooks/useAxiosToken'

const AdminOrdersChart = () => {
    const axios_instance_token = useAxiosToken()
    const [timeframe, setTimeFrame] = useState<"MONTH" | "YEAR">("MONTH")
    const [period, setPeriod] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })
    
    const historyDataQuery = useQuery<[]>({
        queryKey: ["summary-admin", "history", timeframe, period],
        queryFn: async() => await axios_instance_token.get(`/stats/history-data-admin?timeframe=${timeframe}&month=${period.month}&year=${period.year}`).then(res => res.data)
    })

    const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0
    
    return (
        <div className='mt-4 p-4 border rounded-2xl bg-white overflow-hidden'>
            <div className='flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-8'>
            <h3 className='font-bold text-lg lg:text-xl'>History</h3>

                <HistoryPeriodSelector 
                    timeframe={timeframe}
                    period={period}
                    setPeriod={setPeriod}
                    setTimeFrame={setTimeFrame}
                />
            </div>
            <div className='mt-4'>
                {
                    dataAvailable && 
                    <ResponsiveContainer width={"100%"} height={300}>
                        <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                            <defs>
                                <linearGradient id='ordersBar' x1={0} y1={0} x2={0} y2={1}>
                                    <stop
                                        offset={0}
                                        stopColor='#106981'
                                        stopOpacity={1}
                                    />
                                    <stop
                                        offset={1}
                                        stopColor='#106981'
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="5 5"
                                strokeOpacity={"0.2"}
                                vertical={false}
                            />
                            <XAxis 
                                stroke='#888888'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                padding={{left:5, right:5}}
                                dataKey={(data)=>{
                                    const {year, month, day} = data
                                    const date = new Date(year, month, day || 1)

                                    if(timeframe === "YEAR") return date.toLocaleDateString("default", {
                                        month: "long"
                                    })

                                    return date.toLocaleDateString("default", {
                                        day: "2-digit"
                                    })
                                }}
                            />

                            <YAxis 
                                stroke='#888888'
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />

                            <Bar 
                                dataKey={"orders"}
                                label="Orders"
                                fill='url(#ordersBar)'
                                radius={4}
                                className='cursor-pointer'
                            />

                            <Tooltip cursor={{opacity: 0.1}} content={props => (
                                <CustomTooltip {...props}/>
                            )} />
                        </BarChart>
                    </ResponsiveContainer>
                }
                {
                    !dataAvailable && 
                    <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
                        <p className='text-center'>No orders found for the selected account</p>
                        <p className="text-sm text-muted-foreground">Try making a new order</p>
                    </div>
                }
            </div>
        </div>
    )
}

function CustomTooltip({active, payload}: any){
    if(!active || !payload || payload.length == 0) return null

    const data = payload[0].payload
    const {orders} = data

    return (
        <div className='min-w-[200px] rounded border bg-background p-4'>
            <TooltipRow label="Orders" value={orders} bgColor="bg-emerald-500" textColor="text-emerald-500" />
        </div>
    )
}

function TooltipRow({label, value, bgColor, textColor}:{
    label:string
    value:string,
    bgColor: string,
    textColor: string
}){
    return (
        <div className="flex gap-2 items-center">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="flex w-full justify-between">
                <p>{label}</p>
                <p className={cn("font-bold", textColor)}>{value}</p>
            </div>
        </div>
    )
}

export default AdminOrdersChart
