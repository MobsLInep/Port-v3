import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Banner from "./components/Banner";
import { About, WhatIDo, Philosophy, Playbook, Services, Works } from "./components/Sections";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useSmoothScroll(loaded);

  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // Scroll-triggered reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // refresh once images/fonts settle
      ScrollTrigger.refresh();
    });

    const t = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [loaded]);

  return (
    <div className="app">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Nav />
      <main>
        <Banner ready={loaded} />
        <About />
        <WhatIDo />
        <Works />
        <Philosophy />
        <Services />
        <Playbook />
      </main>
      <Footer ready={loaded} />
    </div>
  );
}
