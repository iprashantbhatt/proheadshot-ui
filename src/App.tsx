import { useState } from 'react';
import { UploadZone, StyleSelector, Button, ComparisonView } from './components';
import { STYLE_PRESETS } from './styles';
import { generateImage } from './mock';
import { GenerationStatus } from './types';
import { Wand2, RefreshCw } from 'lucide-react';

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [styleId, setStyleId] = useState<string>(STYLE_PRESETS[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);

  const generate = async () => {
    if (!originalImage) return;
    setStatus(GenerationStatus.GENERATING);

    const style = STYLE_PRESETS.find((s) => s.id === styleId);
    const prompt = customPrompt || style?.prompt || '';

    const result = await generateImage(originalImage, prompt);
    setGeneratedImage(result);
    setStatus(GenerationStatus.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">
          ProHeadshot <span className="text-indigo-400">UI</span>
        </h1>

        {!originalImage && <UploadZone onImageSelected={setOriginalImage} />}

        {originalImage && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <img src={originalImage} className="rounded-2xl border border-zinc-800" />

              <StyleSelector selectedStyleId={styleId} onSelect={setStyleId} />

              <textarea
                placeholder="Optional custom prompt..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full h-28 rounded-xl bg-zinc-900 border border-zinc-800 p-4"
              />

              <Button
                onClick={generate}
                isLoading={status === GenerationStatus.GENERATING}
                icon={
                  generatedImage ? <RefreshCw size={16} /> : <Wand2 size={16} />
                }
              >
                {generatedImage ? 'Regenerate' : 'Generate'}
              </Button>
            </div>

            {generatedImage && (
              <ComparisonView
                originalImage={originalImage}
                generatedImage={generatedImage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
