import React, { useEffect, useMemo, useRef, useState } from "react";

const FILTERS = [
  { id: "normal", name: "Normal", css: "" },
  { id: "vivid", name: "Vivid", css: "saturate(1.5) contrast(1.15)" },
  { id: "warm", name: "Warm", css: "sepia(.25) saturate(1.3) contrast(1.05)" },
  { id: "bw", name: "B&W", css: "grayscale(1)" },
  { id: "cinematic", name: "Cinematic", css: "contrast(1.25) saturate(.8)" },
  { id: "soft", name: "Soft", css: "brightness(1.08) blur(.2px)" },
  { id: "cool", name: "Cool", css: "hue-rotate(12deg) saturate(1.15)" },
  { id: "dramatic", name: "Dramatic", css: "contrast(1.4) saturate(.75)" },
];

const TOOLS = [
  ["Adjust", "☀️"],
  ["Filters", "🎨"],
  ["Transform", "🔄"],
  ["AI Edit", "✨"],
];

export default function App() {
  const inputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const [activeTool, setActiveTool] = useState("Adjust");

  const [filter, setFilter] = useState("normal");

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [showCrop, setShowCrop] = useState(false);

  const currentFilter = useMemo(() => {
    return FILTERS.find((f) => f.id === filter)?.css || "";
  }, [filter]);

  const previewFilter = useMemo(() => {
    return [
      `brightness(${brightness}%)`,
      `contrast(${contrast}%)`,
      `saturate(${saturation}%)`,
      `blur(${blur}px)`,
      currentFilter,
    ]
      .filter(Boolean)
      .join(" ");
  }, [brightness, contrast, saturation, blur, currentFilter]);

  const previewStyle = {
    filter: previewFilter,
    transform: `
      rotate(${rotation}deg)
      scaleX(${flipX ? -1 : 1})
      scaleY(${flipY ? -1 : 1})
      scale(${zoom / 100})
    `,
  };

  function openFile() {
    inputRef.current?.click();
  }

  function handleFile(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const url = URL.createObjectURL(file);

    setImage(url);
    setFileName(file.name);

    resetAll();
    setActiveTool("Adjust");
    setAiResponse("");
  }

  function resetAll() {
    setFilter("normal");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setZoom(100);
  }

  function rotateLeft() {
    setRotation((value) => value - 90);
  }

  function rotateRight() {
    setRotation((value) => value + 90);
  }

  function flipHorizontal() {
    setFlipX((value) => !value);
  }

  function flipVertical() {
    setFlipY((value) => !value);
  }

  async function runAI() {
    if (!image) {
      setAiResponse("Pehle image upload karein.");
      return;
    }

    if (!aiPrompt.trim()) {
      setAiResponse("AI ko batayein ki image mein kya change karna hai.");
      return;
    }

    setAiLoading(true);
    setAiResponse("");

    try {
      /*
       * REAL AI BACKEND
       *
       * Agar aapke paas backend/API hai to yahan:
       *
       * fetch("/api/edit", {
       *   method: "POST",
       *   body: ...
       * })
       *
       * laga sakte hain.
       */

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setAiResponse(
        `AI Edit request ready hai:\n\n"${aiPrompt.trim()}"\n\nReal AI image editing ke liye AI API/backend connect karna hoga.`
      );
    } catch (error) {
      setAiResponse("AI editing mein error aa gaya.");
    } finally {
      setAiLoading(false);
    }
  }

  function downloadImage() {
    if (!image) {
      alert("Pehle image upload karein.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const normalizedRotation =
        ((rotation % 360) + 360) % 360;

      const swap =
        normalizedRotation === 90 ||
        normalizedRotation === 270;

      const canvas = document.createElement("canvas");

      canvas.width = swap
        ? img.naturalHeight
        : img.naturalWidth;

      canvas.height = swap
        ? img.naturalWidth
        : img.naturalHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert("Canvas not supported.");
        return;
      }

      ctx.save();

      ctx.translate(
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.rotate((rotation * Math.PI) / 180);

      ctx.scale(
        flipX ? -1 : 1,
        flipY ? -1 : 1
      );

      const scaleX = swap
        ? canvas.height / img.naturalWidth
        : 1;

      const scaleY = swap
        ? canvas.width / img.naturalHeight
        : 1;

      ctx.scale(
        scaleX * (zoom / 100),
        scaleY * (zoom / 100)
      );

      ctx.filter = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `saturate(${saturation}%)`,
        `blur(${blur}px)`,
        currentFilter,
      ]
        .filter(Boolean)
        .join(" ");

      ctx.drawImage(
        img,
        -img.naturalWidth / 2,
        -img.naturalHeight / 2
      );

      ctx.restore();

      const link = document.createElement("a");

      const cleanName =
        fileName.replace(/\.[^/.]+$/, "") ||
        "edited-image";

      link.download = `pixora-${cleanName}.png`;

      link.href = canvas.toDataURL(
        "image/png",
        1
      );

      link.click();
    };

    img.src = image;
  }

  function renderPanel() {
    if (activeTool === "Filters") {
      return (
        <div className="panel-content">
          <div className="panel-heading">
            <span>🎨</span>
            <h2>Filters</h2>
          </div>

          <div className="filter-grid">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                className={`filter-button ${
                  filter === item.id ? "selected" : ""
                }`}
                onClick={() => setFilter(item.id)}
              >
                <div
                  className="filter-preview"
                  style={{
                    backgroundImage: image
                      ? `url(${image})`
                      : "linear-gradient(135deg,#444,#111)",
                    filter: item.css || "none",
                  }}
                />

                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeTool === "Transform") {
      return (
        <div className="panel-content">
          <div className="panel-heading">
            <span>🔄</span>
            <h2>Transform</h2>
          </div>

          <div className="transform-grid">
            <button onClick={rotateLeft}>
              ↶
              <span>Rotate Left</span>
            </button>

            <button onClick={rotateRight}>
              ↷
              <span>Rotate Right</span>
            </button>

            <button onClick={flipHorizontal}>
              ↔️
              <span>Flip Horizontal</span>
            </button>

            <button onClick={flipVertical}>
              ↕️
              <span>Flip Vertical</span>
            </button>

            <button onClick={() => setShowCrop(true)}>
              ✂️
              <span>Crop</span>
            </button>

            <button onClick={resetAll}>
              ⟳
              <span>Reset</span>
            </button>
          </div>

          <div className="transform-info">
            <div>
              Rotation:
              <strong>
                {((rotation % 360) + 360) % 360}°
              </strong>
            </div>

            <div>
              Zoom:
              <strong>{zoom}%</strong>
            </div>
          </div>

          <Slider
            label="🔍 Zoom"
            value={zoom}
            min={50}
            max={200}
            unit="%"
            onChange={setZoom}
          />
        </div>
      );
    }

    if (activeTool === "AI Edit") {
      return (
        <div className="panel-content">
          <div className="panel-heading">
            <span>✨</span>
            <h2>AI Image Editor</h2>
          </div>

          <button
            className="ai-main-button"
            onClick={openFile}
          >
            📷 Upload Image
          </button>

          <div className="ai-divider">
            <span>AI EDIT</span>
          </div>

          <label className="input-label">
            What should AI change?
          </label>

          <textarea
            rows="5"
            value={aiPrompt}
            onChange={(e) =>
              setAiPrompt(e.target.value)
            }
            placeholder="Example: Remove the background and put the person on a beautiful beach..."
          />

          <button
            className="ai-generate-button"
            onClick={runAI}
            disabled={!image || aiLoading}
          >
            {aiLoading
              ? "⏳ Processing..."
              : "✨ Generate AI Edit"}
          </button>

          {aiResponse && (
            <div className="ai-response">
              {aiResponse}
            </div>
          )}

          <div className="ai-note">
            <strong>AI editing features:</strong>
            <br />
            Background removal, object removal,
            generative fill, image generation,
            face enhancement aur bahut kuch.
            <br /><br />
            Real AI result ke liye backend/API
            connect karna hoga.
          </div>
        </div>
      );
    }

    return (
      <div className="panel-content">
        <div className="panel-heading">
          <span>☀️</span>
          <h2>Adjust</h2>
        </div>

        <Slider
          label="☀️ Brightness"
          value={brightness}
          min={0}
          max={200}
          unit="%"
          onChange={setBrightness}
        />

        <Slider
          label="◐ Contrast"
          value={contrast}
          min={0}
          max={200}
          unit="%"
          onChange={setContrast}
        />

        <Slider
          label="🌈 Saturation"
          value={saturation}
          min={0}
          max={200}
          unit="%"
          onChange={setSaturation}
        />

        <Slider
          label="💨 Blur"
          value={blur}
          min={0}
          max={20}
          unit="px"
          onChange={setBlur}
        />

        <button
          className="reset-button"
          onClick={resetAll}
        >
          ⟳ Reset Adjustments
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✨</div>

          <div>
            <h1>Pixora AI</h1>
            <p>AI Image Editor</p>
          </div>
        </div>

        <div className="top-actions">
          <button onClick={openFile}>
            📁 Open Image
          </button>

          <button
            className="download-button"
            onClick={downloadImage}
          >
            ⬇ Download
          </button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="tool-title">
            <span>🛠️</span>
            <strong>Tools</strong>
          </div>

          <div className="tool-list">
            {TOOLS.map(([name, icon]) => (
              <button
                key={name}
                className={
                  activeTool === name
                    ? "tool active"
                    : "tool"
                }
                onClick={() =>
                  setActiveTool(name)
                }
              >
                <span className="tool-icon">
                  {icon}
                </span>

                <span>{name}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <button
              onClick={downloadImage}
              className="side-download"
            >
              ⬇ Save Image
            </button>
          </div>
        </aside>

        <section className="canvas-area">
          {!image ? (
            <div className="empty-state">
              <div className="upload-icon">🖼️</div>

              <h2>Start Editing Your Image</h2>

              <p>
                Upload an image and use powerful
                editing tools.
              </p>

              <button
                className="upload-main"
                onClick={openFile}
              >
                📷 Upload Image
              </button>

              <small>
                JPG, PNG, WEBP supported
              </small>
            </div>
          ) : (
            <div className="image-stage">
              <img
                src={image}
                alt="Editing preview"
                style={previewStyle}
              />

              {showCrop && (
                <div className="crop-overlay">
                  <div className="crop-box">
                    <div className="crop-title">
                      ✂️ Crop Tool
                    </div>

                    <p>
                      Crop tool interface ready hai.
                    </p>

                    <button
                      onClick={() =>
                        setShowCrop(false)
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="right-panel">
          <div className="file-info">
            <div className="file-name">
              {fileName}
            </div>

            {image && (
              <span className="status">
                ● Ready
              </span>
            )}
          </div>

          {renderPanel()}
        </aside>
      </main>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />

      <footer className="footer">
        <span>
          ✨ Pixora AI Image Editor
        </span>

        <span>
          Created by Kamlesh Meena
        </span>
      </footer>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}) {
  return (
    <div className="slider-box">
      <div className="slider-header">
        <span>{label}</span>
        <strong>
          {value}
          {unit}
        </strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
      />
    </div>
  );
      }
