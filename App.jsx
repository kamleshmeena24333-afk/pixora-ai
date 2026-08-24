import React, { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app">

      <header className="header">
        <div className="logo">Pixora AI</div>

        <nav>
          <a href="#">Home</a>
          <a href="#">AI Tools</a>
          <a href="#">Pricing</a>
        </nav>

        <div className="auth">
          <button className="login">Login</button>
          <button className="signup">Sign Up</button>
        </div>
      </header>

      <main>

        <section className="hero">
          <h1>AI Image Editing Platform</h1>

          <p>
            Edit, enhance and transform your images with powerful AI tools.
          </p>

          <label className="uploadBox">
            <div className="uploadIcon">☁️</div>

            <h2>
              {image ? "Image Uploaded" : "Upload Your Image"}
            </h2>

            <p>
              Drag & drop your image here or click to upload
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            <span>JPG • PNG • WEBP</span>
          </label>

          {image && (
            <div className="preview">
              <img src={image} alt="Uploaded" />

              <div className="tools">
                <button>✨ AI Enhance</button>
                <button>🪄 Remove Background</button>
                <button>🎨 Background Change</button>
                <button>✏️ AI Edit</button>
              </div>
            </div>
          )}
        </section>

        <section className="toolsSection">

          <h2>Powerful AI Tools</h2>

          <div className="toolsGrid">

            <div className="toolCard">
              <h3>🪄 Background Remover</h3>
              <p>Remove image backgrounds automatically.</p>
              <button>Try Now</button>
            </div>

            <div className="toolCard">
              <h3>✨ AI Generative Fill</h3>
              <p>Add or replace objects using AI.</p>
              <button>Try Now</button>
            </div>

            <div className="toolCard">
              <h3>🗑️ Object Remover</h3>
              <p>Remove unwanted people or objects.</p>
              <button>Try Now</button>
            </div>

            <div className="toolCard">
              <h3>🔍 AI Upscaler</h3>
              <p>Increase image resolution with AI.</p>
              <button>Try Now</button>
            </div>

            <div className="toolCard">
              <h3>🌈 Image Enhancer</h3>
              <p>Improve lighting, colors and details.</p>
              <button>Try Now</button>
            </div>

            <div className="toolCard">
              <h3>🎭 Background Changer</h3>
              <p>Change your image background.</p>
              <button>Try Now</button>
            </div>

          </div>
        </section>

      </main>

      <footer>
        <div>
          <h3>Pixora AI</h3>
          <p>Next-generation AI image editing platform.</p>
        </div>

        <div>
          <h4>Product</h4>
          <p>AI Tools</p>
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

    </div>
  );
}
