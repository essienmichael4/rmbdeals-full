import { LogOut, Menu, User, X } from 'lucide-react'
import logo from '../assets/logo.jpg'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import useAuth from '@/hooks/useAuth'

const AdminInAppHeader = () => {
  const navigate = useNavigate()
  const {dispatch} = useAuth()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <header className='w-full sticky top-0 border-b bg-white z-50'>
      <nav className="container px-4 py-4 lg:py-0 lg:px-0 mx-auto flex justify-between items-center">
        <Link to={"../co/administrator/dashboard"} className='flex gap-2 items-center'>
          <img src={logo} alt="logo" className='w-8 h-8 rounded-full'/>
          <h1 className='text-2xl lg:text-3xl font-bold text-black'>RMB Deals</h1>
        </Link>
        <div className='hidden lg:flex gap-8 h-full items-center'>
          <NavLink to={"co/administrator/dashboard"} className={`inline-block py-6 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]`}>Dashboard</NavLink>
          <NavLink to={"co/administrator/orders"} className='inline-block py-6 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Orders</NavLink>
          <NavLink to={"co/administrator/account"} className='inline-block py-6 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Account</NavLink>
          <NavLink to={"co/administrator/settings"} className='inline-block py-6 text-gray-500 border-b-4 border-white hover:text-[#FFDD66]'>Settings</NavLink>
        </div>
        <div className='flex gap-2 md:gap-4 items-center'>
          <div className="flex items-center">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className='w-12 h-12 rounded-full bg-white'><User className="h-8 w-8" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={()=>{navigate(`../co/administrator/account`)}}>
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
              <NavLink to={"co/administrator/dashboard"} className={`text-gray-500 hover:text-[#FFDD66]`}>Dashboard</NavLink>
            </li>
            <li className='py-2 text-center'>
              <NavLink to={"co/administrator/orders"} className='text-gray-500 hover:text-[#FFDD66]'>Orders</NavLink>
            </li>
            <li className='py-2 text-center'>
              <NavLink to={"co/administrator/account"} className='text-gray-500 hover:text-[#FFDD66]'>Account</NavLink>
            </li>
            <li className='py-2 text-center'>
              <NavLink to={"co/administrator/settings"} className='text-gray-500 hover:text-[#FFDD66]'>Settings</NavLink>
            </li>
          </ul>
          
        </div>
      }
    </header>
  )
}

export default AdminInAppHeader
