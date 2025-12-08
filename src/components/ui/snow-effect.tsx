import React, { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
  delay: number;
  wobble: number;
}

export const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    console.log('[SnowEffect] useEffect triggered');
    
    // Optional: Nur im Dezember anzeigen - für Test entfernt
    // const currentMonth = new Date().getMonth() + 1;
    // if (currentMonth !== 12) {
    //   return;
    // }

    const generateSnowflakes = (): Snowflake[] => {
      const flakes: Snowflake[] = [];
      for (let i = 0; i < 50; i++) {
        flakes.push({
          id: i,
          left: Math.random() * 100,
          animationDuration: 4 + Math.random() * 6, // 4-10 Sekunden
          size: 5 + Math.random() * 7, // 5-12px für bessere Sichtbarkeit
          opacity: 0.7 + Math.random() * 0.25, // 0.7-0.95 für bessere Sichtbarkeit
          delay: Math.random() * 3,
          wobble: 10 + Math.random() * 20,
        });
      }
      return flakes;
    };

    const flakes = generateSnowflakes();
    setSnowflakes(flakes);
    console.log('[SnowEffect] Generated', flakes.length, 'snowflakes');
  }, []);

  console.log('[SnowEffect] Component render - snowflakes count:', snowflakes.length);

  return (
    <div className="snow-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {/* Test-Schneeflocke - sehr groß und sichtbar - sollte IMMER sichtbar sein */}
      <div
        style={{
          position: 'fixed',
          top: '50px',
          left: '50%',
          width: '30px',
          height: '30px',
          opacity: 1,
          background: 'red',
          borderRadius: '50%',
          zIndex: 10000,
          pointerEvents: 'none',
          boxShadow: '0 0 10px red',
        }}
      >
        TEST
      </div>
      {snowflakes.length > 0 && snowflakes.map((flake) => {
        return (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `snowfall ${flake.animationDuration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
            }}
          />
        );
      })}
      {snowflakes.length === 0 && (
        <div style={{ position: 'fixed', top: '100px', left: '50%', color: 'yellow', zIndex: 10000, pointerEvents: 'none' }}>
          Loading snowflakes...
        </div>
      )}
    </div>
  );
};