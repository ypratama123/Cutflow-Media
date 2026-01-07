import { supabase } from '../lib/supabase';

export const packageService = {
    async getPackages() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('packages')
            .select('*')
            .order('price', { ascending: true }); // Starter -> Growth -> Pro

        if (error) throw error;
        return data;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createPackage(pkg: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('packages')
            .insert(pkg)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updatePackage(id: string, updates: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('packages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deletePackage(id: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('packages')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getPackageBySlug(slug: string) {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .ilike('name', slug) // Case insensitive match for name/slug logic
            .maybeSingle();

        if (error) throw error;
        return data;
    }
};
