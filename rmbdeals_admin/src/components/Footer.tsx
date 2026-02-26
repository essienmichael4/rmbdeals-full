import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTelegram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <div className='py-8 bg-black mt-20 px-4'>
        <div className='container mx-auto text-white'>
            <div className='flex flex-col md:flex-row md:justify-between items-start'>
                <div >
                    <div className='flex'>
                        <h2 className='text-2xl md:text-4xl pr-2 md:pr-4 border-r mr-4'>RMB Deals</h2>
                        <p className="text-xs">We Are The <br />
                        Cutting Edge RMB Transaction Agency</p>
                    </div>
                    <p className='mt-3'>Let’s take your business to the next level</p>
                    <div className="mt-4 italic flex flex-col gap-2">
                        <p>First Storey Building on the Right</p>
                        <p>Tabora Junction Bus Stop - Alaji Road</p>
                        <p>Accra, Ghana</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                    <p>contact@rmbdeals.com</p>
                    <p>+233 244 699 112</p>
                    <div className='flex flex-col gap-2'>
                        <h5 className='text-[#FFDD66] mt-4'>Channels</h5>
                        <div className='flex gap-4'>
                            <div>
                                <a href="https://whatsapp.com/channel/0029VaehZBYC1FuLb5upi23t" target='_blank' className='block text-4xl'><FontAwesomeIcon icon={faWhatsapp} /></a>
                            </div>
                            <div>
                                <a href="https://t.me/rmbdeals" target='_blank' className='block text-4xl '><FontAwesomeIcon icon={faTelegram} /></a>
                            </div>
                            <div>
                                <a href="https://youtube.com/@rmbdeals" target='_blank' className='block text-4xl'><FontAwesomeIcon icon={faYoutube} /></a>
                            </div>
                            <div>
                                <a href="https://facebook.com/rmbdeals1" target='_blank' className='block text-4xl '><FontAwesomeIcon icon={faFacebook} /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-8 flex items-center justify-between border-t pt-4 flex-col sm:flex-row gap-4'>
                <p className="text-xs">© 2024 RMB Deals Group. All rights reserved</p>
                <div className='flex gap-8 '>
                    <p className="text-xs">Terms Of Use</p>
                    <p className="text-xs">Privacy Policy</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
