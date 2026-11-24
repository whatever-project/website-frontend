"use client";

import { useDraftLang } from "@/components/DraftLang";
import { Fragment, useEffect, useRef, useState, FormEvent } from "react";
import {
  ParchShell,
  InkDivider,
  Flourish,
  PasswordInput,
} from "@/components/Parchment";
import LetterStack from "@/components/LetterStack";
import { routes } from "@/config/routes";
import { EMAIL_RE, getPasswordChecks } from "@/utils/validation";
// Draft-local username rule (letters + digits only); the shared validateUsername also allows _ . - (see CONTEXT.md section 5).
import { validateUsername } from "./_utils/validateUsername";
import { COPY_BY_LANG, TERMS_BY_LANG, SAMPLE_EMAIL } from "./_mock/copy";
import { checkUsernameAvailable } from "./_mock/usernames";
import { VERIFY_COPY_BY_LANG, VERIFY_PREVIEW_OPTIONS, type VerifyInitial } from "./_mock/verify";
import VerifyEmailModal from "./_components/verify/VerifyEmailModal";
// The landing draft's login dialog (candidate to promote to a shared component, see CONTEXT.md section 5).
import LoginModal from "../landing/_components/login-ui/LoginModal";
import { DEV_PREVIEW_ENABLED } from "../landing/_components/draft-tools/devPreviewFlag";
import DeviceButtons from "../landing/_components/draft-tools/DeviceButtons";
import { PreviewCollapsible } from "../landing/_components/draft-tools/PreviewCollapse";
import { buttonClass } from "../landing/_components/draft-tools/previewStyles";
import {
  replacePreviewSearch,
  usePreviewRoute,
  writeDeviceParams,
  type DeviceSpec,
} from "../landing/_components/draft-tools/previewRoute";
import DevicePreviewHost from "./_components/DevicePreviewHost";
import DraggablePanel from "./_components/DraggablePanel";
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
 * Jim Thompson Roman: the two headings (font-jimthompson); buttons use .signup-btn (see below).
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
.signup-scope .signup-wizard-label:lang(en) { font-size: 12px; } /* English labels (uppercase) look larger: smaller */
/* digits in the circles: IBM Plex Sans Thai leaves extra room above/below its digits (Thai marks), so a plain flex-centred line box
   puts them off-centre. Trimming the line box to the digit's own height (text-box: cap alphabetic) centres the glyph itself, at every
   circle size; browsers without text-box get a small fixed nudge instead. The check mark is an SVG and needs neither. */
.signup-scope .signup-wizard-circle { line-height: 1; padding: 0; }
.signup-scope .signup-wizard-num { display: block; line-height: 1; position: relative; top: 0.08em; }
@supports (text-box: trim-both cap alphabetic) {
  .signup-scope .signup-wizard-num { text-box: trim-both cap alphabetic; top: 0; }
}
/* "scroll to the end" notice (after the .font-ui 13px rule so it wins) */
.signup-scope .signup-agree-hint { font-size: 11px; line-height: 1.4; }
/* form labels: wider letters, equal 10px gap to the input */
.signup-scope .signup-field-label { letter-spacing: 0.06em; text-transform: none; margin-bottom: 10px; font-weight: 600; }
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
/* buttons: same as the landing login dialog's submit button (draft/landing/_components/login-ui/classic/*.module.css, copied because those
   modules are scoped to the whole login form). Colour, border, hover and disabled still come from .parch-btn. Montserrat for Latin, Jim Thompson
   Roman for Thai; in English the label <span> is scaled to 0.8 with 4px letter-spacing (needs lang on .signup-scope). */
.signup-scope .signup-btn {
  font-family: 'Montserrat', 'Jim Thompson Roman', 'Google Sans', sans-serif;
  font-weight: 400; font-size: 16px; letter-spacing: 0.22em; line-height: 1.5;
  padding: 10px 0 12px; text-transform: uppercase;
  box-shadow: 0 3px 8px rgba(50, 36, 14, 0.22), inset 0 1px 0 rgba(233, 217, 174, 0.2);
}
.signup-scope .signup-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(50, 36, 14, 0.3), 0 0 10px rgba(190, 150, 80, 0.2);
}
.signup-scope .signup-btn:lang(th) { letter-spacing: normal; } /* Thai: normal letter spacing */
.signup-scope .signup-btn:lang(en) { font-weight: 500; letter-spacing: 4px; }
.signup-scope .signup-btn:lang(en) > span { display: inline-block; transform: scale(0.8); }
/* step 2 Back button: the outline look (colour, border, hover fill come from .parch-btn-outline), without the filled button's dark shadow */
.signup-scope .signup-btn.signup-btn-back { box-shadow: none; color: #5d4626; }
.signup-scope .signup-btn.signup-btn-back:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(80, 58, 22, 0.18); }
.signup-scope .signup-btn.signup-btn-back:disabled { opacity: 0.35; cursor: not-allowed; }

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

/* step 1 and 2, 1280px and up (where the illustration shows): the illustration fills its grid column (480px, no negative-margin overhang), so the
   gap to the panel is the grid gap, 52px (xl:gap-13), and it can never overlap the panel */
.signup-scope .signup-art { container-type: inline-size; }
.signup-scope .signup-art img { width: 100cqw; margin-right: 0; }

/* tablet (640-1023px): everything a step smaller, single column kept narrow and centred */
@media (max-width: 1023px) {
  .parch-bg h1 { font-size: 3rem; }
  .signup-scope .signup-wrap { padding: 3rem 2rem 2rem; } /* top 3rem = py-12, the same stepper-to-panel gap as desktop */
  .signup-scope .parch-sheet { max-width: 36rem; margin-inline: auto; }
  .signup-scope .parch-sheet h2 { font-size: 1.75rem; }
  .signup-scope .signup-terms { max-height: min(28rem, 55vh); }
  .signup-scope .signup-terms li, .signup-scope .signup-terms .term-num { font-size: 15px; }
}
/* mobile (<640px): sizes scale with the viewport width so 360 / 375 / 390 / 430 all fit */
@media (max-width: 639px) {
  .parch-bg h1 { font-size: clamp(1.9rem, 9.5vw, 2.5rem); margin-top: -0.75rem; }
  .signup-scope .signup-wrap { padding: 3rem 1rem 1.5rem; } /* top 3rem = same stepper-to-panel gap as desktop */
  .signup-scope .parch-sheet { padding: 1.25rem; }
  .signup-scope .parch-sheet h2 { font-size: clamp(1.25rem, 6vw, 1.6rem); margin-top: 0; }
  .signup-scope .parch-sheet h2.signup-terms-title { margin-top: 1.25rem; }
  /* wizard: same circle / label sizes as the other viewports (the compact phone overrides were removed), only a slightly tighter top margin */
  .signup-scope .signup-wizard { margin-top: -0.25rem; }
  .signup-scope .signup-wizard-label:lang(en) { font-size: 11px; }
  .signup-scope .signup-terms { max-height: min(22rem, 46vh); padding: 0.75rem; }
  .signup-scope .signup-agree { padding-left: 0.75rem; }
  .signup-scope .signup-terms li { grid-template-columns: 1.5rem 1fr; column-gap: 0.5rem; }
  .signup-scope .signup-terms li, .signup-scope .signup-terms .term-num { font-size: clamp(12.5px, 3.6vw, 14.5px); line-height: 1.6; }
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
  const { lang, setLang } = useDraftLang();
  const COPY = COPY_BY_LANG[lang];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const [passFocus, setPassFocus] = useState(false);
  // Result of the (mock) username availability check, for the username it was asked about (see CONTEXT.md section 5).
  const [avail, setAvail] = useState<{ name: string; ok: boolean } | null>(null);
  const [touched, setTouched] = useState<{
    user?: boolean;
    email?: boolean;
    pass?: boolean;
  }>({});

  // Draft-only preview toggles
  const [showApiError, setShowApiError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Step 3 popup (email verification modal): the draft Preview panel can start it in a given state. `key` remounts the modal.
  const [verifyPreview, setVerifyPreview] = useState<{ key: number; id: string; initial?: VerifyInitial }>({ key: 0, id: "code" });
  // The address an unverified account is waiting on. Set when the form is submitted, kept when the modal is closed with "Later" (the account
  // stays unverified, so step 2 shows a notice that reopens the modal), cleared once the code is accepted.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const VCOPY = VERIFY_COPY_BY_LANG[lang];
  // "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" opens the landing's login dialog over this page instead of leaving it.
  const [loginOpen, setLoginOpen] = useState(false);

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
    // &verify=wrong|locked|expired|resend|change|verified starts the step 3 modal in that state (draft preview only)
    const opt = VERIFY_PREVIEW_OPTIONS.find((o) => o.id === next.verify);
    if (opt && next.verify !== "code") setVerifyPreview({ key: 1, id: opt.id, initial: opt.initial });
  }, [inHost]);
  // Host -> this page (embedded): preview selections arrive as events, so the form is never reloaded.
  useEffect(() => {
    if (!preview.embed) return;
    const onSet = (event: Event) => {
      const d = (event as CustomEvent<Partial<SignupPreviewState>>).detail;
      if (d.step) setStep(d.step);
      if (typeof d.showApiError === "boolean") setShowApiError(d.showApiError);
      if (typeof d.showLoading === "boolean") setShowLoading(d.showLoading);
      // the host's verification-state buttons; entering step 3 without one starts on "code"
      if (d.verify !== undefined || d.step === 3) {
        const id = d.verify ?? "code";
        const opt = VERIFY_PREVIEW_OPTIONS.find((o) => o.id === id);
        setVerifyPreview((v) => ({ key: v.key + 1, id, initial: opt?.initial }));
      }
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
      writeSignupStateParams(p, { step, showApiError, showLoading, verify: verifyPreview.id });
    });

  const userErrCode = validateUsername(form.username);
  const userErr = userErrCode ? COPY.usernameErr[userErrCode] : null;
  // Ask "is it taken?" only once the username passes validation; 400 ms debounce; a response for an older value is ignored (see userAvail).
  useEffect(() => {
    const name = form.username;
    if (name.length === 0 || validateUsername(name)) return;
    let stale = false;
    const timer = setTimeout(async () => {
      const ok = await checkUsernameAvailable(name);
      if (!stale) setAvail({ name, ok });
    }, 400);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [form.username]);
  const userAvail =
    !userErr && form.username.length > 0 && avail?.name === form.username ? (avail.ok ? "available" : "taken") : null;
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
    userAvail !== "taken" &&
    form.username.length > 0 &&
    !emailErr &&
    form.email.length > 0 &&
    passOk;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ user: true, email: true, pass: true });
    if (!formOk) return;
    setPendingEmail(form.email);
    setVerifyPreview((v) => ({ key: v.key + 1, id: "code" }));
    setStep(3);
  };

  const shownStep = step === 3 ? 2 : step;
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
      <ParchShell title={COPY.pageTitle} backHref={routes.home}>
        <style>{SIGNUP_FONT_CSS}</style>
        <div className="signup-scope" lang={lang}>
        {/* step indicator (step 3 is a popup over step 2, so step 2 stays highlighted) */}
        <div className="relative z-20 mx-auto signup-wizard mt-6 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-start gap-3 px-4 sm:gap-4" inert={step === 3}>
            {[1, 2].map((s) => {
              // completed = the user is past this step; only completed steps can be clicked (back only, never forward), and not while the
              // step 3 modal is open (the whole indicator is inert then)
              const completed = step > s;
              const clickable = completed && step !== 3;
              const current = !completed && shownStep === s;
              const label = s === 1 ? COPY.stepTerms : COPY.stepAccountInfo;
              const stepClass = `signup-wizard-step flex flex-col items-center gap-3.5 ${s === 1 ? "justify-self-end" : "col-start-3 justify-self-start"}`;
              const circle = (
                <>
                  <div
                    className={`signup-wizard-circle flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-ibmplexsansthai text-sm transition-all ${
                      completed
                        ? "signup-wizard-circle--check border-[#8a6a35] bg-[#8a6a35] text-[#f3e6c8] group-hover:bg-[#6b5033]"
                        : current
                          ? "border-[#4a3520] bg-[#4a3520] text-[#f3e6c8]"
                          : "border-[#b89a63] bg-transparent text-[#a68d5f]"
                    }`}
                  >
                    {completed ? (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    ) : (
                      <span className="signup-wizard-num">{s}</span>
                    )}
                  </div>
                  <span
                    className={`parch-label signup-wizard-label ${current ? "text-[#3a2c1a]" : completed ? "text-[#6b5533] group-hover:text-[#3a2c1a]" : ""}`}
                  >
                    {label}
                  </span>
                </>
              );
              return (
                <Fragment key={s}>
                  {clickable ? (
                    <button
                      type="button"
                      onClick={() => setStep(s as 1 | 2)}
                      aria-label={`${COPY.goBackToStep}: ${label}`}
                      className={`${stepClass} group relative cursor-pointer after:absolute after:-inset-2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6a35]`}
                    >
                      {circle}
                    </button>
                  ) : (
                    <div className={stepClass} aria-current={current ? "step" : undefined}>
                      {circle}
                    </div>
                  )}
                  {s === 1 && (
                    <span
                      aria-hidden="true"
                      className={`signup-wizard-connector col-start-2 row-start-1 mt-4 flex h-px w-16 items-center sm:w-32 md:w-44 ${step > 1 ? "text-[#8a6a35]" : "text-[#b89a63]"}`}
                    >
                      <span className="h-px flex-1 bg-current" />
                    </span>
                  )}
                </Fragment>
              );
            })}
        </div>

        {/* ── Step 1: Terms ── */}
        {step === 1 && (
          <div className="signup-wrap relative z-20 mx-auto grid max-w-[84rem] grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 xl:grid-cols-[minmax(0,40rem)_minmax(0,30rem)] xl:justify-center xl:gap-13">
            <div className="parch-sheet relative p-8 max-xl:mx-auto max-xl:max-w-3xl sm:p-10">
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
                className="parch-btn signup-btn cursor-pointer"
                disabled={!agree || !readAll}
                onClick={() => setStep(2)}
              >
                <span>{COPY.next}</span>
              </button>
            </div>

            <div className="signup-art relative hidden h-[460px] xl:block">
              <LetterStack />
            </div>
          </div>
        )}

        {/* ── Step 2: Account form (stays rendered behind the step 3 popup) ── */}
        {(step === 2 || step === 3) && (
          <div
            className="signup-wrap relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 xl:grid-cols-[32rem_30rem] xl:justify-center xl:gap-13"
            inert={step === 3}
          >
            <div className="w-full max-w-md justify-self-center lg:max-xl:max-w-3xl xl:max-w-lg xl:justify-self-start">
            <form
              onSubmit={handleSubmit}
              className="parch-sheet relative w-full p-8 sm:p-10"
            >
              <h2 className="font-jimthompson signup-terms-title mt-4 text-center text-3xl text-[#3a2c1a]">
                {COPY.formHeading}
              </h2>
              <InkDivider>
                <Flourish className="h-4 w-4" />
              </InkDivider>

              {pendingEmail && step === 2 && (
                <div
                  role="status"
                  className="mb-4 border border-amber-700/60 bg-amber-100/60 p-3 font-ui text-sm text-amber-900"
                >
                  {VCOPY.resumeBefore}{" "}
                  <strong className="wrap-break-word font-medium">{pendingEmail}</strong>{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setVerifyPreview((v) => ({ key: v.key + 1, id: "code" }));
                      setStep(3);
                    }}
                    className="cursor-pointer underline underline-offset-2 hover:text-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6a35]"
                  >
                    {VCOPY.resumeAction}
                  </button>
                </div>
              )}

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
                  (touched.user && userErr) || userAvail === "taken"
                    ? { borderColor: "#8a2a1f" }
                    : undefined
                }
                value={form.username}
                maxLength={25}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  setTouched((t) => ({ ...t, user: true }));
                }}
                aria-describedby="signup-username-hint"
                required
              />
              {/* One-line helper, always visible: the rules hint; a rule broken -> red error message; valid and not taken -> green "available";
                  valid but taken -> red "already taken" (while the availability check is pending the plain hint stays). */}
              <p
                id="signup-username-hint"
                aria-live="polite"
                className={`mt-1.5 font-ui text-[12px] ${
                  touched.user && userErr
                    ? "text-[#8a2a1f]"
                    : userAvail === "available"
                      ? "text-[#5b7a3d]"
                      : userAvail === "taken"
                        ? "text-[#8a2a1f]"
                        : "text-[#8a7350]"
                }`}
              >
                {touched.user && userErr
                  ? userErr
                  : userAvail === "available"
                    ? COPY.usernameAvailable
                    : userAvail === "taken"
                      ? COPY.usernameTaken
                      : COPY.usernameHint}
              </p>

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
                  {emailErr}
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

              {/* Back (outline, left) + submit (filled, right). Back returns to step 1; what was typed and the ticked checkbox are kept.
                  Below 640px they stack, submit on top. */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={showLoading}
                  className="parch-btn-outline signup-btn signup-btn-back cursor-pointer sm:basis-2/5"
                >
                  <span>
                    {COPY.back}
                  </span>
                </button>
                <button
                  id="signup-submit"
                  type="submit"
                  disabled={showLoading}
                  className="parch-btn signup-btn cursor-pointer sm:basis-3/5"
                >
                  <span>{showLoading ? COPY.submitting : COPY.submit}</span>
                </button>
              </div>

              <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
                {COPY.alreadyHaveAccount}{" "}
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="cursor-pointer font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a6a35]"
                >
                  {COPY.signIn}
                </button>
              </p>
            </form>
            </div>

            <div className="signup-art relative hidden h-[460px] xl:block">
              <LetterStack />
            </div>
          </div>
        )}

        {/* ── Step 3: Email verification: a modal (paper letter) over the dimmed step 2 form. X / Esc ask "leave?" first; "Later" closes it
            back to step 2 (a notice there reopens it). The pending account is kept (re-submitting the form overwrites it). ── */}
        {step === 3 && (
          <VerifyEmailModal
            key={verifyPreview.key}
            variant="signup"
            lang={lang}
            email={pendingEmail ?? (form.email || SAMPLE_EMAIL)}
            initial={verifyPreview.initial}
            onClose={() => setStep(2)}
            onVerified={() => setPendingEmail(null)}
            onEmailChanged={(next) => {
              setPendingEmail(next);
              setForm((f) => ({ ...f, email: next }));
            }}
          />
        )}
        </div>
      </ParchShell>

      {/* The landing's login dialog. Its sign-up links close it (we are already on the signup page) and its own Preview panel is hidden: this
          page has one. Rendered before the Preview panel below so that panel stays on top and usable. */}
      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} lang={lang} closeOnSignup showPreviewPanel={false} />
      )}

      {/* Preview state (draft only); hidden inside the mobile preview frame, whose host has its own controls */}
      {!preview.embed && (
      <DraggablePanel className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow">
        <PreviewCollapsible title="Preview state (draft only)">
        {DEV_PREVIEW_ENABLED && (
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="parch-label mr-1">Device</span>
            <DeviceButtons
              value="desktop"
              onSelect={(next) => next !== "desktop" && enterDevice(next)}
            />
          </div>
        )}
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="parch-label mr-1">Language</span>
          {([["th", "ไทย"], ["en", "English"]] as const).map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className={buttonClass(lang === code)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([1, 2, 3] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (s === 3) setVerifyPreview((v) => ({ key: v.key + 1, id: "code" }));
                setStep(s);
              }}
              aria-pressed={step === s}
              className={buttonClass(step === s)}
            >
              ขั้นตอน {s}
            </button>
          ))}
        </div>
        {step === 3 && (
          <div className="mt-2">
            <p className="parch-label mb-1">หน้าต่างยืนยันอีเมล (รหัสที่ถูกต้อง: 123456)</p>
            <div className="flex flex-wrap gap-1.5">
              {VERIFY_PREVIEW_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setVerifyPreview((v) => ({ key: v.key + 1, id: o.id, initial: o.initial }))}
                  aria-pressed={verifyPreview.id === o.id}
                  className={buttonClass(verifyPreview.id === o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
        </PreviewCollapsible>
      </DraggablePanel>
      )}
    </>
  );
}
