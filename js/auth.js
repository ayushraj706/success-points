import { signInWithPopup, signInAnonymously, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, updateDoc, serverTimestamp, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let generatedOTP = null;
let userEmail = null;
let timerInt = null;

// AUTH LISTENER (Loading Screen Logic Hata Diya)
onAuthStateChanged(window.auth, async(u) => {
    if(u) {
        window.me = u;
        // Seedha App View dikhao (No dark loading screen)
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');

        // SKELETON MAGIC: Thodi der baad skeleton hatao aur asli content dikhao
        setTimeout(() => {
            const skel = document.getElementById('home-skeleton');
            if(skel) skel.classList.add('hidden');
            const cont = document.getElementById('home-content');
            if(cont) cont.classList.remove('hidden');
        }, 1500);

        // Update User Status
        const ref = doc(window.db, "users", u.uid);
        await setDoc(ref, { 
            email: u.email || 'guest@user.com', 
            name: u.displayName || 'Student', 
            lastActive: serverTimestamp() 
        }, { merge: true });

        window.loadPeople();
        window.loadMyChats();
        
    } else {
        // Agar login nahi hai, to login screen dikhao
        document.getElementById('auth-view').classList.remove('hidden');
    }
});

// --- OTP LOGIC ---

window.sendOTP = async () => {
    const email = document.getElementById('u-email').value;
    if(!email.includes('@')) return alert("Sahi Email daalo bhai!");
    
    // 1. Generate 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000);
    generatedOTP = otp;
    userEmail = email;

    // 2. Button Loading State
    const btn = document.getElementById('btn-otp');
    btn.innerText = "Sending...";
    btn.disabled = true;

    try {
        // 3. Call your Backend (api/send.js)
        const res = await fetch('/api/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                to: email, // Backend me isko handle karna padega
                subject: 'Your Login OTP',
                html: `<h1>Your OTP is: ${otp}</h1><p>Valid for 10 minutes.</p>`
            })
        });

        // 4. Show OTP Screen
        document.getElementById('step-email').classList.add('hidden');
        document.getElementById('step-otp').classList.remove('hidden');
        startTimer();
        alert(`OTP Sent to ${email}`);

    } catch (e) {
        alert("Error sending OTP. Try again.");
        btn.innerText = "Send OTP";
        btn.disabled = false;
    }
};

window.verifyOTP = async () => {
    const inputOtp = document.getElementById('u-otp').value;
    if(parseInt(inputOtp) === generatedOTP) {
        // 5. Login User (Anonymous + Profile Update)
        try {
            const cred = await signInAnonymously(window.auth);
            // Naam aur Email set kar rahe hain
            await updateProfile(cred.user, { displayName: userEmail.split('@')[0] });
            // Email ko user object me manually save karenge (upar Auth Listener me)
            // Reload to refresh state
            location.reload();
        } catch(e) {
            alert("Login Failed: " + e.message);
        }
    } else {
        alert("Galat OTP hai bhai! Firse check karo.");
    }
};

function startTimer() {
    let timeLeft = 60;
    const el = document.getElementById('otp-timer');
    timerInt = setInterval(() => {
        timeLeft--;
        el.innerText = `Resend in ${timeLeft}s`;
        if(timeLeft <= 0) {
            clearInterval(timerInt);
            el.innerText = "Resend Now";
            el.onclick = () => location.reload(); // Simple Reset
            el.classList.add('cursor-pointer', 'underline');
        }
    }, 1000);
}

// Google Login & Logout
window.doGoogleLogin = () => signInWithPopup(window.auth, window.provider);
window.doLogout = () => signOut(window.auth).then(() => location.reload());
