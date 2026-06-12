import "./Nav.css";

const EMAIL = "shreyanshoct@gmail.com";
const PORTFOLIO = "https://my-portfolio-seven-chi-25.vercel.app";

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__brand">
        <span className="nav__brand-name">Shreyansh</span>
        <span className="nav__brand-name nav__brand-name--last">Samaddar</span>
      </div>

      <nav className="nav__links">
        <a href="#home"><span>01</span> Home</a>
        <a href="#about"><span>02</span> About</a>
        <a href="#works"><span>03</span> Works</a>
      </nav>

      <div className="nav__social">
        <a href="https://github.com/MobsLInep" target="_blank" rel="noreferrer">
          <img src="/assets/images/menu/github.svg" alt="GitHub" />
        </a>
        <a href="https://www.linkedin.com/in/shreyansh-samaddar-a85519319/" target="_blank" rel="noreferrer">
          <img src="/assets/images/menu/linkedin.svg" alt="LinkedIn" />
        </a>
        <a href={PORTFOLIO} target="_blank" rel="noreferrer">
          <img src="/assets/images/menu/x.svg" alt="Portfolio" />
        </a>
      </div>

      <div className="nav__cta">
        <div className="nav__cta-meta">
          <span className="dot" /> Open to research &amp; roles
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <a className="nav__cta-btn" href={`mailto:${EMAIL}`}>
          Get in touch
        </a>
      </div>
    </header>
  );
}
