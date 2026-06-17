import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wrap every character of an element's text in <span class="char"> so each
 * glyph can be animated independently. Whitespace and <br> are preserved, and
 * nested inline elements are recursed into. Idempotent: re-running on an
 * already-split element is a no-op.
 */
function splitToLetters(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "done") {
    return Array.from(el.querySelectorAll<HTMLElement>(".char"));
  }

  const chars: HTMLElement[] = [];

  const walk = (node: Node, into: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        for (const ch of text) {
          if (ch === " ") {
            into.appendChild(document.createTextNode(" "));
            continue;
          }
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          into.appendChild(span);
          chars.push(span);
        }
      } else if (child.nodeName === "BR") {
        into.appendChild(document.createElement("br"));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // preserve the wrapper element (e.g. an inline <span>) and recurse
        const clone = (child as HTMLElement).cloneNode(false) as HTMLElement;
        into.appendChild(clone);
        walk(child, clone);
      }
    });
  };

  const frag = document.createDocumentFragment();
  walk(el, frag);
  el.replaceChildren(frag);
  el.dataset.split = "done";
  return chars;
}

/**
 * Letter-by-letter reveal for every [data-letters] heading in `scope`, tied
 * directly to scroll position (scrub) so glyphs fill in as the title crosses
 * the viewport and retract on scroll-up.
 */
export function initLetterReveals(scope: HTMLElement | Document = document) {
  scope.querySelectorAll<HTMLElement>("[data-letters]").forEach((el) => {
    const chars = splitToLetters(el);
    if (!chars.length) return;

    gsap.fromTo(
      chars,
      { opacity: 0, yPercent: 90, filter: "blur(6px)" },
      {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          end: "top 42%",
          scrub: 0.6,
        },
      }
    );
  });
}

/**
 * Subtle layered parallax. Every [data-parallax="<n>"] element drifts by `n`
 * percent of its own height across its scroll travel — transform-only so it
 * stays on the GPU. Elements without the attribute (e.g. the banner ovals)
 * never move.
 */
export function initParallax(scope: HTMLElement | Document = document) {
  scope.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = parseFloat(el.dataset.parallax || "0");
    if (!amount) return;

    gsap.fromTo(
      el,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
