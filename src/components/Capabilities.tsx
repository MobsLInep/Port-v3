import type { ReactNode } from "react";
import { Brain, Cpu, Eye, Sparkles, Waves, Database, Zap, Network } from "lucide-react";
import "./Capabilities.css";

type Cap = { t: string; d: string; icon: ReactNode };

const CAPABILITIES: Cap[] = [
  { t: "Deep Learning", d: "Architecting and training neural networks that learn rich representations from data.", icon: <Brain /> },
  { t: "Reinforcement Learning", d: "Agents that learn control through reward — from custom Gym envs to DQN.", icon: <Cpu /> },
  { t: "Computer Vision", d: "Perception systems for recognition, segmentation and visual reasoning.", icon: <Eye /> },
  { t: "Generative AI", d: "Models that synthesize images, text and structured outputs with fidelity.", icon: <Sparkles /> },
  { t: "Diffusion Models", d: "Mask-guided, conditioned diffusion for controllable generation.", icon: <Waves /> },
  { t: "RAG", d: "Retrieval-augmented pipelines grounding LLMs in real knowledge bases.", icon: <Database /> },
  { t: "LLM Fine-Tuning", d: "Adapting large language models for domain-specific reasoning.", icon: <Zap /> },
  { t: "Agentic AI", d: "Orchestrating tools and multi-step autonomous reasoning loops.", icon: <Network /> },
];

const STACK = [
  "Python", "C++", "SQL", "JavaScript", "PyTorch", "TensorFlow", "Scikit-Learn",
  "Gymnasium", "Hugging Face", "Pandas", "NumPy", "Git", "Linux", "Docker",
  "FastAPI", "Apache Superset",
];

function trackGlow(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Capabilities() {
  return (
    <section className="caps" id="capabilities">
      <header className="caps__head">
        <p className="section-label" data-reveal>
          <span className="caps__aster">✦</span> What I do
        </p>
        <h2 className="caps__title font-thunder" data-reveal>Capabilities</h2>
      </header>

      <div className="caps__grid">
        {CAPABILITIES.map((c, i) => (
          <article className="cap" key={c.t} data-reveal onMouseMove={trackGlow}>
            <span className="cap__glow" aria-hidden />
            <span className="cap__line cap__line--top" aria-hidden />
            <div className="cap__row">
              <span className="cap__no">{String(i + 1).padStart(2, "0")}</span>
              <span className="cap__icon" aria-hidden>{c.icon}</span>
            </div>
            <h3 className="cap__title">{c.t}</h3>
            <p className="cap__desc">{c.d}</p>
            <span className="cap__line cap__line--bot" aria-hidden />
          </article>
        ))}
      </div>

      <div className="caps__stack" aria-label="Tools and frameworks">
        <p className="caps__stack-label" data-reveal>Toolbox</p>
        <div className="caps__marquee">
          <div className="caps__track">
            {[...STACK, ...STACK].map((s, i) => (
              <span className="caps__chip" key={i}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
