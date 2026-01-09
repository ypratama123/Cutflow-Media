const express = require('express');
const cors = require('cors');
const midtransClient = require('midtrans-client');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Snap API Wrapper
const snap = new midtransClient.Snap({
    isProduction: process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-UhcqU-Z9q9rxtQld'
});

// Create Transaction Token
app.post('/api/payment/create', async (req, res) => {
    try {
        const { orderId, amount, customerDetails, itemDetails } = req.body;

        // [FIX] Always append timestamp to ensure Unique ID on every attempt
        // This prevents "Order ID already exists" error on retries
        const uniqueOrderId = `${orderId}-${Math.floor(Date.now() / 1000)}`;

        console.log(`Creating payment for Order: ${uniqueOrderId} (Base: ${orderId}), Amount: ${amount}`);

        // Get Base URL from env or default to localhost
        // On Vercel, this should be the frontend URL
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        const parameter = {
            transaction_details: {
                order_id: uniqueOrderId, // Use the new unique ID
                gross_amount: amount
            },
            credit_card: {
                secure: true
            },
            // Paksa redirect balik ke Dashboard Order setelah bayar
            callbacks: {
                finish: `${FRONTEND_URL}/dashboard/orders`
            },
            customer_details: {
                first_name: customerDetails.firstName,
                email: customerDetails.email,
                phone: customerDetails.phone || ''
            },
            item_details: itemDetails
        };

        const transaction = await snap.createTransaction(parameter);
        console.log('Transaction Token Created:', transaction.token);

        res.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            // [IMPORTANT] Send back the ACTUAL ID used for payment
            order_id: uniqueOrderId
        });

    } catch (error) {
        console.error('Midtrans API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start Server only if running directly (Local Development)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`🚀 Payment Server running on http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app;

// [NEW] Endpoint to Check & Sync Status
app.get('/api/payment/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(`Checking status for Order: ${orderId}`);

        // 1. Ask Midtrans for latest status
        const statusResponse = await snap.transaction.status(orderId);
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Midtrans Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

        // 2. Determine Payment Status
        let paymentStatus = 'pending';
        let orderStatus = 'pending';

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                paymentStatus = 'pending'; // Challenge
            } else if (fraudStatus == 'accept') {
                paymentStatus = 'paid'; // Success
                orderStatus = 'processing';
            }
        } else if (transactionStatus == 'settlement') {
            paymentStatus = 'paid'; // Success
            orderStatus = 'processing';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            paymentStatus = 'failed';
            orderStatus = 'cancelled';
        } else if (transactionStatus == 'pending') {
            paymentStatus = 'pending';
        }

        // Return the determined status (Client will update DB via Service for now, 
        // ideally Server updates DB directly but we don't have supabase-admin here yet)
        res.json({
            midtrans_status: transactionStatus,
            payment_status: paymentStatus,
            order_status: orderStatus,
            raw: statusResponse
        });

    } catch (error) {
        // [NEW] Handle 404 (Transaction not found in Midtrans)
        // Ini wajar jika user membuat order di DB tapi belum sempat klik "Bayar" di Midtrans
        if (error.ApiResponse && error.ApiResponse.status_code == '404') {
            console.log(`Transaction ${req.params.orderId} not found in Midtrans. Assuming Unpaid.`);
            res.json({
                midtrans_status: 'not_found',
                payment_status: 'unpaid',
                order_status: 'pending'
            });
            return;
        }

        console.error('Check Status Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});
