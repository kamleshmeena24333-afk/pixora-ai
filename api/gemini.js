export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST method is allowed"
    });
  }

  try {
    const { prompt, image, mimeType } = req.body || {};

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured"
      });
    }

    const input = [];

    // Text instruction
    input.push({
      type: "text",
      text: prompt
    });

    // Uploaded image
    if (image) {
      const cleanBase64 = image.includes(",")
        ? image.split(",")[1]
        : image;

      input.push({
        type: "image",
        mime_type: mimeType || "image/jpeg",
        data: cleanBase64
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-image",
          input,
          response_format: {
            type: "image",
            image_size: "1K"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API error"
      });
    }

    // New image
    if (data?.output_image?.data) {
      return res.status(200).json({
        image: `data:${data.output_image.mime_type || "image/png"};base64,${data.output_image.data}`,
        text: data.output_text || ""
      });
    }

    // Fallback: search through model output steps
    for (const step of data?.steps || []) {
      for (const block of step?.content || []) {
        if (block?.type === "image" && block?.data) {
          return res.status(200).json({
            image: `data:${block.mime_type || "image/png"};base64,${block.data}`,
            text: data.output_text || ""
          });
        }
      }
    }

    return res.status(500).json({
      error: "Gemini did not return an edited image"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
    }
