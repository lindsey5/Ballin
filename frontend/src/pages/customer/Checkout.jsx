import { useDispatch, useSelector } from "react-redux";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { fetchCart } from "../../features/cart/cartThunks";
import CheckoutContainer from "../../components/CheckoutContainer";
import { formatToPeso } from "../../utils/utils";
import { postData } from "../../services/api";
import { confirmDialog, errorAlert } from "../../utils/swal";
import { Helmet } from "react-helmet";
import { UserContext } from "../../contexts/User";
import { successAlert } from "../../utils/swal";
import { Navigate } from "react-router-dom";

const AddressInput = memo(({ items, payment_details }) => {
    const { user, loading } = useContext(UserContext);
    const [agree, setAgree] = useState(false);
    const [regions, setRegions] = useState([]);
    const [address, setAddress] = useState({
        firstname: '',
        lastname: '',
        address_line_1: '',
        address_line_2: '',
        admin_area_1: '',
        admin_area_2: '',
        postal_code: ''
    });

    useEffect(() => {
        if(user){
            setAddress(prev => ({
                ...prev,
                firstname: user?.firstname || '',
                lastname: user?.lastname || '',
            }))
        }
    }, [user])

    useEffect(() => {
        const getRegions = async () => {
            const response = await fetch('https://psgc.gitlab.io/api/regions');
            if(response.ok){
                const result = await response.json();
                setRegions(result.map(r => r.name).sort((a, b) => a.localeCompare(b)));
            }
        };
        getRegions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const confirmed = await confirmDialog('Place this order?', '');
        if (!confirmed) return;

        const response = payment_details.paymentMethod === 'COD' 
            ? await postData('/api/orders', { address, items, payment_details }) 
            : await postData('/api/payment/checkout', { address, items, payment_details });

        if (response.success) {
            if (payment_details.paymentMethod === "COD") {
                await successAlert("Order successfully placed", "Thank you for choosing our Ballin!");
                window.location.href = `/order/${response.order.order_id}`;
            } else {
                window.location.href = response.checkout_url, "_blank";
            }
        } else {
            errorAlert('Order Failed', response.error || 'Unable to place your order. Please try again.');
        }
    }

    if(!user && !loading){
        return <Navigate to="/" />
    }

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 p-4">
            {/* First & Last name */}
            <div className="flex flex-col sm:flex-row gap-3">
                <input 
                    name="firstname"
                    value={address.firstname}
                    onChange={handleChange}
                    className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                    type="text" 
                    required
                    placeholder="Firstname"
                />
                <input 
                    name="lastname"
                    value={address.lastname}
                    onChange={handleChange}
                    className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                    type="text" 
                    required
                    placeholder="Lastname"
                />
            </div>

            <input 
                name="address_line_1"
                value={address.address_line_1}
                onChange={handleChange}
                className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                type="text" 
                required
                placeholder="Street name, house number, subdivision"
            />
            <input 
                name="address_line_2"
                value={address.address_line_2}
                onChange={handleChange}
                className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                type="text" 
                required
                placeholder="Barangay / District"
            />

            <input 
                name="admin_area_2"
                value={address.admin_area_2}
                onChange={handleChange}
                className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                type="text" 
                required
                placeholder="City / Municipality"
            />

            <select
                name="admin_area_1"
                value={address.admin_area_1}
                onChange={handleChange}
                required
                className="outline-none w-full p-3 border border-gray-400 rounded-lg"
            >
                <option value="">Select Region</option>
                {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                ))}
            </select>

            <input 
                name="postal_code"
                value={address.postal_code}
                onChange={handleChange}
                className="outline-none w-full p-3 border border-gray-400 rounded-lg" 
                type="text" 
                required
                placeholder="ZIP Code"
            />

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 mt-2">
                <input 
                    id="agree"
                    type="checkbox" 
                    checked={agree} 
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 cursor-pointer"
                    required
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                    I agree to the <a href="/terms&conditions" target="_blank" className="underline">Terms and Conditions</a> and <a href="/privacy-policy" target="_blank" className="underline">Privacy Policy</a>.
                </label>
            </div>

            <button 
                disabled={!agree} 
                type="submit" 
                className="cursor-pointer hover:opacity-75 mt-4 p-3 bg-black text-white rounded-lg disabled:opacity-50"
            >
                Place Order
            </button>
        </form>
    );
});


const CheckoutPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const payment_details = useMemo(() => {
        const subtotal = cart.reduce((total, item) => total + (item.variant.price * item.quantity),0)
        const shipping_fee = 0;
        const total = subtotal + shipping_fee;

        return { subtotal, shipping_fee, total, paymentMethod }
    }, [cart, paymentMethod])

    return (
        <div className="grid md:grid-cols-2 min-h-screen p-10 gap-5 md:gap-20">
             <Helmet>
                <title>Checkout</title>
            </Helmet>
            <div>
                 <h1 className="text-3xl font-bold mb-6">Checkout</h1>
                 {cart.map(item => (
                    <CheckoutContainer key={item.id} item={item}/>
                ))}
                <div className="flex justify-end border-t pt-6 border-gray-400">
                    <div>
                        <p>Subtotal: <span className="ml-4 font-semibold">{formatToPeso(payment_details.subtotal)}</span></p>
                        <p>Shipping: <span className="ml-4 font-semibold">FREE</span></p>
                        <p className="text-end font-bold text-lg md:text-xl text-purple-500 mt-6">Total: {formatToPeso(payment_details.total)}</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5 md:p-10">
                <strong>Payment Method:</strong>
                <div className="flex gap-5">
                    <button 
                        className={`hover:opacity-75 cursor-pointer rounded-md px-5 py-2 ${paymentMethod === 'COD' && 'bg-black text-white'}`}
                        onClick={() => setPaymentMethod('COD')}
                    >COD</button>
                    <button 
                        className={`hover:opacity-75 cursor-pointer rounded-md px-5 py-2 ${paymentMethod === 'Other' && 'bg-black text-white'}`}
                        onClick={() => setPaymentMethod('Other')}
                    >GCASH / MAYA</button>
                </div>
                <AddressInput items={cart} payment_details={payment_details}/>
            </div>
        </div>
    )
}

export default CheckoutPage