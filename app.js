// State Management
let credits = 48;

// Sample Pre-loaded gallery images
const showcaseImages = [
  { prompt: "Cyberpunk Samurai in rain", style: "Cyberpunk", img: "https://picsum.photos/seed/cyber1/600/600" },
  { prompt: "Futuristic Glass Architecture in Alps", style: "Photorealistic", img: "https://picsum.photos/seed/arch/600/600" },
  { prompt: "Isometric floating enchanted island", style: "3D Render", img: "https://picsum.photos/seed/island/600/600" },
  { prompt: "Ethereal spirit wolf in cosmic forest", style: "Digital Art", img: "https://picsum.photos/seed/wolf/600/600" },
  { prompt: "Retro 80s synthwave sports car", style: "Cyberpunk", img: "https://picsum.photos/seed/synth/600/600" },
  { prompt: "Ancient mystic temple in clouds", style: "Photorealistic", img: "https://picsum.photos/seed/cloud/600/600" }
];

// Handle Image Generation
function handleGenerate() {
  const promptInput = document.getElementById('prompt-input');
  const styleSelect = document.getElementById('style-select');
  const batchSelect = document.getElementById('batch-select');
  const emptyState = document.getElementById('empty-state');
  const loader = document.getElementById('loader');
  const resultsGrid = document.getElementById('results-grid');
  const creditDisplay = document.getElementById('credit-count');

  const prompt = promptInput.value.trim();
  const batchCount = parseInt(batchSelect.value);

  if (!prompt) {
    alert("Please enter a creative prompt first!");
    return;
  }

  if (credits < batchCount) {
    alert("Not enough credits! Upgrade your plan.");
    return;
  }

  // Deduct Credits
  credits -= batchCount;
  if(creditDisplay) creditDisplay.innerText = credits;

  // Show Loading state
  emptyState.classList.add('hidden');
  resultsGrid.classList.add('hidden');
  loader.classList.remove('hidden');

  // Simulated AI API latency
  setTimeout(() => {
    loader.classList.add('hidden');
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('hidden');

    for (let i = 0; i < batchCount; i++) {
      const randomSeed = Math.floor(Math.random() * 99999);
      const imgUrl = `https://picsum.photos/seed/${randomSeed}/800/800`;

      const card = document.createElement('div');
      card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl";
      card.innerHTML = `
        <img src="${imgUrl}" alt="${prompt}" class="w-full h-72 object-cover transition duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p class="text-xs text-gray-200 line-clamp-2 mb-3">${prompt} (${styleSelect.value})</p>
          <div class="flex gap-2">
            <a href="${imgUrl}" target="_blank" download class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
              <i class="fa-solid fa-download"></i>
              <span>Save</span>
            </a>
            <button onclick="triggerTool('Upscaler')" class="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold">
              4K Upscale
            </button>
          </div>
        </div>
      `;
      resultsGrid.appendChild(card);
    }
  }, 1800);
}

// Tool trigger simulation
function triggerTool(toolName) {
  alert(`Launching ${toolName} Module. Upload your image to process.`);
}

// Gallery Page Renderer
function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  container.innerHTML = '';
  showcaseImages.forEach(item => {
    const card = document.createElement('div');
    card.className = "glass rounded-2xl overflow-hidden border border-gray-800 group";
    card.innerHTML = `
      <div class="relative overflow-hidden aspect-square">
        <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span class="absolute top-3 left-3 bg-gray-950/70 border border-gray-700 px-2 py-1 rounded-md text-[10px] text-purple-300 font-semibold">${item.style}</span>
      </div>
      <div class="p-4">
        <p class="text-xs text-gray-300 font-medium truncate">${item.prompt}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Auth Modal
function openAuthModal() {
  document.getElementById('auth-modal')?.classList.remove('hidden');
}
function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.add('hidden');
}
