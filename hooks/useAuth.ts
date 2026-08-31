import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';
import { mockAuth } from '../services/mockAuth';
import type { AuthUser } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(isSupabaseConfigured ? null : mockAuth.getUser());
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return mockAuth.subscribe(setUser);
    }

    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? '', user_metadata: sessionUser.user_metadata } : null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const sessionUser = newSession?.user;
      setUser(sessionUser ? { id: sessionUser.id, email: sessionUser.email ?? '', user_metadata: sessionUser.user_metadata } : null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!isSupabaseConfigured) {
      await mockAuth.signOut();
      return;
    }
    await supabase.auth.signOut();
  }

  return { user, loading, signOut };
}
