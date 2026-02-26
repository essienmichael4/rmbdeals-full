import { Outlet } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const Whatsapp = () => {
  return (
    <>
        <Outlet />
        <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8  rounded-full">
          <a href="https://wa.me/233244699112" target="_blank" className="text-emerald-600 text-4xl inline-block border-4 border-emerald-600/50 bg-white/50 p-2 rounded-full"><FontAwesomeIcon icon={faWhatsapp} /></a>
        </div>
    </>
  )
}

export default Whatsapp
