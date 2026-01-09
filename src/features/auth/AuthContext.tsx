import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types/database.types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: string }>;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Self-healing: If profile missing, create it
            if (!data && (error?.code === 'PGRST116' || !error)) {
                console.log("Profile not found. Attempting to create fallback profile...");
                const { data: userData } = await supabase.auth.getUser();

                if (userData?.user) {
                    const fallbackProfile = {
                        id: userId,
                        email: userData.user.email!,
                        full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0],
                        role: 'customer'
                    };

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { error: insertError } = await supabase.from('profiles').insert(fallbackProfile as any);

                    if (!insertError) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data = fallbackProfile as any;
                    } else {
                        console.error("Failed to create fallback profile:", insertError);
                    }
                }
            }

            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return { error };

            // Fetch role directly to allow immediate redirect logic
            if (data.user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                return { error: null, role: profileData?.role };
            }

            return { error: null };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            // Profile creation is handled by Database Trigger (handle_new_user)
            // No need to insert manually here to avoid race conditions.

            return { error };
        } catch (error) {
            return { error: error as Error };
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    };

    const isAdmin = profile?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                session,
                loading,
                signIn,
                signUp,
                signOut,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
