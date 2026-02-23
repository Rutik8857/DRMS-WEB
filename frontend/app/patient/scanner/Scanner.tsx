"use client";

import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";
import Tesseract from "tesseract.js";

const Scanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [extractedText, setExtractedText] = useState("");

  // 📤 Upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult("");
      setExtractedText("");
    }
  };

  // 🔍 OCR SCAN
  const handleScan = async () => {
    if (!image) return;

    setProcessing(true);
    setResult("Scanning image...");

    try {
      const { data } = await Tesseract.recognize(image, "eng");
      setExtractedText(data.text);
      setResult(data.text);
    } catch {
      setResult("Error scanning image");
    }

    setProcessing(false);
  };

  // 🇮🇳 HINDI TRANSLATE
  const translateToHindi = async () => {
    if (!extractedText) return;

    setProcessing(true);
    setResult("Translating to Hindi...");

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(
          extractedText
        )}`
      );

      const data = await res.json();
      const hindi = data[0].map((item: any) => item[0]).join("");

      setResult(
`🧾 ENGLISH:
${extractedText}

🇮🇳 HINDI:
${hindi}`
      );
    } catch {
      setResult("Translation failed");
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Medical Document Scanner
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-center relative">
            {image ? (
              <img src={image} alt="preview" className="max-h-64 rounded shadow" />
            ) : (
              <>
                <Upload size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600">Click to upload image</p>
              </>
            )}
            <input
              type="file"
              onChange={handleUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* SCAN BUTTON */}
          <button
            onClick={handleScan}
            disabled={!image || processing}
            className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {processing ? "Processing..." : "Extract Text"}
          </button>

          {/* TRANSLATE BUTTON */}
          <button
            onClick={translateToHindi}
            disabled={!extractedText || processing}
            className="w-full py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
          >
            Translate to Hindi
          </button>
        </div>

        {/* RIGHT SIDE RESULT */}
        <div className="bg-white border rounded-xl p-6 shadow-sm h-[450px] flex flex-col">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <FileText size={20} className="mr-2 text-blue-500" />
            Result
          </h3>

          {result ? (
            <div className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-y-auto flex-1">
              {result}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Scan output will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
