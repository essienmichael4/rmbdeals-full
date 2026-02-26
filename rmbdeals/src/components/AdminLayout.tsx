import { Outlet } from "react-router-dom"
import AdminInAppHeader from "./AdminAppHeader"

const AdminLayout = () => {
  return (
    <>
        <AdminInAppHeader />
        <div className="container mt-8 mx-auto">
            <Outlet />
        </div>
    </>
  )
}

export default AdminLayout
