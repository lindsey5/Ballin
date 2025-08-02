
const ProductContainer = ({ id, product_name, price, image, stock }) => {
    return (
        <div 
            className="flex flex-col gap-2 hover:scale-102 hover:shadow-xl hover:border-1 border-gray-200 cursor-pointer transition-all ease-out"
            onClick={() => window.location.href = `/product/${id}`}
        >
            <img className="w-full h-[300px]" src={image} alt={product_name} />
            <div className="px-2 py-3 flex flex-col gap-2">
                <h1 className="font-bold text-lg">{product_name}</h1>
                <p className="text-xl font-bold text-red-600">{price}</p>
                <p className="text-gray-500">Available Stocks: {stock}</p>
            </div>
        </div>
    )
}

export default ProductContainer