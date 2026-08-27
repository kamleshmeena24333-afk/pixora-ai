import React, { useMemo, useRef, useState } from "react";
import "./style.css";

const FILTERS = [
  { id: "normal", name: "Normal", css: "" },
  { id: "vivid", name: "Vivid", css: "saturate(1.8) contrast(1.2)" },
  { id: "warm", name: "Warm", css: "sepia(.35) saturate(1.3)" },
  { id: "bw", name: "B&W", css: "grayscale(1)" },
  { id: "cinematic", name: "Cinematic", css: "contrast(1.3) saturate(.8)" },
  { id: "soft", name: "Soft", css: "brightness(1.1) blur(1px)" },
];

const TOOLS = [
  ["Adjust", "⚙️"],
  ["Filters", "🎨"],
  ["Transform", "↔️"],
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

  const [showCrop, setShowCrop] = useState(false);
  const [cropRatio, setCropRatio] = useState("1:1");

  const currentFilter =
    FILTERS.find((f) => f.id === filter)?.css || "";

  const previewStyle = useMemo(
    () => ({
      filter: [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        `saturate(${saturation}%)`,
        `blur(${blur}px)`,
        currentFilter,
      ]
        .filter(Boolean)
        .join(" "),

      transform: `
        rotate(${rotation}deg)
        scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})
        scale(${zoom / 100})
      `,
    }),
    [
      brightness,
      contrast,
      saturation,
      blur,
      currentFilter,
      rotation,
      flipX,
      flipY,
      zoom,
    ]
  );

  /* =========================
     FILE UPLOAD
  ========================= */

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
  }

  /* =========================
     RESET
  ========================= */

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

  /* =========================
     TRANSFORM
  ========================= */

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

  /* =========================
     AI EDIT
  ========================= */

  function runAI() {
    if (!image) {
      setAiResponse("पहले image upload करें।");
      return;
    }

    if (!aiPrompt.trim()) {
      setAiResponse(
        "AI Edit में बताइए कि image में क्या बदलना है।"
      );
      return;
    }

    setAiResponse(
      `AI Prompt तैयार है:

"${aiPrompt.trim()}"

Real AI editing के लिए इस button को AI API/backend से connect करना होगा।`
    );
  }

  /* =========================
     DOWNLOAD
  ========================= */

  function downloadImage() {
    if (!image) {
      alert("पहले image upload करें।");
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

      if (!ctx) return;

      ctx.save();

      ctx.translate(
        canvas.width / 2,
        canvas.height / 2
      );

      ctx.rotate(
        (rotation * Math.PI) / 180
      );

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

      ctx.scale(scaleX, scaleY);

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
        "edited";

      link.download =
        `pixora-${cleanName}.png`;

      link.href =
        canvas.toDataURL("image/png", 1);

      link.click();
    };

    img.src = image;
  }

  /* =========================
     SETTINGS PANEL
  ========================= */

  function renderPanel() {
    /* FILTERS */

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
                className={
                  `filter-button ${
                    filter === item.id
                      ? "selected"
                      : ""
                  }`
                }
                onClick={() =>
                  setFilter(item.id)
                }
              >

                <div
                  className={
                    `filter-preview ${item.id}`
                  }
                />

                <span>{item.name}</span>

              </button>
            ))}

          </div>

        </div>
      );
    }

    /* TRANSFORM */

    if (activeTool === "Transform") {
      return (
        <div className="panel-content">

          <div className="panel-heading">
            <span>↔️</span>
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

            <button
              onClick={() =>
                setShowCrop(true)
              }
            >
              ✂️
              <span>Crop</span>
            </button>

            <button onClick={resetAll}>
              ⟲
              <span>Reset</span>
            </button>

          </div>

          <div className="transform-info">

            Rotation:{" "}
            {((rotation % 360) + 360) % 360}
            °

            <br />

            Zoom: {zoom}%

          </div>

          <div className="slider-box">

            <div className="slider-header">

              <span>🔍 Zoom</span>

              <strong>{zoom}%</strong>

            </div>

            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) =>
                setZoom(
                  Number(e.target.value)
                )
              }
            />

          </div>

        </div>
      );
    }

    /* AI EDIT */

    if (activeTool === "AI Edit") {
      return (
        <div className="panel-content">

          <div className="panel-heading">

            <span>✨</span>

            <h2>
              AI Image Editor
            </h2>

          </div>

          <button
            className="ai-main-button"
            onClick={openFile}
          >
            📷 Upload Image
          </button>

          <div className="ai-divider">
            AI EDIT
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
            placeholder={
              "Example: Remove the background and put the person on a beach..."
            }
          />

          <button
            className="ai-generate-button"
            onClick={runAI}
            disabled={!image}
          >
            ✨ Prepare AI Edit
          </button>

          {aiResponse && (
            <div className="ai-response">
              {aiResponse}
            </div>
          )}

          <div className="ai-note">

            Real AI background removal,
            object removal, generative fill,
            image generation आदि के लिए
            AI API/backend connect करना होगा।

          </div>

        </div>
      );
    }

    /* ADJUST */

    return (
      <div className="panel-content">

        <div className="panel-heading">

          <span>⚙️</span>

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
          unit
