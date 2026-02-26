import useAuth from "@/hooks/useAuth"
import { Link } from "react-router-dom"
import logo from '@/assets/logo.jpg'

const Unauthorized = () => {
    const {auth} = useAuth()
    return (
        <>
            <header className='w-full py-4 border-b absolute z-50'>
                <nav className="container px-4 lg:px-0 mx-auto flex justify-between items-center py-2">
                    <Link to={"../"} className='flex gap-2 items-center'>
                        <img src={logo} alt="logo" className='w-8 h-8'/>
                        <h1 className='text-3xl font-bold text-black'>RMB Deals</h1>
                    </Link>
                </nav>
            </header>
            <div className="mx-auto container flex flex-col items-center justify-center h-screen px-4 py-16">
                <div className="flex flex-col items-center">
                    <h2 className="text-7xl lg:text-[12rem] tracking-wider font-bold text-center">401</h2>
                    <p className="font-semibold text-2xl text-center">You are not authorized to view this page</p>
                    <p className="text-center">To view this page, reach out to the administrators of RMB Deals to assist you acquire the right authorization. Thank you.</p>
                    { !auth ?  
                        <Link to={"../"} className="bg-black/90 hover:bg-black py-2 px-4 rounded text-white mt-4">Back to Home Page</Link>
                        : <Link to={"../dashboard"} className="bg-black/90 hover:bg-black py-2 px-4 rounded text-white mt-4">Go to dashboard</Link>
                    }
                </div>
            </div>
        </>
    )
}

export default Unauthorized
