import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIG ---
const firebaseConfig = { apiKey: "AIzaSyBT12SP0gvwssxp8vD3KEx3HajqDle46kk", authDomain: "success-points.firebaseapp.com", projectId: "success-points", storageBucket: "success-points.firebasestorage.app", messagingSenderId: "51177935348", appId: "1:51177935348:web:33fc4a6810790a3cbd29a1" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DATA PRESERVED (Jaan) ---
window.ayu={sst:[{name:"2020 Set A",file:"sst1.html"},{name:"2024 Set A",file:"sst9.html"}],science:[{name:"2020 Set A",file:"sci1.html"}],math:[{name:"2020 Set A",file:"mat1.html"}],gad:[{name:"Ch 1",file:"gad1.html"}],kav:[{name:"Ch 1",file:"kav1.html"}],var:[{name:"Ch 1",file:"var1.html"}],sanskrit:[{name:"Ch 1",file:"san1.html"}]};
// (User: Aapka pura lamba list yahan paste kar lena, maine short kiya hai space ke liye)

let me=null; let currentChat=null; let generatedOTP=null;

// --- AUTH LISTENER ---
onAuthStateChanged(auth, async(u)=>{
    if(u){
        me=u;
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('app-view').classList.remove('hidden');
        document.getElementById('my-dp').src = u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}&background=random`;
        
        // Save User to Firestore (Vital for Chat)
        await setDoc(doc(db,"users",u.uid),{
            name: u.displayName||'Student', email: u.email, 
            photo: u.photoURL, lastActive: serverTimestamp()
        },{merge:true});
        
        loadApp();
    } else {
        document.getElementById('app-view').classList.add('hidden');
        document.getElementById('auth-view').classList.remove('hidden');
    }
});

// --- OTP LOGIC (BACKEND CONNECTION) ---
async function sendOTP(email, type) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    generatedOTP = code; 
    
    // Call Vercel API
    const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, otp: code, type })
    });
    
    const data = await res.json();
    if(res.ok) { alert(`OTP Sent to ${email}`); return true; }
    else { alert("Error: " + data.error); return false; }
}

// --- SIGNUP FLOW ---
window.showSignup = () => { document.getElementById('form-login').classList.add('hidden'); document.getElementById('form-signup').classList.remove('hidden'); }
window.showLogin = () => { document.getElementById('form-signup').classList.add('hidden'); document.getElementById('form-forgot').classList.add('hidden'); document.getElementById('form-login').classList.remove('hidden'); }

window.sendSignupOTP = async () => {
    const email = document.getElementById('s-email').value;
    const name = document.getElementById('s-name').value;
    if(!email || !name) return alert("Enter Name & Email");
    
    const success = await sendOTP(email, 'signup');
    if(success) {
        document.getElementById('otp-step-1').classList.add('hidden');
        document.getElementById('otp-step-2').classList.remove('hidden');
    }
}

window.verifyAndSignup = async () => {
    const inputOTP = document.getElementById('s-otp').value;
    const email = document.getElementById('s-email').value;
    const pass = document.getElementById('s-pass').value;
    const name = document.getElementById('s-name').value;

    if(inputOTP !== generatedOTP) return alert("Wrong OTP! Try again.");
    if(!pass) return alert("Set a password.");

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(res.user, { displayName: name });
        alert("Account Created Successfully!");
    } catch(e) { alert(e.message); }
}

// --- LOGIN & FORGOT ---
window.handleLogin = async () => {
    try { await signInWithEmailAndPassword(auth, document.getElementById('l-email').value, document.getElementById('l-pass').value); }
    catch(e) { alert("Invalid Email or Password"); }
}
window.handleGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());

window.showForgot = () => { document.getElementById('form-login').classList.add('hidden'); document.getElementById('form-forgot').classList.remove('hidden'); }
window.sendForgotOTP = async () => {
    const email = document.getElementById('f-email').value;
    if(!email) return alert("Email required");
    const ok = await sendOTP(email, 'reset');
    if(ok) {
        document.getElementById('f-step-1').classList.add('hidden');
        document.getElementById('f-step-2').classList.remove('hidden');
    }
}
window.verifyForgotOTP = async () => {
    if(document.getElementById('f-otp').value === generatedOTP) {
        // Firebase Password Reset Trigger
        await sendPasswordResetEmail(auth, document.getElementById('f-email').value);
        alert("Verification Success! A password reset link has been sent to your email.");
        showLogin();
    } else { alert("Wrong OTP"); }
}

// --- APP FEATURES ---
function loadApp(){ startTimer(); loadPeople(); loadChats(); }

function startTimer(){
    const end = new Date("2026-02-17").getTime();
    setInterval(()=>{ 
        const d = Math.floor((end - new Date().getTime())/(1000*60*60*24));
        document.getElementById('days-left').innerText = `${d} Days Left`;
    },1000);
}

// PEOPLE
function loadPeople(){
    onSnapshot(collection(db,"users"), s=>{
        document.getElementById('list-people').innerHTML = s.docs.map(d=>{
            const u = d.data(); if(u.email===me.email) return '';
            return `<div onclick="startChat('${d.id}','${u.name}','${u.photo||''}')" class="card flex gap">
                <img src="${u.photo||`https://ui-avatars.com/api/?name=${u.name}`}" class="avatar">
                <div><b>${u.name}</b><br><small style="color:gray">Student</small></div>
                <i class="fa-solid fa-comment" style="color:#008069; margin-left:auto;"></i>
            </div>`;
        }).join('');
    });
}
window.filterPeople = () => {
    const q = document.getElementById('search-ppl').value.toLowerCase();
    const items = document.querySelectorAll('#list-people > div');
    items.forEach(div => div.style.display = div.innerText.toLowerCase().includes(q) ? 'flex' : 'none');
}

// CHAT
window.startChat = (uid, name, photo) => {
    const chatId = [me.uid, uid].sort().join("_");
    document.getElementById('room-name').innerText = name;
    document.getElementById('room-av').src = photo || `https://ui-avatars.com/api/?name=${name}`;
    currentChat = chatId;
    document.getElementById('room-view').classList.remove('hidden');
    
    onSnapshot(query(collection(db,"chats",chatId,"msgs"), orderBy("t","asc")), s=>{
        const log = document.getElementById('chat-logs');
        log.innerHTML = s.docs.map(d=>{
            const m = d.data();
            return `<div class="msg ${m.u===me.uid?'msg-me':'msg-other'}">${m.txt}</div>`;
        }).join('');
        log.scrollTop = log.scrollHeight;
    });
}
window.closeChat = () => document.getElementById('room-view').classList.add('hidden');

window.sendMessage = async () => {
    const txt = document.getElementById('chat-in').value;
    if(!txt) return;
    await addDoc(collection(db,"chats",currentChat,"msgs"), { txt, u: me.uid, t: serverTimestamp() });
    document.getElementById('chat-in').value = "";
    
    // Update Recent List
    const otherId = currentChat.replace(me.uid,'').replace('_','');
    const update = { chatId: currentChat, lastMsg: txt, t: serverTimestamp() };
    setDoc(doc(db,"users",me.uid,"recent_chats",otherId), {...update, name: document.getElementById('room-name').innerText}, {merge:true});
    setDoc(doc(db,"users",otherId,"recent_chats",me.uid), {...update, name: me.displayName}, {merge:true});
}

function loadChats(){
    onSnapshot(query(collection(db,"users",me.uid,"recent_chats"), orderBy("t","desc")), s=>{
        if(s.empty) return;
        document.getElementById('list-chat').innerHTML = s.docs.map(d=>{
            const c = d.data();
            return `<div onclick="startChat('${d.id}','${c.name}','')" class="card flex gap">
                <div class="avatar center" style="background:#008069; color:white;">${c.name[0]}</div>
                <div><b>${c.name}</b><br><small style="color:gray">${c.lastMsg}</small></div>
            </div>`;
        }).join('');
    });
}

// DP SETTINGS
window.openSettings = () => {
    document.getElementById('settings-view').classList.remove('hidden');
    document.getElementById('set-dp-prev').src = me.photoURL || `https://ui-avatars.com/api/?name=${me.displayName}`;
    document.getElementById('set-name').value = me.displayName;
}
window.saveProfile = async () => {
    const name = document.getElementById('set-name').value;
    const url = document.getElementById('set-url').value;
    const photo = url || `https://ui-avatars.com/api/?name=${name}`;
    
    await updateProfile(me, { displayName: name, photoURL: photo });
    await setDoc(doc(db,"users",me.uid), { name, photo }, {merge:true});
    alert("Profile Updated!");
    location.reload();
}
window.doLogout = () => signOut(auth);

// NAVIGATION (Minified for speed)
window.switchView=(id)=>{
    ['tab-home','tab-people','tab-chat','menu-hindi','view-list'].forEach(x=>document.getElementById(x).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
    if(id.includes('home')) document.querySelectorAll('.nav-item')[0].classList.add('active');
    if(id.includes('people')) document.querySelectorAll('.nav-item')[1].classList.add('active');
    if(id.includes('chat')) document.querySelectorAll('.nav-item')[2].classList.add('active');
}
window.openList=(k,t)=>{
    document.getElementById('list-title').innerText=t;
    document.getElementById('list-container').innerHTML = window.ayu[k].map(i=>
        `<div onclick="openPdf('${i.file}','${i.name}')" class="card flex" style="justify-content:space-between">
            <div class="flex gap"><i class="fa-solid fa-file-pdf" style="color:red"></i> <b>${i.name}</b></div>
            <i class="fa-solid fa-play" style="color:var(--primary)"></i>
        </div>`
    ).join('');
    switchView('view-list');
}
window.openPdf=(f,n)=>{
    document.getElementById('pdf-title').innerText=n;
    document.getElementById('pdf-frame').src=f;
    document.getElementById('pdf-view').classList.remove('hidden');
}
window.closePdf=()=>document.getElementById('pdf-view').classList.add('hidden');
window.goBack=()=>{
    const t=document.getElementById('list-title').innerText;
    if(['Gadya','Kavya','Varnika'].includes(t)) switchView('menu-hindi'); else switchView('tab-home');
}
