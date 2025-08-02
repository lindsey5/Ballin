import ProductContainer from "./ProductContainer";
import categories from "../contants/categories";
import useFetch from "../hooks/useFetch";
import { formatToPeso } from '../utils/utils';
import { useState, useEffect } from "react";
import { fetchData } from "../services/api";

const ProductsList = () => {
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [totalPages, setTotalPages] = useState(1);
    const { data } = useFetch(`/api/product?limit=10&page=1&category=${selectedCategory}`)
    const [products, setProducts] = useState([]);

    useEffect(() => {
      if (data) {
        setProducts(data.products);
        setTotalPages(data.totalPages)
      }
    }, [data]);

    const loadNextPage = async () => {
      const response = await fetchData(`/api/product?limit=10&page=${page + 1}`)
      if(response.success){
        setTotalPages(response.totalPages)
        setProducts(prev => [...prev, ...response.products])
        setPage(page + 1)
      }
    }

    return (
        <div className="mt-10 px-10">
          <h1 className="text-3xl text-gray-700 mb-6 font-bold">Product Overview</h1>
          <div className="flex gap-5 mb-6">
            <button
              className={`cursor-pointer hover:underline text-xl ${selectedCategory === 'All' && 'font-bold text-purple-500' }`}
             onClick={() => setSelectedCategory('All')}
            >All</button>
            {categories.map(c => <button 
              key={c} 
              className={`cursor-pointer hover:underline text-lg ${selectedCategory === c && 'font-bold text-purple-500' }`}
              onClick={() => setSelectedCategory(c)}
            >{c}</button>)}
          </div>
          <div className="flex flex-col items-center gap-15 pb-10">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                  <ProductContainer
                      key={index}
                      id={product.id}
                      product_name={product.product_name}
                      price={formatToPeso(Math.min(...product.variants.map(v => v.price)))}
                      image={product.thumbnail.thumbnailUrl}
                      stock={product.variants.reduce((total, variant) => total + variant.stock, 0)}
                  />
              ))}
              </div>
             {products.length !== 0 && page !== totalPages && <button 
                className="bg-gray-600 text-white px-5 py-1 cursor-pointer hover:underline rounded-md" 
                onClick={loadNextPage}
              >Load more</button>}

              {products.length === 0 && <div className="py-20">
                  <img src="/page-not-found.png" alt="" />
                  <h1 className="text-center mt-6 text-2xl font-bold">No results</h1>
              </div>}
          </div>
        </div>
    )
}

export default ProductsList