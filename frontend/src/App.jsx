import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/Home";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/dashboard";
import Products from "./pages/admin/products";
import Product from "./pages/admin/product";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route index element={<Home />}/>
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="product" element={<Product />} />
          </Route>
            
          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
  )
}