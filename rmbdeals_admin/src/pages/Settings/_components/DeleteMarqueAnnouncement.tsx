import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import useAxiosToken from '@/hooks/useAxiosToken'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import type { MarqueAnnouncementType } from '@/lib/types'

interface Props{
    trigger?: React.ReactNode,
    announcement:MarqueAnnouncementType,
}

const DeleteMarqueAnnouncement = ({trigger, announcement,}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const deleteMarquee = async ()=>{
        const response = await axios_instance_token.delete(`/announcements/marquee/${announcement.id}`,)
        return response.data
    }    

    const {mutate, isPending} = useMutation({
        mutationFn: deleteMarquee,
        onSuccess: ()=>{
            toast.success(`Announcement deleted successfully`, {
                id: "delete-marquee"
            })

            queryClient.invalidateQueries({queryKey: ["marque", "announcement"]})

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "delete-marquee"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "delete-marquee"
                })
            }
        }
    })

    const onSubmit = ()=>{
        toast.loading("Deleting marquee announcement...", {
            id: "delete-marquee"
        })
        mutate()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Delete Marquee Announcement: {announcement.id}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <p>Are you sure you want to delete this announcement? This action is not reversible. You may continue to delete whenever you are ready. </p>
                </div>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                             >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSubmit} disabled={isPending} className='bg-linear-to-r from-rose-500 to-rose-800 text-white'
                    >
                        {!isPending && "Delete Marquee"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMarqueAnnouncement
