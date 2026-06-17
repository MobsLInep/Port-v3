import "./Sections.css";

/* ================= ABOUT (plum) ================= */
export function About() {
  return (
    <section className="about" id="about">
      <div className="about__top">
        <p className="section-label" data-reveal>
          <img src="/assets/images/about/aster.svg" alt="" /> About me
          <img src="/assets/images/about/aster.svg" alt="" />
        </p>
        <h2 className="about__head font-editorial" data-letters>
          I build intelligent systems across machine learning, generative AI, and security.
        </h2>
      </div>

      <div className="about__torn" data-reveal>
        <img src="/assets/images/about/whoimg.png" alt="Shreyansh Samaddar" data-parallax="6" />
      </div>

      <p className="about__mission font-editorial" data-reveal>
        to turn research ideas into models that learn, reason, and act.
      </p>
    </section>
  );
}

/* ================= CRAFTING LEGACIES (cream) ========= */
export function Crafting() {
  return (
    <>
      <section className="crafting" id="crafting">
        <h2 className="crafting__title font-thunder" data-letters>
          Building<br />Intelligence
        </h2>
        <div className="crafting__meta">
          <p data-reveal>
            B.Tech in Data Science &amp; AI at IIIT Naya Raipur (CGPA 9/10).
            Cybersecurity AI/ML research intern at SwiftSafe and data analytics
            intern at Piramal Swasthya — building agentic and RAG-driven systems.
          </p>
          <p className="crafting__quote font-editorial" data-reveal>
            Published at ARES 2026 and a granted Indian patent — I combine rigorous
            research with engineering to ship models that hold up in the real world.
          </p>
        </div>
      </section>
    </>
  );
}

/* ================= WORKS (green) ================= */
const PROJECTS = [
  { name: "SSH Honeypot", img: "/assets/images/works/nura.webp",
    desc: "Intelligent cybersecurity SSH honeypot with realistic terminal simulation and ML-based attack recognition, capturing and classifying adversarial sessions.",
    field: "Publication · ARES 2026", date: "2026",
    tags: ["Cybersecurity", "Machine Learning", "Telemetry"],
    metrics: [{ k: "ARES 2026", v: "Accepted" }],
    link: "https://github.com/MobsLInep/Advance-adaptive-honeypot" },
  { name: "Plant Disease Diffusion", img: "/assets/images/works/frank.webp",
    desc: "Mask-guided diffusion framework simulating plant disease progression with environment conditioning and fungicide-intervention modeling.",
    field: "Vision & Generative AI", date: "Jan–Feb 2026",
    tags: ["Diffusion", "Computer Vision", "Generative AI"],
    metrics: [{ k: "FID", v: "43.2" }, { k: "LPIPS", v: "0.14" }, { k: "Lesion IoU", v: "94.7%" }],
    link: "https://github.com/MobsLInep/Agricultural-Conversational-Image-Editing" },
  { name: "TrackMania RL Agent", img: "/assets/images/works/evok.webp",
    desc: "Deep RL agent (DQN) driving TrackMania Nations Forever via a custom Gymnasium env and live telemetry with checkpoint-based rewards.",
    field: "Deep Reinforcement Learning", date: "Dec 2025–Feb 2026",
    tags: ["Deep RL", "DQN", "Gymnasium"],
    metrics: [{ k: "Env", v: "Custom Gym" }, { k: "Telemetry", v: "Live" }],
    link: "https://github.com/MobsLInep/TMNF-RL-basic" },
  { name: "Lattice Gas Simulator", img: "/assets/images/works/truekind.webp",
    desc: "Cellular-automata fluid dynamics simulator (FHP/HPP) with collision and streaming operators, validated against Navier–Stokes and benchmark CFD.",
    field: "Computational Physics", date: "Dec 2025–Jan 2026",
    tags: ["CFD", "Cellular Automata", "FHP / HPP"],
    metrics: [{ k: "Conserves", v: "Mass + Momentum" }],
    link: "https://github.com/MobsLInep/LGM-fluid-simulator" },
];

export function Works() {
  return (
    <section className="works" id="works">
      <span className="works__watermark font-thunder" aria-hidden data-parallax="12">Works</span>

      <header className="works__head" data-reveal>
        <p className="section-label section-label--gold">
          <img src="/assets/images/works/motif.svg" alt="" /> Works
        </p>
        <h2 className="works__title font-editorial" data-letters>Featured Projects</h2>
      </header>

      <div className="works__list">
        {PROJECTS.map((p, i) => (
          <a className="work" href={p.link} target="_blank" rel="noreferrer" key={p.name} data-reveal>
            <div className="work__media">
              <img src={p.img} alt={p.name} />
              <span className="work__visit">
                <img src="/assets/images/works/visit.png" alt="visit" />
              </span>
            </div>
            <div className="work__info">
              <h3 className="work__name font-editorial">{p.name}</h3>
              <ul className="work__tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="work__desc">{p.desc}</p>
              <div className="work__metrics">
                {p.metrics.map((m) => (
                  <div className="work__metric" key={m.k}>
                    <span className="work__metric-v">{m.v}</span>
                    <span className="work__metric-k">{m.k}</span>
                  </div>
                ))}
              </div>
              <p className="work__meta">{p.date} ✦ {p.field} <span>0{i + 1}</span></p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ================= PHILOSOPHY (cream) ================= */
export function Philosophy() {
  return (
    <section className="phil" id="philosophy">
      <img className="phil__motif" src="/assets/images/phil/motif.svg" alt="" />
      <p className="section-label section-label--dark" data-reveal>My philosophy</p>
      <blockquote className="phil__quote font-editorial" data-reveal>
        A model is only as good as the questions it answers and the rigor behind
        it. I care about systems that don&rsquo;t just fit the benchmark — they
        reason, generalize, and stay honest when the data gets messy. Research is
        the curiosity; engineering is what makes it real.
      </blockquote>
    </section>
  );
}

/* ================= SERVICES (cream) ================= */
const SERVICES = ["Models", "Agents", "Pipelines", "Research", "Systems"];

export function Services() {
  return (
    <section className="services" id="services">
      <div className="services__infobox" data-reveal>
        <span>AI/ML Researcher &amp; Engineer</span>
        <span>Turning research into real systems</span>
      </div>

      <p className="services__what" data-reveal>What I can build with you ✦✦✦</p>

      <div className="services__stack">
        <h2 className="services__list font-thunder">
          {SERVICES.map((s) => (
            <span key={s} data-letters>{s}</span>
          ))}
        </h2>
        <span className="services__provided font-editorial">Capabilities</span>
      </div>

      <p className="services__note" data-reveal>
        Working in Python, PyTorch and TensorFlow across deep learning,
        reinforcement learning, diffusion models, RAG and agentic AI — from a first
        experiment to a deployed, reproducible pipeline.
      </p>
    </section>
  );
}

/* ================= PLAYBOOK (sand) ================= */
const playGroups = ["plays1", "play2", "play3", "play4", "play5", "play6", "play7", "play8", "play9", "play10"];
const playImgs = playGroups.flatMap((g) => [1, 2, 3].map((n) => `/assets/images/playbook/${g}-${n}.webp`));

export function Playbook() {
  return (
    <section className="playbook" id="playbook">
      <header className="playbook__head" data-reveal>
        <h2 className="playbook__title font-playground" data-letters>Playbook</h2>
        <p className="playbook__sub">experiments with models, agents, simulations and the occasional rabbit hole</p>
      </header>

      <div className="playbook__marquee">
        <div className="playbook__track">
          {[...playImgs, ...playImgs].map((src, i) => (
            <div className="playbook__item" key={i}>
              <img src={src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
