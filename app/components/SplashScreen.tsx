'use client';

import { useEffect, useState } from 'react';
import './SplashScreen.css';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); // Total animation duration

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      
      <div className="splash-content">
        <div className="logo-container">
          <div className="orbit-ring"></div>
          <div className="orbit-ring delay-1"></div>
          <div className="orbit-ring delay-2"></div>
          <div className="planet"></div>
        </div>
        
        <h1 className="team-name">
          <span className="letter">A</span>
          <span className="letter">s</span>
          <span className="letter">t</span>
          <span className="letter">r</span>
          <span className="letter">o</span>
          <span className="letter">c</span>
          <span className="letter">l</span>
          <span className="letter">u</span>
          <span className="letter">s</span>
          <span className="letter">t</span>
          <span className="letter">e</span>
          <span className="letter">r</span>
        </h1>
        
        <p className="subtitle">NASA Space App Challenge 2025</p>
        
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
}