// State Management
let credits = 48;

// Aspect ratio mapping to width/height
const ratioMap = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
  "4:3": { width: 1024, height: 768 }
};

// Style enhancers for better prompt results
const stylePrompts = {
  "photorealistic": "hyperrealistic, 8k resolution, professional photography, highly detailed, realistic lighting",
  "cyberpunk": "cyberpunk neon aesthetic, futuristic city glow, volumetric smoke, high contrast, vibrant synthwave colors",
  "anime": "anime style, makoto shinkai aesthetic, vivid studio anime illustration, crisp lines, 4k",
  "3d-render": "octane 3d render, unreal engine 5, ray tracing, cinematic lighting, ultra sharp",
  "oil-painting": "classical fine art oil painting, visible textured brush strokes, masterpiece canvas art"
};

// Handle Image Generation
async function handleGenerate() {
  const promptInput = document.getElementById('prompt-input');
  const styleSelect = document.getElementById('style-select');
  const ratioSelect = document.getElementById('ratio-select');
  const batchSelect = document.getElementById('batch-select');
  const emptyState = document.getElementById('empty-state');
  const loader = document.getElementById('loader');
  const resultsGrid = document.getElementById('results-grid');
  const creditDisplay = document.getElementById('credit-count');

  const rawPrompt = promptInput.value.trim();
  const selectedStyle = styleSelect ? styleSelect.value : 'photorealistic';
  const selectedRatio = ratioSelect ? ratioSelect.value : '1:1';
  const batchCount = batchSelect ? parseInt(batchSelect.value) : 1;

  if (!rawPrompt) {
    alert("Kripya pehle prompt likhein!");
    return;
  }

  if (credits < batchCount) {
    alert("Credits khatam ho gaye hain! Naye plan par upgrade karein.");
    return;
  }

  // Deduct Credits
  credits -= batchCount;
  if (creditDisplay) creditDisplay.innerText = credits;

  // Show Loading Animation
  if (emptyState) emptyState.classList.add('hidden');
  if (resultsGrid) {
    resultsGrid.classList.add('hidden');
    resultsGrid.innerHTML = '';
  }
  if (loader) loader.classList.remove('hidden');

  const dimensions = ratioMap[selectedRatio] || { width: 1024, height: 1024 };
  const styleAddon = stylePrompts[selectedStyle] || "";
  const finalPrompt = encodeURIComponent(`${rawPrompt}, ${styleAddon}`);

  try {
    for (let i = 0; i < batchCount; i++) {
      const seed = Math.floor(Math.random() * 9999999);
      // Free Pollinations Real AI Image Generator Endpoint
      const imageUrl = `https://image.pollinations.ai/prompt/${finalPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true&enhance=true`;

      // Preload image to ensure it is ready
      await preloadImage(imageUrl);

      const card = document.createElement('div');
      card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl";
      card.innerHTML = `
        <img src="${imageUrl}" alt="${rawPrompt}" class="w-full h-80 object-cover transition duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p class="text-xs text-gray-200 line-clamp-2 mb-3 font-medium">${rawPrompt} (${selectedStyle})</p>
          <div class="flex gap-2">
            <a href="${imageUrl}" target="_blank" download="pixora-ai-${seed}.jpg" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
              <i class="fa-solid fa-download"></i>
              <span>Download</span>
            </a>
            <button onclick="triggerTool('Upscaler')" class="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold">
              4K Upscale
            </button>
          </div>
        </div>
      `;
      if (resultsGrid) resultsGrid.appendChild(card);
    }
  } catch (err) {
    console.error("Generation error:", err);
    alert("Image load hone me samasya aayi. Kripya dobara try karein.");
  } finally {
    if (loader) loader.classList.add('hidden');
    if (resultsGrid) resultsGrid.classList.remove('hidden');
  }
}

// Helper to wait until image loads
function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // continue even if one fails
    img.src = url;
  });
}

// Tool trigger notification
function triggerTool(toolName) {
  alert(`${toolName} feature ke liye image upload karein ya Studio se select karein.`);
}

// Gallery Page Renderer
const showcaseImages = [
  { prompt: "Cyberpunk Samurai in rain with glowing neon sword", style: "Cyberpunk", img: "https://image.pollinations.ai/prompt/cyberpunk%20samurai%20in%20rain%20neon%20lighting?width=600&height=600&nologo=true" },
  { prompt: "Futuristic Glass Villa in snowy mountains, photorealistic", style: "Photorealistic", img: "https://image.pollinations.ai/prompt/futuristic%20glass%20villa%20in%20snowy%20alps%208k?width=600&height=600&nologo=true" },
  { prompt: "Cute magical spirit fox in glowing autumn forest, 3d render", style: "3D Render", img: "https://image.pollinations.ai/prompt/cute%20spirit%20fox%20in%20glowing%20autumn%20forest%203d%20octane?width=600&height=600&nologo=true" },
  { prompt: "Retro 80s synthwave sunset sports car racing highway", style: "Digital Art", img: "https://image.pollinations.ai/prompt/synthwave%20retro%2080s%20sports%20car%20sunset?width=600&height=600&nologo=true" }
];

function renderGallery() {
  const container = document.getElementById('gallery-container');
  if (!container) return;

  container.innerHTML = '';
  showcaseImages.forEach(item => {
    const card = document.createElement('div');
    card.className = "glass rounded-2xl overflow-hidden border border-gray-800 group";
    card.innerHTML = `
      <div class="relative overflow-hidden aspect-square">
        <img src="${item.img}" alt="${item.prompt}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <span class="absolute top-3 left-3 bg-gray-950/70 border border-gray-700 px-2 py-1 rounded-md text-[10px] text-purple-300 font-semibold">${item.style}</span>
      </div>
      <div class="p-4">
        <p class="text-xs text-gray-300 font-medium truncate">${item.prompt}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Modal handling
function openAuthModal() {
  document.getElementById('auth-modal')?.classList.remove('hidden');
}
function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.add('hidden');
}
