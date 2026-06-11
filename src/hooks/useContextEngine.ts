import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useContextEngine() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const [environment, setEnvironment] = useState<'bright' | 'dark'>('bright');
  const [eyeState, setEyeState] = useState<'relaxed' | 'strained'>('relaxed');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  // Track consecutive strained frames/time
  const strainStartTimeRef = useRef<number | null>(null);
  const darkStartTimeRef = useRef<number | null>(null);
  const brightStartTimeRef = useRef<number | null>(null);
  
  // To avoid rapid toggling, we keep state in refs to calculate durations
  const currentEnvRef = useRef<'bright' | 'dark'>('bright');
  const currentEyeRef = useRef<'relaxed' | 'strained'>('relaxed');

  const streamRef = useRef<MediaStream | null>(null);

  const processFrames = useCallback(() => {
    if (!videoRef.current || !landmarkerRef.current) {
      rafIdRef.current = requestAnimationFrame(processFrames);
      return;
    }
    
    const video = videoRef.current;
    
    if (video.readyState >= 2) {
      const now = performance.now();
      
      // -- Feature A: Brightness Detection --
      const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvasRef.current.width !== video.videoWidth) {
           canvasRef.current.width = video.videoWidth;
           canvasRef.current.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Sample every 16th pixel for performance
        const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight).data;
        let luminanceSum = 0;
        let count = 0;
        
        for (let i = 0; i < imageData.length; i += 64) {
          const r = imageData[i];
          const g = imageData[i+1];
          const b = imageData[i+2];
          luminanceSum += 0.299 * r + 0.587 * g + 0.114 * b;
          count++;
        }
        
        if (count > 0) {
          const avgLuminance = luminanceSum / count;
          const isCurrentlyDark = avgLuminance < 60; // Threshold
          
          if (isCurrentlyDark) {
            brightStartTimeRef.current = null;
            if (!darkStartTimeRef.current) darkStartTimeRef.current = now;
            else if (now - darkStartTimeRef.current > 1000 && currentEnvRef.current !== 'dark') {
              currentEnvRef.current = 'dark';
              setEnvironment('dark');
            }
          } else {
            darkStartTimeRef.current = null;
            if (!brightStartTimeRef.current) brightStartTimeRef.current = now;
            else if (now - brightStartTimeRef.current > 1000 && currentEnvRef.current !== 'bright') {
              currentEnvRef.current = 'bright';
              setEnvironment('bright');
            }
          }
        }
      }

      // -- Feature B: Eye Strain Detection --
      const results = landmarkerRef.current.detectForVideo(video, now);
      
      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];
        
        const dist = (p1: any, p2: any) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        const rightEyeV = dist(landmarks[159], landmarks[145]);
        const rightEyeH = dist(landmarks[33], landmarks[133]);
        const rightEAR = rightEyeV / rightEyeH;

        const leftEyeV = dist(landmarks[386], landmarks[374]);
        const leftEyeH = dist(landmarks[362], landmarks[263]);
        const leftEAR = leftEyeV / leftEyeH;

        const avgEAR = (rightEAR + leftEAR) / 2.0;
        
        const isSquinting = avgEAR < 0.23;

        if (isSquinting) {
          if (!strainStartTimeRef.current) {
            strainStartTimeRef.current = now;
          } else if (now - strainStartTimeRef.current > 3000) {
            if (currentEyeRef.current !== 'strained') {
              currentEyeRef.current = 'strained';
              setEyeState('strained');
            }
          }
        } else {
          strainStartTimeRef.current = null;
          // We intentionally do NOT revert eyeState back to 'relaxed' here.
          // Since the UI adaptations (dimming media, switching to dark mode)
          // cause the eyes to relax, reverting would re-introduce the harsh
          // conditions and cause a feedback loop of strain.
        }
      }
    }
    
    rafIdRef.current = requestAnimationFrame(processFrames);
  }, []);

  const startEngine = useCallback(async () => {
    if (isInitializing || isReady) return;
    setIsInitializing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      streamRef.current = stream;

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
      });

      landmarkerRef.current = landmarker;
      setIsReady(true);
      setIsInitializing(false);

    } catch (err) {
      console.error("Error starting Context Engine:", err);
      setIsInitializing(false);
    }
  }, [isInitializing, isReady]);

  useEffect(() => {
    if (isReady && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
      
      // Start processing loop once video is attached
      if (!rafIdRef.current) {
        processFrames();
      }
    }
  }, [isReady, processFrames]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    environment,
    eyeState,
    isInitializing,
    isReady,
    startEngine
  };
}
