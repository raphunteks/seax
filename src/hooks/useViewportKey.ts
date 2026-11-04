import { useEffect, useState } from "react";

/**
 * Changes when the window is resized enough to matter for pinned scenes (width on touch screens,
 * width and height with a mouse), so scenes measured for one size are rebuilt for the next.
 * Debounced, and it ignores the small height changes of a phone's address bar.
 */
export function useViewportKey(): string {
  const read = () => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    return `${Math.round(window.innerWidth / 100)}x${fine ? Math.round(window.innerHeight / 80) : 0}`;
  };
  const [key, setKey] = useState(read);
  useEffect(() => {
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setKey(read()), 250);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);
  return key;
}
