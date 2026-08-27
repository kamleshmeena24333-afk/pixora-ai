// Local Storage Key
const API_KEY_STORAGE = 'pixora_gemini_key';

// Dimension Ratios
const ratioMap = {
  "1:1": "1:1",
  "16:9": "16:9",
  "9:16": "9:16",
  "4:3": "4:3"
};

const pixelDimensions = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720, height: 1280 },
  "4:3": { width: 1024, height: 768 }
};

const styleEnhancers = {
  "photorealistic": "8k uhd, photorealistic, professional lighting, highly detailed photograph, studio quality",
  "cyberpunk": "cyberpunk neon aesthetic, futuristic city glow, volumetric smoke, high contrast, vibrant synthwave colors",
  "anime": "anime style, makoto shinkai aesthetic, vivid studio anime illustration, crisp lines, 4k",
  "3d-render": "octane 3d render, unreal engine 5, ray tracing, cinematic lighting, ultra sharp",
  "oil-painting": "classical fine art oil painting, visible textured brush strokes, masterpiece canvas art"
};

// Check Key Status on Load
document.addEventListener('DOMContentLoaded', () => {
  updateApiStatusUI();
});

function updateApiStatusUI() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  const statusEl = document.getElementById('api-status');
  if (statusEl) {
    statusEl.innerText = key ? "Gemini Key: Active" : "Set Gemini Key";
    statusEl.parentElement.classList.toggle('border-green-500/50', !!key);
    statusEl.parentElement.classList.toggle('border-purple-500/50', !key);
  }
}

// Generate Image Handler
async function handleGenerate() {
  const promptInput = document.getElementById('prompt-input');
  const styleSelect = document.getElementById('style-select');
  const ratioSelect = document.getElementById('ratio-select');
  const batchSelect = document.getElementById('batch-select');
  const emptyState = document.getElementById('empty-state');
  const loader = document.getElementById('loader');
  const resultsGrid = document.getElementById('results-grid');

  const rawPrompt = promptInput.value.trim();
  const selectedStyle = styleSelect ? styleSelect.value : 'photorealistic';
  const selectedRatio = ratioSelect ? ratioSelect.value : '1:1';
  const batchCount = batchSelect ? parseInt(batchSelect.value) : 1;

  if (!rawPrompt) {
    alert("Kripya pehle prompt likhein!");
    return;
  }

  // UI Setup
  if (emptyState) emptyState.classList.add('hidden');
  if (resultsGrid) {
    resultsGrid.classList.add('hidden');
    resultsGrid.innerHTML = '';
  }
  if (loader) loader.classList.remove('hidden');

  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  const enhancer = styleEnhancers[selectedStyle] || "";
  const fullPrompt = `${rawPrompt}, ${enhancer}`;

  try {
    for (let i = 0; i < batchCount; i++) {
      let finalImageUrl = "";

      if (apiKey) {
        // Mode 1: Real Google Gemini Imagen 3 Generation
        finalImageUrl = await generateWithGeminiImagen(fullPrompt, selectedRatio, apiKey);
      } else {
        // Mode 2: High-Quality Fallback Engine
        const dims = pixelDimensions[selectedRatio] || { width: 1024, height: 1024 };
        const seed = Math.floor(Math.random() * 9999999);
        finalImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${dims.width}&height=${dims.height}&seed=${seed}&nologo=true&model=flux`;
      }

      saveToHistory(rawPrompt, finalImageUrl, selectedStyle);

      const card = document.createElement('div');
      card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl bg-gray-950";
      card.innerHTML = `
        <img src="${finalImageUrl}" alt="${rawPrompt}" class="w-full h-80 object-cover transition duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p class="text-xs text-gray-200 line-clamp-2 mb-3 font-medium">${rawPrompt}</p>
          <div class="flex gap-2">
            <a href="${finalImageUrl}" target="_blank" download="pixora-ai.jpg" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
              <i class="fa-solid fa-download"></i>
              <span>Download</span>
            </a>
          </div>
        </div>
      `;
      if (resultsGrid) resultsGrid.appendChild(card);
    }
  } catch (error) {
    console.error("Generation error:", error);
    alert("Generation me issue aaya. Fallback engine se generate kar rahe hain...");
    
    // Auto Fallback if API fails
    const dims = pixelDimensions[selectedRatio] || { width: 1024, height: 1024 };
    const seed = Math.floor(Math.random() * 9999999);
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${dims.width}&height=${dims.height}&seed=${seed}&nologo=true&model=flux`;
    
    const card = document.createElement('div');
    card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl bg-gray-950";
    card.innerHTML = `<img src="${fallbackUrl}" alt="${rawPrompt}" class="w-full h-80 object-cover" />`;
    if (resultsGrid) resultsGrid.appendChild(card);
  } finally {
    if (loader) loader.classList.add('hidden');
    if (resultsGrid) resultsGrid.classList.remove('hidden');
  }
}

// Direct Google Imagen 3 API Call
async function generateWithGeminiImagen(promptText, ratio, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: promptText }],
      parameters: {
        aspectRatio: ratioMap[ratio] || "1:1",
        outputMimeType: "image/jpeg"
      }
    })
  });

  const data = await response.json();
  if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
    return `data:image/jpeg;base64,${data.predictions[0].bytesBase64Encoded}`;
  } else {
    throw new Error(data.error?.message || "Invalid Imagen response");
  }
}

// Local Storage History
function saveToHistory(prompt, url, style) {
  try {
    let history = JSON.parse(localStorage.getItem('pixora_history') || '[]');
    history.unshift({ prompt, img: url, style, date: new Date().toLocaleDateString() });
    if (history.length > 20) history.pop();
    localStorage.setItem('pixora_history', JSON.stringify(history));
  } catch(e) {}
}

// API Key Modal Controls
function toggleApiKeyModal() {
  const modal = document.getElementById('api-modal');
  if (modal) modal.classList.toggle('hidden');
  const input = document.getElementById('api-key-input');
  if (input) input.value = localStorage.getItem(API_KEY_STORAGE) || '';
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  if (input && input.value.trim()) {
    localStorage.setItem(API_KEY_STORAGE, input.value.trim());
    updateApiStatusUI();
    toggleApiKeyModal();
    alert("Gemini API Key successfully activate ho gayi!");
  }
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
  updateApiStatusUI();
  toggleApiKeyModal();
  alert("API Key remove kar di gayi hai. Ab fallback mode use hoga.");
}
