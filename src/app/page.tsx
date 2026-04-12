"use client";

import { useCallback, useState } from "react";
import { HuntProvider } from "@/context/HuntContext";
import { GradientMesh } from "@/components/GradientMesh";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { AnimationProvider } from "@/components/AnimationProvider";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Journey } from "@/components/Journey";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { ArcadeCurtain } from "@/components/ArcadeCurtain";
import { AchievementWidget } from "@/components/hunt/AchievementWidget";
import { ClueToast } from "@/components/hunt/ClueToast";
import { HiddenTerminal } from "@/components/hunt/HiddenTerminal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MetaCorner } from "@/components/MetaCorner";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  return (
    <HuntProvider>
      <SmoothScroll />
      <Preloader onComplete={handlePreloaderComplete} />

      <div
        style={{
          opacity: preloaderDone ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: preloaderDone ? "auto" : "none",
        }}
      >
        <div className="scroll-progress" />
        <ParticleCanvas />
        <GradientMesh />
        <AnimationProvider />
        <Navigation />

        <Hero />
        <Marquee />

        {/* Plan order: work → about → stack → experience → contact */}
        <Projects />
        <About />
        <Skills />
        <Journey />
        <Contact />
        <Footer />

        {/* Hidden trigger — scrolling past the footer fires curtain → /arcade */}
        <ArcadeCurtain />

        {/* Floating widgets */}
        <AchievementWidget />
        <ClueToast />
        <HiddenTerminal />

        {/* WOW 5 — the self-referential meta corner */}
        <MetaCorner />
      </div>
    </HuntProvider>
  );
}
