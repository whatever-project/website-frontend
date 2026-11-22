"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { DraftLang } from "@/components/DraftLang";
import { Flourish, InkDivider, WaxSeal } from "@/components/Parchment";
import { DRAFT_PREFIX } from "@/config/routes";
import { EMAIL_RE } from "@/utils/validation";
import {
  CODE_EXPIRY_MINUTES,
  CODE_LENGTH,
  MAX_ATTEMPTS,
  MOCK_CODE,
  RESEND_COOLDOWN_SECONDS,
  VERIFY_COPY_BY_LANG,
  VERIFY_DELAY_MS,
  type VerifyError,
  type VerifyInitial,
  type VerifyView,
} from "../../_mock/verify";
import CodeInput from "./CodeInput";
import PaperLetter from "./PaperLetter";

/*
 * Email-verification modal, shared by signup step 3 and the "log in with an unverified email" path.
 * Draft only: no request is made. `MOCK_CODE` is the only correct code. See CONTEXT.md §5 for what the real back end must do.
 * Styles live here (scoped under .verify-modal) so the modal looks the same on any page; the button copies the login dialog's button look.
 *
 * Leaving: verification is mandatory but the dialog is dismissible. X and Esc open an "exit?" confirmation (stay / later); the backdrop does
 * nothing. "Later" calls `onClose`, which keeps the account unverified (the page decides how the user comes back).
 */
const VERIFY_CSS = `
.verify-modal { font-family: 'IBM Plex Sans Thai', 'Google Sans', sans-serif; font-size: 14px; color: #4a3820; user-select: text; -webkit-user-select: text; }
.verify-modal .verify-title { font-size: clamp(1.45rem, 6vw, 1.875rem); line-height: 1.25; }
.verify-modal .verify-text { font-size: 15px; line-height: 1.6; }
.verify-modal .verify-small { font-size: 13px; line-height: 1.5; color: #6b5533; }
/* the "new email" field label: same look as .verify-small (the "current email" line above it) */
.verify-modal .verify-label { display: block; margin-bottom: 8px; font-size: 13px; line-height: 1.5; color: #6b5533; }

/* six code boxes: together exactly as wide as the notice, message and button (no max width); at least 44px wide and tall, even at 360px */
.verify-modal .verify-digits { display: flex; width: 100%; gap: 4px; }
@media (min-width: 400px) { .verify-modal .verify-digits { gap: 8px; } }
.verify-modal .verify-digit {
  flex: 1 1 0; min-width: 0; height: 3.75rem; padding: 0;
  text-align: center; font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; color: #3a2c1a;
  background: rgba(255, 252, 240, 0.75); border: 1px solid #b89a63; border-radius: 0;
}
.verify-modal .verify-digit:focus-visible { outline: 2px solid #8a6a35; outline-offset: 1px; border-color: #5c1d17; }
.verify-modal .verify-digit:disabled { opacity: 0.5; cursor: not-allowed; }
.verify-modal .verify-digit--invalid { border: 2px solid #8a2a1f; background: rgba(138, 42, 31, 0.07); }

/* primary button: same look as the landing login dialog's submit button (see signup page .signup-btn) */
.verify-modal .verify-btn {
  display: block; width: 100%; min-height: 44px; text-align: center; text-decoration: none; cursor: pointer;
  font-family: 'Montserrat', 'Jim Thompson Roman', 'Google Sans', sans-serif;
  font-weight: 400; font-size: 16px; letter-spacing: 0.22em; line-height: 1.5; text-transform: uppercase;
  padding: 10px 0 12px;
  box-shadow: 0 3px 8px rgba(50, 36, 14, 0.22), inset 0 1px 0 rgba(233, 217, 174, 0.2);
}
.verify-modal .verify-btn:disabled { cursor: not-allowed; }
.verify-modal .verify-btn:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(50, 36, 14, 0.3), 0 0 10px rgba(190, 150, 80, 0.2); }
.verify-modal .verify-btn:focus-visible { outline: 2px solid #8a6a35; outline-offset: 3px; }
.verify-modal .verify-btn:lang(en) { font-weight: 500; letter-spacing: 4px; }
.verify-modal .verify-btn:lang(en) > span { display: inline-block; transform: scale(0.8); }

/* text links (also real <button>s): plain inline hyperlinks that take no extra space around the text; they follow the surrounding font.
   The tap target is enlarged with an invisible ::after instead of padding / min-height. */
.verify-modal .verify-link {
  display: inline; position: relative; margin: 0; padding: 0; min-height: 0;
  font: inherit; line-height: inherit; color: #3a2c1a; text-decoration: underline; text-underline-offset: 3px;
  background: none; border: 0; cursor: pointer;
}
.verify-modal .verify-link::after { content: ""; position: absolute; inset: -10px -6px; }
.verify-modal .verify-link:hover:not(:disabled) { color: #6b4f22; }
.verify-modal .verify-link:disabled { opacity: 0.5; cursor: not-allowed; }
.verify-modal .verify-link:focus-visible { outline: 2px solid #8a6a35; outline-offset: 1px; }
.verify-modal .verify-close {
  position: absolute; top: 10px; right: 10px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
  color: rgba(107, 85, 51, 0.65); background: none; border: 0; cursor: pointer; transition: color 0.2s;
}
.verify-modal .verify-close:hover { color: #3a2c1a; }
.verify-modal .verify-close:focus-visible { outline: 2px solid #8a6a35; outline-offset: -4px; }
.verify-modal .verify-title:focus { outline: none; }
/* content switch (verification <-> exit confirmation): only the content fades in, the paper stays where it is */
@keyframes verify-fade-in { from { opacity: 0; } to { opacity: 1; } }
.verify-modal .verify-fade { animation: verify-fade-in 180ms ease-out; }
@media (prefers-reduced-motion: reduce) { .verify-modal .verify-fade { animation: none; } }
/* the seal's check mark: same size and font on every page (the signup page's own ".signup-scope .font-display" rule would shrink it to 13px) */
.verify-modal .wax-seal > span { font-family: 'Cormorant Garamond', 'Prompt', serif; font-size: 24px; font-weight: 600; line-height: 1; }
.verify-modal .ink-divider { margin: 0.6rem 0; }
`;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const FOCUSABLE =
  'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])';

/** Where the verified screen leads (automatically after REDIRECT_SECONDS, or at once with X / Esc). Draft only: the live page uses the real post-verification route (the copy says "Character Selection"). */
const AFTER_VERIFY_HREF = `${DRAFT_PREFIX}/account`;
const REDIRECT_SECONDS = 3;
/** If navigation has not happened this long after the countdown ended, a fallback link appears. */
const REDIRECT_STALL_MS = 4000;

const blankDigits = () => Array<string>(CODE_LENGTH).fill("");

export default function VerifyEmailModal({
  email: initialEmail,
  variant,
  lang,
  onClose,
  onUseDifferentAccount,
  onVerified,
  onEmailChanged,
  initial,
}: {
  email: string;
  variant: "signup" | "login";
  lang: DraftLang;
  /** The user chose "Later" in the exit confirmation. The account stays unverified. */
  onClose: () => void;
  /** Login variant only: "Use a different account" (back to the login form). */
  onUseDifferentAccount?: () => void;
  /** The code was accepted (the "Email verified" view is shown). */
  onVerified?: () => void;
  /** The pending address was changed in the "Change email" view. */
  onEmailChanged?: (email: string) => void;
  /** Draft preview: start in a given state. */
  initial?: VerifyInitial;
}) {
  const COPY = VERIFY_COPY_BY_LANG[lang];
  const router = useRouter();
  const uid = useId();
  const titleId = `${uid}-title`;
  const codeLabelId = `${uid}-code-label`;
  const confirmBodyId = `${uid}-confirm-body`;
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const newEmailRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<VerifyView>(initial?.view ?? "code");
  const [email, setEmail] = useState(initialEmail);
  const [digits, setDigits] = useState<string[]>(blankDigits);
  const [attemptsLeft, setAttemptsLeft] = useState(
    initial?.attemptsLeft ?? MAX_ATTEMPTS,
  );
  const [error, setError] = useState<VerifyError>(initial?.error ?? null);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  // Two different clocks, both measured against a deadline (not by counting ticks) so they stay right after the tab was in the background:
  // how long the CURRENT code is valid, and when another code may be requested.
  const [expiresAt, setExpiresAt] = useState(
    () => Date.now() + (initial?.error === "expired" ? 0 : CODE_EXPIRY_MINUTES * 60_000),
  );
  const [resendAt, setResendAt] = useState(
    () => Date.now() + (initial?.secondsLeft ?? RESEND_COOLDOWN_SECONDS) * 1000,
  );
  const [now, setNow] = useState(() => Date.now());
  const [resending, setResending] = useState(false);
  const [changing, setChanging] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [focusSignal, setFocusSignal] = useState(0);
  // which code box takes focus when `focusSignal` changes (0 = the first; the "incomplete code" message points at the first empty one)
  const [focusIndex, setFocusIndex] = useState(0);
  const [incomplete, setIncomplete] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newEmailTouched, setNewEmailTouched] = useState(false);
  // The exit confirmation is a state of THIS dialog (not another dialog); the draft Preview panel can open straight on it.
  const [confirmExit, setConfirmExit] = useState(initial?.confirmExit ?? false);
  // Verified view: auto-redirect countdown. `redirected` makes the navigation happen exactly once whatever triggers it (countdown, X, Esc).
  const [redirectIn, setRedirectIn] = useState(REDIRECT_SECONDS);
  const [navStalled, setNavStalled] = useState(initial?.navStalled ?? false);
  const redirected = useRef(false);
  // Draft preview only: "verified" opened from the Preview panel stays put (frozen at 3) so the success state can be inspected.
  const holdForPreview = initial?.view === "verified";
  // Draft preview: the first "send a code" request fails once (resend or change email), the retry succeeds.
  const failNextSend = useRef(initial?.resendFails ?? false);

  // What had focus before the modal opened (read during the first render, i.e. before the first digit box takes focus).
  const [opener] = useState<HTMLElement | null>(() =>
    typeof document === "undefined"
      ? null
      : (document.activeElement as HTMLElement | null),
  );

  const expiresLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const resendLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));
  const attemptsExhausted = error === "wrong" && attemptsLeft === 0;
  const locked = error === "expired" || attemptsExhausted;
  // A dead code (expired / out of attempts) may be replaced at once; the cooldown only throttles resends of a code that is still alive.
  const canResend = locked || resendLeft === 0;
  const busy = verifying || resending || changing;

  const goToCharacterCreate = () => {
    if (redirected.current) return;
    redirected.current = true;
    router.push(AFTER_VERIFY_HREF);
  };
  const requestExit = () => {
    // Nothing is left to confirm once the email is verified: leaving then goes where the countdown is going anyway.
    if (view === "verified") goToCharacterCreate();
    else setConfirmExit(true);
  };
  // Back to the verification: only the rendered content changes (digits, attempts, timers and errors are kept, nothing is resent).
  const stay = () => {
    setFocusIndex(Math.max(0, digits.findIndex((d) => d === "")));
    setConfirmExit(false);
  };
  const leave = () => {
    setConfirmExit(false);
    onClose();
  };

  // The window-level Esc listener is registered once, so it reads the latest handlers through a ref.
  const latest = useRef({ confirmExit, requestExit, stay });
  useEffect(() => {
    latest.current = { confirmExit, requestExit, stay };
  });

  // Esc asks (or, inside the confirmation, stays); the page behind must not scroll; focus goes back to whatever opened the dialog.
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    // Capture phase + stopPropagation: Esc belongs to this dialog alone, so a dialog underneath (the landing login sheet) never also
    // closes, whatever the order its own window listener was registered in.
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (latest.current.confirmExit) latest.current.stay();
      else latest.current.requestExit();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      root.style.overflow = prevOverflow;
      opener?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clock tick. Also on visibilitychange: timers are throttled in background tabs, so re-read the clock when the user comes back from the mail app.
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  // Mock of the real rule: a code is valid for CODE_EXPIRY_MINUTES, then it is dead and the user must request a new one.
  useEffect(() => {
    if (view === "verified" || expiresLeft > 0) return;
    setDigits(blankDigits());
    setError("expired");
  }, [expiresLeft, view]);

  // Announced once (not every second) so a screen reader user hears that resending is possible again.
  const prevResendLeft = useRef(resendLeft);
  useEffect(() => {
    if (prevResendLeft.current > 0 && resendLeft === 0) setAnnounce(COPY.resendReady);
    prevResendLeft.current = resendLeft;
  }, [resendLeft, COPY.resendReady]);

  // Focus: the first digit box is handled by CodeInput; the other views (and the locked state, whose boxes are disabled) focus their own control.
  useEffect(() => {
    if (view === "change") newEmailRef.current?.focus();
    else if (view === "verified" || locked) titleRef.current?.focus();
  }, [view, locked]);

  // The confirmation moves focus to its heading (not to a button, so no button shows a focus ring on its own; the heading has no outline and
  // keeps focus inside the dialog for keyboard / screen reader users). When the user goes back, the code view refocuses its first empty box
  // by itself (CodeInput mounts again, see `stay`); the other views focus their own control.
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (confirmExit) titleRef.current?.focus();
    else if (wasConfirming.current) {
      if (view === "change") newEmailRef.current?.focus();
      else if (locked) titleRef.current?.focus();
    }
    wasConfirming.current = confirmExit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmExit]);

  // Verified: count 3 -> 2 -> 1, then navigate once. One timeout per step, cleared on every re-run and on unmount.
  useEffect(() => {
    if (view !== "verified" || holdForPreview) return;
    if (redirectIn <= 0) {
      goToCharacterCreate();
      return;
    }
    const t = window.setTimeout(() => setRedirectIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, redirectIn, holdForPreview]);

  // Only if navigation did not happen shortly after the countdown ended: offer a plain link instead of leaving the user stuck.
  useEffect(() => {
    if (view !== "verified" || holdForPreview || redirectIn > 0) return;
    const t = window.setTimeout(() => setNavStalled(true), REDIRECT_STALL_MS);
    return () => window.clearTimeout(t);
  }, [view, redirectIn, holdForPreview]);

  const trapTab = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    const nodes = Array.from(root?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !root?.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !root?.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  /** A new code is in force: both clocks restart, the old code is dead, attempts are back to the maximum. */
  const freshCode = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setExpiresAt(t + CODE_EXPIRY_MINUTES * 60_000);
    setResendAt(t + RESEND_COOLDOWN_SECONDS * 1000);
    setDigits(blankDigits());
    setError(null);
    setAttemptsLeft(MAX_ATTEMPTS);
    setSendError(false);
    setSent(true);
    setAnnounce("");
    setIncomplete(false);
    setFocusIndex(0);
    setFocusSignal((n) => n + 1);
  }, []);

  /** Mock of "ask the server to send a code". Resolves false when sending failed (draft: `initial.resendFails`, first time only). */
  const requestNewCode = () =>
    new Promise<boolean>((resolve) => {
      window.setTimeout(() => {
        const fail = failNextSend.current;
        failNextSend.current = false;
        resolve(!fail);
      }, VERIFY_DELAY_MS);
    });

  const resend = async () => {
    if (busy || !canResend) return;
    setResending(true);
    setSendError(false);
    setSent(false);
    const ok = await requestNewCode();
    setResending(false);
    if (ok) freshCode();
    else setSendError(true); // timers are NOT restarted: nothing was sent
  };

  /** The Verify button / Enter: the code is normally submitted by itself on the 6th digit, so this mostly meets an incomplete code. */
  const handleSubmit = () => {
    if (busy || locked) return;
    if (digits.some((d) => d === "")) {
      setIncomplete(true);
      setFocusIndex(digits.findIndex((d) => d === ""));
      setFocusSignal((n) => n + 1);
      return;
    }
    submitCode(digits.join(""));
  };

  const submitCode = (code: string) => {
    if (busy || locked || code.length !== CODE_LENGTH) return;
    setIncomplete(false);
    setVerifying(true);
    setError(null);
    setSendError(false);
    setSent(false);
    window.setTimeout(() => {
      setVerifying(false);
      if (code === MOCK_CODE) {
        setConfirmExit(false); // a verification that finishes behind the exit confirmation still wins
        setView("verified");
        onVerified?.();
        return;
      }
      setAttemptsLeft((left) => Math.max(0, left - 1));
      setError("wrong");
      setDigits(blankDigits());
      setFocusIndex(0);
      setFocusSignal((n) => n + 1);
    }, VERIFY_DELAY_MS);
  };

  const handleChangeDigits = (next: string[]) => {
    setDigits(next);
    setIncomplete(false);
    if (error === "wrong" && attemptsLeft > 0) setError(null);
    setSendError(false);
    setSent(false);
  };

  const trimmedNewEmail = newEmail.trim();
  const newEmailErr = !trimmedNewEmail
    ? null
    : !EMAIL_RE.test(trimmedNewEmail)
      ? COPY.emailErrFormat
      : trimmedNewEmail.toLowerCase() === email.toLowerCase()
        ? COPY.emailErrSame
        : null;
  const submitNewEmail = async (e: FormEvent) => {
    e.preventDefault();
    setNewEmailTouched(true);
    if (!trimmedNewEmail || newEmailErr || changing) return;
    setChanging(true);
    setSendError(false);
    const ok = await requestNewCode();
    setChanging(false);
    if (!ok) {
      setSendError(true);
      return;
    }
    setEmail(trimmedNewEmail);
    onEmailChanged?.(trimmedNewEmail);
    setNewEmail("");
    setNewEmailTouched(false);
    setView("code");
    freshCode();
  };

  const errorText =
    error === "expired"
      ? COPY.expired
      : error === "wrong"
        ? attemptsLeft === 0
          ? COPY.locked
          : COPY.wrongCode(attemptsLeft)
        : "";

  // The exit confirmation replaces the content of this same dialog (never shown once verified).
  const exiting = confirmExit && view !== "verified";
  const heading = exiting
    ? COPY.confirmTitle
    : view === "change"
      ? COPY.changeTitle
      : view === "verified"
        ? COPY.verifiedTitle
        : COPY.title;

  return (
    <div lang={lang} className="verify-modal" onKeyDown={trapTab}>
      <style>{VERIFY_CSS}</style>

      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2a1f10]/45 backdrop-blur-[2px]">
        <div className="flex min-h-full items-center justify-center px-4 py-8">
          {/* ONE dialog. X / Esc switch its content to the exit confirmation ("exiting") and back; nothing is stacked on top of it. */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={exiting ? confirmBodyId : undefined}
            className="w-full max-w-[37.8rem]"
          >
            <PaperLetter>
              {/* No X once verified (the page moves on by itself; Esc still works as an invisible shortcut to the next page) and none on the
                  exit confirmation, where the two buttons are the only choices (Esc goes back). */}
              {view !== "verified" && !exiting && (
                <button
                  type="button"
                  className="verify-close"
                  onClick={requestExit}
                  aria-label={COPY.close}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
              {/* keyed by the state so only the content fades in on a switch (paper, backdrop and X stay still) */}
              <div key={exiting ? "exit" : "main"} className="verify-fade text-center">
                {view === "verified" && (
                  <WaxSeal letter="✓" size={60} className="mx-auto mb-4" />
                )}
                <h2
                  id={titleId}
                  ref={titleRef}
                  tabIndex={-1}
                  className="font-jimthompson verify-title text-[#3a2c1a]"
                >
                  {heading}
                </h2>
                <InkDivider>
                  <Flourish className="h-4 w-4" />
                </InkDivider>

                {/* ── exit confirmation (same dialog) ── */}
                {exiting && (
                  <>
                    <p id={confirmBodyId} className="verify-text">
                      {COPY.confirmBody}
                    </p>
                    <button
                      type="button"
                      className="parch-btn verify-btn mt-5"
                      onClick={stay}
                    >
                      <span>{COPY.confirmStay}</span>
                    </button>
                    <div className="verify-small mt-4 flex justify-center">
                      <button type="button" className="verify-link" onClick={leave}>
                        {COPY.confirmLeave}
                      </button>
                    </div>
                  </>
                )}

                {/* ── code ── */}
                {!exiting && view === "code" && (
                  <>
                    {/* same layout for the signup and the unverified-login variants; only the first sentence differs */}
                    <p className="verify-text">
                      {variant === "login"
                        ? COPY.loginNoticeBefore
                        : COPY.sentBefore}{" "}
                      <strong className="wrap-break-word font-medium text-[#3a2c1a]">
                        {email}
                      </strong>
                      {attemptsExhausted ? (
                        <>
                          <br />
                          {COPY.codeInvalid}
                        </>
                      ) : (
                        expiresLeft > 0 && (
                          <>
                            <br />
                            {/* how long THIS code is valid (not the resend cooldown, which is the separate line under the button) */}
                            <span role="timer">{COPY.validFor(formatTime(expiresLeft))}</span>
                          </>
                        )
                      )}
                    </p>

                    <form
                      className="mt-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      noValidate
                    >
                      <span id={codeLabelId} className="sr-only">
                        {COPY.codeLabel}
                      </span>
                      <CodeInput
                        digits={digits}
                        onChange={handleChangeDigits}
                        onComplete={submitCode}
                        disabled={locked || busy}
                        invalid={error !== null || incomplete}
                        groupLabelId={codeLabelId}
                        digitLabel={COPY.digitLabel}
                        focusSignal={focusSignal}
                        focusIndex={focusIndex}
                      />

                      {/* Messages sit tight under the boxes, like the error under the email field in the change-email view: nothing is
                          reserved, so the paper grows a little when one appears. The two wrappers stay mounted for screen readers. */}
                      <div role="alert" className="text-left text-[#8a2a1f]">
                        {errorText && (
                          <p className="mt-1.5 text-[13px]">✕ {errorText}</p>
                        )}
                        {incomplete && !error && (
                          <p className="mt-1.5 text-[13px]">✕ {COPY.codeIncomplete}</p>
                        )}
                        {sendError && (
                          <p className="mt-1.5 text-[13px]">✕ {COPY.sendFailed}</p>
                        )}
                      </div>
                      <div role="status" className="text-left text-[#4d6b32]">
                        {sent && !error && (
                          <p className="mt-1.5 text-[13px]">
                            ✓ {COPY.newCodeSent}
                          </p>
                        )}
                      </div>

                      {locked ? (
                        // expired or out of attempts: the way forward is a new code, so that is the primary action
                        <button
                          type="button"
                          className="parch-btn verify-btn mt-5"
                          onClick={resend}
                          disabled={busy}
                        >
                          <span>{resending ? COPY.resending : COPY.newCodeCta}</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="parch-btn verify-btn mt-5"
                          disabled={busy}
                        >
                          <span>
                            {verifying
                              ? COPY.verifying
                              : variant === "login"
                                ? COPY.verifyLogin
                                : COPY.verify}
                          </span>
                        </button>
                      )}
                    </form>

                    {/* One centred stack with an even 12px rhythm, the same in every state (when locked the resend line is simply absent:
                        the primary button is the resend). The links sit inside the text like normal hyperlinks. */}
                    <div className="mt-5 space-y-3 text-center">
                      {!locked && (
                        <p className="verify-small">
                          {COPY.noEmail}{" "}
                          {resendLeft > 0 ? (
                            COPY.resendIn(formatTime(resendLeft))
                          ) : (
                            <button
                              type="button"
                              className="verify-link"
                              onClick={resend}
                              disabled={busy}
                            >
                              {resending ? COPY.resending : COPY.resend}
                            </button>
                          )}
                        </p>
                      )}
                      <p className="verify-small">{COPY.spamHint}</p>
                      <p className="verify-small">
                        <button
                          type="button"
                          className="verify-link"
                          onClick={() => {
                            if (busy) return; // not `disabled`: it must not dim while another control (resend) is busy
                            setSendError(false);
                            setView("change");
                          }}
                          aria-disabled={busy || undefined}
                        >
                          {COPY.changeLink}
                        </button>
                        {variant === "login" && onUseDifferentAccount && (
                          <>
                            <span aria-hidden="true" className="mx-2">
                              ·
                            </span>
                            <button
                              type="button"
                              className="verify-link"
                              onClick={onUseDifferentAccount}
                            >
                              {COPY.useDifferent}
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                    <span role="status" className="sr-only">
                      {announce}
                    </span>
                  </>
                )}

                {/* ── change email ── */}
                {!exiting && view === "change" && (
                  <form
                    onSubmit={submitNewEmail}
                    noValidate
                    className="text-left"
                  >
                    <p className="verify-small">{COPY.currentEmail}</p>
                    <p className="verify-text mb-4 wrap-break-word font-medium text-[#3a2c1a]">
                      {email}
                    </p>

                    <label htmlFor={`${uid}-new-email`} className="verify-label">
                      {COPY.newEmail}
                    </label>
                    <input
                      id={`${uid}-new-email`}
                      ref={newEmailRef}
                      type="email"
                      autoComplete="email"
                      className="parch-input w-full font-serithai"
                      style={
                        newEmailTouched && newEmailErr
                          ? { borderColor: "#8a2a1f" }
                          : undefined
                      }
                      placeholder={COPY.newEmailPlaceholder}
                      value={newEmail}
                      disabled={changing}
                      aria-invalid={newEmailTouched && !!newEmailErr}
                      aria-describedby={
                        newEmailTouched && newEmailErr
                          ? `${uid}-new-email-err`
                          : undefined
                      }
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setSendError(false);
                      }}
                      onBlur={() => setNewEmailTouched(true)}
                    />
                    <div role="alert" id={`${uid}-new-email-err`}>
                      {newEmailTouched && newEmailErr && (
                        <p className="mt-1.5 text-[13px] text-[#8a2a1f]">
                          ✕ {newEmailErr}
                        </p>
                      )}
                      {sendError && (
                        <p className="mt-1.5 text-[13px] text-[#8a2a1f]">
                          ✕ {COPY.sendFailed}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="parch-btn verify-btn mt-5"
                      disabled={!trimmedNewEmail || !!newEmailErr || changing}
                    >
                      <span>{changing ? COPY.resending : COPY.sendNewCode}</span>
                    </button>
                    <div className="verify-small mt-5 flex justify-center">
                      <button
                        type="button"
                        className="verify-link"
                        onClick={() => {
                          if (changing) return; // not `disabled`: it must not dim while the new-address code is being sent
                          setSendError(false);
                          setView("code");
                        }}
                        aria-disabled={changing || undefined}
                      >
                        {COPY.backToCode}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── verified ── */}
                {view === "verified" && (
                  <>
                    <p className="verify-text mb-2">
                      {/* both parts are inline-blocks: on a narrow screen the sentence moves down as a whole instead of being split mid-phrase,
                          and only an address longer than the screen is broken */}
                      <strong className="inline-block max-w-full wrap-break-word font-medium text-[#3a2c1a]">
                        {email}
                      </strong>{" "}
                      <span className="inline-block">{COPY.verifiedBody}</span>
                    </p>
                    {/* Announced once for screen readers; the ticking number below is hidden from them so it is not read every second. */}
                    <span role="status" className="sr-only">
                      {COPY.redirectingSr}
                    </span>
                    {navStalled ? (
                      <>
                        <p className="verify-text">{COPY.redirectFallbackText}</p>
                        <div className="verify-small mt-3 flex justify-center">
                          <Link href={AFTER_VERIFY_HREF} className="verify-link">
                            {COPY.redirectFallback}
                          </Link>
                        </div>
                      </>
                    ) : (
                      <p className="verify-text" aria-hidden="true">
                        {COPY.redirecting(Math.max(1, redirectIn))}
                      </p>
                    )}
                  </>
                )}
              </div>
            </PaperLetter>
          </div>
        </div>
      </div>
    </div>
  );
}
