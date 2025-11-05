import useFetch from "../hooks/useFetch"
import ProductContainer from "./ProductContainer";
import { formatToPeso } from "../utils/utils";

const TopProducts = () => {
    const { data : products } = useFetch('/api/products/top');

    return (
        <div className="p-5 md:p-10">
            <h1 className="text-2xl md:text-3xl text-gray-700 mb-6 font-bold">Popular Products</h1>
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products?.topProducts.map((product, index) => (
                    <ProductContainer
                        key={index}
                        id={product.product_id}
                        product_name={product.product.product_name}
                        price={formatToPeso(Math.min(...product.product.variants.map(v => v.price)))}
                        image={product.product.thumbnail.thumbnailUrl}
                        stock={product.product.variants.reduce((total, variant) => total + variant.stock, 0)}
                    />
                ))}
            </div>
        </div>
    )
}

export default TopProducts