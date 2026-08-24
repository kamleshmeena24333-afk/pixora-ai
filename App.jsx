import React, { useRef, useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [activeTool, setActiveTool] = useState("Original");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const fileInput = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);

    setActiveTool("Original");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setScale(1);
  };

  const resetImage = () => {
    setActiveTool("Original");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setScale(1);
  };

  const enhance = () => {
    setActiveTool("AI Enhance");
    setBrightness(108);
    setContrast(115);
    setSaturation(110);
    setBlur(0);
  };

  const grayscale = () => {
    setActiveTool("Grayscale");
    setSaturation(0);
  };

  const sepia = () => {
    setActiveTool("Sepia");
  };

  const downloadImage = () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

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
      `;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const drawWidth = canvas.width * scale;
      const drawHeight = canvas.height * scale;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      const link = document.createElement("a");
      link.download = "pixora-ai-edited.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.src = image;
  };

  const tools = [
    {
      name: "AI Enhance",
      icon: "✨",
      action: enhance,
    },
    {
      name: "Background Remover",
      icon: "🪄",
      action: () => alert("AI Background Remover API will be connected next."),
    },
    {
      name: "Object Remover",
      icon: "🗑️",
      action: () => alert("AI Object Remover API will be connected next."),
    },
    {
      name: "AI Upscaler",
      icon: "🔍",
      action: () => {
        setActiveTool("AI Upscaler");
        setScale(1.5);
      },
    },
    {
      name: "Background Changer",
      icon: "🌈",
      action: () => alert("AI Background Changer API will be connected next."),
    },
    {
      name: "Face Retouch",
      icon: "😊",
      action: () => alert("AI Face Retouch API will be connected next."),
    },
    {
      name: "Grayscale",
      icon: "⚫",
      action: grayscale,
    },
    {
      name: "Sepia",
      icon: "🟤",
      action: sepia,
    },
  ];

  const imageStyle = {
    filter:
      activeTool === "Sepia"
        ? `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(80%)`
        : `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,

    transform: `rotate(${rotation}deg) scale(${scale})`,
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          <span className="logoIcon">✦</span>
          Pixora <b>AI</b>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#editor">AI Editor</a>
          <a href="#tools">AI Tools</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="auth">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>

      </header>

      {/* HERO */}
      <main id="home">

        <section className="hero">

          <div className="heroContent">

            <div className="badge">
              ✨ NEXT-GENERATION AI IMAGE EDITOR
            </div>

            <h1>
              Create Amazing Images
              <span> With AI</span>
            </h1>

            <p>
              Edit, enhance, transform and create stunning images
              with powerful artificial intelligence.
            </p>

            <button
              className="heroButton"
              onClick={() => fileInput.current?.click()}
            >
              🚀 Start Editing
            </button>

          </div>

        </section>

        {/* EDITOR */}
        <section className="editorSection" id="editor">

          <div className="sectionTitle">
            <span>AI POWERED</span>
            <h2>Professional Image Editor</h2>
            <p>Upload your image and start creating.</p>
          </div>

          {!image ? (

            <label className="uploadBox">

              <div className="uploadIcon">☁️</div>

              <h2>Upload Your Image</h2>

              <p>
                Drag & drop your image here
              </p>

              <button
                type="button"
                onClick={() => fileInput.current?.click()}
              >
                Choose Image
              </button>

              <small>
                JPG • PNG • WEBP
              </small>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                onChange={handleImage}
              />

            </label>

          ) : (

            <div className="editor">

              {/* TOOLBAR */}
              <div className="editorToolbar">

                <button onClick={resetImage}>
                  ↩ Reset
                </button>

                <button onClick={() => setRotation(rotation - 90)}>
                  ↶ Rotate
                </button>

                <button onClick={() => setRotation(rotation + 90)}>
                  ↷ Rotate
                </button>

                <button onClick={downloadImage} className="download">
                  ⬇ Download
                </button>

              </div>

              {/* CANVAS */}
              <div className="canvasArea">

                <div className="imageCanvas">

                  <img
                    src={image}
                    alt="Uploaded"
                    style={imageStyle}
                  />

                </div>

              </div>

              {/* CONTROLS */}
              <div className="controls">

                <h3>🎛 Adjust Image</h3>

                <label>
                  Brightness
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) =>
                      setBrightness(e.target.value)
                    }
                  />
                </label>

                <label>
                  Contrast
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) =>
                      setContrast(e.target.value)
                    }
                  />
                </label>

                <label>
                  Saturation
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) =>
                      setSaturation(e.target.value)
                    }
                  />
                </label>

                <label>
                  Blur
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={blur}
                    onChange={(e) =>
                      setBlur(e.target.value)
                    }
                  />
                </label>

              </div>

              {/* AI TOOLS */}
              <div className="editorTools">

                <h3>✨ AI Tools</h3>

                <div className="miniTools">

                  {tools.map((tool) => (

                    <button
                      key={tool.name}
                      onClick={tool.action}
                    >
                      <span>{tool.icon}</span>
                      {tool.name}
                    </button>

                  ))}

                </div>

              </div>

            </div>

          )}

        </section>

        {/* AI TOOLS */}
        <section className="toolsSection" id="tools">

          <div className="sectionTitle">

            <span>POWERFUL AI</span>

            <h2>Everything You Need</h2>

            <p>
              Professional AI image editing tools in one place.
            </p>

          </div>

          <div className="toolsGrid">

            {tools.map((tool) => (

              <div className="toolCard" key={tool.name}>

                <div className="toolIcon">
                  {tool.icon}
                </div>

                <h3>{tool.name}</h3>

                <p>
                  Powerful AI technology to transform
                  your images instantly.
                </p>

                <button onClick={() => {

                  if (!image) {
                    alert("Please upload an image first.");
                    return;
                  }

                  tool.action();

                }}>
                  Try Now →
                </button>

              </div>

            ))}

          </div>

        </section>

        {/* PRICING */}
        <section className="pricing" id="pricing">

          <div className="sectionTitle">

            <span>SIMPLE PRICING</span>

            <h2>Choose Your Plan</h2>

          </div>

          <div className="pricingGrid">

            <div className="priceCard">

              <h3>Free</h3>

              <div className="price">
                ₹0
                <small>/month</small>
              </div>

              <p>✓ Basic image editing</p>
              <p>✓ Limited AI tools</p>
              <p>✓ Standard download</p>

              <button>Start Free</button>

            </div>

            <div className="priceCard premium">

              <div className="popular">
                MOST POPULAR
              </div>

              <h3>Pro</h3>

              <div className="price">
                ₹299
                <small>/month</small>
              </div>

              <p>✓ Unlimited editing</p>
              <p>✓ AI Background Removal</p>
              <p>✓ AI Object Removal</p>
              <p>✓ HD Upscaling</p>
              <p>✓ Premium downloads</p>

              <button>Upgrade Pro</button>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div>
          <h2>Pixora AI</h2>

          <p>
            Next-generation AI image editing platform.
          </p>

          <p>
            © 2026 Pixora AI. All rights reserved.
          </p>

        </div>

        <div>
          <h3>Product</h3>
          <p>AI Editor</p>
          <p>AI Tools</p>
          <p>Pricing</p>
        </div>

        <div>
          <h3>Company</h3>
          <p>About</p>
          <p>Contact</p>
        </div>

        <div>
          <h3>Legal</h3>
          <p>Privacy</p>
          <p>Terms</p>
        </div>

      </footer>

    </div>
  );
        }
