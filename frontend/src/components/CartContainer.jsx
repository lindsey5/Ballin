import { useEffect, useState } from "react";
import Counter from "./Counter";
import { updateData } from "../services/api";
import { formatToPeso } from "../utils/utils";
import { useDispatch } from "react-redux";
import { deleteCartItem } from "../features/cart/cartThunks";
import { updateCartItem } from "../features/cart/cartSlice";

const CartContainer = ({ item, tableMode }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const dispatch = useDispatch();

    useEffect(() => {
        const updateCartAsync = async () => {
            await updateData(`/api/cart/${item.id}`, { quantity });
        };
        const debounce = setTimeout(async () => {
            await updateCartAsync();
            dispatch(updateCartItem({...item, quantity}))
        }, 300);
        return () => clearTimeout(debounce);
    }, [quantity]);


    if (tableMode) {
        // Table row view
        return (
            <tr>
                <td className="px-4 py-2 flex items-center gap-4">
                    <img
                        className="w-20 h-20 object-cover"
                        src={item.product.thumbnail.thumbnailUrl}
                        alt={item.product.product_name}
                    />
                    <span className="font-semibold">{item.product.product_name}</span>
                </td>
                <td className="px-4 py-2 text-center">
                    {formatToPeso(item.variant.price)}
                </td>
                <td className="px-4 py-2">
                    <div className="flex justify-center">
                        <Counter
                            limit={item.variant.stock}
                            value={quantity}
                            setValue={setQuantity}
                        />
                    </div>
                </td>
                <td className="px-4 py-2 text-center">
                    {formatToPeso(item.variant.price * quantity)}
                </td>
                <td className="px-4 py-2 text-center">
                    <button className="cursor-pointer text-red-500" onClick={() => dispatch(deleteCartItem(item.id))}>Delete</button>
                </td>
            </tr>
        );
    }

    // Mobile card view
    return (
        <div className="p-4 flex flex-col gap-3">
            <div className="flex gap-4">
                <img
                    className="w-20 h-20 object-cover"
                    src={item.product.thumbnail.thumbnailUrl}
                    alt={item.product.product_name}
                />
                <div>
                    <h2 className="font-semibold">{item.product.product_name}</h2>
                    <p className="text-gray-500">{formatToPeso(item.variant.price)}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <Counter
                    limit={item.variant.stock}
                    value={quantity}
                    setValue={setQuantity}
                />
                <div className="text-center">
                    <p className="font-bold mb-4">{formatToPeso(item.variant.price * quantity)}</p>
                    <button className="cursor-pointer text-red-500" onClick={() => dispatch(deleteCartItem(item.id))}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default CartContainer;
