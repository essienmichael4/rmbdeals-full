import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useState } from 'react'
import { EditMarqueAnnouncementSchema, type EditMarqueAnnouncementSchemaType } from '@/schema/announcement'
import type { MarqueAnnouncementType } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'

interface Props{
    announcement:MarqueAnnouncementType,
    trigger?: React.ReactNode,
}

const EditMarqueAnnouncement = ({announcement, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditMarqueAnnouncementSchemaType>({
        resolver:zodResolver(EditMarqueAnnouncementSchema),
        defaultValues:{
            announcement: announcement.announcement,
        }
    })

    const editAnnouncement = async (data:EditMarqueAnnouncementSchemaType)=>{
        const response = await axios_instance_token.patch(`/announcements/marquee/${announcement.id}`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: editAnnouncement,
        onSuccess: ()=>{
            toast.success("Announcement edited successfully", {
                id: "edit-announcement"
            })

            queryClient.invalidateQueries({queryKey: ["marque", "announcement"]})

            form.reset()

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "edit-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-announcement"
                })
            }
        }
    })

    const onSubmit = (data:EditMarqueAnnouncementSchemaType)=>{
        toast.loading("Editing announcement...", {
            id: "edit-announcement"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Marquee Announcement
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>

                        <FormField
                            control={form.control}
                            name="announcement"
                            render={({field}) =>(
                                <FormItem className='space-y-1'>
                                    <FormLabel className='text-xs'>Marquee Announcement</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-linear-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Edit marquee announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditMarqueAnnouncement
