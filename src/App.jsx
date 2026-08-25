import React, { useRef, useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const fileInput = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const resetEditor = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setGrayscale(0);
  };

  const downloadImage = () => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        blur(${blur}px)
        grayscale(${grayscale}%)
      `;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.drawImage(
        img,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      const link = document.createElement("a");
      link.download = "pixora-ai-edited.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = image;
  };

  const filterStyle = {
    filter: `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      blur(${blur}px)
      grayscale(${grayscale}%)
    `,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>✦</span> Pixora AI
        </div>

        <div className="header-right">
          <span className="status">AI Image Editor</span>
        </div>
      </header>

      <main className="editor">

        <section className="top-section">
          <div>
            <h1>AI Image Editor</h1>
            <p>
              Edit your photos with powerful Pixora AI tools.
            </p>
          </div>

          <button
            className="upload-btn"
            onClick={() => fileInput.current?.click()}
          >
            📁 Upload Image
          </button>

          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleImage}
            hidden
          />
        </section>

        <section className="workspace">

          <div className="preview-area">

            {!image ? (
              <div
                className="upload-box"
                onClick={() => fileInput.current?.click()}
              >
                <div className="upload-icon">🖼️</div>

                <h2>Upload an Image</h2>

                <p>
                  Select a JPG, PNG or WEBP image
                </p>

                <button className="choose-btn">
                  Choose Image
                </button>
              </div>
            ) : (
              <div className="image-container">
                <img
                  src={image}
                  alt="Pixora preview"
                  style={filterStyle}
                />
              </div>
            )}

          </div>

          <aside className="tools">

            <div className="tools-title">
              <h2>Editing Tools</h2>

              <button
                className="reset-btn"
                onClick={resetEditor}
              >
                ↻ Reset
              </button>
            </div>

            <div className="tool-group">

              <label>
                ☀️ Brightness
                <strong>{brightness}%</strong>
              </label>

              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) =>
                  setBrightness(Number(e.target.value))
                }
              />

            </div>

            <div className="tool-group">

              <label>
                ◐ Contrast
                <strong>{contrast}%</strong>
              </label>

              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) =>
                  setContrast(Number(e.target.value))
                }
              />

            </div>

            <div className="tool-group">

              <label>
                🎨 Saturation
                <strong>{saturation}%</strong>
              </label>

              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) =>
                  setSaturation(Number(e.target.value))
                }
              />

            </div>

            <div className="tool-group">

              <label>
                🌫️ Blur
                <strong>{blur}px</strong>
              </label>

              <input
                type="range"
                min="0"
                max="10"
                value={blur}
                onChange={(e) =>
                  setBlur(Number(e.target.value))
                }
              />

            </div>

            <div className="tool-group">

              <label>
                ⚫ Black & White
                <strong>{grayscale}%</strong>
              </label>

              <input
                type="range"
                min="0"
                max="100"
                value={grayscale}
                onChange={(e) =>
                  setGrayscale(Number(e.target.value))
                }
              />

            </div>

            <div className="rotate-section">

              <h3>↻ Rotate</h3>

              <div className="rotate-buttons">

                <button
                  onClick={() =>
                    setRotation((r) => r - 90)
                  }
                >
                  ↺ Left
                </button>

                <button
                  onClick={() =>
                    setRotation((r) => r + 90)
                  }
                >
                  ↻ Right
                </button>

              </div>

            </div>

            <div className="actions">

              <button
                className="ai-btn"
                onClick={() =>
                  alert(
                    "AI tools will be connected in the next version."
                  )
                }
              >
                ✨ AI Tools
              </button>

              <button
                className="download-btn"
                disabled={!image}
                onClick={downloadImage}
              >
                ⬇️ Download Image
              </button>

            </div>

          </aside>

        </section>

        <section className="ai-features">

          <h2>Pixora AI Tools</h2>

          <div className="feature-grid">

            <div className="feature-card">
              <div>✨</div>
              <h3>AI Enhance</h3>
              <p>
                Automatically improve image quality.
              </p>
            </div>

            <div className="feature-card">
              <div>🪄</div>
              <h3>Background Remove</h3>
              <p>
                Remove backgrounds using AI.
              </p>
            </div>

            <div className="feature-card">
              <div>🎭</div>
              <h3>AI Filters</h3>
              <p>
                Create unique artistic effects.
              </p>
            </div>

            <div className="feature-card">
              <div>🧠</div>
              <h3>AI Image Generator</h3>
              <p>
                Create images from text prompts.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer>
        <p>
          © 2026 Pixora AI • AI Image Editing Platform
        </p>
      </footer>

    </div>
  );
                               }
