import Divider from "@mui/material/Divider"
import { useState, useEffect, useMemo } from "react"
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import categories from "../../contants/categories"
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { sizes } from '../../contants/contants.js';
import { fetchData, postData, updateData } from "../../services/api.js"
import { confirmDialog, successAlert } from "../../utils/swal.js"
import { useParams } from "react-router-dom"
import Button from "@mui/material/Button"

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
                    <InputLabel>Size</InputLabel>
                    <Select
                        value={variant.size}
                        label="Size"
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
                    required
                    onChange={(e) => updateVariant('sku', e.target.value)}
                />
            </div>}
        </div>
    )
}

const productInitialState = {
    product_name: '',
    description: '',
    category: '',
}

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(productInitialState);
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [thumbnail, setThumbnail] = useState();
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            const response = await fetchData(`/api/product/${id}`);
            if(response){
                const { images, thumbnail, variants, ...rest } = response
                setProduct(rest);
                setImages(images)
                setThumbnail(thumbnail);
                setVariants(variants)
            }
        }

        if(id) getProduct();
    }, [])
    
    const handleThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(prev => ({...prev, thumbnailUrl: reader.result}))
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImages = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, { imageUrl: reader.result }])
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

    const handleCreate = async () =>{
        const response = await postData('/api/product', { product, thumbnail, images, variants }) 
        if(response){
            await successAlert('Success', 'Product successfully created');
            window.location.reload()
        }
    }

    const handleUpdate = async () => {
        const response = await updateData(`/api/product/${id}`, { product, thumbnail, images, variants, imagesToDelete });
        if(response){
            await successAlert('Success', 'Product successfully updated');
            window.location.reload()
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        
        if(await confirmDialog('Save Product?', 'This action will save your product and all variants.', 'question')){
            await !product.id ? handleCreate() : handleUpdate();
        }
    }

    const removeImage = (index) => {
        const imageToRemove = images[index];
        if (imageToRemove) {
            setImagesToDelete(prev => [...prev, imageToRemove]);
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const isVariantValid = useMemo(() => {
        return variants.every(variant => Object.values(variant).every(v => v))
    }, [variants])

    return (
        <form className="p-5 flex flex-col gap-10" onSubmit={handleSave}>
            <h1 className="text-3xl font-bold text-blue-500">Create Product</h1>
            <Divider />
            <div className="p-5 grid lg:grid-cols-2 gap-10">
                <div className="flex flex-col gap-5">
                    <TextField 
                        label="Product Name" 
                        value={product.product_name}
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
                        value={product.description}
                        rows={5}
                        onChange={(e) => setProduct(prev => ({...prev, description: e.target.value}))}
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
                    <img className="w-30 h-30" src={thumbnail?.thumbnailUrl ?? '/image/image-gallery.png'} alt="product-image"/>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="cursor-pointer text-blue-500" htmlFor="image-input">Add Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image-input"
                        className="hidden"
                        onChange={handleImages}
                    />
                    <div className="overflow-x-auto flex gap-5">
                        {images.map((image, i) => <img 
                            key={i} 
                            onClick={() => removeImage(i)} 
                            className="w-20 h-20" src={image.imageUrl ?? '/image/image-gallery.png'} 
                            alt="product-image"
                        />)}
                        <img className="w-20 h-20" src='/image/image-gallery.png' alt="product-image"/>
                    </div>
                    <Divider />
                    <div className="flex gap-5 justify-between items-center mb-4">
                        <p className="text-black text-lg text-blue-500">Variations</p>
                        <button type="button" className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={addVariant}>Add Variant</button>
                    </div>
                    {variants.length > 0 ? variants.map((variant, i) => <VariantContainer index={i} setVariants={setVariants} variant={variant}/>) : <p>No Variants</p>}
                </div>
                <Button 
                    disabled={!thumbnail || variants.length < 1 || !isVariantValid}
                    type="submit" 
                    variant="contained" 
                    sx={{ backgroundColor: 'black'}}
                >Save Product</Button>
            </div>
        </form>
    )
}

export default Product