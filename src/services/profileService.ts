import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const profileService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, updates: ProfileUpdate) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
