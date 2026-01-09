import { supabase } from '../lib/supabase';

export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'order' | 'ticket' | 'system' | 'info';
    link: string;
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    // Get notifications for current user
    async getMyNotifications(limit = 10) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as Notification[];
    },

    // Get unread count
    async getUnreadCount() {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    },

    // Mark as read
    async markAsRead(id: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) throw error;
    },

    // Mark all as read
    async markAllAsRead() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;
    },

    // Create notification (Admin usage mainly)
    async createNotification(userId: string, title: string, message: string, type = 'info', link = '#') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('notifications')
            .insert({
                user_id: userId,
                title,
                message,
                type,
                link
            });

        if (error) throw error;
    }
};
