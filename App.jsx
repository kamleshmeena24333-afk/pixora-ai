import React, { useRef, useState } from "react";
import removeBackground from "@imgly/background-removal";
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  RefreshCcw,
  ZoomIn,
  ZoomOut,
  Sun,
  Contrast,
  Palette,
  Image as ImageIcon,
  Eraser,
  Sparkles,
  Wand2,
  Loader2,
  X,
  Check,
  Languages,
} from "lucide-react";

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

  const [removingBackground, setRemovingBackground] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [language, setLanguage] = useState("en");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");

  const fileInput = useRef(null);
  const canvasRef = useRef(null);

  const t = {
    en: {
      home: "Home",
      tools: "AI Tools",
      editor: "Editor",
      pricing: "Pricing",
      login: "Login",
      signup: "Sign Up",
      title: "AI Image Editing",
      made: "Made Simple",
      subtitle:
        "Edit, enhance and transform your images with powerful AI-powered tools.",
      upload: "Upload Your Image",
      uploaded: "Image Uploaded ✓",
      choose: "Choose Image",
      formats: "JPG • PNG • WEBP",
      editorTitle: "Image Editor",
      aiTools: "AI Tools",
      removeBg: "Remove Background",
      removing: "Removing background...",
      adjust: "Adjust Image",
      brightness: "Brightness",
      contrast: "Contrast",
      saturation: "Saturation",
      grayscale: "Grayscale",
      rotate: "Rotate",
      flip: "Flip",
      zoom: "Zoom",
      reset: "Reset",
      download: "Download Image",
      aiEdit: "AI Edit",
      promptPlaceholder:
        "Describe what you want to do with this image...",
      runAI: "Run AI",
      close: "Close",
      ready: "Your image is ready!",
    },

    hi: {
      home: "होम",
      tools: "AI टूल्स",
      editor: "एडिटर",
      pricing: "प्राइसिंग",
      login: "लॉगिन",
      signup: "साइन अप",
      title: "AI Image Editing",
      made: "आसान बनाया गया",
      subtitle:
        "शक्तिशाली AI टूल्स की मदद से अपनी इमेज को एडिट, एन्हांस और ट्रांसफॉर्म करें।",
      upload: "अपनी इमेज अपलोड करें",
      uploaded: "इमेज अपलोड हो गई ✓",
      choose: "इमेज चुनें",
      formats: "JPG • PNG • WEBP",
      editorTitle: "इमेज एडिटर",
      aiTools: "AI टूल्स",
      removeBg: "Background हटाएं",
      removing: "Background हट रहा है...",
      adjust: "इमेज Adjust करें",
      brightness: "Brightness",
      contrast: "Contrast",
      saturation: "Saturation",
      grayscale: "Grayscale",
      rotate: "Rotate",
      flip: "Flip",
      zoom: "Zoom",
      reset: "Reset",
      download: "इमेज Download करें",
      aiEdit: "AI Edit",
      promptPlaceholder:
        "इमेज में क्या बदलाव करना है, यहां लिखें...",
      runAI: "AI चलाएं",
      close: "बंद करें",
      ready: "आपकी इमेज तैयार है!",
    },
  }[language];

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        language === "hi"
          ? "कृपया केवल image file चुनें।"
          : "Please select an image file."
      );
      return;
    }

    const url = URL.createObjectURL(file);

    setImage(url);
    setFileName(file.name.split(".")[0] || "pixora-image");

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

  const flipImage = () => {
    setFlip((prev) => !prev);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleRemoveBackground = async () => {
    if (!image || removingBackground) return;

    try {
      setRemovingBackground(true);

      const blob = await removeBackground(image);

      const newUrl = URL.createObjectURL(blob);

      setImage(newUrl);
      setAiMessage(
        language === "hi"
          ? "Background सफलतापूर्वक हटा दिया गया।"
          : "Background removed successfully."
      );
    } catch (error) {
      console.error("Background removal failed:", error);

      alert(
        language === "hi"
          ? "Background remove नहीं हो पाया। कृपया दोबारा कोशिश करें।"
          : "Background removal failed. Please try again."
      );
    } finally {
      setRemovingBackground(false);
    }
  };

  const getImageFilter = () => {
    return `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      grayscale(${grayscale}%)
    `;
  };

  const getImageTransform = () => {
    return `
      rotate(${rotation}deg)
      scaleX(${flip ? -1 : 1})
      scale(${zoom / 100})
    `;
  };

  const downloadImage = () => {
    if (!image) {
      alert(
        language === "hi"
          ? "पहले इमेज upload करें।"
          : "Please upload an image first."
      );
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const angle = ((rotation % 360) + 360) % 360;

      if (angle === 90 || angle === 270) {
        canvas.width = img.height * (zoom / 100);
        canvas.height = img.width * (zoom / 100);
      } else {
        canvas.width = img.width * (zoom / 100);
        canvas.height = img.height * (zoom / 100);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

      const scale = zoom / 100;

      ctx.drawImage(
        img,
        (-img.width * scale) / 2,
        (-img.height * scale) / 2,
        img.width * scale,
        img.height * scale
      );

      ctx.restore();

      const link = document.createElement("a");

      link.download = `${fileName}-pixora.png`;

      link.href = canvas.toDataURL("image/png");

      link.click();

      setAiMessage(t.ready);
    };

    img.onerror = () => {
      alert(
        language === "hi"
          ? "इमेज download करने में समस्या हुई।"
          : "There was a problem downloading the image."
      );
    };

    img.src = image;
  };

  const runAI = async () => {
    if (!image) {
      alert(
        language === "hi"
          ? "पहले image upload करें।"
          : "Please upload an image first."
      );
      return;
    }

    if (!aiPrompt.trim()) {
      alert(
        language === "hi"
          ? "AI को बताएं कि image में क्या बदलाव करना है।"
          : "Tell AI what you want to change in the image."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiMessage("");

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `
You are Pixora AI, an advanced AI image editing assistant.

The user wants to edit an uploaded image.

User request:
${aiPrompt}

Explain the exact image editing operation that should be performed.

Return a short, clear instruction for the image editor.
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI API error");
      }

      setAiMessage(
        data?.text ||
          (language === "hi"
            ? "AI response प्राप्त हुआ।"
            : "AI response received.")
      );
    } catch (error) {
      console.error(error);

      setAiMessage(
        language === "hi"
          ? `AI Error: ${error.message}`
          : `AI Error: ${error.message}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAiPrompt("");
    setAiMessage("");
    resetEditing();

    if (fileInput.current) {
      fileInput.current.value = "";
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
          <a href="#home">{t.home}</a>
          <a href="#tools">{t.tools}</a>
          <a href="#editor">{t.editor}</a>
          <a href="#pricing">{t.pricing}</a>
        </nav>

        <div className="headerActions">
          <button
            className="languageButton"
            onClick={() =>
              setLanguage((prev) => (prev === "en" ? "hi" : "en"))
            }
            title="Change language"
          >
            <Languages size={18} />
            {language === "en" ? "हिंदी" : "English"}
          </button>

          <button className="login">{t.login}</button>

          <button className="signup">{t.signup}</button>
        </div>
      </header>

      {/* HERO */}
      <main id="home">
        <section className="hero">
          <div className="heroContent">
            <div className="badge">
              <Sparkles size={16} />
              AI POWERED
            </div>

            <h1>
              {t.title}
              <br />
              <span>{t.made}</span>
            </h1>

            <p>{t.subtitle}</p>
          </div>

          {/* UPLOAD */}
          {!image && (
            <label className="uploadBox">
              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImage}
                hidden
              />

              <div className="uploadIcon">
                <Upload size={34} />
              </div>

              <h2>{t.upload}</h2>

              <p>{t.formats}</p>

              <button
                type="button"
                className="chooseButton"
                onClick={() => fileInput.current?.click()}
              >
                <Upload size={18} />
                {t.choose}
              </button>
            </label>
          )}
        </section>

        {/* EDITOR */}
        {image && (
          <section className="editorSection" id="editor">
            <div className="sectionTitle">
              <h2>
                <Wand2 size={24} />
                {t.editorTitle}
              </h2>

              <button className="clearButton" onClick={clearImage}>
                <X size={18} />
                {t.close}
              </button>
            </div>

            <div className="editorLayout">
              {/* IMAGE PREVIEW */}
              <div className="previewPanel">
                <div className="previewHeader">
                  <span>
                    <ImageIcon size={18} />
                    Pixora Preview
                  </span>
                </div>

                <div className="previewImage">
                  <img
                    src={image}
                    alt="Pixora preview"
                    style={{
                      filter: getImageFilter(),
                      transform: getImageTransform(),
                    }}
                  />
                </div>

                <div className="previewActions">
                  <button onClick={downloadImage}>
                    <Download size={18} />
                    {t.download}
                  </button>

                  <button onClick={resetEditing}>
                    <RefreshCcw size={18} />
                    {t.reset}
                  </button>
                </div>
              </div>

              {/* CONTROLS */}
              <div className="controlsPanel">
                {/* AI TOOLS */}
                <div className="toolCard">
                  <h3>
                    <Sparkles size={20} />
                    {t.aiTools}
                  </h3>

                  <button
                    className="aiToolButton"
                    onClick={handleRemoveBackground}
                    disabled={removingBackground}
                  >
                    {removingBackground ? (
                      <>
                        <Loader2 className="spin" size={18} />
                        {t.removing}
                      </>
                    ) : (
                      <>
                        <Eraser size={18} />
                        {t.removeBg}
                      </>
                    )}
                  </button>
                </div>

                {/* AI PROMPT */}
                <div className="toolCard">
                  <h3>
                    <Sparkles size={20} />
                    {t.aiEdit}
                  </h3>

                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={t.promptPlaceholder}
                    rows="4"
                  />

                  <button
                    className="aiRunButton"
                    onClick={runAI}
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="spin" size={18} />
                        AI...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        {t.runAI}
                      </>
                    )}
                  </button>

                  {aiMessage && (
                    <div className="aiMessage">
                      <Check size={18} />
                      <span>{aiMessage}</span>
                    </div>
                  )}
                </div>

                {/* ADJUST IMAGE */}
                <div className="toolCard">
                  <h3>
                    <Palette size={20} />
                    {t.adjust}
                  </h3>

                  {/* BRIGHTNESS */}
                  <div className="control">
                    <div className="controlLabel">
                      <span>
                        <Sun size={17} />
                        {t.brightness}
                      </span>

                      <b>{brightness}%</b>
                    </div>

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

                  {/* CONTRAST */}
                  <div className="control">
                    <div className="controlLabel">
                      <span>
                        <Contrast size={17} />
                        {t.contrast}
                      </span>

                      <b>{contrast}%</b>
                    </div>

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

                  {/* SATURATION */}
                  <div className="control">
                    <div className="controlLabel">
                      <span>
                        <Palette size={17} />
                        {t.saturation}
                      </span>

                      <b>{saturation}%</b>
                    </div>

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

                  {/* GRAYSCALE */}
                  <div className="control">
                    <div className="controlLabel">
                      <span>
                        <Contrast size={17} />
                        {t.grayscale}
                      </span>

                      <b>{grayscale}%</b>
                    </div>

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

                  {/* TRANSFORM BUTTONS */}
                  <div className="buttonGrid">
                    <button onClick={rotateImage}>
                      <RotateCw size={18} />
                      {t.rotate}
                    </button>

                    <button onClick={flipImage}>
                      <FlipHorizontal size={18} />
                      {t.flip}
                    </button>

                    <button onClick={zoomOut}>
                      <ZoomOut size={18} />
                      -
                    </button>

                    <button onClick={zoomIn}>
                      <ZoomIn size={18} />
                      +
                    </button>
                  </div>

                  <div className="zoomInfo">
                    {t.zoom}: <b>{zoom}%</b>
                  </div>
                </div>

                {/* DOWNLOAD */}
                <button
                  className="downloadButton"
                  onClick={downloadImage}
                >
                  <Download size={20} />
                  {t.download}
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />
          </section>
        )}

        {/* FEATURES */}
        <section className="features" id="tools">
          <div className="featureCard">
            <Sparkles size={28} />
            <h3>AI Editing</h3>
            <p>
              Powerful AI tools for modern image editing.
            </p>
          </div>

          <div className="featureCard">
            <Eraser size={28} />
            <h3>Background Removal</h3>
            <p>
              Remove image backgrounds directly in your browser.
            </p>
          </div>

          <div className="featureCard">
            <ImageIcon size={28} />
            <h3>Image Enhancement</h3>
            <p>
              Adjust brightness, contrast, saturation and more.
            </p>
          </div>

          <div className="featureCard">
            <Download size={28} />
            <h3>High Quality Export</h3>
            <p>
              Download your edited image as PNG.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section className="pricing" id="pricing">
          <h2>Pixora AI</h2>

          <p>
            Powerful image editing tools in one simple editor.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <strong>Pixora AI</st
