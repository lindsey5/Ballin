import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchCart } from "../../features/cart/cartThunks";
import CartContainer from "../../components/CartContainer";
import { formatToPeso } from "../../utils/utils";
import { Helmet } from "react-helmet";
import { CircularProgress } from "@mui/material";

const CartPage = () => {
    const dispatch = useDispatch();
    const { loading, cart }= useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const subTotal = useMemo(() => cart.reduce((total, item) => total + (item.variant.price * item.quantity),0) , [cart])

    return (
        <div className="min-h-[calc(100vh-100px)] px-4 md:px-10 py-10">
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {loading ? <div className="flex justify-center">
                <CircularProgress />
            </div> : cart.length === 0 ? <div className="w-full flex flex-col items-center gap-5">
                <h1 className="text-xl font-bold">Your cart is empty.</h1>
                <button 
                    onClick={() => window.location.href = "/products"}
                    className="cursor-pointer rounded-md py-2 px-6 text-lg text-white bg-black"
                >
                    Shop now
                </button>
            </div> : 
            <>
                {/* TABLE for medium+ screens */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Subtotal</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <CartContainer key={item.id} item={item} tableMode />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CARD layout for small screens */}
                <div className="flex flex-col gap-5 md:hidden">
                    {cart.map(item => (
                        <CartContainer key={item.id} item={item} />
                    ))}
                </div>

                <div className="w-full flex justify-end items-center mt-6 gap-5">
                    <h2 className="text-lg text-end">Subtotal: <span className="text-xl text-purple-500">{formatToPeso(subTotal)}</span></h2>
                    <button 
                        disabled={cart.length === 0} 
                        className="cursor-pointer rounded-md py-2 px-6 text-lg text-white bg-black"
                        onClick={() => window.location.href = '/checkout'}
                    >Checkout</button>
                </div>
            </>
            }
        </div>
    );
};

export default CartPage;
