// login.js - High Performance & Full Features

// 1. DYNAMIC IMPORTS (90+ Speed ke liye)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. CONFIG
const firebaseConfig = { apiKey: "AIzaSyBT12SP0gvwssxp8vD3KEx3HajqDle46kk", authDomain: "success-points.firebaseapp.com", projectId: "success-points", storageBucket: "success-points.firebasestorage.app", messagingSenderId: "51177935348", appId: "1:51177935348:web:33fc4a6810790a3cbd29a1" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3. YOUR DATA (JAAN HAI YE) - MAT HATANA
window.ayu = { 
    sst:[{name:"2020 Set A",file:"sst1.html"},{name:"2020 Set B",file:"sst2.html"},{name:"2021 Set A",file:"sst3.html"},{name:"2021 Set B",file:"sst4.html"},{name:"2022 Set A",file:"sst5.html"},{name:"2022 Set B",file:"sst6.html"},{name:"2023 Set A",file:"sst7.html"},{name:"2023 Set B",file:"sst8.html"},{name:"2024 Set A",file:"sst9.html"},{name:"2024 Set B",file:"sst10.html"},{name:"2025 Set A",file:"sst11.html"},{name:"2025 Set B",file:"sst12.html"}], 
    science:[{name:"2020 Set A",file:"sci1.html"},{name:"2020 Set B",file:"sci2.html"},{name:"2021 Set A",file:"sci3.html"},{name:"2021 Set B",file:"sci4.html"},{name:"2022 Set A",file:"sci5.html"},{name:"2022 Set B",file:"sci6.html"},{name:"2023 Set A",file:"sci7.html"},{name:"2023 Set B",file:"sci8.html"},{name:"2024 Set A",file:"sci9.html"},{name:"2024 Set B",file:"sci10.html"},{name:"2025 Set A",file:"sci11.html"},{name:"2025 Set B",file:"sci12.html"}], 
    math:[{name:"2020 Set A",file:"mat1.html"},{name:"2020 Set B",file:"mat2.html"},{name:"2021 Set A",file:"mat3.html"},{name:"2021 Set B",file:"mat4.html"},{name:"2022 Set A",file:"mat5.html"},{name:"2022 Set B",file:"mat6.html"},{name:"2023 Set A",file:"mat7.html"},{name:"2023 Set B",file:"mat8.html"},{name:"2024 Set A",file:"mat9.html"},{name:"2024 Set B",file:"mat10.html"},{name:"2025 Set A",file:"mat11.html"},{name:"2025 Set B",file:"mat12.html"}], 
    gad:[{name:"Ch 1",file:"gad1.html"},{name:"Ch 2",file:"gad2.html"},{name:"Ch 3",file:"gad3.html"},{name:"Ch 4",file:"gad4.html"},{name:"Ch 5",file:"gad5.html"},{name:"Ch 6",file:"gad6.html"},{name:"Ch 7",file:"gad7.html"},{name:"Ch 8",file:"gad8.html"},{name:"Ch 9",file:"gad9.html"},{name:"Ch 10",file:"gad10.html"},{name:"Ch 11",file:"gad11.html"},{name:"Ch 12",file:"gad12.html"}], 
    kav:[{name:"Ch 1",file:"kav1.html"},{name:"Ch 2",file:"kav2.html"},{name:"Ch 3",file:"kav3.html"},{name:"Ch 4",file:"kav4.html"},{name:"Ch 5",file:"kav5.html"},{name:"Ch 6",file:"kav6.html"},{name:"Ch 7",file:"kav7.html"},{name:"Ch 8",file:"kav8.html"},{name:"Ch 9",file:"kav9.html"},{name:"Ch 10",file:"kav10.html"},{name:"Ch 11",file:"kav11.html"},{name:"Ch 12",file:"kav12.html"}], 
    var:[{name:"Ch 1",file:"var1.html"},{name:"Ch 2",file:"var2.html"},{name:"Ch 3",file:"var3.html"},{name:"Ch 4",file:"var4.html"},{name:"Ch 5",file:"var5.html"},{name:"Ch 6",file:"var6.html"},{name:"Ch 7",file:"var7.html"},{name:"Ch 8",file:"var8.html"},{name:"Ch 9",file:"var9.html"},{name:"Ch 10",file:"var10.html"},{name:"Ch 11",file:"var11.html"},{name:"Ch 12",file:"var12.html"}], 
    sanskrit:[{name:"Ch 1",file:"san1.html"},{name:"Ch 2",file:"san2.html"},{name:"Ch 3",file:"san3.html"},{name:"Ch 4",file:"san4.html"},{name:"Ch 5",file:"san5.html"},{name:"Ch 6",file:"san6.html"},{name:"Ch 7",file:"san7.html"},{name:"Ch 8",file:"san8.html"},{name:"Ch 9",file:"san9.html"},{name:"Ch 10",file:"san10.html"},{name:"Ch 11",file:"san11.html"},{name:"Ch 12",file:"san12.html"},{name:"Ch 13",file:"san13.html"},{name:"Ch 14",file:"san14.html"}] 
};

let me = null;
let curChat = null;
let allUsers = [];

// 4. AUTH & STARTUP LOGIC
onAuthStateChanged(auth, async (u) => {
    const authDiv = document.getElementById('auth-view');
    const appDiv = document.getElementById('app-view');

    if (u) {
        // LOGGED IN
        me = u;
        authDiv.classList.add('hidden');
        appDiv.classList.remove('hidden');
        
        // Update Avatar
        document.getElementById('head-av').src = `https://ui-avatars.com/api/?name=${u.displayName || 'User'}&background=random&color=fff`;

        // Save User Presence
        await setDoc(doc(db, "users", u.uid), { 
            name: u.displayName || 'Student', 
            email: u.email, 
            lastActive: serverTimestamp() 
        }, { merge: true });

        // Load Content
        startTimer();
        loadPeople();
        loadMyChats();

    } else {
        // LOGGED OUT
        appDiv.classList.add('hidden');
        authDiv.classList.remove('hidden');
    }
});

// 5. BUTTON LISTENERS (Clean Code)
document.getElementById('btn-login').onclick = async () => {
    const e = document.getElementById('l-email').value;
    const p = document.getElementById('l-pass').value;
    if(!e || !p) return alert("Please fill all fields");
    try { await signInWithEmailAndPassword(auth, e, p); } catch(err) { alert("Error: " + err.message); }
};

document.getElementById('btn-signup').onclick = async () => {
    const n = document.getElementById('s-name').value;
    const e = document.getElementById('s-email').value;
    const p = document.getElementById('s-pass').value;
    if(!n || !e || !p) return alert("Fill all details");
    try { 
        const res = await createUserWithEmailAndPassword(auth, e, p);
        await updateProfile(res.user, { displayName: n });
        alert("Account Created! Welcome.");
    } catch(err) { alert(err.message); }
};

document.getElementById('btn-google').onclick = () => signInWithPopup(auth, new GoogleAuthProvider());

document.getElementById('btn-forgot').onclick = async () => {
    const e = document.getElementById('f-email').value;
    if(!e) return alert("Enter your email first.");
    try {
        await sendPasswordResetEmail(auth, e);
        alert("Password Reset Link sent to " + e + ". Check Inbox/Spam.");
        document.getElementById('forgot-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    } catch(err) { alert(err.message); }
};

window.doLogout = () => signOut(auth).then(() => location.reload());


// 6. CORE FUNCTIONS (Chat, People, Navigation)

function startTimer() {
    const exam = new Date("Feb 17, 2026").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const d = Math.floor((exam - now) / (1000 * 60 * 60 * 24));
        const el = document.getElementById('days-left');
        if(el) el.innerText = `${d} Days Left`;
    }, 1000);
}

function loadPeople() {
    onSnapshot(collection(db, "users"), s => {
        allUsers = s.docs.map(d => ({ uid: d.id, ...d.data() }));
        renderPeople(allUsers);
    });
}

window.renderPeople = (list) => {
    const el = document.getElementById('people-list');
    if(!el) return;
    el.innerHTML = list.map(u => {
        if (me && u.uid === me.uid) return ''; // Hide self
        return `<div onclick="startChat('${u.uid}','${u.name}')" class="card flex items-center gap-3 cursor-pointer active:bg-gray-50">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#008069]">${u.name[0]}</div>
            <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-sm">${u.name}</h3>
                <p class="text-xs text-gray-500">Tap to chat</p>
            </div>
            <i class="fa-solid fa-comment text-[#008069]"></i>
        </div>`;
    }).join('');
}

window.filterPeople = () => {
    const term = document.getElementById('p-search').value.toLowerCase();
    renderPeople(allUsers.filter(u => u.name.toLowerCase().includes(term)));
}

function loadMyChats() {
    onSnapshot(query(collection(db, "users", me.uid, "recent_chats"), orderBy("t", "desc")), s => {
        const el = document.getElementById('recent-chats');
        if (s.empty) return; 
        el.innerHTML = s.docs.map(d => {
            const c = d.data();
            return `<div onclick="openChat('${c.chatId}','${c.name}','${c.uid}')" class="card flex items-center gap-3 cursor-pointer">
                <div class="w-12 h-12 rounded-full bg-[#008069] text-white flex items-center justify-center font-bold text-lg">${c.name[0]}</div>
                <div class="flex-grow overflow-hidden">
                    <h3 class="font-bold text-gray-800">${c.name}</h3>
                    <p class="text-sm text-gray-500 truncate">${c.lastMsg || 'Tap to chat'}</p>
                </div>
            </div>`;
        }).join('');
    });
}

window.startChat = (uid, name) => {
    const cid = [me.uid, uid].sort().join('_');
    openChat(cid, name, uid);
}

window.openChat = (cid, name, uid) => {
    curChat = cid;
    document.getElementById('rm-name').innerText = name;
    document.getElementById('rm-av').innerText = name[0];
    document.getElementById('v-room').classList.remove('hidden');
    
    // Load Messages
    onSnapshot(query(collection(db, "chats", cid, "msgs"), orderBy("t", "asc")), s => {
        const log = document.getElementById('msg-log');
        log.innerHTML = s.docs.map(d => {
            const m = d.data();
            const isMe = m.u === me.uid;
            return `<div class="${isMe ? 'msg-me' : 'msg-other'} px-3 py-2 text-sm shadow-sm max-w-[80%] break-words">
                ${m.m}
            </div>`;
        }).join('');
        log.scrollTop = log.scrollHeight;
    });
}

window.sndMsg = async () => {
    const inp = document.getElementById('m-in');
    const txt = inp.value.trim();
    if (!txt) return;
    
    // 1. Send Message
    await addDoc(collection(db, "chats", curChat, "msgs"), { m: txt, u: me.uid, t: serverTimestamp() });
    inp.value = '';

    // 2. Update Both Users' Recent Chat List
    const otherUid = curChat.replace(me.uid, '').replace('_', '');
    
    // Update Mine
    setDoc(doc(db, "users", me.uid, "recent_chats", otherUid), { 
        name: document.getElementById('rm-name').innerText, 
        uid: otherUid, chatId: curChat, lastMsg: "You: " + txt, t: serverTimestamp() 
    }, { merge: true });

    // Update Theirs (So they see me in Chat tab)
    setDoc(doc(db, "users", otherUid, "recent_chats", me.uid), { 
        name: me.displayName || "User", 
        uid: me.uid, chatId: curChat, lastMsg: txt, t: serverTimestamp() 
    }, { merge: true });
}

// 7. NAVIGATION SYSTEM
window.switchV = (id) => {
    ['tab-home', 'tab-people', 'tab-chat', 'v-hindi-menu', 'v-list'].forEach(x => document.getElementById(x).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('v-room').classList.add('hidden'); 
    
    // Dock Icons Color
    const btns = document.querySelectorAll('.dock-btn');
    btns.forEach(b => b.classList.remove('active'));
    if(id === 'tab-home') btns[0].classList.add('active');
    if(id === 'tab-people') btns[1].classList.add('active');
    if(id === 'tab-chat') btns[2].classList.add('active');
}

window.openList = (key, title) => {
    const list = window.ayu[key];
    document.getElementById('list-title').innerText = title;
    document.getElementById('list-container').innerHTML = list.map(i => 
        `<div onclick="openFile('${i.file}','${i.name}')" class="card flex items-center justify-between cursor-pointer active:bg-blue-50">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><i class="fa-solid fa-file-pdf"></i></div>
                <span class="font-bold text-gray-700 text-sm">${i.name}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-gray-300"></i>
        </div>`
    ).join('');
    switchV('v-list');
}

window.openFile = (file, name) => {
    document.getElementById('file-title').innerText = name;
    document.getElementById('main-frame').src = file;
    document.getElementById('v-frame').classList.remove('hidden');
}

window.closeFrame = () => {
    document.getElementById('v-frame').classList.add('hidden');
    document.getElementById('main-frame').src = "";
}

window.goBack = () => {
    const t = document.getElementById('list-title').innerText;
    if(t.includes("Gadya") || t.includes("Kavya") || t.includes("Varnika")) {
        switchV('v-hindi-menu');
    } else {
        switchV('tab-home');
    }
}
