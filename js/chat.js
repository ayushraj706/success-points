import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let curChat = null;
let allUsers = [];

window.loadPeople = () => { 
    onSnapshot(collection(window.db,"users"), s => { 
        allUsers = s.docs.map(d => ({uid:d.id, ...d.data()})); 
        window.renderPeople(allUsers); 
    }); 
};

window.renderPeople = (list) => { 
    document.getElementById('people-list').innerHTML = list.map(u => 
        `<div onclick="window.startChat('${u.uid}','${u.name}')" class="user-card">
            <div class="avatar-circle" style="background:#008069">${u.name[0]}</div>
            <div class="flex-grow"><h3 class="font-bold text-gray-800">${u.name}</h3></div>
            <i class="fa-solid fa-comment text-[#008069] text-xl"></i>
        </div>`
    ).join(''); 
};

window.filterPeople = () => { 
    const term = document.getElementById('p-search').value.toLowerCase(); 
    window.renderPeople(allUsers.filter(u => u.name.toLowerCase().includes(term))); 
};

window.startChat = (uid, name) => {
    if(uid === window.me.uid) return alert("Khud se chat nahi kar sakte bhai!");
    const chatId = [window.me.uid, uid].sort().join('_');
    
    curChat = chatId;
    document.getElementById('rm-name').innerText = name;
    window.switchV('v-room');
    
    onSnapshot(query(collection(window.db,"chats",chatId,"msgs"), orderBy("t","asc")), s => { 
        document.getElementById('msg-log').innerHTML = s.docs.map(x => { 
            const m = x.data(); 
            const isMe = m.u === window.me.uid; 
            return `<div class="msg-bubble ${isMe?'msg-me':'msg-other'}"><div>${m.m}</div></div>`; 
        }).join(''); 
        document.getElementById('msg-log').scrollTop = 99999; 
    });
};

window.sndMsg = async () => { 
    const m = document.getElementById('m-in'); 
    const txt = m.value.trim(); 
    if(txt && curChat){ 
        await addDoc(collection(window.db,"chats",curChat,"msgs"), {m:txt, u:window.me.uid, t:serverTimestamp()}); 
        m.value=''; 
    }
};

window.loadMyChats = () => {
    // Recent chats load karne ka logic yahan aayega
    // (Abhi ke liye simple rakha hai)
};
