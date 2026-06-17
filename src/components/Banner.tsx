import { lazy, Suspense } from "react";
import { Globe } from "lucide-react";
import "./Banner.css";

const Scene3D = lazy(() => import("../three/Scene3D"));

export default function Banner({ ready }: { ready: boolean }) {
  return (
    <section className="banner" id="home">

      {/* drifting clouds on their own layer, behind the top oval ring */}
      <div className="banner__3d banner__3d--clouds">
        {ready && (
          <Suspense fallback={null}>
            <Scene3D variant="clouds" />
          </Suspense>
        )}
      </div>

      <img className="banner__oval banner__oval--top" src="/assets/images/banner/oval_desktop_top.svg" alt="" />

      {/* rotating red flower (mounted after intro), in front of the top oval */}
      <div className="banner__3d">
        {ready && (
          <Suspense fallback={null}>
            <Scene3D variant="flower" />
          </Suspense>
        )}
      </div>

      {/* thin elliptical ring split top/bottom so the flower sits inside it */}

      <img className="banner__oval banner__oval--bot" src="/assets/images/banner/oval_desktop_bot.svg" alt="" />

      {/* viewfinder crosshair markers */}
      <span className="banner__cross banner__cross--a" aria-hidden />
      <span className="banner__cross banner__cross--b" aria-hidden />

      {/* info box under the nav */}
      <div className="banner__infobox">
        <div className="banner__infobox-row banner__infobox-row--title">
          <span className="banner__infobox-title" data-letters>AI / ML Researcher &amp; Engineer</span>
          <Globe className="banner__infobox-icon" />
        </div>
        <div className="banner__infobox-row banner__infobox-row--body">
          <span className="banner__infobox-date">EST 24</span>
          <span className="banner__infobox-sub">Building intelligent systems /<br />based in India</span>
        </div>
      </div>

      {/* bottom bar */}
      <div className="banner__progress">
        <span className="banner__progress-bar" />
        <span className="banner__progress-dots">····</span>
      </div>

      <div className="banner__scroll">
        <span className="banner__scroll-label">Scroll down to explore</span>
        <span className="banner__scroll-btn">↓</span>
      </div>
    </section>
  );
}
