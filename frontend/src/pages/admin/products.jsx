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
import { filterInitialState } from "../../contants/contants";
import { Helmet } from "react-helmet"
import { formatDate } from "../../utils/dateUtils"
import { exportData } from "../../utils/utils"

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
            const response = await deleteData(`/api/products/${product.id}`)
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

const Products = () => {
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState('');
    const { data } = useFetch(`/api/products?limit=50&page=${filter.page}&searchTerm=${filter.searchTerm}`)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    const exportProducts = () => {
        const dataToExport = [];

        data.products.forEach((product) => {
            product.variants.forEach((variant) => {
            dataToExport.push({
                product_name: product.product_name,
                sku: variant.sku,
                color: variant.color,
                size: variant.size,
                stock: variant.stock,
            });
            });
        });
        exportData({
            dataToExport,
            filename: `BALLIN-inventory (${formatDate(new Date())}).xlsx`,
            sheetname: `Inventory ${formatDate(new Date())}`
        })
    };

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Products</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-black">Products</h1>
            <div className="flex justify-between items-center gap-5">
                <Searchfield placeholder="Search by name, sku..." onChange={(e) => setSearchTerm(e.target.value)}/>
                <div className="flex gap-5">
                    <button className="px-3 py-2 rounded-lg bg-red-600 text-white cursor-pointer" onClick={() => window.location.href = '/admin/low-stock-variants'}>Low Stocks</button>
                    <button className="px-3 py-2 rounded-lg bg-purple-600 text-white cursor-pointer" onClick={() => window.location.href = '/admin/product'}>Create Product</button>
                </div>
            </div>
            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={<ProductTableColumns />}
                    rows={data?.products.map(product => (
                        <ProductTableRow key={product.id} product={product}/>
                    ))}
                />
            </div>
            <div className='mt-4 flex justify-between gap-5'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
                    <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={exportProducts}>Export</button>
            </div>
        </div>
    )
}

export default Products