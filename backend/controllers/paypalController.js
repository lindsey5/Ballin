import { createOrder } from "../services/orderService.js";
import { client } from "../config/paypal.js";
import checkoutServerSdk from "@paypal/checkout-server-sdk";

export const paypal_create_order = async (req, res) => {
    const items = req.body.items || [];
    const total = req.body.total;

    const request = new checkoutServerSdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            items: items,
            amount: {
                currency_code: 'PHP',
                value: total,
                breakdown: {
                    item_total: {
                        currency_code: 'PHP',
                        value: total
                    }
                }
            }
        }],
    });

    try {
        const order = await client().execute(request);
        res.status(200).json({ id: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

export const paypal_capture_order = async (req, res) => {
    const { orderID, payment_details, items } = req.body;
    const { subtotal, shipping_fee, total, } = payment_details;

    const request = new checkoutServerSdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client().execute(request);

        const { name, ...shipping_address } = capture.result.purchase_units[0].shipping
        const address = { ...shipping_address.address, fullname: name.full_name }

        const order = await createOrder(req, {
            address,
            subtotal,
            total,
            shipping_fee,
            items,
            payment_method: 'PAYPAL'
        })
        res.status(200).json({success: true, result: capture.result, order });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}