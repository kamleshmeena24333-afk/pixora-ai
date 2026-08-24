import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Pixora AI</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#tools">AI Tools</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="nav-buttons">
          <button className="login">Login</button>
          <button className="primary-btn">Sign Up</button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="badge">✦ AI POWERED IMAGE EDITOR</span>

            <h1>
              Create, Edit & Enhance
              <span> Images With AI</span>
            </h1>

            <p>
              Transform your images with powerful AI tools. Remove
              backgrounds, erase objects, enhance photos and create amazing
              images.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn big-btn">
                Upload Image
              </button>

              <button className="secondary-btn">
                ✨ Try AI Generator
              </button>
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-icon">☁</div>

            <h3>Drag & drop your image here</h3>

            <p>or click to browse from your device</p>

            <div className="formats">
              JPG · PNG · WEBP
            </div>
          </div>
        </section>

        <section id="tools" className="tools-section">
          <div className="section-title">
            <span>POWERFUL AI TOOLS</span>
            <h2>Everything you need to edit images</h2>
            <p>
              Professional AI-powered tools designed for creators.
            </p>
          </div>

          <div className="tools-grid">
            <Tool
              icon="✂"
              title="Background Remover"
              text="Remove backgrounds automatically with AI."
            />

            <Tool
              icon="✨"
              title="AI Generative Fill"
              text="Add or replace elements in your images."
            />

            <Tool
              icon="⌫"
              title="Object Remover"
              text="Remove unwanted objects from photos."
            />

            <Tool
              icon="↗"
              title="AI Upscaler"
              text="Increase image resolution while preserving details."
            />

            <Tool
              icon="◉"
              title="Image Enhancer"
              text="Improve lighting, colors and image quality."
            />

            <Tool
              icon="▣"
              title="Background Changer"
              text="Create beautiful AI-generated backgrounds."
            />
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="section-title">
            <span>SIMPLE PRICING</span>
            <h2>Choose your plan</h2>
          </div>

          <div className="pricing-grid">
            <Plan
              name="Free"
              price="₹0"
              credits="50 credits"
            />

            <Plan
              name="Pro"
              price="₹999"
              credits="2,000 credits"
              popular
            />

            <Plan
              name="Business"
              price="₹2,999"
              credits="10,000 credits"
            />
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>Pixora AI</strong>
          <p>AI-powered image creation and editing platform.</p>
        </div>

        <div>
          <strong>Product</strong>
          <p>AI Tools</p>
          <p>Pricing</p>
        </div>

        <div>
          <strong>Legal</strong>
          <p>Privacy</p>
          <p>Terms</p>
        </div>
      </footer>
    </div>
  );
}

function Tool({ icon, title, text }) {
  return (
    <div className="tool-card">
      <div className="tool-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button>Try Now →</button>
    </div>
  );
}

function Plan({ name, price, credits, popular }) {
  return (
    <div className={`plan ${popular ? "popular" : ""}`}>
      {popular && <div className="popular-badge">MOST POPULAR</div>}

      <h3>{name}</h3>
      <div className="price">{price}</div>
      <p>{credits}</p>

      <ul>
        <li>✓ AI image tools</li>
        <li>✓ Image downloads</li>
        <li>✓ My Projects</li>
      </ul>

      <button className="primary-btn">Choose Plan</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
