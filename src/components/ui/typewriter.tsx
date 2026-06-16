'use client';

import { useEffect, useRef } from 'react';

interface TypeWriterProps {
  words: readonly string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseEndWord?: number;
  pauseNextWord?: number;
  initialDelay?: number;
}

const DEFAULT_TIMING = {
  TYPING_SPEED:   110,
  DELETING_SPEED:  60,
  PAUSE_END_WORD: 1800,
  PAUSE_NEXT_WORD: 380,
  INITIAL_DELAY:   900,
} as const;

export function TypeWriter({
  words,
  typingSpeed = DEFAULT_TIMING.TYPING_SPEED,
  deletingSpeed = DEFAULT_TIMING.DELETING_SPEED,
  pauseEndWord = DEFAULT_TIMING.PAUSE_END_WORD,
  pauseNextWord = DEFAULT_TIMING.PAUSE_NEXT_WORD,
  initialDelay = DEFAULT_TIMING.INITIAL_DELAY,
}: TypeWriterProps) {
  const textRef  = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl || !words.length) return;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting  = false;

    const tick = () => {
      const word = words[wordIndex];
      deleting ? charIndex-- : charIndex++;
      textEl.textContent = word.slice(0, charIndex);

      let delay = deleting ? deletingSpeed : typingSpeed;
      if (!deleting && charIndex === word.length) {
        delay    = pauseEndWord;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting   = false;
        wordIndex  = (wordIndex + 1) % words.length;
        delay      = pauseNextWord;
      }

      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, initialDelay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [words, typingSpeed, deletingSpeed, pauseEndWord, pauseNextWord, initialDelay]);

  return (
    <span aria-live='polite' aria-label='Role animation'>
      <span ref={textRef} style={{ color: 'var(--accent)', fontWeight: 600 }} aria-hidden='true' />
      <span className='cursor-blink ml-0.5 inline-block h-[1.1em] w-0.5 rounded-sm align-text-bottom' style={{ background: 'var(--accent)' }} aria-hidden='true' />
    </span>
  );
}
