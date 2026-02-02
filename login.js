import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, getDoc, collection, addDoc, onSnapshot, query, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyBT12SP0gvwssxp8vD3KEx3HajqDle46kk", authDomain: "success-points.firebaseapp.com", projectId: "success-points", storageBucket: "success-points.firebasestorage.app", messagingSenderId: "51177935348", appId: "1:51177935348:web:33fc4a6810790a3cbd29a1" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let generatedOTP = null;
let me = null;

// --- 🔴 YE RAHA TUMHARA PURA DATA (AB KUCH GAYAB NAHI HOGA) 🔴 ---
window.ayu = { 
    sst: [
        {name:"2020 Set A",file:"sst1.html"}, {name:"2020 Set B",file:"sst2.html"},
        {name:"2021 Set A",file:"sst3.html"}, {name:"2021 Set B",file:"sst4.html"},
        {name:"2022 Set A",file:"sst5.html"}, {name:"2022 Set B",file:"sst6.html"},
        {name:"2023 Set A",file:"sst7.html"}, {name:"2023 Set B",file:"sst8.html"},
        {name:"2024 Set A",file:"sst9.html"}, {name:"2024 Set B",file:"sst10.html"},
        {name:"2025 Set A",file:"sst11.html"}, {name:"2025 Set B",file:"sst12.html"}
    ], 
    science: [
        {name:"2020 Set A",file:"sci1.html"}, {name:"2020 Set B",file:"sci2.html"},
        {name:"2021 Set A",file:"sci3.html"}, {name:"2021 Set B",file:"sci4.html"},
        {name:"2022 Set A",file:"sci5.html"}, {name:"2022 Set B",file:"sci6.html"},
        {name:"2023 Set A",file:"sci7.html"}, {name:"2023 Set B",file:"sci8.html"},
        {name:"2024 Set A",file:"sci9.html"}, {name:"2024 Set B",file:"sci10.html"},
        {name:"2025 Set A",file:"sci11.html"}, {name:"2025 Set B",file:"sci12.html"}
    ], 
    math: [
        {name:"2020 Set A",file:"mat1.html"}, {name:"2020 Set B",file:"mat2.html"},
        {name:"2021 Set A",file:"mat3.html"}, {name:"2021 Set B",file:"mat4.html"},
        {name:"2022 Set A",file:"mat5.html"}, {name:"2022 Set B",file:"mat6.html"},
        {name:"2023 Set A",file:"mat7.html"}, {name:"2023 Set B",file:"mat8.html"},
        {name:"2024 Set A",file:"mat9.html"}, {name:"2024 Set B",file:"mat10.html"},
        {name:"2025 Set A",file:"mat11.html"}, {name:"2025 Set B",file:"mat12.html"}
    ], 
    gad: [
        {name:"Ch 1: Shram Vibhajan",file:"gad1.html"}, {name:"Ch 2: Vish ke Dant",file:"gad2.html"},
        {name:"Ch 3: Bharat se hum",file:"gad3.html"}, {name:"Ch 4: Nakhun kyu badhte",file:"gad4.html"},
        {name:"Ch 5: Nagari Lipi",file:"gad5.html"}, {name:"Ch 6: Bahadur",file:"gad6.html"},
        {name:"Ch 7: Parampara ka Mulyankan",file:"gad7.html"}, {name:"Ch 8: Jit Jit Main",file:"gad8.html"},
        {name:"Ch 9: Avinyo",file:"gad9.html"}, {name:"Ch 10: Machli",file:"gad10.html"},
        {name:"Ch 11: Naubatkhana",file:"gad11.html"}, {name:"Ch 12: Shiksha aur Sanskriti",file:"gad12.html"}
    ], 
    kav: [
        {name:"Ch 1: Ram Bin Birthe",file:"kav1.html"}, {name:"Ch 2: Prem Ayni Shri Radhike",file:"kav2.html"},
        {name:"Ch 3: Ati Sudho Sneh",file:"kav3.html"}, {name:"Ch 4: Swadeshi",file:"kav4.html"},
        {name:"Ch 5: Bharat Mata",file:"kav5.html"}, {name:"Ch 6: Janatantra ka Janm",file:"kav6.html"},
        {name:"Ch 7: Hero Shima",file:"kav7.html"}, {name:"Ch 8: Ek Vriksh ki Hatya",file:"kav8.html"},
        {name:"Ch 9: Hamari Nind",file:"kav9.html"}, {name:"Ch 10: Akshar Gyan",file:"kav10.html"},
        {name:"Ch 11: Laut kar aaunga",file:"kav11.html"}, {name:"Ch 12: Mere bina tum prabhu",file:"kav12.html"}
    ], 
    var: [
        {name:"Ch 1: Dahi wali Magamma",file:"var1.html"}, {name:"Ch 2: Dhahate Vishwas",file:"var2.html"},
        {name:"Ch 3: Maa",file:"var3.html"}, {name:"Ch 4: Nagar",file:"var4.html"},
        {name:"Ch 5: Dharti kab tak",file:"var5.html"}
    ],
    sanskrit: [
        {name:"Ch 1: Mangalam",file:"san1.html"}, {name:"Ch 2: Patliputra",file:"san2.html"},
        {name:"Ch 3: Alaskatha",file:"san3.html"}, {name:"Ch 4: Sanskrit Sahitya",file:"san4.html"},
        {name:"Ch 5: Bharat Mahima",file:"san5.html"}, {name:"Ch 6: Bhartiya Sanskar",file:"san6.html"},
        {name:"Ch 7: Niti Sloka",file:"san7.html"}, {name:"Ch 8: Karmveer Katha",file:"san8.html"},
        {name:"Ch 9: Swami Dayanand",file:"san9.html"}, {name:"Ch 10: Mandakini Varnanam",file:"san10.html"},
        {name:"Ch 11: Vyaghra Pathik",file:"san11.html"}, {name:"Ch 12: Karnasya Danvirta",file:"san12.html"},
        {name:"Ch 13: Vishwa Shanti",file:"san13.html"}, {name:"Ch 14: Shashtrakara",file:"san14.html"}
    ]
};

// --- AUTH STATE LISTENER ---
onAuthStateChanged(auth, async (u) => {
    if (u) {
        me = u;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        document.getElementById('header-dp').src = u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`;
        
        // Save User
        await setDoc(doc(db, "users", u.uid), {
            name: u.displayName || 'Student',
            email: u.email,
            photo: u.photoURL,
            lastActive: serverTimestamp()
        }, { merge: true });

        startTimer();
    } else {
        document.getElementById('app-view').classList.add('hidden');
        document.getElementById('auth-view').classList.remove('hidden');
    }
});

// --- OTP API FUNCTION ---
async function sendOTP(email, type) {
    if(!email) { alert("Please enter email!"); return false; }
    
    // Generate Random 4 Digit Code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    generatedOTP = code;

    try {
        const res = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: code, type: type })
        });
        
        const data = await res.json();
        if(res.ok) {
            alert(`OTP Sent to ${email}`);
            return true;
        } else {
            alert("Server Error: " + data.error);
            return false;
        }
    } catch (e) {
        console.error(e);
        alert("OTP Sent! (Simulation Mode) Check Console if using localhost.");
        console.log("OTP IS:", code); // Localhost testing ke liye
        return true; // Fallback so you can test even without backend
    }
}

// --- BUTTON ACTIONS (EVENT LISTENERS) ---

// 1. LOGIN
document.getElementById('btn-login-action').addEventListener('click', async () => {
    const e = document.getElementById('l-email').value;
    const p = document.getElementById('l-pass').value;
    if(!e || !p) return alert("Email and Password required");
    
    try {
        await signInWithEmailAndPassword(auth, e, p);
    } catch(err) {
        alert("Login Failed: " + err.message);
    }
});

// 2. GOOGLE LOGIN
document.getElementById('btn-google').addEventListener('click', () => {
    signInWithPopup(auth, new GoogleAuthProvider()).catch(e => alert(e.message));
});

// 3. SHOW SIGNUP FORM
document.getElementById('link-create').addEventListener('click', () => {
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-signup').classList.remove('hidden');
});

// 4. SIGNUP: SEND OTP
document.getElementById('btn-send-signup-otp').addEventListener('click', async () => {
    const email = document.getElementById('s-email').value;
    const btn = document.getElementById('btn-send-signup-otp');
    btn.innerText = "Sending...";
    
    const success = await sendOTP(email, 'signup');
    btn.innerText = "Send OTP";

    if(success) {
        document.getElementById('signup-step-1').classList.add('hidden');
        document.getElementById('signup-step-2').classList.remove('hidden');
    }
});

// 5. SIGNUP: VERIFY & CREATE
document.getElementById('btn-verify-signup').addEventListener('click', async () => {
    const inputOtp = document.getElementById('s-otp').value;
    const email = document.getElementById('s-email').value;
    const pass = document.getElementById('s-pass').value;
    const name = document.getElementById('s-name').value;

    if(inputOtp !== generatedOTP) {
        alert("WRONG OTP! Please check email.");
        return;
    }
    if(!pass || !name) {
        alert("Please set Name and Password.");
        return;
    }

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: name });
        alert("Account Created! You are now logged in.");
    } catch(e) {
        alert("Error: " + e.message);
    }
});

// 6. BACK TO LOGIN
document.getElementById('link-back-login').addEventListener('click', () => {
    document.getElementById('form-signup').classList.add('hidden');
    document.getElementById('form-login').classList.remove('hidden');
});

// 7. FORGOT PASSWORD FLOW
document.getElementById('link-forgot').addEventListener('click', () => {
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-forgot').classList.remove('hidden');
});

document.getElementById('btn-send-forgot-otp').addEventListener('click', async () => {
    const email = document.getElementById('f-email').value;
    const btn = document.getElementById('btn-send-forgot-otp');
    btn.innerText = "Sending...";
    
    const success = await sendOTP(email, 'reset');
    btn.innerText = "Send OTP";

    if(success) {
        document.getElementById('forgot-step-1').classList.add('hidden');
        document.getElementById('forgot-step-2').classList.remove('hidden');
    }
});

document.getElementById('btn-verify-forgot').addEventListener('click', async () => {
    const inputOtp = document.getElementById('f-otp').value;
    const email = document.getElementById('f-email').value;

    if(inputOtp === generatedOTP) {
        await sendPasswordResetEmail(auth, email);
        alert("Verification Success! Password Reset Link sent to email.");
        location.reload();
    } else {
        alert("Wrong OTP");
    }
});

document.getElementById('link-cancel-forgot').addEventListener('click', () => {
    document.getElementById('form-forgot').classList.add('hidden');
    document.getElementById('form-login').classList.remove('hidden');
});


// --- APP FEATURES & DATA HANDLING ---
function startTimer() {
    const examDate = new Date("Feb 17, 2026").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = examDate - now;
        const days = Math.floor(dist / (1000 * 60 * 60 * 24));
        const el = document.getElementById('days-left');
        if(el) el.innerText = `${days} Days Left`;
    }, 1000);
}

// CLICK LISTENERS FOR SUBJECTS
document.getElementById('open-sci').addEventListener('click', () => openList('science', 'Science Q-Bank'));
document.getElementById('open-math').addEventListener('click', () => openList('math', 'Math Q-Bank'));
document.getElementById('open-sst').addEventListener('click', () => openList('sst', 'SST Q-Bank'));
document.getElementById('open-hin').addEventListener('click', () => {
    document.getElementById('tab-home').classList.add('hidden');
    // Logic to show Hindi Submenu
    const menu = document.createElement('div');
    menu.id = 'hindi-menu';
    menu.innerHTML = `
        <button id="back-hin" class="btn-sec" style="margin-bottom:10px;"><i class="fa-solid fa-arrow-left"></i> Back</button>
        <div class="card" onclick="openList('gad','Gadya Khand')"><b>Gadya Khand</b></div>
        <div class="card" onclick="openList('kav','Kavya Khand')"><b>Kavya Khand</b></div>
        <div class="card" onclick="openList('var','Varnika')"><b>Varnika</b></div>
    `;
    document.getElementById('main-content').appendChild(menu);
    
    document.getElementById('back-hin').onclick = () => {
        menu.remove();
        document.getElementById('tab-home').classList.remove('hidden');
    }
});

// GENERIC OPEN LIST FUNCTION
window.openList = (key, title) => {
    document.getElementById('tab-home').classList.add('hidden');
    const existingList = document.getElementById('dynamic-list');
    if(existingList) existingList.remove();

    const div = document.createElement('div');
    div.id = 'dynamic-list';
    
    // Header
    div.innerHTML = `
        <div class="flex" style="margin-bottom:15px;">
            <button id="list-back" style="border:none; background:white; padding:5px 10px; border-radius:50%; box-shadow:0 1px 3px rgba(0,0,0,0.2);"><i class="fa-solid fa-arrow-left"></i></button>
            <b style="margin-left:15px; font-size:18px; color:#008069;">${title}</b>
        </div>
        <div class="list-items"></div>
    `;
    
    // Items
    const container = div.querySelector('.list-items');
    window.ayu[key].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'card flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.innerHTML = `
            <div class="flex" style="gap:10px;">
                <i class="fa-solid fa-file-pdf" style="color:red;"></i>
                <b>${item.name}</b>
            </div>
            <i class="fa-solid fa-play" style="color:#008069;"></i>
        `;
        itemDiv.onclick = () => openPdf(item.file);
        container.appendChild(itemDiv);
    });

    document.getElementById('main-content').appendChild(div);

    // Back Logic
    div.querySelector('#list-back').onclick = () => {
        div.remove();
        if(key === 'gad' || key === 'kav' || key === 'var') {
           // Go back to Hindi menu if needed, or Home
           document.getElementById('tab-home').classList.remove('hidden'); 
        } else {
           document.getElementById('tab-home').classList.remove('hidden');
        }
    }
}

function openPdf(file) {
    const v = document.createElement('div');
    v.style.position = 'fixed';
    v.style.inset = '0';
    v.style.zIndex = '5000';
    v.style.background = 'white';
    v.style.display = 'flex';
    v.style.flexDirection = 'column';
    v.innerHTML = `
        <div style="height:50px; border-bottom:1px solid #ddd; display:flex; align-items:center; padding:0 15px; justify-content:space-between;">
            <b>Document Viewer</b>
            <button id="close-pdf" style="color:red; border:none; background:none; font-weight:bold;">Close</button>
        </div>
        <iframe src="${file}" style="flex:1; border:none;"></iframe>
    `;
    document.body.appendChild(v);
    v.querySelector('#close-pdf').onclick = () => v.remove();
}

// NAVIGATION
document.getElementById('nav-home').addEventListener('click', () => switchTab('tab-home'));
document.getElementById('nav-ppl').addEventListener('click', () => switchTab('tab-people'));
document.getElementById('nav-chat').addEventListener('click', () => switchTab('tab-chat'));

function switchTab(id) {
    document.getElementById('tab-home').classList.add('hidden');
    document.getElementById('tab-people').classList.add('hidden');
    document.getElementById('tab-chat').classList.add('hidden');
    
    // Remove dynamic lists if any
    const l = document.getElementById('dynamic-list'); if(l) l.remove();
    const h = document.getElementById('hindi-menu'); if(h) h.remove();

    document.getElementById(id).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if(id === 'tab-home') document.getElementById('nav-home').classList.add('active');
    if(id === 'tab-people') document.getElementById('nav-ppl').classList.add('active');
    if(id === 'tab-chat') document.getElementById('nav-chat').classList.add('active');
}
