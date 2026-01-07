import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
type NewContactSubmission = Database['public']['Tables']['contact_submissions']['Insert'];

export const contactService = {
    // Public: Submit form kontak
    async submitContact(data: NewContactSubmission) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('contact_submissions')
            .insert(data);

        if (error) throw error;
    },

    // Admin: Get all leads
    async getAllLeads() {
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ContactSubmission[];
    },

    // Admin: Update status lead
    async updateLeadStatus(id: string, status: ContactSubmission['status']) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('contact_submissions')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Add notes
    async updateNotes(id: string, notes: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('contact_submissions')
            .update({ notes })
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Delete lead
    async deleteLead(id: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('contact_submissions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
