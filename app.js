// State & Ratio Setup
const ratioMap = {
  "1:1": { w: 1024, h: 1024 },
  "16:9": { w: 1280, h: 720 },
  "9:16": { w: 720, h: 1280 },
  "4:3": { w: 1024, h: 768 }
};

// Style enhancers to assist prompt accuracy
const styleKeywords = {
  "photorealistic": "photograph, highly detailed, 8k resolution, realistic lighting",
  "cyberpunk": "cyberpunk style, neon lights, futuristic city aesthetic",
  "anime": "anime illustration, vibrant anime colors, crisp lines",
  "3d-render": "3d render, octane render, unreal engine 5, detailed",
  "oil-painting": "oil painting, textured canvas, fine art"
};

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

  const dim = ratioMap[selectedRatio] || { w: 1024, h: 1024 };
  const styleText = styleKeywords[selectedStyle] || "";
  
  // Clean prompt string
  const combinedPrompt = `${rawPrompt}, ${styleText}`;
  const encodedPrompt = encodeURIComponent(combinedPrompt);

  try {
    for (let i = 0; i < batchCount; i++) {
      const seed = Math.floor(Math.random() * 1000000);
      
      // Clean Direct AI URL (Guaranteed Prompt Match)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dim.w}&height=${dim.h}&seed=${seed}&nologo=true`;

      // Save to localStorage
      saveToHistory(rawPrompt, imageUrl, selectedStyle);

      const card = document.createElement('div');
      card.className = "relative group rounded-2xl overflow-hidden glass border border-gray-800 shadow-xl bg-gray-950 min-h-[300px] flex items-center justify-center";
      card.innerHTML = `
        <img 
          src="${imageUrl}" 
          alt="${rawPrompt}" 
          class="w-full h-80 object-cover transition duration-500 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <p class="text-xs text-gray-200 line-clamp-2 mb-3 font-medium">${rawPrompt}</p>
          <div class="flex gap-2">
            <a href="${imageUrl}" target="_blank" download="pixora-ai-${seed}.jpg" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
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
    alert("Image load karne me error aaya.");
  } finally {
    if (loader) loader.classList.add('hidden');
    if (resultsGrid) resultsGrid.classList.remove('hidden');
  }
}

// Local history helper
function saveToHistory(prompt, url, style) {
  try {
    let history = JSON.parse(localStorage.getItem('pixora_history') || '[]');
    history.unshift({ prompt, img: url, style, date: new Date().toLocaleDateString() });
    if (history.length > 20) history.pop();
    localStorage.setItem('pixora_history', JSON.stringify(history));
  } catch(e) {}
}
