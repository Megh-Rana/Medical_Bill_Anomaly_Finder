import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type UserData = {
  credits: number;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  signupEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  consumeCredit: (n?: number) => Promise<void>;
  addCredits: (n: number) => Promise<void>; 
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const addCredits = async (n: number) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { credits: increment(n) });

    setUserData(prev =>
        prev ? { credits: prev.credits + n } : prev
        );
    };

  // 🔹 Load auth + user doc
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, { credits: 5 });
        setUserData({ credits: 5 });
      } else {
        setUserData(snap.data() as UserData);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔹 Auth actions
  const loginEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const consumeCredit = async (n = 1) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, { credits: increment(-n) });
    setUserData(prev =>
      prev ? { credits: prev.credits - n } : prev
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        loginEmail,
        signupEmail,
        loginGoogle,
        logout,
        consumeCredit,
        addCredits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }
  return ctx;
}
