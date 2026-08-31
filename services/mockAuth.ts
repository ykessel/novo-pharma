import type { AuthUser } from '../types/auth';

type Listener = (user: AuthUser | null) => void;

let currentUser: AuthUser | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener(currentUser));
}

export const mockAuth = {
  getUser(): AuthUser | null {
    return currentUser;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  async signIn(email: string): Promise<void> {
    currentUser = { id: 'mock-user', email, user_metadata: {} };
    notify();
  },
  async signUp(email: string, fullName: string, phone: string): Promise<void> {
    currentUser = { id: 'mock-user', email, user_metadata: { full_name: fullName, phone } };
    notify();
  },
  async signOut(): Promise<void> {
    currentUser = null;
    notify();
  },
};
