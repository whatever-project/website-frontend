"use client";

import { useDraftLang } from "@/components/DraftLang";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, FormEvent } from "react";
import {
  ParchShell,
  InkDivider,
  Flourish,
  WaxSeal,
  SheetCorners,
  PasswordInput,
} from "@/components/Parchment";
import LetterStack from "@/components/LetterStack";
import { routes } from "@/config/routes";
import {
  EMAIL_RE,
  getPasswordChecks,
  validateUsername,
} from "@/utils/validation";
import { COPY_BY_LANG, TERMS_BY_LANG, SAMPLE_EMAIL } from "./_mock/copy";
import { DEV_PREVIEW_ENABLED } from "../landing/_components/draft-tools/devPreviewFlag";
import DeviceButtons from "../landing/_components/draft-tools/DeviceButtons";
import {
  replacePreviewSearch,
  usePreviewRoute,
  writeDeviceParams,
  type DeviceSpec,
} from "../landing/_components/draft-tools/previewRoute";
import DevicePreviewHost from "./_components/DevicePreviewHost";
import {
  SIGNUP_PREVIEW_SET_EVENT,
  SIGNUP_PREVIEW_STATUS_EVENT,
  readSignupState,
  writeSignupStateParams,
  type SignupPreviewState,
} from "./_components/previewBridge";

/*
 * Typography scoped to the signup content only (.signup-scope).
 * Unlayered .parch-* rules in globals.css beat Tailwind's layered utilities,
 * so a scoped selector with higher specificity is used instead of !important.
 * Jim Thompson Roman: the two headings (font-jimthompson) and .parch-btn.
 */
const SIGNUP_FONT_CSS = `
.signup-scope { font-family: 'IBM Plex Sans Thai', 'Google Sans', sans-serif; font-size: 13px; }
.signup-scope .font-display,
.signup-scope .font-serif2,
.signup-scope .font-ui,
.signup-scope .parch-label,
.signup-scope .parch-input {
  font-family: 'IBM Plex Sans Thai', 'Google Sans', sans-serif;
  font-size: 13px;
}
.signup-scope .parch-input::placeholder { font-size: 15px; }
/* wizard step names: 13px, vertically centred with the circle */
.signup-scope .signup-wizard-label { font-size: 14px; line-height: 1; letter-spacing: normal; }
/* digits in IBM Plex Sans Thai sit slightly high: nudge them down so they look centred in the circle (all sizes) */
.signup-scope .signup-wizard-circle { line-height: 1; padding: 0.28em 0 0; }
/* "scroll to the end" notice (after the .font-ui 13px rule so it wins) */
.signup-scope .signup-agree-hint { font-size: 11px; line-height: 1.4; }
/* form labels: wider letters, equal 10px gap to the input */
.signup-scope .signup-field-label { letter-spacing: 0.06em; text-transform: none; margin-bottom: 10px; font-weight: 600; }
/* step 3 (verify email) body text: 15px */
.signup-scope .signup-verify .font-serif2,
.signup-scope .signup-verify .font-ui { font-size: 15px; }
/* requirement box titles: normal letter-spacing */
.signup-scope .signup-hint-title { letter-spacing: normal; text-transform: none; }
/* terms list: number column + hanging text, stable width while scrolling */
.signup-scope .signup-terms li {
  font-size: 16px; line-height: 1.7; text-align: left; overflow-wrap: break-word;
}
.signup-scope .signup-terms .term-num {
  font-family: 'IBM Plex Sans Thai', 'Google Sans', sans-serif;
  font-size: 16px; line-height: 1.7; font-variant-numeric: tabular-nums;
}
.signup-scope .parch-btn { font-family: 'Jim Thompson Roman', 'Serithai', 'Google Sans', serif; }

/* page scrollbar: transparent track, no arrow buttons, no white strip */
html { background: #e0cfa5; }
html::-webkit-scrollbar { width: 20px; height: 20px; }
html::-webkit-scrollbar-track { background: transparent; }
html::-webkit-scrollbar-thumb {
  background: #8f867a; border-radius: 999px; border: 5px solid transparent; background-clip: padding-box;
}
html::-webkit-scrollbar-thumb:hover { background: #766d61; background-clip: padding-box; }
html::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
@supports not selector(::-webkit-scrollbar) {
  html { scrollbar-color: #8f867a transparent; scrollbar-width: thin; }
}
/* terms box: scrollbar hidden (still scrolls with wheel / touch / keys); the page requires reading to the end instead */
.signup-scope .signup-terms { scrollbar-width: none; }
.signup-scope .signup-terms::-webkit-scrollbar { display: none; }

/* tablet (640-1023px): everything a step smaller, single column kept narrow and centred */
@media (max-width: 1023px) {
  .parch-bg h1 { font-size: 3rem; }
  .signup-scope .signup-wrap { padding: 2rem; }
  .signup-scope .parch-sheet { max-width: 36rem; margin-inline: auto; }
  .signup-scope .parch-sheet h2 { font-size: 1.75rem; }
  .signup-scope .signup-terms { max-height: min(28rem, 55vh); }
  .signup-scope .signup-terms li, .signup-scope .signup-terms .term-num { font-size: 15px; }
  .signup-scope .signup-verify .font-serif2, .signup-scope .signup-verify .font-ui { font-size: 14px; }
}
/* mobile (<640px): sizes scale with the viewport width so 375 / 390 / 430 all fit */
@media (max-width: 639px) {
  .parch-bg h1 { font-size: clamp(1.9rem, 9.5vw, 2.5rem); margin-top: -0.75rem; }
  .signup-scope .signup-wrap { padding: 1.75rem 1rem 1.5rem; }
  .signup-scope .parch-sheet { padding: 1.25rem; }
  .signup-scope .parch-sheet h2 { font-size: clamp(1.25rem, 6vw, 1.6rem); margin-top: 0; }
  .signup-scope .parch-sheet h2.signup-terms-title { margin-top: 1.25rem; }
  /* compact wizard: 36px circles, 13px labels under them, tighter vertical space */
  .signup-scope .signup-wizard { margin-top: -0.25rem; }
  .signup-scope .signup-wizard-step { gap: 0.5rem; }
  .signup-scope .signup-wizard-circle { width: 24px; height: 24px; font-size: 11px; }
  .signup-scope .signup-wizard-connector { margin-top: 12px; }
  .signup-scope .signup-wizard-label { font-size: 12px; letter-spacing: normal; }
  .signup-scope .signup-terms { max-height: min(22rem, 46vh); padding: 0.75rem; }
  .signup-scope .signup-agree { padding-left: 0.75rem; }
  .signup-scope .signup-terms li { grid-template-columns: 1.5rem 1fr; column-gap: 0.5rem; }
  .signup-scope .signup-terms li, .signup-scope .signup-terms .term-num { font-size: clamp(12.5px, 3.6vw, 14.5px); line-height: 1.6; }
  .signup-scope .parch-btn { font-size: 15px; }
  .signup-scope .signup-verify .verify-title { font-size: clamp(1rem, 5.2vw, 1.3rem); margin-bottom: 0.4rem; }
  .signup-scope .signup-verify .verify-divider .ink-divider { margin: clamp(0.2rem, 1.6vw, 0.5rem) 0; gap: 8px; }
  .signup-scope .signup-verify .verify-divider svg { width: 0.75rem; height: 0.75rem; }
  .signup-scope .signup-verify .font-serif2, .signup-scope .signup-verify .font-ui { font-size: clamp(11.5px, 3.2vw, 13px); line-height: 1.45; }
  .signup-scope .signup-verify .font-ui { margin-top: 0.3rem; }
  /* all signup steps on mobile only: a lighter page background (the vignette and dark corner gradients are toned down) */
  .parch-bg:has(.signup-scope) {
    background:
      radial-gradient(120% 90% at 50% 0%, rgba(255, 248, 225, 0.15), transparent 60%),
      repeating-linear-gradient(0deg, rgba(120, 90, 45, 0.02) 0 2px, transparent 2px 5px),
      linear-gradient(160deg, #e6d9b4 0%, #dfcda5 50%, #d7c295 100%);
  }
  .parch-bg:has(.signup-scope) > .parch-vignette { opacity: 0.75; }
}
`;

export default function SignupDraft() {
  const { lang } = useDraftLang();
  const COPY = COPY_BY_LANG[lang];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [touched, setTouched] = useState<{
    user?: boolean;
    email?: boolean;
    pass?: boolean;
  }>({});

  // Draft-only preview toggles
  const [showApiError, setShowApiError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Terms must be read to the end before the checkbox / Next unlock. If the text already fits in the box (no scrolling
  // needed, e.g. wide desktop), it counts as read. Once read it stays read.
  const termsRef = useRef<HTMLOListElement>(null);
  const [readAll, setReadAll] = useState(false);
  const checkTermsEnd = () => {
    const el = termsRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 4) setReadAll(true);
  };
  useEffect(() => {
    const el = termsRef.current;
    if (!el) return;
    checkTermsEnd();
    const ro = new ResizeObserver(checkTermsEnd);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step, lang]);

  // Developer device preview (dev builds only). The route (?device= &w= &h= &embed=) is the landing draft's; the signup preview state
  // (?step= &err= &loading=) is ./_components/previewBridge. `device` => this page is the host; `embed` => this page is inside its iframe.
  const preview = usePreviewRoute();
  const inHost = !!preview.device && !preview.embed;
  useEffect(() => {
    if (!DEV_PREVIEW_ENABLED || inHost) return;
    // Mount (normal page / embedded frame) and return from the host: adopt the preview state carried in the URL.
    const next = readSignupState(window.location.search);
    setStep(next.step);
    setShowApiError(next.showApiError);
    setShowLoading(next.showLoading);
  }, [inHost]);
  // Host -> this page (embedded): preview selections arrive as events, so the form is never reloaded.
  useEffect(() => {
    if (!preview.embed) return;
    const onSet = (event: Event) => {
      const d = (event as CustomEvent<Partial<SignupPreviewState>>).detail;
      if (d.step) setStep(d.step);
      if (typeof d.showApiError === "boolean") setShowApiError(d.showApiError);
      if (typeof d.showLoading === "boolean") setShowLoading(d.showLoading);
    };
    window.addEventListener(SIGNUP_PREVIEW_SET_EVENT, onSet);
    return () => window.removeEventListener(SIGNUP_PREVIEW_SET_EVENT, onSet);
  }, [preview.embed]);
  // This page (embedded) -> host: report the step so the host's buttons follow Next / submit.
  useEffect(() => {
    if (!preview.embed || window.parent === window) return;
    const parent = window.parent as Window & typeof globalThis;
    parent.dispatchEvent(
      new parent.CustomEvent(SIGNUP_PREVIEW_STATUS_EVENT, { detail: { step } }),
    );
  }, [preview.embed, step]);
  const enterDevice = (device: DeviceSpec) =>
    replacePreviewSearch((p) => {
      writeDeviceParams(p, device);
      writeSignupStateParams(p, { step, showApiError, showLoading });
    });

  const userErrCode = validateUsername(form.username);
  const userErr = userErrCode ? COPY.usernameErr[userErrCode] : null;
  const emailErr =
    form.email.length > 0 && !EMAIL_RE.test(form.email)
      ? COPY.emailErrFormat
      : null;

  const checks = getPasswordChecks(form.password);
  const passRules = [
    { ok: checks.length, label: COPY.passRules[0] },
    { ok: checks.digit, label: COPY.passRules[1] },
    { ok: checks.mixedCase, label: COPY.passRules[2] },
  ];
  const passOk = passRules.every((r) => r.ok);
  const formOk =
    !userErr &&
    form.username.length > 0 &&
    !emailErr &&
    form.email.length > 0 &&
    passOk;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ user: true, email: true, pass: true });
    if (!formOk) return;
    setStep(3);
  };

  // Preview host: the real page in a device-sized iframe (all hooks above have already run).
  if (preview.device && !preview.embed) {
    return (
      <DevicePreviewHost
        device={preview.device}
        initial={readSignupState(window.location.search)}
      />
    );
  }

  return (
    <>
      {preview.embed && (
        <style>{`a[href="/draft/dev-tools"] { display: none !important; }
/* inside the device frame the document scrolls like a phone: no visible page scrollbar, full-width content (still scrollable) */
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; width: 0; height: 0; }`}</style>
      )}
      <ParchShell title={step === 3 ? "" : COPY.pageTitle} backHref={routes.home}>
        <style>{SIGNUP_FONT_CSS}</style>
        <div className="signup-scope">
        {/* step indicator */}
        {step !== 3 && (
          <div className="relative z-20 mx-auto signup-wizard mt-6 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-start gap-3 px-4 sm:gap-4">
            {[1, 2].map((s) => (
              <Fragment key={s}>
                <div
                  className={`signup-wizard-step flex flex-col items-center gap-3.5 ${s === 1 ? "justify-self-end" : "col-start-3 justify-self-start"}`}
                >
                  <div
                    className={`signup-wizard-circle flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-ibmplexsansthai text-sm transition-all ${
                      step === s
                        ? "border-[#4a3520] bg-[#4a3520] text-[#f3e6c8]"
                        : "border-[#b89a63] bg-transparent text-[#a68d5f]"
                    }`}
                  >
                    {s}
                  </div>
                  <span
                    className={`parch-label signup-wizard-label ${step === s ? "text-[#3a2c1a]" : ""}`}
                  >
                    {s === 1 ? COPY.stepTerms : COPY.stepAccountInfo}
                  </span>
                </div>
                {s === 1 && (
                  <span
                    aria-hidden="true"
                    className="signup-wizard-connector col-start-2 row-start-1 mt-4 flex h-px w-16 items-center gap-1.5 text-[#b89a63] sm:w-32 sm:gap-2 md:w-44 lg:gap-0"
                  >
                    <span className="h-px flex-1 bg-current" />
                    <span className="text-[10px] leading-none sm:text-xs lg:hidden">✦</span>
                    <span className="h-px flex-1 bg-current" />
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        )}

        {/* ── Step 1: Terms ── */}
        {step === 1 && (
          <div className="signup-wrap relative z-20 mx-auto grid max-w-[84rem] grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[1.35fr_1fr] lg:gap-28 min-[1400px]:grid-cols-[36rem_35rem] min-[1400px]:justify-center min-[1400px]:gap-20">
            <div className="parch-sheet relative p-8 sm:p-10">
              <h2 className="font-jimthompson signup-terms-title mt-4 text-center text-3xl text-[#3a2c1a]">
                {COPY.termsHeading}
              </h2>
              <InkDivider>
                <Flourish className="h-4 w-4" />
              </InkDivider>

              <ol
                ref={termsRef}
                onScroll={checkTermsEnd}
                tabIndex={0}
                aria-label={COPY.termsHeading}
                className="signup-terms my-5 max-h-[min(34rem,62vh)] space-y-3.5 overflow-y-auto p-5"
              >
                {TERMS_BY_LANG[lang].map((term, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2rem_1fr] gap-x-3 font-serif2 text-[#4a3820]"
                  >
                    <span className="term-num font-display text-[#8a6a35]">
                      {i + 1}.
                    </span>
                    {term}
                  </li>
                ))}
              </ol>

              <div
                aria-hidden="true"
                className="mb-5 h-px w-full bg-[linear-gradient(90deg,transparent,#b89a63_15%,#b89a63_85%,transparent)]"
              />

              {!readAll && (
                <p className="signup-agree signup-agree-hint mb-3 pl-5 font-ui text-[12px] text-[#8a2a1f]" role="status">
                  {COPY.scrollToAccept}
                </p>
              )}
              <label
                className={`signup-agree mb-6 flex items-center gap-3 pl-5 font-ui text-sm text-[#3a2c1a] ${readAll ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
              >
                <input
                  type="checkbox"
                  checked={agree}
                  disabled={!readAll}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="parch-check"
                />
                <span>
                  {COPY.iAgree}{" "}
                  <span className="text-[#a68d5f]">{COPY.iAgreeRequired}</span>
                </span>
              </label>

              <button
                type="button"
                className="parch-btn"
                disabled={!agree || !readAll}
                onClick={() => setStep(2)}
              >
                {COPY.next}
              </button>
            </div>

            <div className="relative hidden h-[460px] lg:block">
              <LetterStack />
            </div>
          </div>
        )}

        {/* ── Step 2: Account form ── */}
        {step === 2 && (
          <div className="signup-wrap relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[28rem_35rem] lg:justify-center lg:gap-16">
            <form
              onSubmit={handleSubmit}
              className="parch-sheet relative mx-auto w-full max-w-md p-8 sm:p-10 lg:mx-0"
            >
              <h2 className="font-jimthompson signup-terms-title mt-4 text-center text-3xl text-[#3a2c1a]">
                {COPY.formHeading}
              </h2>
              <InkDivider>
                <Flourish className="h-4 w-4" />
              </InkDivider>

              {showApiError && (
                <div className="mb-4 border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-sm text-[#8a2a1f]">
                  ⚠️ {COPY.sampleError}
                </div>
              )}

              <label
                htmlFor="signup-username"
                className="parch-label signup-field-label mt-4 block"
              >
                {COPY.username}
              </label>
              <input
                id="signup-username"
                className="parch-input w-full font-serithai"
                style={
                  touched.user && userErr
                    ? { borderColor: "#8a2a1f" }
                    : undefined
                }
                value={form.username}
                maxLength={25}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  setTouched((t) => ({ ...t, user: true }));
                }}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                required
              />
              {userFocus && (
                <div className="mt-2 border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-3 font-ui text-[12px]">
                  <p className="parch-label signup-hint-title mb-1">
                    {COPY.usernameRequirements}
                  </p>
                  <ul className="space-y-1 text-[#4a3820]">
                    {COPY.usernameRules.map((r) => (
                      <li key={r} className="flex items-baseline gap-3">
                        <span aria-hidden="true">✦</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {touched.user && userErr && (
                <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">
                  ✕ {userErr}
                </p>
              )}

              <label
                htmlFor="signup-email"
                className="parch-label signup-field-label mt-5 block"
              >
                {COPY.email}
              </label>
              <input
                id="signup-email"
                type="email"
                className="parch-input w-full font-serithai"
                style={
                  touched.email && emailErr
                    ? { borderColor: "#8a2a1f" }
                    : undefined
                }
                placeholder={COPY.emailPlaceholder}
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  setTouched((t) => ({ ...t, email: true }));
                }}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                required
              />
              {touched.email && emailErr && (
                <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">
                  ✕ {emailErr}
                </p>
              )}

              <label
                htmlFor="signup-password"
                className="parch-label signup-field-label mt-5 block"
              >
                {COPY.password}
              </label>
              <div
                onFocus={() => setPassFocus(true)}
                onBlur={() => setPassFocus(false)}
              >
                <PasswordInput
                  id="signup-password"
                  className="parch-input w-full font-serithai"
                  placeholder={COPY.passwordPlaceholder}
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    setTouched((t) => ({ ...t, pass: true }));
                  }}
                  minLength={8}
                  required
                />
              </div>
              {(passFocus || (touched.pass && !passOk)) && (
                <ul className="mt-2 space-y-1 border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-3 font-ui text-[12px]">
                  <li className="parch-label signup-hint-title mb-1">
                    {COPY.passwordRequirements}
                  </li>
                  {passRules.map((r) => (
                    <li
                      key={r.label}
                      className={`flex items-center gap-2 ${r.ok ? "text-[#5b7a3d]" : "text-[#8a2a1f]"}`}
                    >
                      <span className="w-4 text-center font-bold">
                        {r.ok ? "✓" : "✕"}
                      </span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8">
                <button
                  id="signup-submit"
                  type="submit"
                  disabled={showLoading}
                  className="parch-btn"
                >
                  {showLoading ? COPY.submitting : COPY.submit}
                </button>
              </div>

              <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
                {COPY.alreadyHaveAccount}{" "}
                <Link
                  href={routes.login}
                  className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
                >
                  {COPY.signIn}
                </Link>
              </p>
            </form>

            <div className="relative hidden h-[460px] lg:block">
              <LetterStack />
            </div>
          </div>
        )}

        {/* ── Step 3: Email verification (fantasy letter: paper.png + Letter seal.png) ── */}
        {step === 3 && (
          <div className="signup-wrap relative z-20 mx-auto flex min-h-[calc(100vh-11rem)] max-w-3xl items-center justify-center px-6 py-14">
            {/* Both images are 1500x1500 canvases with transparent margins. The box has the aspect of the visible paper
                (1370x809 px), and the paper image is offset inside it, so the whole sheet (tilt, torn edge) shows uncropped
                and un-stretched. Everything is positioned in % of this box, so it scales with it. */}
            <div className="signup-verify relative mx-auto aspect-[1370/809] w-full max-w-[38rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/paper.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-[-36.6%] left-[-4.53%] w-[109.5%] max-w-none select-none [filter:drop-shadow(0_14px_18px_rgba(60,40,15,.3))]"
              />

              <div className="absolute inset-x-[12%] top-[14%] bottom-[12%] z-10 flex flex-col items-center justify-center text-center">
                <h2 className="font-jimthompson verify-title text-3xl text-[#3a2c1a]">
                  {COPY.verifyHeading}
                </h2>
                <div className="verify-divider w-full">
                  <InkDivider>
                    <Flourish className="h-4 w-4" />
                  </InkDivider>
                </div>

                <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">
                  {COPY.verifyBody}
                </p>
                <p className="font-ui mt-2 text-[13px] text-[#6b5533]">
                  {COPY.verifyLetterSent}{" "}
                  <span className="font-medium text-[#3a2c1a]">
                    {form.email || SAMPLE_EMAIL}
                  </span>
                </p>

                <p className="font-ui mt-4 text-[13px] text-[#6b5533]">
                  {COPY.alreadyVerified}{" "}
                  <Link
                    href={routes.login}
                    className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
                  >
                    {COPY.signIn}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </ParchShell>

      {/* Preview state (draft only); hidden inside the mobile preview frame, whose host has its own controls */}
      {!preview.embed && (
      <div className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow">
        <p className="parch-label mb-1.5">Preview state (draft only)</p>
        {DEV_PREVIEW_ENABLED && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="parch-label mr-1">Device</span>
            <DeviceButtons
              value="desktop"
              onSelect={(next) => next !== "desktop" && enterDevice(next)}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              aria-pressed={step === s}
              className={`border px-2.5 py-1 ${step === s ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] text-[#6b5533]"}`}
            >
              ขั้นตอน {s}
            </button>
          ))}
        </div>
        {step === 2 && (
          <div className="mt-2 flex flex-col gap-1">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="parch-check"
                checked={showApiError}
                onChange={(e) => setShowApiError(e.target.checked)}
              />
              แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="parch-check"
                checked={showLoading}
                onChange={(e) => setShowLoading(e.target.checked)}
              />
              แสดงสถานะกำลังสร้างบัญชี
            </label>
          </div>
        )}
      </div>
      )}
    </>
  );
}
