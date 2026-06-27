let allProducts = [];
let myBuildList = [];
let selectedCategory = 'all';
let signUpMode = false;
let userSession = { name: "Guest Operator", loggedIn: false };

const tipsPool = [
    "\"Never skimp on the Power Supply (PSU). A cheap model can damage components during electric spikes!\"",
    "\"Ensure you peel the clear plastic film off the bottom of your CPU cooler before mounting it down!\"",
    "\"Always install the Motherboard back panel I/O shield first before fastening the main PCB inside!\"",
    "\"Always install matching RAM sticks in dual-channel slots 2 and 4 for the best performance stability!\"",
    "\"NVMe M.2 drives run fast; ensure you utilize the motherboard built-in heat sinks to avoid heat throttling.\""
];

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProducts();
        });
    rotateExpertAdvice();
});

function showPage(pageId) {
    document.querySelectorAll('.page-view').forEach(p => p.classList.add('hidden'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const query = document.getElementById('searchBar').value.toLowerCase();
    
    const filtered = allProducts.filter(p => {
        const matchesCategory = (selectedCategory === 'all' || p.category === selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-gray-500 col-span-full text-center text-xs py-12">No current hardware matches in this sub-class matrix.</p>`;
        return;
    }

    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg">
                <div class="p-4 flex flex-col justify-between h-full">
                    <div>
                        <span class="text-[8px] bg-blue-500/10 text-blue-400 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">${p.category}</span>
                        <h3 class="text-sm font-bold mt-1 text-white tracking-tight">${p.name}</h3>
                    </div>
                    <div class="mt-4 flex justify-between items-center border-t border-slate-800/60 pt-2.5">
                        <span class="text-xs font-mono font-bold text-gray-300">₱${p.price.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                        <button onclick="addToBuildList(${p.id})" class="bg-blue-500 hover:bg-blue-400 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all">
                            + Add to Build
                        </button>
                    </div>
                </div>
            </div>`;
    });
}

function filterProducts() { renderProducts(); }
function filterCategory(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.className = "cat-btn px-3 py-1.5 bg-slate-800 text-gray-300 font-medium rounded-lg text-xs hover:bg-slate-700 transition-all");
    event.currentTarget.className = "cat-btn px-3 py-1.5 bg-blue-500 text-slate-950 font-bold rounded-lg text-xs transition-all";
    renderProducts();
}

function addToBuildList(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;
    if (myBuildList.some(item => item.id === id)) return;
    myBuildList.push(product);
    updateBuildUI();
}

function removeFromBuildList(id) {
    myBuildList = myBuildList.filter(item => item.id !== id);
    updateBuildUI();
}

function updateBuildUI() {
    const container = document.getElementById('build-list-container');
    if (!container) return;

    if (myBuildList.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-xs text-center py-12">No components mapped. Click parts to add them here.</p>`;
        document.getElementById('build-total-price').innerText = '₱0.00';
        evaluateBuildSuggestions();
        return;
    }

    container.innerHTML = '';
    myBuildList.forEach(item => {
        container.innerHTML += `
            <div class="bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                <div class="truncate pr-1">
                    <p class="font-bold text-white truncate text-[11px]">${item.name}</p>
                    <p class="text-[9px] text-blue-400 font-mono">₱${item.price.toLocaleString()}</p>
                </div>
                <button onclick="removeFromBuildList(${item.id})" class="text-rose-400 font-medium text-[10px] hover:underline ml-1">Delete</button>
            </div>`;
    });

    let totalSum = myBuildList.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('build-total-price').innerText = `₱${totalSum.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    
    evaluateBuildSuggestions();
}

function evaluateBuildSuggestions() {
    const tipsBox = document.getElementById('blueprint-tips');
    if (myBuildList.length === 0) {
        tipsBox.innerText = "Add parts to your layout. Our helper will automatically verify setup balance.";
        return;
    }

    const hasStrongGPU = myBuildList.some(item => item.category === 'GPU' && item.price > 40000);
    const hasWeakCPU = myBuildList.some(item => item.category === 'CPU' && item.price < 10000);
    const hasDDR4Ram = myBuildList.some(item => item.category === 'RAM' && item.name.includes("DDR4"));
    const hasDDR5Board = myBuildList.some(item => item.category === 'Motherboard' && item.name.includes("DDR5"));

    if (hasStrongGPU && hasWeakCPU) {
        tipsBox.innerText = "⚠️ Speed Bottleneck Mismatch: Your graphics card is ultra high-end. Consider selecting a stronger CPU to balance processing speeds.";
    } else if (hasDDR4Ram && hasDDR5Board) {
        tipsBox.innerText = "⚠️ RAM Generation Mismatch: You have added a DDR5 motherboard platform but a DDR4 RAM stick kit. These parts are physically incompatible.";
    } else {
        tipsBox.innerText = "✅ Component Balance Clear: Your selected hardware models show solid structural alignment. Ready to save layout.";
    }
}

function loadPresetBlueprint(tier) {
    myBuildList = [];
    if (tier === 'entry') {
        myBuildList.push(allProducts.find(p => p.id === 1));  // 4060
        myBuildList.push(allProducts.find(p => p.id === 11)); // Ryzen 5600
        myBuildList.push(allProducts.find(p => p.id === 21)); // B550M
        myBuildList.push(allProducts.find(p => p.id === 31)); // DDR4 RAM
        myBuildList.push(allProducts.find(p => p.id === 41)); // 1TB NVMe
    } else if (tier === 'mid') {
        myBuildList.push(allProducts.find(p => p.id === 4));  // 4070 Super
        myBuildList.push(allProducts.find(p => p.id === 12)); // Ryzen 7600
        myBuildList.push(allProducts.find(p => p.id === 22)); // B650M
        myBuildList.push(allProducts.find(p => p.id === 32)); // DDR5 RAM
        myBuildList.push(allProducts.find(p => p.id === 42)); // Samsung 1TB
    } else if (tier === 'dream') {
        myBuildList.push(allProducts.find(p => p.id === 5));  // RTX 4090
        myBuildList.push(allProducts.find(p => p.id === 13)); // Ryzen 7800X3D
        myBuildList.push(allProducts.find(p => p.id === 23)); // ROG B650
        myBuildList.push(allProducts.find(p => p.id === 33)); // Trident Z5
        myBuildList.push(allProducts.find(p => p.id === 43)); // Samsung 2TB
    }
    updateBuildUI();
    showPage('home');
}

function generatePrintableQuote() {
    if (myBuildList.length === 0) return alert("Your configuration sheet is empty.");
    
    let txt = `========================================\n`;
    txt += `          JBYTE PC BUILD SHEET          \n`; // Swapped layout text here
    txt += `========================================\n`;
    txt += `Operator: ${userSession.name}\n`;
    txt += `Date Mapped: ${new Date().toLocaleDateString()}\n`;
    txt += `----------------------------------------\n`;

    
    let subtotal = 0;
    myBuildList.forEach((item, index) => {
        subtotal += item.price;
        txt += `${index + 1}. [${item.category}] ${item.name}\n`;
        txt += `   Price: PHP ${item.price.toLocaleString()}\n\n`;
    });
    
    txt += `----------------------------------------\n`;
    txt += `Estimated System Total: PHP ${subtotal.toLocaleString()}\n`;
    txt += `========================================\n`;
    txt += `Show this printout layout directly at retail counters\n`;
    txt += `inside Gilmore/DynaQuest for quick matching component quotes.`;

    document.getElementById('quote-text-area').value = txt;
    document.getElementById('quote-modal').classList.remove('hidden');
}

function rotateExpertAdvice() {
    const el = document.getElementById('expert-builder-quote');
    if (!el) return;
    setInterval(() => {
        let randIdx = Math.floor(Math.random() * tipsPool.length);
        el.innerText = tipsPool[randIdx];
    }, 8000);
}

function toggleAuthMode() {
    signUpMode = !signUpMode;
    document.getElementById('auth-title').innerText = signUpMode ? "Create New Profile" : "Welcome Operator";
    document.getElementById('auth-subtitle').innerText = signUpMode ? "Register new builder account parameters" : "Access custom account parameters to save layout sheets";
    document.getElementById('auth-submit-btn').innerText = signUpMode ? "Signup" : "Login";
    document.getElementById('auth-switch-prompt').innerText = signUpMode ? "Already verified?" : "Don't have an account?";
}

function handleUserAuthentication(e) {
    e.preventDefault();
    const username = document.getElementById('auth-username').value.trim();
    if(!username) return;
    
    userSession = { name: username, loggedIn: true };
    document.getElementById('user-display-status').innerText = userSession.name;
    document.getElementById('user-display-status').className = "text-sm font-bold text-blue-400";
    
    const btn = document.getElementById('auth-nav-btn');
    btn.innerText = "Logout";
    btn.className = "px-4 py-1.5 bg-red-950 text-red-400 border border-red-800 rounded-lg text-xs font-bold transition-all";
    btn.setAttribute('onclick', 'logout()');
    showPage('home');
}

function logout() {
    userSession = { name: "Guest Operator", loggedIn: false };
    document.getElementById('user-display-status').innerText = userSession.name;
    document.getElementById('user-display-status').className = "text-sm font-bold text-white";
    
    const btn = document.getElementById('auth-nav-btn');
    btn.innerText = "Login / Signup";
    btn.className = "px-4 py-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-lg text-xs transition-all";
    btn.setAttribute('onclick', "showPage('auth')");
    showPage('home');
}