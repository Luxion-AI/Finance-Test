const particles = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 5,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.4 + 0.08,
  xDrift: (Math.random() - 0.5) * 80,
  yDrift: (Math.random() - 0.5) * 80,
}));

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `float-particle-${p.id} ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        ${particles
          .map(
            (p) => `
        @keyframes float-particle-${p.id} {
          0% { transform: translate(0, 0) scale(1); opacity: ${p.opacity}; }
          25% { transform: translate(${p.xDrift * 0.5}px, ${p.yDrift * 0.5}px) scale(${Math.random() * 0.4 + 0.8}); }
          50% { transform: translate(${p.xDrift * -0.3}px, ${p.yDrift * 0.7}px) scale(${Math.random() * 0.4 + 0.9}); opacity: ${p.opacity * 1.5}; }
          75% { transform: translate(${p.xDrift * 0.8}px, ${p.yDrift * -0.4}px) scale(${Math.random() * 0.3 + 0.85}); }
          100% { transform: translate(${p.xDrift * -0.5}px, ${p.yDrift * -0.6}px) scale(1); opacity: ${p.opacity}; }
        }
        `
          )
          .join("")}
      `}</style>
    </div>
  );
};

export default ParticleBackground;
