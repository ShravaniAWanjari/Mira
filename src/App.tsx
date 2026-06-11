import { useState, useEffect, useRef } from 'react';
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
    facePresence,
    isInitializing, 
    isReady, 
    startEngine,
    resetEyeState
  } = useContextEngine();

  // Apply theme to document element for Tailwind dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const latestEyeState = useRef(eyeState);
  useEffect(() => {
    latestEyeState.current = eyeState;
  }, [eyeState]);

  // Environment Adaptation Logic
  useEffect(() => {
    if (environment === 'dark') {
      setTheme('dark');
    } else if (environment === 'bright' && latestEyeState.current === 'relaxed') {
      setTheme('light');
    }
  }, [environment]); 

  // Eye Strain Adaptation Logic
  useEffect(() => {
    if (eyeState === 'strained') {
      setTheme('dark');
    }
    // Intentionally do nothing when eyeState becomes 'relaxed'.
    // Dark mode should stay as it is until user changes it using toggle theme.
  }, [eyeState]);

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      resetEyeState();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} setTheme={handleThemeToggle} environment={environment} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <WorkspaceGrid eyeState={eyeState} />
        </main>
        <Sidebar 
          environment={environment} 
          eyeState={eyeState} 
          facePresence={facePresence}
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
