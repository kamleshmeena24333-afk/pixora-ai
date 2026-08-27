// State Management
let credits = 50;

// Aspect Ratio Dimensions
const ratioMap = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
  "4:3": { width: 1024, height: 768 }
};

// Style Enhancement Prompts
const styleEnhancers = {
  "photorealistic": "8k uhd, photorealistic, professional lighting, highly detailed photograph",
  "cyberpunk": "cyberpunk style, neon glow, futuristic aesthetic, volumetric lighting, dark synthwave",
  "anime": "vibrant anime style, detailed anime illustration, makoto shinkai style, sharp lines",
  "3d-render": "octane 3d render, unreal engine 5, cinematic 3d art, volumetric lighting, 8k",
  "oil-painting": "oil on canvas, classical oil painting, textured strokes, fine art masterpiece"
};

// Main Generate Function
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
    alert("Kripya prompt likhein!");
    return;
  }

  if (credits < batchCount) {
    alert("Credits khatam ho gaye hain!");
    return;
  }

  // Credits deduct & update
  credits -= batchCount;
  if (creditDisplay) creditDisplay.innerText = credits;

  // UI state change
  if (emptyState) emptyState.classList.add('hidden');
  if (resultsGrid) {
    resultsGrid.classList.add('hidden');
    resultsGrid.innerHTML = '';
  }
  if (loader) loader.classList.remove('hidden');

  const dimensions = ratioMap[selectedRatio] || { width: 1024, height: 1024 };
  const enhancer = styleEnhancers[selectedStyle] || "";
  
  // Clean encoding
  const cleanPrompt = `${rawPrompt}, ${enhancer}`.replace(/[\n\r]+/g, ' ');
  const encodedPrompt = encodeURIComponent(cleanPrompt);

  try {
    for (let i = 0; i < batchCount; i++) {
      const seed = Math.floor(Math.random() * 10000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${seed}&nologo=true&model=flux`;

      // Save to local storage history
      saveToHistory(rawPrompt, imageUrl, selectedStyle);

      const card = document.createElement('div');
      card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl min-h-[300px] flex items-center justify-center bg-gray-950";
      
      card.innerHTML = `
        <img 
          src="${imageUrl}" 
          alt="${rawPrompt}" 
          loading="lazy"
          class="w-full h-80 object-cover transition duration-500 group-hover:scale-105" 
          onload="this.classList.remove('opacity-0')"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p class="text-xs text-gray-200 line-clamp-2 mb-3 font-medium">${rawPrompt}</p>
          <div class="flex gap-2">
            <a href="${imageUrl}" target="_blank" download="pixora-${seed}.jpg" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
              <i class="fa-solid fa-download"></i>
              <span>Download</span>
            </a>
          </div>
        </div>
      `;
      if (resultsGrid) resultsGrid.appendChild(card);
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (loader) loader.classList.add('hidden');
    if (resultsGrid) resultsGrid.classList.remove('hidden');
  }
}

// Save to Local History
function saveToHistory(prompt, url, style) {
  try {
    let history = JSON.parse(localStorage.getItem('pixora_history') || '[]');
    history.unshift({ prompt, img: url, style, date: new Date().toLocaleDateString() });
    if (history.length > 20) history.pop();
    localStorage.setItem('pixora_history', JSON.stringify(history));
  } catch(e) {}
}

// Tool trigger alert
function triggerTool(toolName) {
  alert(`${toolName} feature ke liye page open karein.`);
}

// Modal handling
function openAuthModal() {
  document.getElementById('auth-modal')?.classList.remove('hidden');
}
function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.add('hidden');
}
