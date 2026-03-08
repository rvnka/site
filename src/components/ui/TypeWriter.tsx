"use client";

import { useEffect, useRef } from "react";

interface TypeWriterProps {
  words: readonly string[];
}

const TIMING = {
  TYPING_SPEED: 110,
  DELETING_SPEED: 60,
  PAUSE_END_WORD: 1800,
  PAUSE_NEXT_WORD: 380,
  INITIAL_DELAY: 900,
} as const;

export function TypeWriter({ words }: TypeWriterProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl || !words.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex];
      deleting ? charIndex-- : charIndex++;
      textEl.textContent = word.slice(0, charIndex);

      let delay = deleting ? TIMING.DELETING_SPEED : TIMING.TYPING_SPEED;

      if (!deleting && charIndex === word.length) {
        delay = TIMING.PAUSE_END_WORD;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = TIMING.PAUSE_NEXT_WORD;
      }

      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, TIMING.INITIAL_DELAY);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [words]);

  return (
    <span aria-live="polite" aria-label="Role animation">
      <span
        ref={textRef}
        style={{ color: "var(--accent)", fontWeight: 600 }}
        aria-hidden="true"
      />
      <span
        className="cursor-blink ml-0.5 inline-block h-[1.1em] w-0.5 rounded-sm align-text-bottom"
        style={{ background: "var(--accent)" }}
        aria-hidden="true"
      />
    </span>
  );
}
