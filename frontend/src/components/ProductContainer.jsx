
const ProductContainer = ({ product_name, price, image }) => {
    return (
        <div className="flex flex-col gap-2 hover:scale-102 hover:shadow-xl hover:border-1 border-gray-200 cursor-pointer transition-all ease-out">
            <img className="w-full h-[300px]" src={image} alt={product_name} />
            <div className="px-2 py-3">
                <h1 className="font-bold text-lg">{product_name}</h1>
                <p className="text-red-600">{price}</p>
            </div>
        </div>
    )
}

export default ProductContainer