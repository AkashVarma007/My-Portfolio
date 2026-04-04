// Pure CSS gradient orbs — parallax handled by GSAP AnimationProvider via .gsap-orb

export function GradientMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div
        className="gsap-orb absolute w-[600px] h-[600px] rounded-full -top-64 -left-32 animate-orb-1"
        style={{ background: "#c4f751", filter: "blur(160px)", opacity: 0.06 }}
      />
      <div
        className="gsap-orb absolute w-[500px] h-[500px] rounded-full -bottom-48 -right-32 animate-orb-2"
        style={{ background: "#818cf8", filter: "blur(160px)", opacity: 0.04 }}
      />
    </div>
  );
}
