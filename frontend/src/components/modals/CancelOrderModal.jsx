import { Modal } from "@mui/material"
import { useState } from "react";
import { confirmDialog, errorAlert } from "../../utils/swal";
import { updateData } from "../../services/api";

const reasons = [
    "Found a better price elsewhere",
    "Order placed by mistake",
    "Need to change shipping address",
    "Changed mind about purchase",
    "Payment issues",
    "Customer service response too slow",
    "Delivery fees too high",
    "Delay in processing order",
    "Received wrong item previously",
    "Other"
];

const CancelOrderModal = ({ open, close, id, setUpdating }) => {
    const [reason, setReason] = useState(reasons[0]);
    const [otherReason, setOtherReason] = useState("");

    const cancelOrder = async() => {
        if(await confirmDialog('Are you sure you want to cancel this order?')){
            const response = await updateData(`/api/orders/${id}/cancel`, { reason: reason === "Other" ? otherReason : reason})
            if(response.success){
                window.location.reload();
            } else{
                errorAlert(response.error, 'Please reload the page');
            }
            setUpdating(false)
        }
    }

    return (
        <Modal
            open={open}
            onClose={close}
            aria-labelledby="cancel-order-modal-title"
            aria-describedby="cancel-order-modal-description"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                zIndex: 1
            }}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 id="cancel-order-modal-title" className="text-xl font-bold mb-4">Cancel Order</h2>
                <p id="cancel-order-modal-description" className="mb-4">Please select a reason for cancelling your order:</p>
                <select 
                    className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    {reasons.map((reason, index) => (
                        <option key={index} value={reason}>{reason}</option>
                    ))}
                </select>
                {reason === "Other" && (
                    <textarea 
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        placeholder="Please specify your reason"
                        value={otherReason}
                        rows={5}
                        onChange={(e) => setOtherReason(e.target.value)}
                    />
                )}
                <div className="flex justify-end gap-4">
                    <button
                        className="cursor-pointer px-4 py-2 bg-gray-300 rounded-lg hover:opacity-50"
                        onClick={close}
                    >
                        Close
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-50"
                        onClick={cancelOrder}
                    >
                        Confirm Cancel
                    </button>
                </div>

            </div>

        </Modal>
    )
}

export default CancelOrderModal