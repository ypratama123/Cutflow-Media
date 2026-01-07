import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectFile = Database['public']['Tables']['project_files']['Row'];

export const projectService = {
    // Customer: Get My Projects
    async getMyProjects() {
        // Get user id first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                orders!inner (
                    order_number,
                    packages (name)
                )
            `)
            .eq('orders.user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get Project Detail (including files)
    async getProjectById(id: string) {
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *,
                orders (
                    order_number,
                    notes,
                    packages (name, features)
                ),
                project_files (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Upload File (Insert Db Record)
    async addProjectFile(fileData: {
        project_id: string;
        file_name: string;
        file_url: string;
        file_type: 'raw' | 'result' | 'doc';
        file_size: number
    }) {
        const { data: { user } } = await supabase.auth.getUser();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('project_files')
            .insert({
                ...fileData,
                uploader_id: user?.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Admin: Update Status/Progress
    async updateProject(id: string, updates: { status?: string; progress?: number; deadline?: string }) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('projects')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    }
};
