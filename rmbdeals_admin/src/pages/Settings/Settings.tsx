import useAxiosToken from "@/hooks/useAxiosToken"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { PlusCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import AddAnnouncement from "../Account/AddAnnouncement"
import AddPaymentAccount from "../Account/AddPaymentAccount"
import EditAnnouncement from "../Account/EditAnnouncement"
import EditPaymentAccount from "../Account/EditPaymentAccount"
import { axios_instance } from "@/api/axios"
import type { AnnouncementType, PaymentType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import MarqueAnnouncement from "./_components/MarqueAnnouncement"

const Settings = () => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const announcement = useQuery<AnnouncementType>({
        queryKey: ["announcements",],
        queryFn: async() => await axios_instance.get(`/announcements`).then(res => res.data)
    })

    const payment = useQuery<PaymentType>({
        queryKey: ["account"],
        queryFn: async() => await axios_instance.get(`/accounts`).then(res => res.data)
    })

    const upadateAnnouncementStatus = async (data:string)=>{
        const response = await axios_instance_token.patch(`/announcements/1/show`, {
            status: data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: upadateAnnouncementStatus,
        onSuccess: ()=>{
            toast.success("Announcement added successfully", {
                id: "update-announcement"
            })

            queryClient.invalidateQueries({queryKey: ["announcements"]})

        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "update-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "update-announcement"
                })
            }
        }
    })

    const onUpdate = (data:string)=>{
        toast.loading("Updating announcement status...", {
            id: "update-announcement"
        })
        mutate(data)
    }

    return (
        <div>
            <div className="my-8 border flex flex-wrap gap-8 p-4 rounded-2xl">
            <div className="flex-1">
                <div className="flex items-center justify-between gap-4 mb-4">
                <h4 className="text-lg lg:text-3xl">Announcement</h4>
                <div className="flex gap-2">
                    {!announcement.data &&
                    <AddAnnouncement trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent"><PlusCircle  className="w-4 h-4 mr-2"/> Add Announcement</Button>
                    } />
                    }
                    {announcement.data && 
                    <EditAnnouncement trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Announcement</Button>
                    } />
                    }
                </div>
                </div>
                <hr />
                <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
                {announcement.data &&
                <div className="mt-4">
                    <h3 className="text-2xl font-bold mb-2">{announcement.data.title}</h3>
                    <p className="mb-4 text-muted-foreground">{announcement.data.subject}</p>
                    {announcement.data.show === "TRUE" && 
                    <button onClick={ ()=>onUpdate("FALSE")} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                        {!isPending && "Remove Announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                    }
                    {announcement.data.show === "FALSE" && 
                    <button onClick={ ()=>onUpdate("TRUE")} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                        {!isPending && "Show Announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                    }
                </div>
                }
            </div>
            <div>
                <div className="flex items-center justify-between gap-8 mb-4">
                <h4 className="text-lg lg:text-3xl">Payment Account</h4>
                <div className="flex gap-2">
                    {!payment.data &&
                    <AddPaymentAccount trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent"><PlusCircle  className="w-4 h-4 mr-2"/> Add Account</Button>
                    } />
                    }
                    {payment.data && 
                    <EditPaymentAccount trigger={
                        <Button className="text-xs lg:text-sm border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent">Edit Account</Button>
                    } />
                    }
                </div>
                </div>
                <hr />
                {payment.data && 
                <div className="pt-4 flex flex-col gap-4">
                    <div className='flex flex-col gap-1'>
                        <h4 className='font-bold tex-sm'>Number</h4>
                        <p className='text-xl'>{payment.data.number}</p>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h4 className='font-bold tex-sm'>Merchant Name</h4>
                        <p className='text-xl'>{payment.data.name}</p>
                    </div>
                </div>
                }
            </div>
            </div>
            <MarqueAnnouncement />
        </div>
    )
}

export default Settings
