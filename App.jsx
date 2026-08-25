import React, { useRef, useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("pixora-image");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState(false);
  const [zoom, setZoom] = useState(100);

  const fileInput = useRef(null);
  const canvasRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const url = URL.createObjectURL(file);

    setImage(url);
    setFileName(file.name.split(".")[0]);

    resetEditing();
  };

  const resetEditing = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setRotation(0);
    setFlip(false);
    setZoom(100);
  };

  const rotateImage = () => {
    setRotation((prev) => prev + 90);
  };

  const downloadImage = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const angle = rotation % 360;

      if (angle === 90 || angle === 270) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      ctx.save();

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);

      if (flip) {
        ctx.scale(-1, 1);
      }

      ctx.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        grayscale(${grayscale}%)
      `;

      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );

      ctx.restore();

      const link = document.createElement("a");

      link.download = `${fileName}-pixora.png`;
      link.href = canvas.toDataURL("image/png");

      link.click();
    };

    img.src = image;
  };

  const toolClick = async (tool) => {
  if (!image) {
    alert("पहले image upload करें");
    return;
  }

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `You are Pixora AI image editor. 
The user selected the AI tool: ${tool}.
Explain what this tool should do to the uploaded image.`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI API error");
    }

    alert(data.text || "AI response received!");
  } catch (error) {
    alert("AI Error: " + error.message);
  }
};

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          Pixora <span>AI</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#tools">AI Tools</a>
          <a href="#editor">Editor</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="auth">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>

      </header>

      <main id="home">

        {/* HERO */}
        <section className="hero">

          <h1>
            AI Image Editing
            <br />
            <span>Made Simple</span>
          </h1>

          <p>
            Edit, enhance and transform your images with powerful
            AI-powered tools.
          </p>

          {/* UPLOAD */}
          <label className="uploadBox">

            <div className="uploadIcon">
              📸
            </div>

            <h2>
              {image ? "Image Uploaded ✓" : "Upload Your Image"}
            </h2>

            <p>
              Drag & drop your image here
              <br />
              or click to browse
            </p>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handleImage}
              hidden
            />

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
            >
              📤 Choose Image
            </button>

            <span>
              JPG • PNG • WEBP
            </span>

          </label>

        </section>

        {/* EDITOR */}
        {image && (
          <section className="editorSection" id="editor">

            <h2>🖌️ Image Editor</h2>

            <div className="editor">

              {/* IMAGE */}
              <div className="preview">

                <div className="previewImage">

                  <img
                    src={image}
                    alt="Pixora preview"
                    style={{
                      filter: `
                        brightness(${brightness}%)
                        contrast(${contrast}%)
                        saturate(${saturation}%)
                        grayscale(${grayscale}%)
                      `,
                      transform: `
                        rotate(${rotation}deg)
                        scaleX(${flip ? -1 : 1})
                        scale(${zoom / 100})
                      `
                    }}
                  />

                </div>

              </div>

              {/* CONTROLS */}
              <div className="controls">

                <h3>Adjust Image</h3>

                <label>
                  ☀️ Brightness
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) =>
                      setBrightness(Number(e.target.value))
                    }
                  />
                  <span>{brightness}%</span>
                </label>

                <label>
                  🌗 Contrast
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) =>
                      setContrast(Number(e.target.value))
                    }
                  />
                  <span>{contrast}%</span>
                </label>

                <label>
                  🎨 Saturation
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) =>
                      setSaturation(Number(e.target.value))
                    }
                  />
                  <span>{saturation}%</span>
                </label>

                <label>
                  ⚫ Grayscale
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={grayscale}
                    onChange={(e) =>
                      setGrayscale(Number(e.target.value))
                    }
                  />
                  <span>{grayscale}%</span>
                </label>

                <label>
                  🔎 Zoom
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={zoom}
                    onChange={(e) =>
                      setZoom(Number(e.target.value))
                    }
                  />
                  <span>{zoom}%</span>
                </label>

                <div className="editButtons">

                  <button onClick={rotateImage}>
                    🔄 Rotate
                  </button>

                  <button onClick={() => setFlip(!flip)}>
                    🪞 Flip
                  </button>

                  <button onClick={resetEditing}>
                    ↩️ Reset
                  </button>

                </div>

                <button
                  className="downloadButton"
                  onClick={downloadImage}
                >
                  💾 Download Image
                </button>

              </div>

            </div>

          </section>
        )}

        {/* AI TOOLS */}
        <section className="toolsSection" id="tools">

          <h2>⚡ Powerful AI Tools</h2>

          <p className="sectionSubtitle">
            Transform your images with next-generation AI.
          </p>

          <div className="toolsGrid">

            <div className="toolCard">
              <h3>🪄 Background Remover</h3>
              <p>
                Automatically remove image backgrounds.
              </p>
              <button onClick={() => toolClick("Background Remover")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>✨ AI Generative Fill</h3>
              <p>
                Add or replace objects using AI.
              </p>
              <button onClick={() => toolClick("Generative Fill")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>🗑️ Object Remover</h3>
              <p>
                Remove unwanted people and objects.
              </p>
              <button onClick={() => toolClick("Object Remover")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>🔍 AI Upscaler</h3>
              <p>
                Increase image resolution with AI.
              </p>
              <button onClick={() => toolClick("AI Upscaler")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>🌈 Image Enhancer</h3>
              <p>
                Improve lighting, colors and details.
              </p>
              <button onClick={() => toolClick("Image Enhancer")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>🎭 Background Changer</h3>
              <p>
                Change your image background with AI.
              </p>
              <button onClick={() => toolClick("Background Changer")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>👤 AI Portrait</h3>
              <p>
                Enhance portraits and faces.
              </p>
              <button onClick={() => toolClick("AI Portrait")}>
                Try Now
              </button>
            </div>

            <div className="toolCard">
              <h3>✏️ AI Image Editor</h3>
              <p>
                Edit your image using natural language.
              </p>
              <button onClick={() => toolClick("AI Image Editor")}>
                Try Now
              </button>
            </div>

          </div>

        </section>

        {/* FEATURES */}
        <section className="features">

          <h2>Why Choose Pixora AI?</h2>

          <div className="featureGrid">

            <div>
              <span>⚡</span>
              <h3>Fast</h3>
              <p>Process your images quickly.</p>
            </div>

            <div>
              <span>🤖</span>
              <h3>AI Powered</h3>
              <p>Advanced AI editing technology.</p>
            </div>

            <div>
              <span>🔒</span>
              <h3>Secure</h3>
              <p>Your images stay protected.</p>
            </div>

            <div>
              <span>📱</span>
              <h3>Mobile Friendly</h3>
              <p>Works on phone, tablet and desktop.</p>
            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div>
          <h3>Pixora AI</h3>
          <p>
            Next-generation AI image editing platform.
          </p>
        </div>

        <div>
          <h4>Product</h4>
          <p>AI Tools</p>
          <p>Image Editor</p>
          <p>Pricing</p>
        </div>

        <div>
          <h4>Company</h4>
          <p>About</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Legal</h4>
          <p>Privacy</p>
          <p>Terms</p>
        </div>

      </footer>

      {/* HIDDEN CANVAS FOR DOWNLOAD */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

    </div>
  );
        }
