import { create } from "zustand";

interface User {
  uid: string;
  name: string;
}

interface UserStore {
  user: User | null;
  setUser: (uid: string, name: string) => void;
  logout: () => void;
  clearUser: () => void;
}

const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (uid: string, name: string) => {
    set(() => ({ user: { uid, name } }));
  },
  logout: () => {
    set(() => ({ user: null }));
  },
  clearUser: () => set({ user: { uid: "", name: "" } }),
}));

export default userStore;
