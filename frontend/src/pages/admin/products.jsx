import CustomizedTable from "../../components/CustomizedTable"
import Searchfield from "../../components/SearchField"
import TableRow from "@mui/material/TableRow"
import { StyledTableCell } from "../../components/CustomizedTable"

export const ProductTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Product Type</StyledTableCell>
            <StyledTableCell align="center">Created at</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

const Products = () => {
    return (
        <div className="p-5 flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-blue-500">Products</h1>
            <div className="flex justify-between items-center">
                <Searchfield placeholder="Search by name, sku..."/>
                <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={() => window.location.href = '/admin/product'}>Create Product</button>
            </div>text-blue-500
            <div className="h-screen overflow-y-auto">
                <CustomizedTable 
                    cols={<ProductTableColumns />}
                />
            </div>
        </div>
    )
}

export default Products