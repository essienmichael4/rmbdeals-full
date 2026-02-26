import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { X } from "lucide-react"
import { Order } from "@/lib/types"
import { useNavigate, useParams } from "react-router-dom"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios"
import { FormattedDate, FormattedTime } from "@/lib/helper"

const OrderItem = () => {
    const {id} =useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const order = useQuery<Order>({
        queryKey: ["orders", id],
        queryFn: async() => await axios_instance_token.get(`/orders/${id}`).then(res => {            
            return res.data
        })
    })

    const updateOrder = async (status:string) => {
        const response = await axios_instance_token.patch(`/orders/${id}`, {
            status
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateOrder,
        onSuccess: ()=>{
            toast.success("Order updated successfully", {
                id: "order-update"
            })

            queryClient.invalidateQueries({queryKey: ["orders", id]})
            
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.error, {
                    id: "order-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "order-update"
                })
            }
        }
    })

    const onOrderUpdate = (data:string)=>{
        toast.loading("Updating order ...", {
            id: "order-update"
        })
        mutate(data)
    }

    return (
        <>
            <div className="mb-12 px-4 lg:px-0">
                <div className="flex justify-between flex-wrap mb-4 lg:mb-0">
                    <div className="flex gap-4 ">
                        <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-12 h-12 border rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                            &larr;
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <h4 className="text-3xl font-semibold mb-2">Order ID: #{id}</h4>
                                <span className={`${order.data?.status === "HELD" && 'bg-gray-300'} ${order.data?.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${order.data?.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${order.data?.status === "PENDING" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{order.data?.status}</span>
                            </div>
                            <p className="mb-2 text-xs lg:text-sm text-muted-foreground">{FormattedDate(new Date(order.data?.createdAt as string))} at {FormattedTime(new Date(order.data?.createdAt as string))} from drafts</p>
                        </div>
                    </div>
                    <div className="flex justify-self-end gap-2">
                        {order.data?.status !== "COMPLETED" && <Button className="border bg-rose-700 hover:bg-rose-500" onClick={()=>{onOrderUpdate("CANCELLED")}} disabled={isPending}>Cancel Order</Button>}
                    </div>
                </div>
                <hr />
                <div className='h-2 w-96 relative hidden lg:block bg-[#FFDD66] -top-1'></div>
                <div className="w-full lg:w-1/2 mx-auto border rounded-2xl mt-8 p-4">
                    <h5 className="text-xl font-bold">Order Item</h5>
                    <span className={`${order.data?.status === "HELD" && 'bg-gray-300'} ${order.data?.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${order.data?.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${order.data?.status === "PENDING" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{order.data?.status}</span>
                    <div className="flex items-center justify-between">
                        <div className="mt-4 flex items-center gap-4">
                            <div className="w-16 h-16 bg-black rounded-lg">

                            </div>
                            <div className="flex flex-col">
                                <h6 className="font-bold">Product</h6>
                                <p>RMB</p>
                            </div>
                        </div>
                        <p className="flex text-xl">
                            <X  className="w-4"/> 1
                        </p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 mx-auto border rounded-2xl mt-8 p-4">
                    <h5 className="text-xl font-bold">Order Summary</h5>
                    <span className={`${order.data?.status === "HELD" && 'bg-gray-300'} ${order.data?.status === "COMPLETED" && 'bg-emerald-300 text-emerald-700'} ${order.data?.status === "CANCELLED" && 'bg-rose-300 text-rose-700'} ${order.data?.status === "PENDING" && 'bg-blue-300 text-blue-700'} py-1 px-4 rounded-full text-xs`}>{order.data?.status}</span>
                    <div className="flex items-center justify-between mt-4">
                        <p className="font-bold">{order.data?.currency} Amount:</p>
                        <p className="">
                            {order.data?.amount}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-bold">RMB Equivalent:</p>
                        <p className="">
                            {order.data?.rmbEquivalence}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-bold">Rate:</p>
                        <p className="">
                            {order.data?.rate}
                        </p>
                    </div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Sub Total:</p>
                        <p className="">
                            {order.data?.amount}
                        </p>
                    </div>
                    <hr />
                    <div className='h-1 w-36 relative hidden lg:block bg-[#FFDD66] -top-1'></div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Total:</p>
                        <p className="">
                            {order.data?.amount}
                        </p>
                    </div>
                    <hr />
                    <div className='h-1 w-36 relative hidden lg:block bg-[#FFDD66] -top-1'></div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Recepient Name:</p>
                        <p className="">
                            {order.data?.recipient}
                        </p>
                    </div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Account Type:</p>
                        <p className="">
                            {order.data?.account}
                        </p>
                    </div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Payment Method:</p>
                        <p className="">
                            Momo Payment
                        </p>
                    </div>
                    <div className="flex items-center justify-between my-2">
                        <p className="font-bold">Name on Momo Account:</p>
                        <p className="">
                            {order.data?.orderBilling?.momoName}
                        </p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 mx-auto border rounded-2xl mt-8 p-4">
                    <h5 className="text-xl font-bold">Billing Address</h5>
                    
                    <div className="mt-8">
                        <h5 className="text-3xl italic">{order.data?.orderBilling?.name}</h5>
                        <p className="text-3xl italic">{order.data?.orderBilling?.whatsapp}</p>
                    </div>
                    <p className="mt-4 italic text-2xl">{order.data?.orderBilling?.email}</p>
                </div>
            </div>
        </>
        
    )
}

export default OrderItem
