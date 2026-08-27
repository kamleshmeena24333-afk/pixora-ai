import React, { useRef, useState, useEffect } from "react";
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  Sun,
  Contrast,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Eraser,
  Crop,
  Maximize,
  SlidersHorizontal,
  X,
  Check,
} from "lucide-react";
import removeBackground from "@imgly/background-removal";

export default function App() {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("pixora-image");

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [activeFilter, setActiveFilter] = useState("normal");
  const [removingBackground, setRemovingBackground] = useState(false);

  const [showCrop, setShowCrop] = useState(false);
  const [cropRatio, setCropRatio] = useState("free");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const [activeTool, setActiveTool] = useState("adjust");

  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const url = URL.createObjectURL(file);

    setImage(url);
    setFileName(file.name.replace(/\.[^/.]+$/, ""));

    resetEditing(false);
    setAiMessage("");
  };

  const resetEditing = (clearImage = false) => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setBlur(0);
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setZoom(100);
    setActiveFilter("normal");

    if (clearImage) {
      setImage(null);
      setFileName("pixora-image");
    }
  };

  const applyFilter = (filter) => {
    setActiveFilter(filter);

    if (filter === "normal") {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setGrayscale(0);
      setBlur(0);
    }

    if (filter === "vivid") {
      setBrightness(105);
      setContrast(120);
      setSaturation(145);
      setGrayscale(0);
    }

    if (filter === "warm") {
      setBrightness(105);
      setContrast(110);
      setSaturation(120);
      setGrayscale(0);
    }

    if (filter === "bw") {
      setBrightness(105);
      setContrast(115);
      setSaturation(0);
      setGrayscale(100);
    }

    if (filter === "cinematic") {
      setBrightness(95);
      setContrast(130);
      setSaturation(90);
      setGrayscale(15
