import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import GraduationPackages from './pages/GraduationPackages';
import ProductDetails from './components/Products/ProductDetails';
import NewArrivals from './components/Products/NewArrivals';
import Checkout from './components/Cart/Checkout';

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position='top-right' />
      <Routes>
          <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='profile' element={<Profile />} />
          <Route path='graduation' element={<GraduationPackages />} />
          <Route path='product/:id' element={<ProductDetails />} />
          <Route path='checkout' element={<Checkout />} />
        </Route>
        <Route></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App