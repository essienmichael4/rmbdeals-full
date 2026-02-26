import { axios_instance } from '@/api/axios';
import { Currency } from '@/lib/types';
import { useQuery } from '@tanstack/react-query'

const Rate = () => {
    const rate = useQuery<Currency[]>({
        queryKey: ["currency", "rate"],
        queryFn: async() => await axios_instance.get(`/currencies`).then(res => {
            return res.data
        })
    })


    return (
        <div className='mt-20 px-4 lg:px-0'>
            <div className='flex items-start lg:items-center justify-between mb-4 flex-col lg:flex-row'>
                <h3 className='text-3xl lg:text-5xl font-semibold lg:w-2/5'>Current Rate</h3>
            </div>
            <hr className="block" />
            <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
            <div className="flex flex-wrap gap-4">
                {rate.data?.map((currency:Currency, i:number)=>{
                    return <div className="py-4 md:py-8 px-2" key={i}>
                    <div className="flex gap-4 flex-col">
                        {/* <p  className="font-bold">{currency.description}</p> */}
                        <p className="text-2xl lg:text-4xl">{currency.label} {currency.rate}</p>
                    </div>
                </div>
                })}
            </div>
        </div>
    )
}

export default Rate
