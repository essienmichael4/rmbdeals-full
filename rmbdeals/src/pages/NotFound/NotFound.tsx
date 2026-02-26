import logo from '@/assets/logo.jpg'
import useAuth from "@/hooks/useAuth"
import { Link } from "react-router-dom"

const NotFound = () => {
    const {auth} = useAuth()
    return (
        <div className="mx-auto container flex flex-col items-center justify-between h-screen px-4 py-16">
            <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">404</p>
                <p className="text-lg font-semibold">Error Page</p>
            </div>
            <div className="flex flex-col items-center">
                <div className='flex items-center gap-4'>
                    <img src={logo} alt="logo" className='w-24 mb-4 '/>
                    <h2 className='text-3xl'>RMB Deals</h2>
                </div>
                <h3 className="font-bold text-7xl">404</h3>
                <p className="font-semibold text-2xl">Sorry, we couldn't find the page you were looking for.</p>
                { !auth ?  
                    <Link to={"../"} className="bg-black/90 hover:bg-black py-2 px-4 rounded text-white mt-4">Back to Home Page</Link>
                    : <Link to={"../dashboard"} className="bg-black/90 hover:bg-black py-2 px-4 rounded text-white mt-4">Go to dashboard</Link>
                }
            </div>
            <div className="flex flex-col items-center">
                <p className="text-xl font-semibold ">The page you are looking for doesn't exist or another error possibly occured.</p>
            </div>
        </div>
    )
}

export default NotFound
