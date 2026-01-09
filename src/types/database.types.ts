export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    phone: string | null;
                    company: string | null;
                    avatar_url: string | null;
                    role: 'customer' | 'admin' | 'editor';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    phone?: string | null;
                    company?: string | null;
                    avatar_url?: string | null;
                    role?: 'customer' | 'admin' | 'editor';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    phone?: string | null;
                    company?: string | null;
                    avatar_url?: string | null;
                    role?: 'customer' | 'admin' | 'editor';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            packages: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    price: number;
                    period: string;
                    clips_per_month: number | null;
                    turnaround_days: number | null;
                    revision_limit: number | null;
                    features: Json;
                    is_active: boolean;
                    is_popular: boolean;
                    sort_order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    slug: string;
                    price: number;
                    period?: string;
                    clips_per_month?: number | null;
                    turnaround_days?: number | null;
                    revision_limit?: number | null;
                    features?: Json;
                    is_active?: boolean;
                    is_popular?: boolean;
                    sort_order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    slug?: string;
                    price?: number;
                    period?: string;
                    clips_per_month?: number | null;
                    turnaround_days?: number | null;
                    revision_limit?: number | null;
                    features?: Json;
                    is_active?: boolean;
                    is_popular?: boolean;
                    sort_order?: number;
                    created_at?: string;
                };
            };
            orders: {
                Row: {
                    id: string;
                    order_number: string;
                    user_id: string;
                    package_id: string;
                    status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
                    payment_status: 'unpaid' | 'pending' | 'paid' | 'failed';
                    amount: number;
                    payment_proof_url: string | null;
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_number: string;
                    user_id: string;
                    package_id: string;
                    status?: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
                    payment_status?: 'unpaid' | 'pending' | 'paid' | 'failed';
                    amount: number;
                    payment_proof_url?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    order_number?: string;
                    user_id?: string;
                    package_id?: string;
                    status?: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
                    payment_status?: 'unpaid' | 'pending' | 'paid' | 'failed';
                    amount?: number;
                    payment_proof_url?: string | null;
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    order_id: string;
                    title: string;
                    status: 'active' | 'review' | 'revision' | 'completed';
                    progress: number;
                    deadline: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    title: string;
                    status?: 'active' | 'review' | 'revision' | 'completed';
                    progress?: number;
                    deadline?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string;
                    title?: string;
                    status?: 'active' | 'review' | 'revision' | 'completed';
                    progress?: number;
                    deadline?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            project_files: {
                Row: {
                    id: string;
                    project_id: string;
                    uploader_id: string | null;
                    file_name: string;
                    file_url: string;
                    file_type: 'raw' | 'result' | 'doc';
                    file_size: number | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    uploader_id?: string | null;
                    file_name: string;
                    file_url: string;
                    file_type?: 'raw' | 'result' | 'doc';
                    file_size?: number | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    uploader_id?: string | null;
                    file_name?: string;
                    file_url?: string;
                    file_type?: 'raw' | 'result' | 'doc';
                    file_size?: number | null;
                    created_at?: string;
                };
            };
            contact_submissions: {
                Row: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    company: string | null;
                    project_type: string | null;
                    budget_range: string | null;
                    message: string;
                    status: 'new' | 'contacted' | 'converted' | 'closed';
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    company?: string | null;
                    project_type?: string | null;
                    budget_range?: string | null;
                    message: string;
                    status?: 'new' | 'contacted' | 'converted' | 'closed';
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    company?: string | null;
                    project_type?: string | null;
                    budget_range?: string | null;
                    message?: string;
                    status?: 'new' | 'contacted' | 'converted' | 'closed';
                    notes?: string | null;
                    created_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

// Utility types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Package = Database['public']['Tables']['packages']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
