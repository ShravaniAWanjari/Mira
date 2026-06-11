import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WorkspaceGrid from './components/WorkspaceGrid';
import { useContextEngine } from './hooks/useContextEngine';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const { 
    videoRef, 
    environment, 
    eyeState, 
    isInitializing, 
    isReady, 
    startEngine 
  } = useContextEngine();

  // Apply theme to document element for Tailwind dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Automatic Context Adaptation Logic
  useEffect(() => {
    // If environment is dark OR user is squinting, switch to Dark Mode
    if (environment === 'dark' || eyeState === 'strained') {
      if (theme !== 'dark') setTheme('dark');
    } else if (environment === 'bright' && eyeState === 'relaxed') {
      if (theme !== 'light') setTheme('light');
    }
  }, [environment, eyeState, theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={setTheme} environment={environment} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <WorkspaceGrid eyeState={eyeState} />
        </main>
        <Sidebar 
          environment={environment} 
          eyeState={eyeState} 
          theme={theme}
          videoRef={videoRef}
          isInitializing={isInitializing}
          isReady={isReady}
          startEngine={startEngine}
        />
      </div>
    </div>
  );
}

export default App;
