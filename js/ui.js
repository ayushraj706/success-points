// 1. SKELETON ENGINE: Data load hone par skeleton hatana
window.hideSkeletons = () => {
    setTimeout(() => { // Thoda fake delay taaki effect dikhe
        const skels = document.querySelectorAll('[id$="-skeleton"]');
        const contents = document.querySelectorAll('[id$="-content"], #people-list');
        
        skels.forEach(el => el.classList.add('hidden'));
        contents.forEach(el => el.classList.remove('hidden'));
    }, 1500);
};

// 2. SEARCH ENGINE: Real-time filtering
window.toggleSearch = () => {
    const el = document.getElementById('search-overlay');
    el.classList.toggle('hidden');
    if(!el.classList.contains('hidden')) document.getElementById('global-search').focus();
};

window.runGlobalSearch = () => {
    const term = document.getElementById('global-search').value.toLowerCase();
    // Logic: Agar PDF list khuli hai to wahan search karega
    const items = document.querySelectorAll('.menu-item, .user-card');
    items.forEach(item => {
        const txt = item.innerText.toLowerCase();
        item.style.display = txt.includes(term) ? 'flex' : 'none';
    });
};

// 3. BACKGROUND DOWNLOAD ENGINE
window.downloadFileBg = (url, name) => {
    // UI dikhao
    const toast = document.getElementById('download-toast');
    toast.classList.remove('hidden');
    toast.querySelector('p').innerText = `Downloading ${name}...`;

    // Background Fetch (Engine)
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Success Message
            toast.querySelector('p').innerText = "Download Complete!";
            toast.querySelector('.fa-circle-down').classList.remove('animate-bounce');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        })
        .catch(err => {
            toast.querySelector('p').innerText = "Download Failed!";
            setTimeout(() => toast.classList.add('hidden'), 3000);
        });
};

// 4. NAVIGATION ENGINE
window.switchV = (id) => {
    ['v-home', 'v-people', 'v-chat', 'v-list'].forEach(v => document.getElementById(v).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    
    // Dock Active State
    document.querySelectorAll('.dock-btn').forEach(b => b.classList.remove('active'));
    // Logic to highlight correct button...
    if(id === 'v-home') document.querySelectorAll('.dock-btn')[0].classList.add('active');
    if(id === 'v-people') document.querySelectorAll('.dock-btn')[1].classList.add('active');
    
    // Skeleton check
    if(id === 'v-people' && document.getElementById('people-list').children.length === 0) {
        // Agar list khali hai to skeleton dikhao
        document.getElementById('people-skeleton').classList.remove('hidden');
    }
};

// 5. LIST OPENER
window.openList = (subject) => {
    window.switchV('v-list');
    document.getElementById('list-title').innerText = subject.toUpperCase() + " MATERIALS";
    const container = document.getElementById('pdf-list-container');
    container.innerHTML = "";
    
    // Data.js se data uthana (Assuming window.ayu exists)
    const data = window.ayu[subject] || [];
    data.forEach(item => {
        container.innerHTML += `
            <div class="menu-item bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                    <h4 class="font-bold">${item.name}</h4>
                    <span class="text-xs text-gray-400">PDF • 2MB</span>
                </div>
                <button onclick="window.downloadFileBg('${item.file}', '${item.name}')" class="bg-gray-100 p-2 rounded-full text-[#008069]">
                    <i class="fa-solid fa-download"></i>
                </button>
            </div>
        `;
    });
};
