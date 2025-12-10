import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDSLWILuGbmHrTqT74RWF1jP4sF8vcg4SI",
    authDomain: "bantuayahibu.firebaseapp.com",
    projectId: "bantuayahibu",
    storageBucket: "bantuayahibu.firebasestorage.app",
    messagingSenderId: "39548327314",
    appId: "1:39548327314:web:f4870c3a4f43b49ace5d4b",
    measurementId: "G-XP3JDBLF1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth };
