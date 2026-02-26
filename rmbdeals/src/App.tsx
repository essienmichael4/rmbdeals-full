import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './components/Layout'
import Orders from './pages/Orders/Orders'
import Account from './pages/Account/Account'
import Checkout from './pages/Checkout/Checkout'
import Whatsapp from './components/Whatsapp'
import RequireAuth from './components/RequireAuth'
import OrderItem from './pages/Orders/OrderItem'
import Buy from './pages/Buy/Buy'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import PasswordReset from './pages/PasswordReset/PasswordReset'
import NotFound from './pages/NotFound/NotFound'
import Unauthorized from './pages/NotFound/Unauthorized'
import PhoneWizard from './pages/Wizard/PhoneWizard'
import DeleteAccount from './pages/Delete/DeleteAccount'

function App() {
  return (
    <>
      <Routes>
        {/* User Routes */}
        <Route element={<Whatsapp />}>
          <Route path='/' element={<Home />} />
          <Route path='buy' element={<Buy />} />
          <Route path='checkout/:id' element={<Checkout />} />
          <Route path='login' element={<Login />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password' element={<PasswordReset />} />
          <Route path='delete-account' element={<DeleteAccount />} />
          <Route path='register' element={<Register />} />

          {/* User Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='orders' element={<Orders />} />
              <Route path='orders/:id' element={<OrderItem />} />
              <Route path='account' element={<Account />} />
              <Route path='wizard' element={<PhoneWizard />} />
            </Route> 
          </Route> 

          {/* Catch all other routes */}
          <Route path='*' element={<NotFound />} />
          <Route path='unauthorized' element={<Unauthorized />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
