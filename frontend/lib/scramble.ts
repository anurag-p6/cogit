import { useEffect, useMemo, useRef, useState } from "react";

const GLYPHS = "0123456789abcdef";

function cipherFor(text: string): string {
  let state = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    state ^= text.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  let out = "";
  for (let index = 0; index < text.length; index += 1) {
    state = Math.imul(state ^ (index + 7), 2246822519);
    out += GLYPHS[(state >>> 24) & 15];
  }
  return out;
}

export function useCipherText(text: string, ciphered: boolean, duration = 720): string {
  const cipher = useMemo(() => cipherFor(text), [text]);
  const [display, setDisplay] = useState(ciphered ? cipher : text);
  const frame = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !ciphered) {
      setDisplay(ciphered ? cipher : text);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * cipher.length);
      let out = "";
      for (let index = 0; index < cipher.length; index += 1) {
        if (index < settled) {
          out += cipher[index];
        } else {
          out += GLYPHS[(index * 7 + ((now / 36) | 0)) % 16];
        }
      }
      setDisplay(out);
      if (t < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [ciphered, cipher, text, duration]);

  return display;
}
