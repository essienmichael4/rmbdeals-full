import { LogOut, Menu, User, X } from 'lucide-react'
import logo from '../assets/logo.jpg'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import useAuth from '@/hooks/useAuth'
import { axios_instance } from '@/api/axios'
import { MarqueAnnouncementType } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import Marquee from 'react-fast-marquee'

const InAppHeader = () => {
  const navigate = useNavigate()
  const {dispatch} = useAuth()
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <header className='w-full sticky top-0 border-b bg-white z-50'>
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
      <nav className="container px-4 py-0 lg:py-0 lg:px-0 mx-auto flex justify-between items-center">
        <Link to={"../dashboard"} className='flex gap-2 items-center'>
            <img src={logo} alt="logo" className='w-8 h-8 rounded-full'/>
            <h1 className='text-2xl lg:text-3xl font-bold text-black'>RMB Deals</h1>
          </Link>
        <div className='hidden lg:flex gap-8 h-full items-center'>
          <NavLink to={"dashboard"} className={`inline-block py-5 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]`}>Dashboard</NavLink>
          <NavLink to={"orders"} className='inline-block py-5 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Orders</NavLink>
          <NavLink to={"account"} className='inline-block py-5 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Account</NavLink>
        </div>
        <div className='flex gap-2 md:gap-4 items-center'>
          <Link className='py-2 px-4 lg:px-6 rounded-full text-md font-medium text-white bg-black' to={"buy"}>Buy</Link>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className='w-12 h-12 rounded-full bg-white'><User className="h-8 w-8" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>{navigate(`../account`)}}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>{
                    dispatch({type:"REMOVE_AUTH",payload: undefined})
                  }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="lg:hidden md:flex flex-col items-center justify-end">
            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>
      {mobileDrawerOpen && 
        <div className="fixed right-0 z-20 w-full bg-white p-12 flex flex-col justify-center items-center lg:hidden border-y">
          <ul>
            <li className='py-2 text-center'>
              <NavLink to={"dashboard"} className={`text-gray-500 hover:text-[#FFDD66]`}>Dashboard</NavLink>
            </li>
            <li className='py-2 text-center'>
              <NavLink to={"orders"} className='text-gray-500 hover:text-[#FFDD66]'>Orders</NavLink>
            </li>
            <li className='py-2 text-center'>
              <NavLink to={"account"} className='text-gray-500 hover:text-[#FFDD66]'>Account</NavLink>
            </li>
          </ul>
          
        </div>
      }
    </header>
  )
}

export default InAppHeader
