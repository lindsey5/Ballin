import { formatToPeso } from "../utils/utils"

const OrderContainer = ({ item }) => {
    return (
            <div className="p-5 flex gap-4 justify-between items-start">
                <div className="flex gap-4 w-[50%]">
                    <img
                        className="w-20 h-20 object-cover"
                        src={item.product.thumbnail.thumbnailUrl}
                        alt={item.product.product_name}
                    />
                    <div>
                        <h2 className="font-semibold">{item.product.product_name}</h2>
                        <p className="text-gray-500">{formatToPeso(item.price)}</p>
                        <p className="text-gray-500">{item.quantity}</p>
                    </div>
                </div>
                <p className="text-gray-500">{item.color} | {item.size}</p>
                <p className="text-purple-500 text-center font-bold">{formatToPeso(item.total)}</p>
            </div>
    )
}

export default OrderContainer