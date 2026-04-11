import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "medicare-a49ba.firebaseapp.com",
  projectId: "medicare-a49ba",
  storageBucket: "medicare-a49ba.firebasestorage.app",
  messagingSenderId: "91613409886",
  appId: "1:91613409886:web:53c87cde834d3521107acf",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();