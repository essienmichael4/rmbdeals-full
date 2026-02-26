import useAxiosToken from "@/hooks/useAxiosToken"
import type { MarqueAnnouncementType } from "@/lib/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AddMarqueAnnouncement from "./AddMarqueAnnouncement"
import { Edit, Loader2, Plus, Trash2 } from "lucide-react"
import EditMarqueAnnouncement from "./EditMarqueAnnouncement"
import { toast } from "sonner"
import axios from "axios"
import DeleteMarqueAnnouncement from "./DeleteMarqueAnnouncement"

interface Data {
    show: string
    id: number
}

const MarqueAnnouncement = () => {
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    
    const marqueAnnouncements = useQuery<MarqueAnnouncementType[]>({
        queryKey: ["marque", "announcement"],
        queryFn: async() => await axios_instance_token.get(`/announcements/marquee/all`).then(res =>{
            return res.data
        })
    })

    
    const upadateAnnouncementStatus = async (data: Data)=>{
        const response = await axios_instance_token.patch(`/announcements/marquee/${data.id}/show`, {
            show: data.show
        },)
        
        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: upadateAnnouncementStatus,
        onSuccess: ()=>{
            toast.success("Announcement status change successfully", {
                id: "update-announcement"
            })
    
            queryClient.invalidateQueries({queryKey: ["marque", "announcement"]})
    
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
    
    const onUpdate = (show:string, id: number)=>{
        toast.loading("Updating announcement status...", {
            id: "update-announcement"
        })
        mutate({show, id})
    }

    return (
        <div className="mt-4 p-4 rounded-md border">
            <div className="flex items-center justify-between">
                    <h3 className="font-bold">Marquee Announcement</h3>
                     <div>
                        <AddMarqueAnnouncement trigger={
                        <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                            <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Marquee Announcement</span>
                        </button>}
                        />
                    </div>
                </div>
                <div className="mb-12 flex flex-wrap">
                {marqueAnnouncements.data &&
                    marqueAnnouncements.data?.map(marque=>(
                        <div key={marque.id} className="w-full md:w-1/2 p-2 ">
                            <div className="mt-4 border rounded-lg relative p-4">
                                <div className="mb-2 w-[85%]">
                                    {marque.announcement}
                                </div>
                                <div className='flex absolute right-2 top-2 gap-2 z-10'>
                                    <EditMarqueAnnouncement announcement={marque} trigger={
                                        <button className="p-2 text-emerald-300 hover:text-emerald-700 bg-white"><Edit className='w-4 h-4' /></button>
                                    } />
                                    <DeleteMarqueAnnouncement announcement={marque} trigger={<button className='p-2 rounded-full bg-white text-rose-300 hover:text-rose-700'>
                                        <Trash2 className='w-4 h-4' />
                                    </button>} />
                                </div>
                                {marque.isShown === "TRUE" && 
                                    <button onClick={ ()=>onUpdate("FALSE", marque.id)} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                                    {!isPending && "Remove Marque Announcement"}
                                    {isPending && <Loader2 className='animate-spin' /> }
                                    </button>
                                }
                                {marque.isShown === "FALSE" && 
                                    <button onClick={ ()=>onUpdate("TRUE", marque.id)} disabled={isPending} className="py-2 px-4 bg-gray-600 hover:bg-gray-800 rounded-md flex text-white">
                                    {!isPending && "Show Marque Announcement"}
                                    {isPending && <Loader2 className='animate-spin' /> }
                                    </button>
                                }
                            </div>
                        </div>
                    ))
                    
                }
            </div>
        </div>
    )
}

export default MarqueAnnouncement
