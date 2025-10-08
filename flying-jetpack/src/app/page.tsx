'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [position, setPosition] = useState({ x: 100, y: 200 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const keysPressed = useRef<Set<string>>(new Set());
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = () => {
      setVelocity(prev => {
        let newVx = prev.x;
        let newVy = prev.y;

        if (keysPressed.current.has('ArrowLeft')) newVx = Math.max(newVx - 0.5, -5);
        if (keysPressed.current.has('ArrowRight')) newVx = Math.min(newVx + 0.5, 5);
        if (keysPressed.current.has('ArrowUp')) newVy = Math.max(newVy - 0.5, -5);
        if (keysPressed.current.has('ArrowDown')) newVy = Math.min(newVy + 0.5, 5);

        // Gravity
        newVy += 0.2;

        // Friction
        newVx *= 0.98;
        newVy *= 0.98;

        return { x: newVx, y: newVy };
      });

      setPosition(prev => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;

        // Boundaries
        if (newX < 0) newX = 0;
        if (newX > window.innerWidth - 50) newX = window.innerWidth - 50;
        if (newY < 0) newY = 0;
        if (newY > window.innerHeight - 50) newY = window.innerHeight - 50;

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden relative">
      <div
        className="absolute transition-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `rotate(${Math.atan2(velocity.y, velocity.x) * 180 / Math.PI}deg)`,
        }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          {/* Jet Pack Body */}
          <rect x="15" y="10" width="20" height="30" fill="#silver" stroke="#black" strokeWidth="1" />
          {/* Straps */}
          <rect x="10" y="15" width="5" height="2" fill="#black" />
          <rect x="35" y="15" width="5" height="2" fill="#black" />
          <rect x="10" y="25" width="5" height="2" fill="#black" />
          <rect x="35" y="25" width="5" height="2" fill="#black" />
          {/* Jets */}
          <ellipse cx="20" cy="45" rx="5" ry="8" fill="#orange" opacity="0.8" />
          <ellipse cx="30" cy="45" rx="5" ry="8" fill="#orange" opacity="0.8" />
          {/* Flames */}
          <ellipse cx="20" cy="50" rx="3" ry="5" fill="#yellow" />
          <ellipse cx="30" cy="50" rx="3" ry="5" fill="#yellow" />
        </svg>
      </div>
      <div className="absolute top-4 left-4 text-white text-xl font-bold">
        Flying Jet Pack
      </div>
      <div className="absolute bottom-4 left-4 text-white text-sm">
        Use arrow keys to fly!
      </div>
    </div>
  );
}
