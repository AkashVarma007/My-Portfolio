"use client";

import { HuntProvider, useHunt } from "@/context/HuntContext";

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
import { CustomCursor } from "@/components/CustomCursor";
import { ArcadeCurtain } from "@/components/ArcadeCurtain";
import { AchievementWidget } from "@/components/hunt/AchievementWidget";
import { ClueToast } from "@/components/hunt/ClueToast";
import { HiddenTerminal } from "@/components/hunt/HiddenTerminal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { RouteReveal } from "@/components/RouteReveal";

/** Hunt UI — only renders after the user discovers the arcade (clue 1).
 *  This keeps the mystery hidden until they find it themselves. */
function HuntUI() {
  const { isClueFound } = useHunt();
  if (!isClueFound(1)) return null;
  return (
    <>
      <AchievementWidget />
      <ClueToast />
      <HiddenTerminal />
    </>
  );
}

export default function Home() {
  return (
    <HuntProvider>
      <SmoothScroll />
      <CustomCursor />
      <RouteReveal>
        <div className="scroll-progress" />
        <ParticleCanvas />
        <AnimationProvider />
        <Navigation />

        <Hero />
        <Marquee />

        <About />
        <div className="divider-glow mx-6 md:mx-12" />

        <Projects />
        <div className="divider-glow mx-6 md:mx-12" />

        <Journey />
        <div className="divider-glow mx-6 md:mx-12" />

        <Skills />
        <div className="divider-glow mx-6 md:mx-12" />

        <Contact />
        <Footer />

        {/* Hidden trigger — scrolling past the footer fires curtain → /arcade */}
        <ArcadeCurtain />

        {/* Hunt widgets — hidden until arcade is discovered */}
        <HuntUI />
      </RouteReveal>
    </HuntProvider>
  );
}
