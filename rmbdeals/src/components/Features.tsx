import { AspectRatio } from "./ui/aspect-ratio"
import payment from '../assets/payments.jpg'
import pricing from '../assets/pricing.jpg'
import platform from '../assets/platform.jpg'
import trading from '../assets/tradding.jpg'


const Features = () => {
  return (
    <div className='mt-20 px-4 lg:px-0'>
        <div className='flex items-start lg:items-center justify-between mb-4 flex-col lg:flex-row'>
            <h3 className='text-3xl lg:text-5xl font-semibold lg:w-2/5'>OUR TAILORED FEATURES JUST FOR YOU</h3>
            <p className='lg:w-2/5 text-sm lg:text-md'>At the heart of our features lies our commitment to make your financial goals into thriving achievements and reality.</p>
        </div>
        <hr className="block" />
        <div className='h-2 w-36 lg:w-96 relative block bg-[#FFDD66] -top-1'></div>
        <div className='flex justify-center flex-wrap mt-12'>
            <div className='w-full lg:w-1/2 py-4 lg:p-4'>
                <AspectRatio ratio={16 / 9}>
                    <div className="bg-black flex flex-col justify-end p-4 gap-4 h-full rounded-2xl w-full bg-cover bg-center bg-blend-luminosity" style={{backgroundImage:`url(${payment})`}}>
                        <h5 className="text-2xl lg:text-6xl">Payments</h5>
                        <p className="text-xs md:text-lg">Move Funds & Accept/Make Payments</p>
                    </div>
                </AspectRatio>
            </div>
            <div className='w-full lg:w-1/2 py-4 lg:p-4'>
                <AspectRatio ratio={16 / 9}>
                    <div className="bg-black flex flex-col justify-end p-4 gap-4 h-full rounded-2xl w-full bg-cover bg-center bg-blend-luminosity" style={{backgroundImage:`url(${trading})`}}>
                        <h5 className="text-2xl lg:text-6xl">Trading</h5>
                        <p className="text-white text-xs md:text-lg">Buy/Sell RMB</p>
                    </div>
                </AspectRatio>
            </div>
            <div className='w-full lg:w-1/2 py-4 lg:p-4'>
                <AspectRatio ratio={16 / 9}>
                    <div className="text-white bg-black flex flex-col justify-end p-4 gap-4 h-full rounded-2xl w-full bg-cover bg-center bg-blend-luminosity" style={{backgroundImage:`url(${platform})`}}>
                        <h5 className="text-2xl lg:text-6xl">Platform</h5>
                        <p className="text-xs md:text-lg">API’s, Dashboard & Security</p>
                    </div>
                </AspectRatio>
            </div>
            <div className='w-full lg:w-1/2 py-4 lg:p-4'>
                <AspectRatio ratio={16 / 9}>
                    <div className="text-white bg-black flex flex-col justify-end p-4 gap-4 h-full rounded-2xl w-full bg-cover bg-center bg-blend-luminosity" style={{backgroundImage:`url(${pricing})`}}>
                        <h5 className="text-2xl lg:text-6xl">Transparent Pricing</h5>
                        <p className="text-xs md:text-lg">Enjoy peace of mind with straightforward pricing structure, free from hidden charges, providing clarity. Our rate is always shown.</p>
                    </div>
                </AspectRatio>
            </div>
        </div>
    </div>
  )
}

export default Features
