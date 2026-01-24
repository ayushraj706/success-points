import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBT12SP0gvwssxp8vD3KEx3HajqDle46kk", // Apni API Key yahan check karlena
    authDomain: "success-points.firebaseapp.com",
    projectId: "success-points",
    storageBucket: "success-points.firebasestorage.app",
    messagingSenderId: "51177935348",
    appId: "1:51177935348:web:33fc4a6810790a3cbd29a1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Global access ke liye window me daal rahe hain
window.auth = auth;
window.db = db;
window.provider = provider;

console.log("Firebase Initialized");
