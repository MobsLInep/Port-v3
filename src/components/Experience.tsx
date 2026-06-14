import { useEffect, useRef, useState } from "react";
import { Award, FileText, GraduationCap, Briefcase } from "lucide-react";
import "./Experience.css";

const TIMELINE = [
  {
    role: "Cybersecurity AI/ML Research Intern",
    org: "SwiftSafe · Hyderabad, India",
    period: "Mar 2026 — May 2026",
    icon: <Briefcase />,
    points: [
      "Built an AI-agent orchestration platform (RLM layer) spanning the full RAG → LLM → Tooling pipeline for automated cybersecurity investigation.",
      "Engineered dynamic tool selection and multi-step autonomous reasoning across browser automation, network analysis, reverse engineering, OCR, sandboxing and malware analysis.",
    ],
  },
  {
    role: "Business Analysis & Data Analytics Intern",
    org: "Piramal Swasthya Management & Research Institute",
    period: "Jun 2025 — Jul 2025",
    icon: <Briefcase />,
    points: [
      "Built a RAG-based system (Python, FastAPI, Apache Superset, vector retrieval) enabling natural-language, automated dashboard generation.",
      "Converted user queries into structured dashboard configs, cutting manual report-creation effort.",
    ],
    cert: "/files/piramal-internship-certificate.pdf",
  },
  {
    role: "B.Tech, Data Science & Artificial Intelligence",
    org: "IIIT Naya Raipur",
    period: "Aug 2024 — Present",
    icon: <GraduationCap />,
    points: ["Current CGPA 9/10. Coursework and research across deep learning, RL, vision and generative AI."],
  },
];

const RECOGNITION = [
  {
    icon: <FileText />,
    tag: "Publication · ARES 2026",
    title: "Intelligent Cybersecurity SSH Honeypot with ML-Based Attack Recognition",
    sub: "Accepted at the 21st International Conference on Availability, Reliability and Security (SecIndustry Track).",
    href: "/files/ares-2026-ssh-honeypot.pdf",
    cta: "Read the paper",
  },
  {
    icon: <Award />,
    tag: "Indian Patent · Granted",
    title: "Air-Pollution Monitoring via Quantum-Secured Encryption in IoT & Blockchain",
    sub: "Patent No. 589285 · Granted 13 May 2026 · Co-Inventor.",
    href: "/files/patent-589285.pdf",
    cta: "View certificate",
  },
];

const STATS = [
  { value: 9, decimals: 0, suffix: "/10", label: "Current CGPA" },
  { value: 43.2, decimals: 1, suffix: "", label: "Diffusion FID" },
  { value: 94.7, decimals: 1, suffix: "%", label: "Lesion IoU" },
  { value: 1, decimals: 0, suffix: "", label: "Patent granted" },
];

function useCountUp(target: number, decimals: number, run: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return val.toFixed(decimals);
}

function Stat({ s, run }: { s: (typeof STATS)[number]; run: boolean }) {
  const shown = useCountUp(s.value, s.decimals, run);
  return (
    <div className="xp-stat" data-reveal>
      <span className="xp-stat__num font-thunder">
        {shown}
        <span className="xp-stat__suffix">{s.suffix}</span>
      </span>
      <span className="xp-stat__label">{s.label}</span>
    </div>
  );
}

export default function Experience() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className="xp" id="experience">
      <header className="xp__head" data-reveal>
        <p className="section-label">
          <span className="xp__aster">✦</span> Experience &amp; Recognition
        </p>
        <h2 className="xp__title font-editorial">A track record of research, shipped.</h2>
      </header>

      <div className="xp__stats" ref={statsRef}>
        {STATS.map((s) => (
          <Stat key={s.label} s={s} run={run} />
        ))}
      </div>

      <div className="xp__body">
        <ol className="xp__timeline">
          {TIMELINE.map((t) => (
            <li className="xp-item" key={t.role} data-reveal>
              <span className="xp-item__icon" aria-hidden>{t.icon}</span>
              <div className="xp-item__main">
                <div className="xp-item__top">
                  <h3 className="xp-item__role">{t.role}</h3>
                  <span className="xp-item__period">{t.period}</span>
                </div>
                <p className="xp-item__org">{t.org}</p>
                <ul className="xp-item__points">
                  {t.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {"cert" in t && t.cert && (
                  <a className="xp-item__cert" href={t.cert} target="_blank" rel="noreferrer">
                    View certificate <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="xp__reco">
          {RECOGNITION.map((r) => (
            <a
              className="reco"
              key={r.title}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              data-reveal
            >
              <span className="reco__icon" aria-hidden>{r.icon}</span>
              <span className="reco__tag">{r.tag}</span>
              <h3 className="reco__title font-editorial">{r.title}</h3>
              <p className="reco__sub">{r.sub}</p>
              <span className="reco__cta">{r.cta} <span aria-hidden>↗</span></span>
            </a>
          ))}
        </div>
      </div>

      <ul className="xp__extra" data-reveal>
        <li><span>Core Member</span> The Society of Coders, IIIT-NR</li>
        <li><span>Jr. Placement Coordinator</span> Training &amp; Placement Cell, IIIT-NR</li>
        <li><span>Codeforces</span> Pupil rating</li>
      </ul>
    </section>
  );
}
