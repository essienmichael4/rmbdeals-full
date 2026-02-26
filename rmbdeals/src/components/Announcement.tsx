import { axios_instance } from '@/api/axios'
import { AnnouncementType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { Megaphone, X } from 'lucide-react'
import React, { useState } from 'react'

type Props = {
    setHeight : (height:number)=> void
}

const Announcement = ({setHeight}: Props) => {
    const [show, setShow] = useState(false)

    const announcement = useQuery<AnnouncementType>({
        queryKey: ["announcements",],
        queryFn: async() => await axios_instance.get(`/announcements`).then(res => {
            if(res.data){
                if(res.data.show === "TRUE"){
                    setShow(true)
                }
            }
            return res.data
        })
    })

    const handleShow = ()=>{
        setShow(!show)
      }
    
      const handleElementRef: React.RefCallback<HTMLDivElement> = element =>{
        if(!element) return
    
        setHeight(element.offsetHeight)
      }

  return (
    <>
    <div className={`${show ? 'flex' : 'hidden'} rounded-md absolute z-10 top-20 left-6 sm:left-1/3 md:left-2/4 lg:left-2/3 right-6 p-8 items-center justify-center bg-orange-500`} ref={handleElementRef}>
      <div className='relative container w-full mx-auto flex items-center justify-center text-white'>
        <div className="flex-col flex gap-2 items-center justify-center">
          <div className='flex items-center gap-4'>
            <Megaphone className='text-white'/>
            <h5 className='text-2xl font-bold'>{announcement.data?.title}</h5>
          </div>
          <button onClick={handleShow} className='absolute -right-4 -top-4'>
            <X />
          </button>
          <p>{announcement.data?.subject}</p>
        </div>
      </div>
    </div>
  </>
  )
}

export default Announcement
