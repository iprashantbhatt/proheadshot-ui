import { STYLE_PRESETS } from './styles';
import { Wand2, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

export const UploadZone = ({
  onImageSelected,
}: {
  onImageSelected: (img: string) => void;
}) => (
  <label className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-700 rounded-3xl cursor-pointer bg-zinc-900/40 hover:bg-zinc-900 transition">
    <Sparkles className="w-10 h-10 mb-4 opacity-40" />
    <span className="text-zinc-400">Click to upload image</span>
    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onImageSelected(reader.result as string);
        reader.readAsDataURL(file);
      }}
    />
  </label>
);

export const StyleSelector = ({
  selectedStyleId,
  onSelect,
}: {
  selectedStyleId: string | null;
  onSelect: (id: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-3">
    {STYLE_PRESETS.map((s) => (
      <button
        key={s.id}
        onClick={() => onSelect(s.id)}
        className={`rounded-xl border px-3 py-2 text-sm ${
          selectedStyleId === s.id
            ? 'border-indigo-500 text-white'
            : 'border-zinc-700 text-zinc-400'
        }`}
      >
        {s.name}
      </button>
    ))}
  </div>
);

export const Button = ({
  children,
  onClick,
  isLoading,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl py-4 text-white font-medium"
  >
    {icon}
    {children}
  </button>
);

export const ComparisonView = ({
  originalImage,
  generatedImage,
}: {
  originalImage: string;
  generatedImage: string;
}) => (
  <div className="grid grid-cols-2 gap-4">
    <img src={originalImage} className="rounded-2xl border border-zinc-800" />
    <img src={generatedImage} className="rounded-2xl border border-zinc-800" />
  </div>
);
