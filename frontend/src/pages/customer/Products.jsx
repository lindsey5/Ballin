import { useNavigate, useSearchParams } from "react-router-dom";
import ProductsList from "../../components/ProductsList";
import { Helmet } from "react-helmet";
import useFetch from "../../hooks/useFetch";

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("searchTerm");
    const { data } = useFetch('/api/products/top')
    const navigate = useNavigate();

    return(
        <div className="min-h-screen px-2 md:px-10">
             <Helmet>
                <title>Products</title>
            </Helmet>
            <div className="flex gap-5">
                <div className="flex-1">
                    <ProductsList searchTerm={search} title={search ? `Results for ${search}` : "Products"} />
                </div>
                <div className="hidden md:flex flex-1 max-w-[300px] flex-col gap-2 border-l border-gray-300 md:p-5">
                    <h1 className="text-xl">Most Selling Products</h1>
                    {data?.topProducts.map(product => <div key={product.product_id} onClick={() => navigate(`/product/${product.product_id}`)} className="p-5 flex items-start gap-5 cursor-pointer hover:bg-gray-100">
                        <img className="w-20 h-20" src={product.product.thumbnail.thumbnailUrl} alt="" />
                        <div>
                            <h1>{product.product.product_name}</h1>
                            <p className="mt-1 text-gray-400 text-sm">Available Stock: {product.product.variants.reduce((total, variant) => total + variant.stock, 0)}</p>
                        </div>
                    </div>)}
             </div>
            </div>
        </div>
    )
}

export default ProductsPage