import { lazy, Suspense } from "react";
import "./Footer.css";

const Scene3D = lazy(() => import("../three/Scene3D"));

const EMAIL = "shreyanshoct@gmail.com";
const PORTFOLIO = "https://my-portfolio-seven-chi-25.vercel.app";

const socials = [
  { n: "01", label: "GitHub", url: "https://github.com/MobsLInep" },
  { n: "02", label: "LinkedIn", url: "https://www.linkedin.com/in/shreyansh-samaddar-a85519319/" },
  { n: "03", label: "Portfolio", url: "https://my-portfolio-seven-chi-25.vercel.app" },
  { n: "04", label: "Codeforces", url: "https://codeforces.com/" },
  { n: "05", label: "Email", url: "mailto:shreyanshoct@gmail.com" },
];

export default function Footer({ ready }: { ready: boolean }) {
  return (
    <footer className="footer">
      <div className="footer__cta">
        <h2 className="footer__benchmark font-thunder" data-reveal>
          Have a problem worth solving with AI? Let&rsquo;s build the{" "}
          <em className="font-editorial">solution.</em>
        </h2>
      </div>

      <div className="footer__3d">
        {ready && (
          <Suspense fallback={null}>
            <Scene3D variant="macintosh" />
          </Suspense>
        )}
      </div>

      <a className="footer__mail" href={`mailto:${EMAIL}`}>
        <img src="/assets/images/footer/cta_mail.svg" alt="" />
        <span className="footer__mail-text font-thunder">Send an email</span>
        <span className="footer__mail-sub">i&rsquo;m eager to hear from you</span>
      </a>

      <div className="footer__grid">
        <div className="footer__col">
          <span className="footer__col-h">Index</span>
          <a href={PORTFOLIO} target="_blank" rel="noreferrer">Visit my portfolio</a>
          <a href={`mailto:${EMAIL}`}>Send an email</a>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Scroll back to top
          </a>
        </div>

        <div className="footer__col footer__col--social">
          <span className="footer__col-h">Socials</span>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              <span>{s.n}</span> {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 Shreyansh Samaddar, All rights reserved</span>
        <span>Raipur, CG, India · +91 8770350709 · Built with love &amp; curiosity</span>
        <a href={PORTFOLIO} target="_blank" rel="noreferrer">Portfolio ↗</a>
      </div>
    </footer>
  );
}
