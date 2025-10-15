import useFetch from "../../hooks/useFetch"
import { Helmet } from "react-helmet"
import categories from "../../contants/categories"
import CustomizedTable from "../../components/CustomizedTable"
import { TableRow, FormControl, Select, InputLabel, MenuItem, Modal, Box, Typography, TextField, Button } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable"
import Searchfield from "../../components/SearchField"
import { filterInitialState } from "../../contants/contants"
import { useState, useEffect } from "react"
import { errorAlert, successAlert } from "../../utils/swal"
import { updateData } from "../../services/api"
import { useLocation } from "react-router-dom"

export const VariantTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Product Name</StyledTableCell>
            <StyledTableCell align="center">SKU</StyledTableCell>
            <StyledTableCell align="center">Size</StyledTableCell>
            <StyledTableCell align="center">Color</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Stock</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

export const VariantTableRow = ({ variant, setVariantToUpdate}) => {
    return (
        <StyledTableRow>
            <StyledTableCell>
                <div className="flex items-center gap-4">
                    <img className="w-9 h-9" src={variant.product.thumbnail.thumbnailUrl} />
                    {variant.product.product_name}
                </div>
            </StyledTableCell>
            <StyledTableCell align="center">{variant.sku}</StyledTableCell>
            <StyledTableCell align="center">{variant.size}</StyledTableCell>
            <StyledTableCell align="center">{variant.color}</StyledTableCell>
            <StyledTableCell align="center">{variant.product.category}</StyledTableCell>
            <StyledTableCell align="center">
                <div className="text-white flex justify-center bg-red-500 p-1">
                {variant.stock}
                </div>
            </StyledTableCell>
            <StyledTableCell align="center">
                <button 
                    className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer"
                    onClick={() => setVariantToUpdate(variant)}
                >Add Stock</button>
            </StyledTableCell>
        </StyledTableRow>
    )
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

const AddStockModal = ({ open, onClose, variant }) => {
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            errorAlert('Error.', 'Please enter valid quantity');
            return;
        }

        const response = await updateData(`/api/variants/${variant.id}`, { quantity })

        if(!response.success){
            errorAlert('Error.', response.error)
            return;
        }

        await successAlert('Success!', "Stock updated successfully!")
        window.location.reload();
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: 1 }}>
        <Box sx={modalStyle}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
            Add Stock
            </Typography>

            <Typography variant="body2" mb={1}>
            Variant: <strong>{variant?.sku}</strong>
            </Typography>
            <Typography variant="body2" mb={2}>
            Current Stock: <strong>{variant?.stock}</strong>
            </Typography>

            <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Add Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                sx={{ mb: 3 }}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={onClose} color="inherit" variant="outlined" type="button">
                Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                Add
                </Button>
            </Box>
            </form>
        </Box>
        </Modal>
    );
};


const LowStockVariants = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const sku = queryParams.get("sku");
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState(sku ? sku : '');
    const [category, setCategory] = useState('All');
    const [variantToUpdate, setVariantToUpdate] = useState();
    const { data } = useFetch(`/api/variants/low-stocks?searchTerm=${filter.searchTerm}&category=${category}`)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSelect = (event) => {
        setCategory(event.target.value)
    };

    return (
       <div className="min-h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Low Stock Variants</title>
            </Helmet>
            <AddStockModal 
                open={variantToUpdate !== undefined}
                variant={variantToUpdate}
                onClose={() => setVariantToUpdate(undefined)}
            />
            <h1 className="text-3xl font-bold text-black">Low Stock Variants</h1>
            <div className="flex justify-between items-center gap-5">
                <Searchfield placeholder="Search by sku..." onChange={(e) => setSearchTerm(e.target.value)}/>
                <FormControl sx={{ width: '30%'}}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    label="Category"
                    onChange={handleSelect}
                    required
                >
                    <MenuItem value='All'>All</MenuItem>
                    {categories.map(c => <MenuItem value={c}>{c}</MenuItem>)}
                </Select>
            </FormControl>
            
            </div>

            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={<VariantTableColumns />}
                    rows={data?.variants.map(variant => <VariantTableRow setVariantToUpdate={setVariantToUpdate} key={variant.id} variant={variant}/>)}
                />
            </div>
        </div> 
    )
}

export default LowStockVariants