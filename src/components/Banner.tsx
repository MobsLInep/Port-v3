import { lazy, Suspense } from "react";
import "./Banner.css";

const Scene3D = lazy(() => import("../three/Scene3D"));

export default function Banner({ ready }: { ready: boolean }) {
  return (
    <section className="banner" id="home">
      {/* HDR cloudy-sky background + rotating red flower (mounted after intro) */}
      <div className="banner__3d">
        {ready && (
          <Suspense fallback={null}>
            <Scene3D variant="flower" />
          </Suspense>
        )}
      </div>

      {/* thin elliptical ring split top/bottom so the flower sits inside it */}
      <img className="banner__oval banner__oval--top" src="/assets/images/banner/oval_desktop_top.svg" alt="" />
      <img className="banner__oval banner__oval--bot" src="/assets/images/banner/oval_desktop_bot.svg" alt="" />

      {/* info box under the nav */}
      <div className="banner__infobox">
        <span className="banner__infobox-title">AI / ML Researcher &amp; Engineer</span>
        <span className="banner__infobox-sub">A Data Science &amp; AI undergrad building<br />intelligent systems, based in India</span>
      </div>

      {/* bottom bar */}
      <div className="banner__progress">
        <span className="banner__progress-bar" />
        <span className="banner__progress-dots">····</span>
      </div>

      <div className="banner__scroll">
        <span>Scroll down to explore</span>
        <span className="banner__scroll-btn">↓</span>
      </div>
    </section>
  );
}
