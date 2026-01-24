// Screen Switching Logic
window.switchV = (id) => { 
    ['v-home','v-chat','v-people','v-room','v-list','v-frame'].forEach(x => {
        const el = document.getElementById(x);
        if(el) el.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    
    // Bottom Dock Logic
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(id==='v-home') document.querySelectorAll('.dock-btn')[0].classList.add('active');
    if(id==='v-people') document.querySelectorAll('.dock-btn')[1].classList.add('active');
    if(id==='v-chat') document.querySelectorAll('.dock-btn')[2].classList.add('active');
};

window.openList = (k, t) => { 
    document.getElementById('v-home').classList.add('hidden');
    document.getElementById('v-list').classList.remove('hidden');
    const c = document.getElementById('list-container'); 
    c.innerHTML = ""; 
    if(window.ayu[k]) {
        window.ayu[k].forEach(i => { 
            c.innerHTML += `<div onclick="window.openFile('${i.file}','${i.name}')" class="menu-item border rounded-lg bg-white"><span>${i.name}</span><i class="fa-solid fa-play text-[#008069] ml-auto"></i></div>`; 
        });
    }
};

window.openFile = (f, n) => { 
    document.getElementById('main-frame').src = f; 
    document.getElementById('v-frame').classList.remove('hidden'); 
};

window.closeFrame = () => {
    document.getElementById('v-frame').classList.add('hidden');
    document.getElementById('main-frame').src = "";
};

window.toggleProfileMenu = () => document.getElementById('profile-menu').classList.toggle('translate-x-full');

// API Email Trigger (Backend Call)
window.triggerBackendEmail = async () => {
    alert("Sending request to Backend...");
    try {
        const res = await fetch('/api/send', { method: 'POST' });
        const data = await res.json();
        if(data.success) alert("Email Sent Successfully!");
        else alert("Failed: " + data.error);
    } catch(e) {
        alert("Error connecting to backend");
    }
};

// Countdown
setInterval(() => { 
    const days = Math.floor((new Date("Feb 17, 2026").getTime() - new Date().getTime())/(1000*60*60*24)); 
    const el = document.getElementById('countdown-box');
    if(el) el.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> Exam Countdown: ${days} Days Left`; 
}, 1000);
