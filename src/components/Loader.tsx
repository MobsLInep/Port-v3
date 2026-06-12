import { useEffect, useRef, useState } from "react";
import "./Loader.css";

const sides = [
  { src: "/assets/images/loader/side1.png", cls: "--left2" },
  { src: "/assets/images/loader/side2.png", cls: "--left1" },
  { src: "/assets/images/loader/side3.png", cls: "--right1" },
  { src: "/assets/images/loader/side4.png", cls: "--right2" },
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const rootRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 10 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        // sides slide out, main image fully revealed, then lift
        setTimeout(() => setPhase("reveal"), 400);
        setTimeout(() => {
          setPhase("done");
          onDoneRef.current();
        }, 1500);
      }
      setProgress(Math.floor(p));
    }, 130);
    return () => clearInterval(id);
  }, []);

  const clip =
    phase === "loading"
      ? `inset(${100 - progress}% 0% 0% 0%)`
      : "inset(0% 0% 0% 0%)";

  return (
    <div ref={rootRef} className={`loader ${phase === "done" ? "done" : ""}`}>
      <div className="loader__logo">Shreyansh Samaddar — AI/ML Researcher &amp; Engineer</div>

      <div className="loader__line" />
      <span className="loader__pct loader__pct--l">{progress}%</span>
      <span className="loader__pct loader__pct--r">{progress}%</span>

      <div className={`loader__images ${phase === "loading" ? "" : "loading"}`}>
        {sides.slice(0, 2).map((s) => (
          <img
            key={s.cls}
            className={`${s.cls} ${phase === "done" ? "hide" : "show"}`}
            src={s.src}
            alt=""
          />
        ))}

        <div className="main__img">
          <img src="/assets/images/loader/blur.png" alt="" />
          <div style={{ clipPath: clip }}>
            <img src="/assets/images/loader/main-image.png" alt="" />
          </div>
        </div>

        {sides.slice(2).map((s) => (
          <img
            key={s.cls}
            className={`${s.cls} ${phase === "done" ? "hide" : "show"}`}
            src={s.src}
            alt=""
          />
        ))}
      </div>

      <div className="wave" />
    </div>
  );
}
