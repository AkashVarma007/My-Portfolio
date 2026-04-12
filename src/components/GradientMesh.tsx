// Pure CSS gradient orbs — STATIC for scroll performance.
// Previous version had filter: blur(160px) + CSS keyframe animations
// + scroll-linked GSAP parallax, which was tanking scroll FPS.

export function GradientMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div
        className="absolute w-[520px] h-[520px] rounded-full -top-48 -left-32"
        style={{
          background: "radial-gradient(circle, rgba(196,247,81,0.08) 0%, transparent 70%)",
          willChange: "auto",
        }}
      />
      <div
        className="absolute w-[440px] h-[440px] rounded-full -bottom-32 -right-24"
        style={{
          background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
          willChange: "auto",
        }}
      />
    </div>
  );
}
