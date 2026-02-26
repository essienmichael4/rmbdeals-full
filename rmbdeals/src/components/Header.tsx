import { useQuery } from '@tanstack/react-query'
import logo from '../assets/logo.jpg'
import { Link, useLocation  } from 'react-router-dom'
import Marquee from 'react-fast-marquee'
import { axios_instance } from '@/api/axios'
import { type MarqueAnnouncementType } from '@/lib/types'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const Header = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const [show, setShow] = useState(false)

  const marqueeAnnouncements = useQuery<MarqueAnnouncementType[]>({
      queryKey: ["announcements", "marquee"],
      queryFn: async() => await axios_instance.get(`/announcements/marquee`).then(res => {
        return res.data
      })
  })

  useEffect(() => {
    if (marqueeAnnouncements.data && marqueeAnnouncements.data.length > 0) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [marqueeAnnouncements.data])

  const handleShow = ()=>{
    setShow(!show)
  }
  
  return (
    <header className='w-full  border-b sticky top-0 z-50 backdrop-blur-lg'>
      <div className={`${show ? "block" : "hidden"} bg-gray-800 relative`}>
        <div className='container px-4 py-4 mx-auto '>
          <Marquee className="text-gray-100 text-sm space-x-16">
            {marqueeAnnouncements.data?.map((marquee, idx) => (
              <span
                key={idx}
                className={`flex items-center ${idx > 0 ? "ml-4" : ""}`}
              >
                {idx > 0 && <span className="mx-4 text-gray-400">|</span>}
                {marquee.announcement}
              </span>
            ))}
          </Marquee>
          <button onClick={handleShow} className='absolute z-10 text-white right-4 top-4'>
            <X  className='w-4 h-4'/>
          </button>
        </div>
      </div>
      <nav className="container px-4 lg:px-0 mx-auto flex justify-between items-center py-4">
        <Link to={"../"} className='flex gap-2 items-center'>
        <img src={logo} alt="logo" className='w-8 h-8 rounded-full '/>
        <h1 className='text-2xl lg:text-3xl font-bold text-white sm:text-black'>RMB Deals</h1>
        </Link>
          <div className='flex gap-4'>
              <Link className='py-2 px-4 lg:px-6 rounded-full text-md font-medium text-white bg-black' to={"../buy"}>Buy</Link>
              {/* <Link className='py-2 px-4 lg:px-6 rounded-full text-md font-medium bg-[#FFDD66]' to={"login"}>Login</Link> */}
              <Link
                className="py-2 px-4 lg:px-6 rounded-full text-md font-medium bg-[#FFDD66]"
                to={isLoginPage ? "/register" : "/login"}
              >
                {isLoginPage ? "Register" : "Login"}
              </Link>
          </div>
      </nav>
    </header>
  )
}

export default Header
