import CustomizedTable from "../../components/CustomizedTable"
import Searchfield from "../../components/SearchField"
import TableRow from "@mui/material/TableRow"
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable"
import useFetch from "../../hooks/useFetch"
import { useState, useEffect } from "react"
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton"
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom"
import Pagination from "@mui/material/Pagination"
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal"
import { deleteData } from "../../services/api"

export const ProductTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="center">Stock</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Total Variants</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

export const ProductTableRow = ({ product }) => {
    const stock = product.variants.reduce((total, variant) => variant.stock + total, 0);
    const navigate = useNavigate()

    const navigateToEdit = () => {
        navigate(`/admin/product/${product.id}`)
    }

    const deleteProduct = async () => {
        if(await confirmDialog('Delete this product?', 'This action cannot be undone.')){
            const response = await deleteData(`/api/product/${product.id}`)
            if(response.success){
                await successAlert('Product successfully deleted', 'Your inventory has been updated.')
                window.location.reload()
            }else{
                errorAlert('Deletion Error', response.error)
            }
        }
    }

    return (
        <StyledTableRow>
            <StyledTableCell>
                <div className="flex items-center gap-5">
                    <img className="w-15 h-15" src={product.thumbnail?.thumbnailUrl} alt="" />
                    {product.product_name}
                </div>
            </StyledTableCell>
            <StyledTableCell align="center">{stock}</StyledTableCell>
            <StyledTableCell align="center">{product.category}</StyledTableCell>
            <StyledTableCell align="center">{product.variants.length}</StyledTableCell>
            <StyledTableCell align="center">
                <IconButton onClick={navigateToEdit}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={deleteProduct}>
                    <DeleteIcon />
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}

const filterInitialState = {
    page: 1,
    searchTerm: '',
    totalPages: 1,
}

const Products = () => {
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState('');
    const { data } = useFetch(`/api/product?limit=50&page=${filter.page}&searchTerm=${filter.searchTerm}`)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    return (
        <div className="p-5 flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-black">Products</h1>
            <div className="flex justify-between items-center">
                <Searchfield placeholder="Search by name, sku..." onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={() => window.location.href = '/admin/product'}>Create Product</button>
            </div>
            <div className="max-h-screen overflow-y-auto">
                <CustomizedTable 
                    cols={<ProductTableColumns />}
                    rows={data?.products.map(product => (
                        <ProductTableRow key={product.id} product={product}/>
                    ))}
                />
            </div>
            <div className='mt-4 flex justify-end'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
            </div>
        </div>
    )
}

export default Products