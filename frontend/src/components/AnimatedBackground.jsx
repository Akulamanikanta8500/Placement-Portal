import { useEffect, useState } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Generate randomized properties for exactly 10 diagonal shooting stars
    const generatedStars = Array.from({ length: 10 }).map(() => ({
      top: Math.random() * 40 - 15 + 'vh', // Random start height between -15vh and 25vh
      left: Math.random() * 100 + 'vw', // Random start horizontal position
      animationDelay: Math.random() * 15 + 's', // Staggered delays up to 15s
      animationDuration: Math.random() * 5 + 6 + 's', // Fall duration between 6s and 11s
    }));
    setShootingStars(generatedStars);
  }, []);

  return (
    <div className="animated-bg-container">
      {/* Heavy Glowing Ambiance */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>
      <div className="glow-orb orb-3"></div>
      
      {/* Synthwave/Cyber moving floor perspective */}
      <div className="cyber-grid"></div>

      {/* Dynamic diagonal shooting stars (max 10) */}
      {shootingStars.map((style, index) => (
        <div key={index} className="shooting-star" style={style}></div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
