import crypto from 'crypto'
import { createOrder } from '../services/orderService.js';
import Payment from '../models/Payment.js';
import { sendAdminNotification } from '../services/notificationService.js';
import { successCheckout } from '../sockets/socket.js';

export const paymongoWebhook = async (req, res) => {
    try{

        const payload = req.body;
        const signature = req.headers['paymongo-signature'];

        // Verify the webhook signature
        const isValid = verifyWebhookSignature(payload, signature);

        if (isValid && payload.data.attributes.type === 'checkout_session.payment.paid') {
            const { order } = payload.data.attributes.data.attributes.metadata
            const parsedOrder = JSON.parse(order)
            const payment_method = payload.data.attributes.data.attributes.payment_method_used.toUpperCase()
            const payment_id = payload.data.attributes.data.attributes.payments[0].id;
            
            const newOrder = await createOrder(req, {...parsedOrder, payment_method })
            const newPayment = await Payment.create({ payment_id, order_id: newOrder.order_id })
            
            if(newOrder && newPayment){
                await sendAdminNotification(newOrder.customer_id, newOrder.order_id, `placed an order`)
                successCheckout(newOrder.customer_id);
            }
        
        }
        
        res.sendStatus(200)

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

function verifyWebhookSignature(payload, signature) {
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY || '';
    if (!signature) {
        console.error('Missing Paymongo-Signature header');
        return false;
    }

    const components = signature.split(',');
    const timestamp = components[0].split('=')[1];
    const testSignature = components[1].split('=')[1];

    const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
    const receivedSignatureBuffer = Buffer.from(testSignature, 'hex');

    return crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);
}

const url = process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:5173';

export const createPaymentCheckout = async (req, res) => {
    try{
        const { address, payment_details, items } = req.body;
        const { subtotal, shipping_fee, total, } = payment_details;
        const { firstname, lastname, ...rest } = address;
        
        const fullAddress = { fullname: `${firstname} ${lastname}`, ...rest }
        
        const order = {
            address: fullAddress,
            subtotal,
            total,
            shipping_fee,
            items,
            payment_method: 'COD',
            customer_id: req.user_id
        }

        const line_items = items.map((item) => ({ 
            images: [item.product.thumbnail.thumbnailUrl],
            currency: "PHP", 
            amount: item.variant.price * 100, 
            name: item.product.product_name,  
            quantity: item.quantity 
        }))

        if(order.shipping_fee){
            line_items.push({
                currency: "PHP",
                amount: order.shipping_fee * 100,
                name: "Shipping fee",
                quantity: 1,
            })
        }

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Basic ${process.env.PAYMONGO_SECRET}`
            },
            body: JSON.stringify({
                data: {
                attributes: {
                    send_email_receipt: true,
                    show_description: false,
                    show_line_items: true,
                    line_items,
                    success_url: url,
                    cancel_url: url,
                    payment_method_types: ['gcash', 'paymaya'],
                    metadata: { 
                        order: JSON.stringify(order),
                    }
                }
                }
            })
        };

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        if(!response.ok) {
            const result = await response.json();
            throw new Error(result.errors[0].detail)
        }
        const result = await response.json();
        res.status(200).json({success: true, id: result.data.id, checkout_url: result.data.attributes.checkout_url})


    }catch(err){
        console.log(err)
        res.status(500).json({ error: err.message });
    }
}