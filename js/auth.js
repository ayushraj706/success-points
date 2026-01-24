import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(window.auth, async(u) => {
    if(u) {
        window.me = u;
        document.getElementById('loading-view').classList.add('hidden');
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');

        // SKELETON REMOVE (Thoda delay taaki style dikhe)
        setTimeout(() => {
            document.getElementById('home-skeleton').classList.add('hidden');
            document.getElementById('home-content').classList.remove('hidden');
        }, 1500);

        // User Update
        const ref = doc(window.db, "users", u.uid);
        await updateDoc(ref, { lastActive: serverTimestamp(), status: 'online' })
            .catch(async() => { 
                await setDoc(ref, { email: u.email, name: u.displayName || 'Student', time: 0, lastActive: serverTimestamp() }, { merge: true }); 
            });

        // Start other engines
        window.loadPeople();
        window.loadMyChats();

        // Countdown Start
        setInterval(() => {
            const days = Math.floor((new Date("Feb 17, 2026").getTime() - new Date().getTime())/(1000*60*60*24));
            const el = document.getElementById('days-left');
            if(el) el.innerText = `${days} Days Left`;
        }, 1000);
        
    } else {
        document.getElementById('loading-view').classList.add('hidden');
        document.getElementById('auth-view').classList.remove('hidden');
    }
});

window.doGoogleLogin = async () => {
    try { await signInWithPopup(window.auth, window.provider); } 
    catch (e) { alert(e.message); }
};

window.doLogout = () => signOut(window.auth).then(() => location.reload());
