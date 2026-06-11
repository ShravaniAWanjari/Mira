import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import { useState } from 'react';

interface VideoContentCardProps {
  eyeState: 'relaxed' | 'strained';
}

export default function VideoContentCard({ eyeState }: VideoContentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={`neo-card flex flex-col h-96 relative overflow-hidden transition-all duration-500 ${eyeState === 'strained' ? 'opacity-80 blur-[1px]' : ''}`}>
      <div className="bg-black text-white border-b-4 border-black p-3 flex items-center justify-between z-10">
        <h3 className="font-black text-lg flex items-center gap-2 uppercase tracking-wide">
          <Play size={20} />
          Media
        </h3>
        {eyeState === 'strained' && (
          <span className="neo-badge bg-[var(--primary)] text-black animate-pulse">
            DIMMED
          </span>
        )}
      </div>
      
      <div className="flex-1 bg-gray-900 relative flex items-center justify-center p-4">
        {eyeState === 'strained' && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
            <div className="bg-white text-black p-4 neo-border shadow-[4px_4px_0px_0px_rgba(255,87,34,1)] text-center font-bold">
              <p className="uppercase text-[var(--primary)] mb-1">Rest Your Eyes</p>
              <p className="text-sm">Video dimmed due to detected strain</p>
            </div>
          </div>
        )}
        
        {/* Fake video placeholder */}
        <div className="w-full h-full border-4 border-white border-dashed rounded-lg flex items-center justify-center text-white opacity-20">
          Video Stream
        </div>
        
        {/* Big play button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute z-10 bg-[var(--primary)] text-black neo-border p-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>
      </div>

      <div className="bg-[var(--bg-color)] border-t-4 border-black p-3 flex items-center justify-between z-10">
        <div className="w-full bg-gray-300 h-4 neo-border mx-4 relative overflow-hidden">
          <div className="bg-[var(--secondary)] h-full w-1/3 border-r-2 border-black"></div>
        </div>
        <div className="flex gap-2 text-black">
          <Volume2 size={20} className="cursor-pointer hover:text-[var(--primary)]" />
          <Maximize size={20} className="cursor-pointer hover:text-[var(--primary)]" />
        </div>
      </div>
    </div>
  );
}
