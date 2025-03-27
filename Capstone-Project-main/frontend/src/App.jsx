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
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';

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
          <Route path='order-confirmation' element={<OrderConfirmation />} />
          <Route path='order/:id' element={<OrderDetailsPage />} />
          <Route path='my-orders' element={<MyOrdersPage />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />} >
          <Route index element={<AdminHomePage />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='products' element={<ProductManagement />} />
          <Route path='products/:id/edit' element={<EditProductPage />} />
          <Route path='orders' element={<OrderManagement />} />
        </Route>
        <Route></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App