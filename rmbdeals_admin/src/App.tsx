import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import RequireAuth from './components/RequireAuth'
import AdminLayout from './components/AdminLayout'
import NotFound from './pages/NotFound/NotFound'
import Unauthorized from './pages/NotFound/Unauthorized'
import Dashboard from './pages/Dashboard/Dashboard'
import OrderItemAdmin from './pages/Orders/OrderItemAdmin'
import OrdersAdmin from './pages/Orders/OrdersAdmin'
import Settings from './pages/Settings/Settings'
import AdminAccount from './pages/Account/AdminAccount'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import PasswordReset from './pages/PasswordReset/PasswordReset'

function App() {
  return (
    <>
      <Routes>
        {/* User Routes */}

        {/* Admin Routes */}
        <Route path='/' element={<Login />} />
        <Route path='forgot-password' element={<ForgotPassword />} />
        <Route path='reset-password' element={<PasswordReset />} />

        {/* Admin Protected Route */}
        <Route element={<RequireAuth allowedRole='ADMIN'/>}>
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='orders' element={<OrdersAdmin />} />
            <Route path='orders/:id' element={<OrderItemAdmin />} />
            <Route path='account' element={<AdminAccount />} />
            <Route path='settings' element={<Settings />} />
          </Route>
        </Route>

        {/* Catch all other routes */}
        <Route path='*' element={<NotFound />} />
        <Route path='unauthorized' element={<Unauthorized />} />
      </Routes>
    </>
  )
}

export default App
