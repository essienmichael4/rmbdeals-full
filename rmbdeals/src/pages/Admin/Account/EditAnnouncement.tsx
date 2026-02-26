import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { EditAnnouncementSchema, EditAnnouncementSchemaType } from '@/schema/announcement'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

interface Props{
    trigger?: React.ReactNode,
}

const EditAnnouncement = ({trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<EditAnnouncementSchemaType>({
        resolver:zodResolver(EditAnnouncementSchema),
        defaultValues:{
            title: "",
            subject: "",
        }
    })

    const editAnnouncement = async (data:EditAnnouncementSchemaType)=>{
        const response = await axios_instance_token.patch(`/announcements/1`, {
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

            queryClient.invalidateQueries({queryKey: ["announcements"]})

            form.reset({
                title: "",
                subject: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "edit-announcement"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "edit-announcement"
                })
            }
        }
    })

    const onSubmit = (data:EditAnnouncementSchemaType)=>{
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
                        Edit Announcement
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
                                        <FormLabel className='text-xs'>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} 
                            />

                        <FormField 
                            control={form.control}
                            name="subject"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Subject</FormLabel>
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
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-[#47C9D1] hover:bg-[#106981]'
                    >
                        {!isPending && "Edit Announcement"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAnnouncement
