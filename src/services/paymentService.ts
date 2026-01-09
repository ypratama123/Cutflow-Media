import { supabase } from '../lib/supabase';

// Use relative path for Vercel deployment (serverless functions)
// OR fallback to localhost for local dev if not proxied
const API_URL = import.meta.env.VITE_API_URL || '/api/payment';

export interface PaymentRequest {
    orderId: string;
    amount: number;
    customerDetails: {
        firstName: string;
        email: string;
        phone?: string;
    };
    itemDetails?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
    }>;
}

export const paymentService = {
    /**
     * Create a snap token for payment
     */
    async createTransaction(params: PaymentRequest) {
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment creation failed');
            }

            // Return the full object including order_id
            return await response.json();
        } catch (error) {
            console.error('Payment Service Error:', error);
            throw error;
        }
    },

    /**
     * Update order status manually after successful (frontend) payment
     */
    async handleSuccess(orderId: string) {
        console.log('handleSuccess called for:', orderId);

        // Use RPC to bypass RLS issues securely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .rpc('update_payment_status', {
                p_order_id: orderId,
                p_payment_status: 'paid',
                p_status: 'processing'
            });

        if (error) {
            console.error("CRITICAL: Failed to update payment status via RPC!", error);
            console.error("Error details:", error);
            alert("Pembayaran berhasil dicatat, namun gagal memperbarui status otomatis. Silakan hubungi admin atau refresh halaman.");
            throw error;
        } else {
            console.log("SUCCESS: Payment status updated via RPC for Order:", orderId);
        }
    },

    /**
     * Update midtrans_id in orders table for tracking
     */
    async updateMidtransId(orderId: string, midtransId: string) {
        console.log(`Updating midtrans_id for order ${orderId} to ${midtransId} via RPC...`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .rpc('update_midtrans_id', {
                p_order_id: orderId,
                p_midtrans_id: midtransId
            });

        if (error) {
            console.error("CRITICAL: Failed to update midtrans_id via RPC", error);
            throw error; // IMPORTANT: Throw error to stop flow
        } else {
            console.log("SUCCESS: midtrans_id updated via RPC");
        }
    },

    /**
     * Check valid status from Backend and sync to Supabase
     */
    async syncOrderStatus(orderId: string) {
        try {
            // 0. CHECK DB FIRST: Do we have a specific midtrans_id?
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: order } = await (supabase as any)
                .from('orders')
                .select('midtrans_id')
                .eq('id', orderId)
                .single();

            const targetId = order?.midtrans_id || orderId;
            console.log(`Syncing Order ${orderId} using Target Midtrans ID: ${targetId}`);

            // 1. Get status from your Backend (which calls Midtrans)
            const response = await fetch(`${API_URL}/status/${targetId}`);
            if (!response.ok) return; // Silent fail

            const result = await response.json();
            console.log("Backend Status Result:", result); // [DEBUG] Check what backend returns

            // 2. If paid, update Supabase via RPC
            if (result.payment_status === 'paid' || result.payment_status === 'failed') {
                console.log(`Updating Order ${orderId} status to ${result.payment_status} via RPC...`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error } = await (supabase as any)
                    .rpc('update_payment_status', {
                        p_order_id: orderId,
                        p_payment_status: result.payment_status,
                        p_status: result.order_status
                    });

                if (error) {
                    console.error("Sync RPC Error:", error);
                } else {
                    console.log("Sync RPC Success");
                }
            }

            return result;
        } catch (error) {
            console.error('Sync Error:', error);
        }
    }
};
