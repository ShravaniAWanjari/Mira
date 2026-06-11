import { useState, useEffect, useRef } from 'react';
import { Settings, Camera, Loader2, Play } from 'lucide-react';

interface SidebarProps {
  environment: 'bright' | 'dark';
  eyeState: 'relaxed' | 'strained';
  theme: 'light' | 'dark';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isInitializing: boolean;
  isReady: boolean;
  startEngine: () => void;
}

interface ActionLog {
  id: number;
  timestamp: string;
  message: string;
  type: 'dark' | 'bright' | 'strained' | 'relaxed';
}

export default function Sidebar({ environment, eyeState, theme, videoRef, isInitializing, isReady, startEngine }: SidebarProps) {
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const initialEnvRef = useRef(true);
  // Monitor environment changes
  useEffect(() => {
    if (initialEnvRef.current) {
      initialEnvRef.current = false;
      return;
    }
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (environment === 'dark') {
      setLogs(prev => [{ id: Date.now(), timestamp: time, message: 'Switching to Dark Mode', type: 'dark' }, ...prev].slice(0, 10));
    } else {
      setLogs(prev => [{ id: Date.now(), timestamp: time, message: 'Switching to Light Mode', type: 'bright' }, ...prev].slice(0, 10));
    }
  }, [environment]);

  const initialEyeRef = useRef(true);
  // Monitor eye state changes
  useEffect(() => {
    if (initialEyeRef.current) {
      initialEyeRef.current = false;
      return;
    }
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (eyeState === 'strained') {
      setLogs(prev => [{ id: Date.now() + 1, timestamp: time, message: 'Dimming Media Content', type: 'strained' }, ...prev].slice(0, 10));
    } else {
      setLogs(prev => [{ id: Date.now() + 1, timestamp: time, message: 'Restoring Media Content', type: 'relaxed' }, ...prev].slice(0, 10));
    }
  }, [eyeState]);

  return (
    <aside className="w-80 border-l-4 border-black bg-[var(--card-bg)] p-6 overflow-y-auto flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2 mb-6 flex items-center gap-2">
          <Settings size={24} />
          Mira Assistant
        </h2>
        
        <div className="space-y-6">
          {/* CURRENT STATUS */}
          <div className="neo-card p-4">
            <h3 className="font-bold text-lg mb-4 border-b-2 border-black pb-1 uppercase tracking-wider text-black dark:text-white">
              Current
            </h3>
            <div className="space-y-3 text-black dark:text-white">
              <div className="flex items-center justify-between font-medium">
                <span>Environment:</span>
                <span className={`neo-badge ${environment === 'bright' ? 'bg-[var(--secondary)] text-black' : 'bg-gray-800 text-white'}`}>
                  {environment === 'bright' ? 'Bright' : 'Dark'}
                </span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Eye State:</span>
                <span className={`neo-badge ${eyeState === 'strained' ? 'bg-[var(--primary)] text-black' : 'bg-white text-black'}`}>
                  {eyeState === 'relaxed' ? 'Relaxed' : 'Strained'}
                </span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Active Theme:</span>
                <span className="neo-badge bg-white text-black">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* FUTURE / MIRA ACTIONS */}
          <div className="neo-card p-4 bg-black text-white border-4 border-black">
            <h3 className="font-bold text-lg mb-4 border-b-2 border-white pb-1 uppercase tracking-wider text-[var(--secondary)]">
              Mira Actions
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {logs.length > 0 ? (
                  logs.map(log => {
                    // Highlight if this log matches the CURRENT active state
                    const isActive = 
                      (log.type === 'dark' && environment === 'dark') ||
                      (log.type === 'bright' && environment === 'bright') ||
                      (log.type === 'strained' && eyeState === 'strained') ||
                      (log.type === 'relaxed' && eyeState === 'relaxed');

                    // Determine highlight color based on type
                    let borderColor = 'border-gray-600';
                    let textColor = 'text-gray-400';
                    
                    if (isActive) {
                      if (log.type === 'dark' || log.type === 'bright') {
                        borderColor = 'border-[var(--secondary)]';
                        textColor = 'text-[var(--secondary)]';
                      } else if (log.type === 'strained' || log.type === 'relaxed') {
                        borderColor = 'border-[var(--primary)]';
                        textColor = 'text-[var(--primary)]';
                      }
                    }

                    return (
                      <div key={log.id} className={`border p-2 bg-zinc-950 text-sm flex items-start gap-2 ${borderColor}`}>
                        {isActive && (log.type === 'dark' || log.type === 'strained') && (
                          <span className={`w-2.5 h-2.5 mt-1 rounded-full animate-ping flex-shrink-0 ${log.type === 'dark' ? 'bg-[var(--secondary)]' : 'bg-[var(--primary)]'}`} />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 font-mono">{log.timestamp}</span>
                          <span className={`font-bold ${textColor}`}>{log.message}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-dashed border-gray-600 p-3 text-sm font-bold text-gray-400 text-center italic">
                    No actions recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <h3 className="text-sm font-black uppercase mb-4 tracking-widest text-gray-500 flex items-center gap-2">
          Context Engine
        </h3>
        
        {!isReady ? (
          <div className="neo-card p-4 flex flex-col items-center justify-center text-center space-y-4 bg-[var(--bg-color)]">
            <Camera size={32} className="text-black dark:text-white opacity-50" />
            <p className="text-sm font-medium">Activate the webcam to enable real-time detection.</p>
            <button 
              onClick={startEngine}
              disabled={isInitializing}
              className={`w-full neo-btn flex items-center justify-center gap-2 ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isInitializing ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              {isInitializing ? 'Loading Model...' : 'Start Engine'}
            </button>
          </div>
        ) : (
          <div className="neo-card overflow-hidden bg-black flex items-center justify-center relative aspect-video">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
            ></video>
            
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              <span className={`w-2 h-2 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${environment === 'dark' ? 'bg-gray-600' : 'bg-yellow-400'}`} title="Brightness"></span>
              <span className={`w-2 h-2 rounded-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${eyeState === 'strained' ? 'bg-red-500' : 'bg-green-400'}`} title="Eye State"></span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-0.5 text-[10px] font-bold border border-white uppercase opacity-70">
              Live Feed
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
