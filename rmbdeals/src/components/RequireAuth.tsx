import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const RequireAuth = () => {
  const {auth} = useAuth()
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    auth ? <Outlet /> : <Navigate to='../login' state={{from: location}} replace/>
  )
}

export default RequireAuth
