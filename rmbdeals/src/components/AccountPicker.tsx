import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Account, Accounts } from '@/lib/constants'

interface Props {
    onChange: (value: "personal" | "supplier")=>void
}

const AccountPicker = ({ onChange}:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"personal" | "supplier">("personal")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const selectedAccount = Accounts.find((account:Account)=> account.value === value)

    // const successCallback = useCallback((account:Account)=>{
    //     setValue(account.value)
    //     setOpen(prev => !prev)
    // },[setValue, setOpen])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className=' justify-between'>
                    {selectedAccount ? (
                        <AccountRow account={selectedAccount} />
                    ) : (
                        "Select Account Type"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search Account'/>
                    <CommandEmpty>
                        <p>Account type not found</p>
                    </CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {Accounts?.map((account:Account) => {
                                    return (
                                        <CommandItem key={account.value} onSelect={()=>{
                                            setValue(account.value)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <AccountRow account={account} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===account.value && "opacity-100")} />
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

function AccountRow({account}:{account:Account}){
    return (
        <div className="flex items-center gap-2">
            <span>{account.label}</span>
        </div>
    )
}

export default AccountPicker
