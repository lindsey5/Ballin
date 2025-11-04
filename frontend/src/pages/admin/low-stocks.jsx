import { formatDate } from "../../utils/dateUtils";
import { Helmet } from "react-helmet";
import { IconButton, Pagination, TableRow } from "@mui/material"; // keeping only Pagination
import useFetch from "../../hooks/useFetch";
import CustomizedTable from "../../components/CustomizedTable";
import { filterInitialState } from "../../contants/contants";
import { useState } from "react";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { updateData } from "../../services/api";

const StatusChip = ({ status }) => {
  const isUnread = status === "unread";

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        isUnread ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
      }`}
    >
      {isUnread ? "Unread" : "Read"}
    </span>
  );
};

export const LowStockTableColumns = () => {
  return (
    <TableRow
      sx={{ position: "sticky", top: 0, zIndex: 1, backgroundColor: "white" }}
    >
      <StyledTableCell align="left">Message</StyledTableCell>
      <StyledTableCell align="center">Date</StyledTableCell>
      <StyledTableCell align="center">Status</StyledTableCell>
      <StyledTableCell align="center">Action</StyledTableCell>
    </TableRow>
  );
};

export const LowStockTableRow = ({ lowStock }) => {
    const markAsRead = async () => {
        if(lowStock.status === 'read'){
        window.location.href = `/admin/variants?sku=${lowStock.variant.sku}`
        }

        const response = await updateData(`/api/low-stocks/${lowStock.id}`, {});
        if(response.success){
            window.location.href = `/admin/variants?sku=${lowStock.variant.sku}`
        }
    }

    return (
        <>
        <StyledTableRow>
        <StyledTableCell>{lowStock.message}</StyledTableCell>
        <StyledTableCell align="center">
            {formatDate(lowStock.date)}
        </StyledTableCell>
        <StyledTableCell align="center">
            <StatusChip status={lowStock.status} />
        </StyledTableCell>
        <StyledTableCell align="center">
            <IconButton onClick={markAsRead}>
                <VisibilityIcon />
            </IconButton>
        </StyledTableCell>
        </StyledTableRow>
        </>
    );
};

const LowStockNotifications = () => {
    const [filter, setFilter] = useState({ ...filterInitialState, status: "all" });
    const { data } = useFetch(`/api/low-stocks?page=${filter.page}&limit=50&status=${filter.status !== "all" ? filter.status : ""}`);

    const handleChangePage = (_, value) => {
        setFilter((prev) => ({ ...prev, page: value }));
    };

    const handleTabChange = (status) => {
        setFilter((prev) => ({ ...prev, status, page: 1 }));
    };

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Low Stock Alert</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-black">Low Stock Alert</h1>

            {/* 🔽 Tabs for Status */}
            <div className="flex gap-4 border-b border-gray-200">
                {["all", "unread", "read"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`pb-2 text-sm font-medium ${
                    filter.status === tab
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
                ))}
            </div>

            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable
                cols={<LowStockTableColumns />}
                rows={data?.lowStockNotifications.map((lowstock) => (
                    <LowStockTableRow key={lowstock.id} lowStock={lowstock} />
                ))}
                />
            </div>

            <div className="mt-4 flex justify-end">
                <Pagination
                color="secondary"
                count={data?.totalPages ?? 1}
                page={filter.page}
                onChange={handleChangePage}
                />
            </div>
        </div>
    );
};

export default LowStockNotifications;
