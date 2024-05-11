import React, { ReactNode, createContext, useEffect, useRef } from 'react';


export const CanvasBackgroundContext = createContext(null);


interface CanvasBackgroundProviderProps {
  children: ReactNode;
}

export const CanvasBackgroundProvider: React.FC<CanvasBackgroundProviderProps> = ({ children }) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const cw = canvas.width = window.innerWidth;
    const ch = canvas.height = window.innerHeight;

    function reOffset() {
      const BB = canvas.getBoundingClientRect();
      offsetX = BB.left;
      offsetY = BB.top;
    }

    let offsetX: number, offsetY: number;
    reOffset();
    window.onscroll = () => reOffset();
    window.onresize = () => reOffset();

    ctx.fillStyle = '#DDDDDD';

    const PI2 = Math.PI * 2;
    const hoverRadius = 300; // Radius for hover effect
    const minDotSize = 1;
    const maxDotSize = 3;

    const hexRadius = 1;
    const hexPadding = 15;
    const hexes: { startingX: number; startingY: number; x: number; y: number }[] = [];
    for (let y = hexRadius; y < ch; y += hexRadius * 2 + hexPadding) {
      for (let x = 0; x < cw; x += hexRadius * 2 + hexPadding) {
        hexes.push({ startingX: x, startingY: y, x, y });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, cw, ch);
      hexes.forEach((h) => {
        const dx = h.x - mx;
        const dy = h.y - my;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const dotSize = Math.min(maxDotSize, Math.max(minDotSize, maxDotSize - distance / hoverRadius * maxDotSize));
        ctx.beginPath();
        ctx.arc(h.x, h.y, dotSize, 0, PI2);
        ctx.closePath();
        ctx.fill();
      });
    }

    function handleMouseMove(e: MouseEvent) {
      mx = e.clientX - offsetX;
      my = e.clientY - offsetY;
      draw();
    }

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  let mx: number, my: number;

  return (
    <CanvasBackgroundContext.Provider value={null}>
      <div style={{ overflow: 'hidden' }}>
        <canvas id="canvas" ref={canvasRef} style={{ width: '100vw' }}></canvas>
        {children}
      </div>
    </CanvasBackgroundContext.Provider>
  );
};
// const CanvasBackground: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     const ctx = canvas.getContext('2d')!;
//     const cw = canvas.width = window.innerWidth;
//     const ch = canvas.height = window.innerHeight;

//     function reOffset() {
//       const BB = canvas.getBoundingClientRect();
//       offsetX = BB.left;
//       offsetY = BB.top;
//     }

//     let offsetX: number, offsetY: number;
//     reOffset();
//     window.onscroll = () => reOffset();
//     window.onresize = () => reOffset();

//     ctx.fillStyle = '#DDDDDD';

//     const PI2 = Math.PI * 2;
//     const hoverRadius = 300; // Radius for hover effect
//     const minDotSize = 1;
//     const maxDotSize = 3;

//     const hexRadius = 1;
//     const hexPadding = 15;
//     const hexes: { startingX: number; startingY: number; x: number; y: number }[] = [];
//     for (let y = hexRadius; y < ch; y += hexRadius * 2 + hexPadding) {
//       for (let x = 0; x < cw; x += hexRadius * 2 + hexPadding) {
//         hexes.push({ startingX: x, startingY: y, x, y });
//       }
//     }

//     function draw() {
//       ctx.clearRect(0, 0, cw, ch);
//       hexes.forEach((h) => {
//         const dx = h.x - mx;
//         const dy = h.y - my;
//         const distance = Math.sqrt(dx * dx + dy * dy);
//         const dotSize = Math.min(maxDotSize, Math.max(minDotSize, maxDotSize - distance / hoverRadius * maxDotSize));
//         ctx.beginPath();
//         ctx.arc(h.x, h.y, dotSize, 0, PI2);
//         ctx.closePath();
//         ctx.fill();
//       });
//     }

//     function handleMouseMove(e: MouseEvent) {
//       mx = e.clientX - offsetX;
//       my = e.clientY - offsetY;
//       draw();
//     }

//     canvas.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       canvas.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   let mx: number, my: number;

//   return (
//     <div style={{ overflow: 'hidden' }}>
//       <canvas id="canvas" ref={canvasRef} style={{ width: '100vw' }}></canvas>
//     </div>
//   );
// };

// export default CanvasBackground;



