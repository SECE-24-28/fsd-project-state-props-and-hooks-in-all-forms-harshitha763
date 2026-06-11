import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './components/Toast'
import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Signup       from './pages/Signup'
import Shop         from './pages/Shop'
import Checkout     from './pages/Checkout'
import Orders       from './pages/Orders'
import Wishlist     from './pages/Wishlist'
import Profile      from './pages/Profile'
import SizeAdvisor  from './pages/SizeAdvisor'
import VirtualTryon from './pages/VirtualTryon'
import ShopTheLook  from './pages/ShopTheLook'
import About        from './pages/About'
import Contact      from './pages/Contact'
import FAQ          from './pages/FAQ'
import Privacy      from './pages/Privacy'
import Terms        from './pages/Terms'
import OrderTracking from './pages/OrderTracking'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace/>
}

function Layout({ children, showFooter = true }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      {showFooter && <Footer/>}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/"              element={<Layout><Landing/></Layout>}/>
            <Route path="/login"         element={<Layout showFooter={false}><Login/></Layout>}/>
            <Route path="/signup"        element={<Layout showFooter={false}><Signup/></Layout>}/>
            <Route path="/about"         element={<Layout><About/></Layout>}/>
            <Route path="/contact"       element={<Layout><Contact/></Layout>}/>
            <Route path="/faq"           element={<Layout><FAQ/></Layout>}/>
            <Route path="/privacy"       element={<Layout><Privacy/></Layout>}/>
            <Route path="/terms"         element={<Layout><Terms/></Layout>}/>
            <Route path="/track-order"   element={<Layout><OrderTracking/></Layout>}/>
            <Route path="/size-advisor"  element={<Layout showFooter={false}><SizeAdvisor/></Layout>}/>
            <Route path="/virtual-tryon" element={<Layout showFooter={false}><VirtualTryon/></Layout>}/>
            <Route path="/shop-the-look" element={<Layout><ShopTheLook/></Layout>}/>

            {/* Protected */}
            <Route path="/shop"      element={<PrivateRoute><Layout><Shop/></Layout></PrivateRoute>}/>
            <Route path="/checkout"  element={<PrivateRoute><Layout showFooter={false}><Checkout/></Layout></PrivateRoute>}/>
            <Route path="/orders"    element={<PrivateRoute><Layout><Orders/></Layout></PrivateRoute>}/>
            <Route path="/wishlist"  element={<PrivateRoute><Layout><Wishlist/></Layout></PrivateRoute>}/>
            <Route path="/profile"   element={<PrivateRoute><Layout><Profile/></Layout></PrivateRoute>}/>

            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
