import { Moon, Sun, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  environment: 'bright' | 'dark';
}

export default function Header({ theme, setTheme, environment }: HeaderProps) {
  return (
    <header className="border-b-4 border-black p-4 flex items-center justify-between bg-[var(--card-bg)] z-10 neo-shadow-sm sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[var(--primary)] text-black neo-border px-4 py-2 font-black text-xl uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <LayoutDashboard size={24} />
          <span>Mira Lite</span>
        </div>
        <div className="hidden md:flex gap-4 font-bold text-lg">
          <span className="neo-badge bg-[var(--secondary)]">
            Mode: {theme === 'light' ? 'Light' : 'Dark'}
          </span>
          <span className="neo-badge bg-white text-black">
            Env: {environment.charAt(0).toUpperCase() + environment.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="neo-btn-secondary flex items-center gap-2"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="hidden sm:inline">Toggle Theme</span>
        </button>
      </div>
    </header>
  );
}
