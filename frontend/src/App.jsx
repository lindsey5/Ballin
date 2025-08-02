import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/Home";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Products from "./pages/admin/products";
import Product from "./pages/admin/product";
import CustomerLoginPage from "./pages/auth/CustomerLogin";
import CustomerSignupPage from "./pages/auth/CustomerSIgnup";
import CustomerProductPage from "./pages/customer/Product";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route index element={<Home />}/>
            <Route path="login" element={<CustomerLoginPage />} />
            <Route path="signup" element={<CustomerSignupPage />} />
            <Route path="product/:id" element={<CustomerProductPage />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="product" element={<Product />} />
            <Route path="product/:id" element={<Product />} />
          </Route>
            
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
  )
}