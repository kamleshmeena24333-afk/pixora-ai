import React, { useRef, useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

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
    setGrayscale(0);
    setRotation(0);
    setFlipX(1);
    setFlipY(1);
  };

  const downloadImage = () => {
    if (!image) return;

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const angle = ((rotation % 360) + 360) % 360;
      const rotated = angle === 90 || angle === 270;

      canvas.width = rotated ? img.height : img.width;
      canvas.height = rotated ? img.width : img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipX, flipY);

      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        blur(${blur}px)
        grayscale(${grayscale}%)
      `;

      ctx.drawImage(img, -img.width / 2, -img.height / 2);

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
    transform: `rotate(${rotation}deg) scaleX(${flipX}) scaleY(${flipY})`,
    maxWidth: "100%",
    maxHeight: "60vh",
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">✨ Pixora AI</div>

        <nav>
          <span>Home</span>
          <span>AI Tools</span>
          <span>Editor</span>
        </nav>
      </header>

      <main className="editor">
        <h1>AI Image Editor</h1>
        <p className="subtitle">
          Edit your photos quickly with Pixora AI
        </p>

        {!image ? (
          <div
            className="upload-box"
            onClick={() => fileInput.current?.click()}
          >
            <div className="upload-icon">📷</div>
            <h2>Upload an Image</h2>
            <p>JPG, PNG or WEBP</p>

            <button className="primary">
              Choose Image
            </button>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />
          </div>
        ) : (
          <>
            <section className="workspace">
              <div className="preview">
                <img
                  src={image}
                  alt="Pixora preview"
                  style={filterStyle}
                />
              </div>

              <aside className="controls">
                <h2>Adjust</h2>

                <label>
                  Brightness
                  <span>{brightness}%</span>
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

                <label>
                  Contrast
                  <span>{contrast}%</span>
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

                <label>
                  Saturation
                  <span>{saturation}%</span>
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

                <label>
                  Blur
                  <span>{blur}px</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) =>
                    setBlur(Number(e.target.value))
                  }
                />

                <label>
                  Grayscale
                  <span>{grayscale}%</span>
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

                <h2>Transform</h2>

                <div className="buttons">
                  <button onClick={() => setRotation(rotation - 90)}>
                    ↶ Rotate
                  </button>

                  <button onClick={() => setRotation(rotation + 90)}>
                    ↷ Rotate
                  </button>

                  <button onClick={() => setFlipX(flipX * -1)}>
                    ↔ Flip
                  </button>

                  <button onClick={() => setFlipY(flipY * -1)}>
                    ↕ Flip
                  </button>
                </div>

                <div className="actions">
                  <button onClick={resetEditor}>
                    Reset
                  </button>

                  <button
                    className="primary"
                    onClick={downloadImage}
                  >
                    ⬇ Download
                  </button>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>

      <footer>
        © 2026 Pixora AI — AI Image Editing Platform
      </footer>
    </div>
  );
}
