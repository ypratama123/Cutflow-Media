import { supabase } from '../lib/supabase';

export const storageService = {
    // Upload payment proof
    async uploadPaymentProof(file: File, orderId: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${orderId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // Upload avatar
    async uploadAvatar(file: File, userId: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_avatar.${fileExt}`;
        const filePath = `${fileName}`;

        // Overwrite existing avatar
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // Upload project file
    async uploadProjectFile(file: File, projectId: string, type: 'raw' | 'result' | 'doc') {
        // Sanitize filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${projectId}/${type}/${Date.now()}_${cleanName}`;

        const { error: uploadError } = await supabase.storage
            .from('project-files')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('project-files')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
