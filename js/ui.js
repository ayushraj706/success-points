window.switchV = (id) => { 
    ['v-home','v-people','v-chat','v-room','v-list','v-hindi-menu'].forEach(x => {
        const el = document.getElementById(x);
        if(el) el.classList.add('hidden');
    });
    document.getElementById(id).classList.remove('hidden');
    
    // Dock Active Logic
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    if(id==='v-home') document.querySelectorAll('.dock-btn')[0].classList.add('active');
    if(id==='v-people') document.querySelectorAll('.dock-btn')[1].classList.add('active');
    if(id==='v-chat') document.querySelectorAll('.dock-btn')[2].classList.add('active');
};

window.openList = (k, t) => { 
    window.switchV('v-list');
    const c = document.getElementById('list-container'); 
    c.innerHTML = `<h3 class="font-bold text-lg mb-2">${t}</h3>`; 
    
    const data = window.ayu[k] || [];
    data.forEach(i => { 
        c.innerHTML += `
            <div class="bg-white p-3 rounded shadow flex justify-between items-center mb-2">
                <div onclick="window.openFile('${i.file}','${i.name}')" class="font-bold text-gray-700 cursor-pointer">${i.name}</div>
                <i class="fa-solid fa-file-pdf text-red-500"></i>
            </div>`; 
    });
};

window.openFile = (f, n) => { 
    document.getElementById('file-title').innerText = n;
    document.getElementById('main-frame').src = f; 
    document.getElementById('v-frame').classList.remove('hidden'); 
};

window.closeFrame = () => {
    document.getElementById('v-frame').classList.add('hidden');
    document.getElementById('main-frame').src = "";
};

// Search Engine Logic
window.toggleSearch = () => {
    const el = document.getElementById('search-overlay');
    el.classList.toggle('hidden');
    if(!el.classList.contains('hidden')) document.getElementById('global-search').focus();
};

window.runGlobalSearch = () => {
    const term = document.getElementById('global-search').value.toLowerCase();
    // Abhi ke liye ye bas UI dikha raha hai, baad me logic jodenge
    console.log("Searching for:", term);
};
