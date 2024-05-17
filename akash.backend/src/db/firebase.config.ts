import { initializeApp, getApps } from "firebase/app";
import { getAuth, TwitterAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDy4z6wMbFqdbG836aIYhg6DbzacObzAC8",
    authDomain: "akashnetwork-59dd7.firebaseapp.com",
    projectId: "akashnetwork-59dd7",
    storageBucket: "akashnetwork-59dd7.appspot.com",
    messagingSenderId: "759286412837",
    appId: "1:759286412837:web:283c31baed4251aeac31cc"
  };

  
// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const Authprovider = new TwitterAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);



export default app;