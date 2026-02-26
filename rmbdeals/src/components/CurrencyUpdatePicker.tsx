import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { cn } from '../lib/utils'
import { axios_instance } from '@/api/axios'
import { useQuery } from '@tanstack/react-query'
import { Currency } from '@/lib/types'

interface Props {
    onChange: (value: string)=>void
}

const CurrencyPicker = ({ onChange }:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("GHS")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const currenciesQuery = useQuery<Currency[]>({
        queryKey: ["currencies"],
        queryFn: async() => await axios_instance.get("/currencies").then(res => res.data)
    })

    const selectedCurrency = currenciesQuery.data?.find((currency:Currency)=> currency.currency === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className=' justify-between w-full'>
                    {selectedCurrency ? (
                        <CurrencyRow currency={selectedCurrency} />
                    ) : (
                        "Select currency"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search currency'/>
                    <CommandEmpty>
                        <p>Currency not found</p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {currenciesQuery.data?.map((currency:Currency) => {
                                    return (
                                        <CommandItem key={currency.currency} onSelect={()=>{
                                            setValue(currency.currency)
                                            onChange(currency.currency)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <CurrencyRow currency={currency} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===currency.currency && "opacity-100")} />
                                        </CommandItem>
                                    )
                                })}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
      )
}

function CurrencyRow({currency}:{currency:Currency}){
    return (
        <div className="flex items-center gap-2">
            <span>{currency.currency}</span>
        </div>
    )
}

export default CurrencyPicker
