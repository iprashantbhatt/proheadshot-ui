import React, { useState, useRef } from 'react';
import { UploadZone } from './components/UploadZone';
import { StyleSelector } from './components/StyleSelector';
import { ComparisonView } from './components/ComparisonView';
import { generateEditedImage } from './services/geminiService';
import { STYLE_PRESETS } from './constants';
import { GenerationStatus } from './types';
import { Heart, Download, Maximize2, X, Sparkles } from 'lucide-react';

const App = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(STYLE_PRESETS[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageSelected = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setStatus(GenerationStatus.IDLE);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setStatus(GenerationStatus.GENERATING);
    setError(null);

    try {
      let finalPrompt = '';
      if (customPrompt.trim()) {
        finalPrompt = customPrompt.trim();
      } else if (selectedStyleId) {
        const style = STYLE_PRESETS.find(s => s.id === selectedStyleId);
        if (style) finalPrompt = style.prompt;
      } else {
        finalPrompt = "Enhance this image to look more professional.";
      }

      const result = await generateEditedImage(originalImage, finalPrompt);
      setGeneratedImage(result);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Failed to generate image.");
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pro-headshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      
      {/* Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-500/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-semibold mb-2 text-white">ProHeadshot</h1>
        <p className="text-gray-400">Professional Headshots. Reimagined.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        
        {/* Upload Card */}
        <div className="glass rounded-2xl p-6 text-center flex flex-col">
          <h2 className="text-lg font-medium mb-4 text-white">Upload an Image</h2>
          <UploadZone onImageSelected={handleImageSelected} currentImage={originalImage} />
          {originalImage && (
            <button 
              onClick={() => setOriginalImage(null)}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm text-zinc-300"
            >
              Clear Image
            </button>
          )}
        </div>

        {/* Style Selector */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-medium mb-4 text-center text-white">Choose a Style</h2>
          <StyleSelector 
            selectedStyleId={selectedStyleId} 
            onSelect={(id) => {
              setSelectedStyleId(id);
              setCustomPrompt('');
            }} 
          />
          
          <div className="text-center text-gray-400 text-sm my-4 font-medium">OR</div>
          
          <input
            type="text"
            placeholder="Describe your edit..."
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              if (e.target.value) setSelectedStyleId(null);
            }}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:border-blue-400 text-zinc-200 placeholder-zinc-500 transition-all"
          />
        </div>

        {/* Preview Card */}
        <div className="glass rounded-2xl p-6 flex flex-col relative">
          <ComparisonView 
            originalImage={originalImage} 
            generatedImage={generatedImage} 
            status={status}
          />

          <div className="mt-6 flex flex-col gap-3">
            <button 
              disabled={!originalImage || status === GenerationStatus.GENERATING}
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 transition font-medium text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {status === GenerationStatus.GENERATING ? 'Generating...' : 'Generate Headshot'}
            </button>

            {generatedImage && (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium text-white flex items-center justify-center gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  View Large
                </button>
                <button 
                  onClick={handleDownload}
                  className="py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>
          
          {error && <p className="text-red-400 text-[10px] mt-2 text-center">{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-500 text-xs">
          <span>Developed with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 mx-0.5" />
          <span>by</span>
          <a 
            href="https://www.prashantbhatt.net" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-zinc-200 ml-1 hover:text-blue-400 transition-colors underline decoration-zinc-800 underline-offset-2"
          >
            Prashant Bhatt
          </a>
        </div>
      </footer>

      {/* Modal for Large View */}
      {isModalOpen && generatedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-[70]"
            onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={generatedImage} 
              alt="Generated Headshot Large" 
              className="max-w-full max-h-full rounded-2xl shadow-2xl shadow-blue-500/20 object-contain animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
