import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Order = Database['public']['Tables']['orders']['Row'];

export const orderService = {
    // Customer: Buat order baru
    async createOrder(data: { package_id: string; amount: number; notes?: string }) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Generate Order Number (Simple timestamp based for now)
        const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: order, error } = await (supabase as any)
            .from('orders')
            .insert({
                user_id: user.id,
                package_id: data.package_id,
                amount: data.amount,
                notes: data.notes,
                order_number: orderNumber,
                status: 'pending',
                payment_status: 'unpaid'
            })
            .select()
            .single();

        if (error) throw error;
        return order;
    },

    // Customer: Get order sendiri
    async getMyOrders() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        packages (
          name,
          slug,
          price
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get single order detail
    async getOrderById(id: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        packages (name, price, features),
        profiles (full_name, email, company)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Get semua order
    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        packages (name),
        profiles (full_name, email)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Admin: Update status
    async updateStatus(id: string, status: Order['status']) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('orders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Update payment status
    async updatePaymentStatus(id: string, paymentStatus: Order['payment_status']) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('orders')
            .update({ payment_status: paymentStatus })
            .eq('id', id);

        if (error) throw error;
    },

    // Customer: Submit payment proof
    async submitPaymentProof(id: string, proofUrl: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('orders')
            .update({
                payment_proof_url: proofUrl,
                payment_status: 'pending',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
    }
};
