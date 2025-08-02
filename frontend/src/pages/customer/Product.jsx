import useFetch from "../../hooks/useFetch"
import { useParams } from "react-router-dom";
import { formatToPeso } from "../../utils/utils";
import { useMemo, useState } from "react";
import Counter from "../../components/Counter";

const CustomerProductPage = () => {
    const { id } = useParams();
    const { data } = useFetch(`/api/product/${id}`)
    const [selectedColor, setSelectedColor] = useState();
    const [selectedSize, setSelectedSize] = useState();
    const [quantity, setQuantity] = useState(1);

    const selectedVariant = useMemo(() => {
        if(!data?.product) return null

        return data.product.variants.filter(variant => variant.color === selectedColor && variant.size === selectedSize)[0]
    }, [data?.product, selectedColor, selectedSize])

    return (
        <div className="min-h-screen">
            <div className="gap-5 md:gap-10 grid md:grid-cols-2 p-10 md:p-10">
                {/* images */}
                <div className="flex flex-col gap-10 items-center">
                    <img className="w-[90%] md:w-[80%] h-[50vh] md:h-[70vh]" src={data?.product.thumbnail.thumbnailUrl} alt="" />
                    <div className="w-[90%] md:w-[80%] flex gap-5 overflow-x-auto">
                        {data?.product.images.map(image => <img key={image.id} className="w-[100px] h-[100px]" src={image.imageUrl} />)}
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
                                className={`border px-5 py-1 rounded-lg text-xl cursor-pointer ${selectedColor === color && 'bg-black text-white'}`}
                                onClick={() => setSelectedColor(color)}
                            >{color}</button>
                        ))}
                    </div>
                    <strong>Size:</strong>
                    <div className="flex flex-wrap gap-5">
                        {[...new Set(data?.product.variants.map(v => v.size))].map(size => (
                            <button 
                                key={size}
                                className={`border px-5 py-1 rounded-lg text-xl cursor-pointer ${selectedSize === size && 'bg-black text-white'}`}
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
                            className="cursor-pointer w-full md:w-[300px] rounded-3xl px-5 py-2 text-xl text-white bg-black"
                        >Add to cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerProductPage