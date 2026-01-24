import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let me = null;

// Login Function
window.doGoogleLogin = async () => {
    try {
        await signInWithPopup(window.auth, window.provider);
    } catch (error) {
        alert(error.message);
    }
};

// Logout Function
window.doLogout = () => {
    signOut(window.auth).then(() => location.reload());
};

// State Change Listener
onAuthStateChanged(window.auth, async(u) => {
    if(u) {
        window.me = u;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('loading-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');

        // User Status Update
        const ref = doc(window.db, "users", u.uid);
        await updateDoc(ref, { lastActive: serverTimestamp(), status: 'online' })
            .catch(async() => { 
                await setDoc(ref, { email: u.email, name: u.displayName || 'Student', time: 0, lastActive: serverTimestamp() }, { merge: true }); 
            });

        // Time Tracking
        setInterval(() => { if(document.visibilityState === 'visible') updateDoc(ref, { time: increment(1) }); }, 60000);

        // Load Data
        window.loadPeople();
        window.loadMyChats();
        
    } else {
        document.getElementById('loading-view').classList.add('hidden');
        document.getElementById('auth-view').classList.remove('hidden');
    }
});
