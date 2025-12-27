import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmrpXofSz6sUckhbXiCP5D2ghpXsgDiyM",
  authDomain: "mbaf-7625f.firebaseapp.com",
  projectId: "mbaf-7625f",
  storageBucket: "mbaf-7625f.firebasestorage.app",
  messagingSenderId: "989224064510",
  appId: "1:989224064510:web:3b6af04a01983b8a701caf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
