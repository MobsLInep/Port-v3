export type SectionBg = { sectionId: string; color: string };

/**
 * Ordered list of sections that participate in the interpolated page
 * background. `sectionId` must match the `id` attribute on the section's
 * root element. `color` is the page background while that section is active.
 * Edit this array to add/remove/recolor sections — nothing else needs to change.
 */
export const SECTION_BACKGROUNDS: SectionBg[] = [
  { sectionId: "home",         color: "#9fbac9" }, // hero sky (Banner stays opaque)
  { sectionId: "about",        color: "#280822" }, // plum
  { sectionId: "capabilities", color: "#013300" }, // green
  { sectionId: "crafting",     color: "#ddc8c5" }, // cream
  { sectionId: "works",        color: "#013300" }, // green
  { sectionId: "experience",   color: "#280822" }, // plum
  { sectionId: "philosophy",   color: "#ddc8c5" }, // cream
  { sectionId: "services",     color: "#ddc8c5" }, // cream
  { sectionId: "playbook",     color: "#ede4d3" }, // sand
  { sectionId: "footer",       color: "#280822" }, // plum
];
