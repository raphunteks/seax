import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);
// Thesis easing: cubic-bezier(0.2, 0, 0, 1).
CustomEase.create("kopi", "0.2,0,0,1");

/** Media query under which every GSAP scene is allowed to move. */
export const NO_PREF = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
