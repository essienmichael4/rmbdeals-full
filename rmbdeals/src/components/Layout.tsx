import { Outlet } from "react-router-dom"
import InAppHeader from "./InAppHeader"

const Layout = () => {
  return (
    <>
        <InAppHeader />
        <div className="container mt-8 mx-auto">
            <Outlet />
        </div>
    </>
  )
}

export default Layout
