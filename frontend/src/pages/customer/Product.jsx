import useFetch from "../../hooks/useFetch"
import { useParams } from "react-router-dom";
import { formatToPeso } from "../../utils/utils";
import { useMemo, useState } from "react";
import Counter from "../../components/Counter";
import { postData } from "../../services/api";
import { successAlert } from "../../utils/swal";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartThunks";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import { UserContext } from "../../contexts/User";

const CustomerProductPage = () => {
    const { id } = useParams();
    const { data } = useFetch(`/api/products/${id}`)
    const [selectedColor, setSelectedColor] = useState();
    const [selectedSize, setSelectedSize] = useState();
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState();
    const { user } = useContext(UserContext);

    const selectedVariant = useMemo(() => {
        if(!data?.product) return null

        return data.product.variants.filter(variant => variant.color === selectedColor && variant.size === selectedSize)[0]
    }, [data?.product, selectedColor, selectedSize])

    const addToCart = async () => {
        if(!user) {
            window.location.href = '/login'
            return;
        }
        const response = await postData('/api/cart', { product_id: id, variant_id: selectedVariant.id, quantity })
        if(response.success){
            dispatch(fetchCart())
            await successAlert('Added to cart', 'You can view it in your cart now.');
        }
    }

    return (
        <div className="min-h-screen">
             <Helmet>
                <title>Product</title>
            </Helmet>
            <div className="gap-5 md:gap-10 grid md:grid-cols-2 p-10 md:p-10">
                {/* images */}
                <div className="flex flex-col gap-10 items-center">
                    <img className="w-[90%] md:w-[80%] h-[50vh] md:h-[70vh]" src={selectedImage || data?.product.thumbnail.thumbnailUrl} alt="" />
                    <div className="w-[90%] md:w-[80%] flex gap-5 overflow-x-auto">
                        <img onMouseEnter={() => setSelectedImage(data?.product.thumbnail.thumbnailUrl)} className="cursor-pointer w-[100px] h-[100px]" src={data?.product.thumbnail.thumbnailUrl} />
                        {data?.product.images.map(image => <img onMouseEnter={() => setSelectedImage(image.imageUrl)} key={image.id} className="cursor-pointer w-[100px] h-[100px]" src={image.imageUrl} />)}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-bold">{data?.product.product_name}</h1>
                    <strong className="font-bold text-2xl font-bold text-purple-500">{formatToPeso(
                    selectedVariant?.price ??
                        Math.min(
                            ...(data?.product?.variants?.length
                            ? data.product.variants.map(v => v.price)
                            : [0])
                        )
                    )}</strong>
                    <p className="text-xl text-gray-600 mb-3">{data?.product.description}</p>
                    {selectedColor && selectedSize && (selectedVariant ? <p>Stock: {selectedVariant?.stock}</p> : <p className="text-red-600">Not Available</p>)}
                    <strong>Color:</strong>
                    <div className="flex flex-wrap gap-5">
                        {[...new Set(data?.product.variants.map(v => v.color))].map(color => (
                            <button 
                                key={color}
                                className={`border px-5 py-1 rounded-xl text-md cursor-pointer ${selectedColor === color && 'bg-black text-white'}`}
                                onClick={() => setSelectedColor(color)}
                            >{color}</button>
                        ))}
                    </div>
                    <strong>Size:</strong>
                    <div className="flex flex-wrap gap-5">
                        {[...new Set(data?.product.variants.map(v => v.size))].map(size => (
                            <button 
                                key={size}
                                className={`border px-5 py-1 rounded-xl text-md cursor-pointer ${selectedSize === size && 'bg-black text-white'}`}
                                onClick={() => setSelectedSize(size)}
                            >{size}</button>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-5">
                        <Counter 
                            limit={selectedVariant?.stock ?? 1}
                            value={quantity}
                            setValue={setQuantity}
                            disabled={!selectedVariant}
                        />
                        <button 
                            disabled={!selectedVariant}
                            onClick={addToCart}
                            className="cursor-pointer w-full md:w-[300px] rounded-3xl px-5 py-2 text-xl text-white bg-black"
                        >Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerProductPage