import { supabase } from '../lib/supabase';

export interface Ticket {
    id: string;
    user_id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
}

export interface TicketMessage {
    id: string;
    ticket_id: string;
    sender_id: string;
    message: string;
    is_admin: boolean;
    created_at: string;
    sender?: {
        full_name: string;
        avatar_url: string;
    }
}

export const ticketService = {
    // Create a new ticket
    async createTicket(subject: string, initialMessage: string, userId: string) {
        // 1. Create Ticket
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: ticket, error: ticketError } = await (supabase as any)
            .from('tickets')
            .insert({
                user_id: userId,
                subject,
                status: 'open',
                priority: 'normal'
            })
            .select()
            .single();

        if (ticketError) throw ticketError;

        // 2. Create Initial Message
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: messageError } = await (supabase as any)
            .from('ticket_messages')
            .insert({
                ticket_id: ticket.id,
                sender_id: userId,
                message: initialMessage,
                is_admin: false
            });

        if (messageError) throw messageError;

        return ticket;
    },

    // Get tickets for current customer
    async getMyTickets() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Ticket[];
    },

    // Get all tickets (Admin)
    async getAllTickets() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('tickets')
            .select(`
                *,
                profiles:user_id (full_name, email, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get messages for a ticket
    async getTicketMessages(ticketId: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('ticket_messages')
            .select(`
                *,
                sender:sender_id (full_name, avatar_url)
            `)
            .eq('ticket_id', ticketId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as TicketMessage[];
    },

    // Send a message
    async sendMessage(ticketId: string, senderId: string, message: string, isAdmin: boolean) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('ticket_messages')
            .insert({
                ticket_id: ticketId,
                sender_id: senderId,
                message,
                is_admin: isAdmin
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update ticket status
    async updateStatus(ticketId: string, status: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('tickets')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', ticketId);

        if (error) throw error;
    }
};
