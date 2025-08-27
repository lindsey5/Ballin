import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/Home";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Products from "./pages/admin/products";
import Product from "./pages/admin/product";
import CustomerLoginPage from "./pages/auth/CustomerLogin";
import CustomerSignupPage from "./pages/auth/CustomerSignup";
import CustomerProductPage from "./pages/customer/Product";
import CartPage from "./pages/customer/Cart";
import ProductsPage from "./pages/customer/Products";
import CheckoutPage from "./pages/customer/Checkout";
import Orders from "./pages/admin/orders";
import Order from "./pages/admin/order";
import MyOrdersPage from "./pages/customer/MyOrders";
import CustomersPage from "./pages/admin/customers";
import MyOrder from "./pages/customer/Order";
import { UserContextProvider } from "./contexts/User";
import AdminLogin from "./pages/auth/AdminLogin";
import TermsAndConditions from "./pages/customer/Terms&Conditions";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy";
import FAQ from "./pages/customer/FAQ";

export default function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route index element={<Home />}/>
            <Route path="terms&conditions" element={<TermsAndConditions />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />}/>
            <Route path="faq" element={<FAQ />} />
            <Route path="login" element={<CustomerLoginPage />} />
            <Route path="signup" element={<CustomerSignupPage />} />
            <Route path="product/:id" element={<CustomerProductPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<MyOrdersPage />} />
            <Route path="order/:id" element={<MyOrder />}/>
          </Route>
          <Route path="admin">
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order/:id" element={<Order />} />
            <Route path="customers" element={<CustomersPage />} />
          </Route>
          </Route>
            
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}