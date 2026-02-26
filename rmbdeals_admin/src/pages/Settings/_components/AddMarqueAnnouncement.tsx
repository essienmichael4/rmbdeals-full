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
import { AddMarqueAnnouncementSchema, type AddMarqueAnnouncementSchemaType,  } from '@/schema/announcement'
import { Textarea } from '@/components/ui/textarea'

interface Props{
    trigger?: React.ReactNode,
}

const AddMarqueAnnouncement = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<AddMarqueAnnouncementSchemaType>({
        resolver:zodResolver(AddMarqueAnnouncementSchema),
        defaultValues:{
            announcement: "",
        }
    })

    const addAnnouncement = async (data:AddMarqueAnnouncementSchemaType)=>{
        const response = await axios_instance_token.post(`/announcements/marquee`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAnnouncement,
        onSuccess: ()=>{
            toast.success("Announcement added successfully", {
                id: "add-announcement"
            })

            queryClient.invalidateQueries({queryKey: ["marque", "announcement"]})

            form.reset({
                announcement: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-announcement"
                })
            }
        }
    })

    const onSubmit = (data:AddMarqueAnnouncementSchemaType)=>{
        toast.loading("Adding announcement...", {
            id: "add-announcement"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add Marquee Announcement
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="announcement"
                            render={({field}) =>(
                                <FormItem className='space-y-1'>
                                    <FormLabel className='text-xs'>Annoucement</FormLabel>
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
                        {!isPending && "Add Marquee Announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddMarqueAnnouncement
