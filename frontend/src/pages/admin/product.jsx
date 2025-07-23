import Divider from "@mui/material/Divider"
import { useState } from "react"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import categories from "../../contants/categories"
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { sizes } from '../../contants/contants.js';

const productInitialState = {
    product_name: '',
    description: '',
    category: '',
    thumbnailUrl: null,
    thumbnailPublicId: null,
}

const VariantContainer = ({ setVariants, variant, index }) => {
    const [open, setOpen] = useState(false);

    const removeVariant = () => {
        setVariants(prev => prev.filter((_, i) => i !== index))
    }

    const updateVariant = (field, newValue) => {
        setVariants(prev => prev.map((v, i) => (i !== index ? v : {...v, [field]: newValue})))
    }

    const handleSelect = (event) => {
        updateVariant('size', event.target.value)
    };

    return (
        <div className="border border-gray-300">
            <div className="border-b border-gray-300 flex justify-between items-center px-5 py-2">
                <div className="flex flex-col gap-2">
                    <p className="font-bold text-lg">Variant {index + 1}</p>
                    <p>{variant.color}-{variant.size}</p>
                </div>
                <div className="flex items-center">
                    <span className="cursor-pointer text-blue-500" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</span>
                    <IconButton onClick={removeVariant}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
            {open && <div className="grid grid-cols-2 gap-5 p-5 bg-gray-100">
                <FormControl sx={{ backgroundColor: 'white'}}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={variant.size}
                        label="Category"
                        onChange={handleSelect}
                        required
                    >
                        {sizes.map(s => <MenuItem value={s}>{s}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField 
                    value={variant.color}
                    label="Color" 
                    sx={{ backgroundColor: 'white'}} 
                    required
                    onChange={(e) => updateVariant('color', e.target.value.toLocaleUpperCase())}
                />
                <TextField 
                    value={variant.stock}
                    label="Stock" 
                    sx={{ backgroundColor: 'white'}} 
                    required
                    onChange={(e) => updateVariant('stock', e.target.value)}
                />
                <TextField 
                    value={variant.price}
                    label="Price" 
                    sx={{ backgroundColor: 'white'}} 
                    required
                    onChange={(e) => updateVariant('price', e.target.value)}
                />
                <TextField 
                    value={variant.sku}
                    label="SKU" 
                    sx={{ backgroundColor: 'white'}} 
                    onChange={(e) => updateVariant('sku', e.target.value)}
                />
            </div>}
        </div>
    )
}

const Product = () => {
    const [product, setProduct] = useState(productInitialState);
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);

    const handleThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct({...product, thumbnailUrl: reader.result})
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImages = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, { url: reader.result }])
            };
            reader.readAsDataURL(file);
        }
    };

    const addVariant = () =>{
        setVariants(prev => [...prev, { 
            size: '',
            color: '',
            sku: '',
            price: undefined,
            stock: undefined,
        }])
    }

    const handleSelect = (event) => {
        setProduct(prev => ({...prev, category: event.target.value}));
    };

    return (
        <form className="p-5 flex flex-col gap-10">
            <h1 className="text-3xl font-bold text-blue-500">Create Product</h1>
            <Divider />
            <div className="p-5 flex gap-20">
                <div className="flex-1 flex flex-col gap-5">
                    <TextField 
                        label="Product Name" 
                        onChange={(e) => setProduct(prev => ({...prev, product_name: e.target.value}))}
                        required
                    />
                    <FormControl>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={product.category}
                            label="Category"
                            onChange={handleSelect}
                            required
                        >
                            {categories.map(c => <MenuItem value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField 
                        label="Description" 
                        rows={5}
                        multiline
                        required
                    />
                    <label className="cursor-pointer text-blue-500" htmlFor="thumbnail-input">Upload Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="thumbnail-input"
                        className="hidden"
                        onChange={handleThumbnail}
                    />
                    <img className="w-30 h-30" src={product.thumbnailUrl ?? '/image/image-gallery.png'} alt="product-image"/>
                    <button type="submit" className="mt-4 px-3 py-2 rounded-lg bg-black text-white cursor-pointer">Save Product</button>
                </div>
                <div className="flex-1 flex flex-col gap-5">
                    <label className="cursor-pointer text-blue-500" htmlFor="image-input">Add Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-input"
                        className="hidden"
                        onChange={handleImages}
                    />
                    <div className="overflow-x-auto flex gap-5">
                        {images.map(image => <img className="w-20 h-20" src={image.url ?? '/image/image-gallery.png'} alt="product-image"/>)}
                        <img className="w-20 h-20" src='/image/image-gallery.png' alt="product-image"/>
                    </div>
                    <Divider />
                    <div className="flex gap-5 justify-between items-center mb-4">
                        <p className="text-black text-lg text-blue-500">Variations</p>
                        <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={addVariant}>Add Variant</button>
                    </div>
                    {variants.length > 0 ? variants.map((variant, i) => <VariantContainer index={i} setVariants={setVariants} variant={variant}/>) : <p>No Variants</p>}
                </div>
            </div>
        </form>
    )
}

export default Product