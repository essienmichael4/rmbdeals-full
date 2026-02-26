import { useQuery } from '@tanstack/react-query'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import useAxiosToken from '@/hooks/useAxiosToken'

type Period = {
    month: number,
    year: number
}

type Timeframe = "MONTH" | "YEAR"

interface Props{
    timeframe: Timeframe,
    period: Period
    setPeriod: (period:Period) => void,
    setTimeFrame: (timeframe: Timeframe) => void
}

const HistoryPeriodSelector = ({timeframe, period, setPeriod, setTimeFrame}:Props) => {
    const axios_instance_token = useAxiosToken()

    const historyPeriodsQuery = useQuery<number[]>({
        queryKey: ["summary", "history", "periods"],
        queryFn: async() => await axios_instance_token.get(`/stats/history-periods`).then(res => res.data)
    })
    return (
        <div className='flex items-center gap-4'>
            <Tabs 
                value={timeframe}
                onValueChange={value => setTimeFrame(value as Timeframe)}
            >
                <TabsList>
                    <TabsTrigger value='MONTH'>Month</TabsTrigger>
                    <TabsTrigger value='YEAR'>Year</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className='flex gap-2'>
                <YearSelector period={period} setPeriod={setPeriod} years={historyPeriodsQuery.data || []} />
                {timeframe === "MONTH" &&
                    (<MonthSelector period={period} setPeriod={setPeriod} years={historyPeriodsQuery.data || []}/>)
                }
            </div>
        </div>
    )
}

function YearSelector({period, setPeriod, years}:{
    period:Period,
    setPeriod: (period:Period) => void,
    years: number[]
}){
    return (
        <Select 
          value={period.year.toString()} 
          onValueChange={value => setPeriod({month: period.month, year: parseInt(value)}) }
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>{years.map(year =>{
                return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            })}</SelectContent>
        </Select>
    )
}

function MonthSelector({period, setPeriod}:{
    period:Period,
    setPeriod: (period:Period) => void,
    years: number[]
}){
    return (
        <Select 
          value={period.month.toString()} 
          onValueChange={value => setPeriod({year: period.year, month: parseInt(value)}) }
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>{[0,1,2,3,4,5,6,7,8,9,10,11].map(month =>{
                const monthStr = new Date(period.year, month, 1).toLocaleString("default", {month: "long"})
                return <SelectItem key={month} value={month.toString()}>{monthStr}</SelectItem>
            })}</SelectContent>
        </Select>
    )
}

export default HistoryPeriodSelector
