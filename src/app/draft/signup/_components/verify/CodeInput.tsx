"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { CODE_LENGTH } from "../../_mock/verify";

/** Thai (๐-๙) and full-width (０-９) digits become ASCII, then everything that is not a digit is dropped. */
function digitsOnly(raw: string) {
  return raw
    .replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50))
    .replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10))
    .replace(/\D/g, "");
}

function digitsOnlyKeepingSpaces(raw: string) {
  return raw
    .replace(/[๐-๙]/g, (c) => String(c.charCodeAt(0) - 0x0e50))
    .replace(/[０-９]/g, (c) => String(c.charCodeAt(0) - 0xff10));
}

/**
 * Six single-digit boxes. Numeric keyboard, one-time-code autofill, auto-advance, Backspace / arrow keys, paste of a whole code fills
 * every box, and `onComplete` fires as soon as the sixth digit is in. Invalid state uses a red border AND the parent's alert text/icon.
 */
export default function CodeInput({
  digits,
  onChange,
  onComplete,
  disabled,
  invalid,
  groupLabelId,
  digitLabel,
  focusSignal,
  focusIndex = 0,
}: {
  digits: string[];
  onChange: (next: string[]) => void;
  onComplete: (code: string) => void;
  disabled: boolean;
  invalid: boolean;
  groupLabelId: string;
  digitLabel: (n: number) => string;
  /** Changes whenever the first box should take focus (on open, after a wrong code, after a resend). */
  focusSignal: number;
  /** Which box takes focus when `focusSignal` changes (default: the first). */
  focusIndex?: number;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!disabled) refs.current[focusIndex]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus only when the signal / disabled state changes, not when the index alone does
  }, [focusSignal, disabled]);

  const fill = (start: number, raw: string) => {
    const chars = digitsOnly(raw).slice(0, CODE_LENGTH - start).split("");
    if (chars.length === 0) return;
    const next = [...digits];
    chars.forEach((c, k) => {
      next[start + k] = c;
    });
    onChange(next);
    const last = Math.min(start + chars.length, CODE_LENGTH - 1);
    refs.current[last]?.focus();
    if (next.every((d) => d !== "")) onComplete(next.join(""));
  };

  const handleChange = (i: number, value: string) => {
    const typed = digitsOnly(value);
    if (typed === "") {
      const next = [...digits];
      next[i] = "";
      onChange(next);
      return;
    }
    if (typed.length > 1 && digits[i] === "") {
      // one-time-code autofill hands over the whole code at once
      fill(typed.length >= CODE_LENGTH ? 0 : i, typed);
      return;
    }
    // typing over a filled box: keep only the new character
    fill(i, typed.length > 1 ? typed.replace(digits[i], "").slice(-1) || typed.slice(-1) : typed);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && digits[i] === "" && i > 0) {
      e.preventDefault();
      const next = [...digits];
      next[i - 1] = "";
      onChange(next);
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) {
      e.preventDefault();
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // normalise first, then prefer a standalone 6-digit run ("code: 123456 (5 min)" must not become 512345)
    const text = digitsOnlyKeepingSpaces(e.clipboardData.getData("text"));
    const run = text.match(/(?<!\d)\d{6}(?!\d)/)?.[0];
    if (run) return fill(0, run);
    fill(digitsOnly(text).length >= CODE_LENGTH ? 0 : i, text);
  };

  return (
    <div role="group" aria-labelledby={groupLabelId} className="verify-digits">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          aria-label={digitLabel(i + 1)}
          aria-invalid={invalid}
          disabled={disabled}
          value={d}
          className={`verify-digit ${invalid ? "verify-digit--invalid" : ""}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
