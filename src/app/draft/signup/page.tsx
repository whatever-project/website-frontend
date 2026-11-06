"use client";

import { useDraftLang } from "@/components/DraftLang";
import Link from "next/link";
import { Fragment, useState, FormEvent } from "react";
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
import { MdEmail } from "react-icons/md";

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
.signup-scope .signup-wizard-label { font-size: 15px; line-height: 1; }
/* form labels: wider letters, equal 10px gap to the input */
.signup-scope .signup-field-label { letter-spacing: 0.06em; text-transform: none; margin-bottom: 10px; font-weight: 600; }
/* step 3 (verify email) body text: 15px */
.signup-scope .signup-verify .font-serif2,
.signup-scope .signup-verify .font-ui { font-size: 15px; }
/* requirement box titles: normal letter-spacing */
.signup-scope .signup-hint-title { letter-spacing: normal; text-transform: none; }
/* terms list: number column + hanging text, stable width while scrolling */
.signup-scope .signup-terms { scrollbar-gutter: stable; }
.signup-scope .signup-terms li {
  font-size: 16px; line-height: 1.7; text-align: left; overflow-wrap: break-word;
}
.signup-scope .signup-terms .term-num {
  font-family: 'IBM Plex Sans Thai', 'Google Sans', sans-serif;
  font-size: 16px; line-height: 1.7; font-variant-numeric: tabular-nums;
}
.signup-scope .parch-btn { font-family: 'Jim Thompson Roman', 'Serithai', 'Google Sans', serif; }
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

  return (
    <>
      <ParchShell title={COPY.pageTitle} backHref={routes.home}>
        <style>{SIGNUP_FONT_CSS}</style>
        <div className="signup-scope">
        {/* step indicator */}
        {step !== 3 && (
          <div className="relative z-20 mx-auto mt-6 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-start gap-3 px-4 sm:gap-4">
            {[1, 2].map((s) => (
              <Fragment key={s}>
                <div
                  className={`flex flex-col items-center gap-3.5 ${s === 1 ? "justify-self-end" : "col-start-3 justify-self-start"}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-ibmplexsansthai text-sm transition-all ${
                      step === s
                        ? "border-[#4a3520] bg-[#4a3520] text-[#f3e6c8] shadow-[0_3px_8px_rgba(50,32,14,0.45)]"
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
                    className="col-start-2 row-start-1 mt-[18px] h-px w-10 bg-[#b89a63] sm:w-32 md:w-44"
                  />
                )}
              </Fragment>
            ))}
          </div>
        )}

        {/* ── Step 1: Terms ── */}
        {step === 1 && (
          <div className="relative z-20 mx-auto grid max-w-[84rem] grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[1.35fr_1fr] lg:gap-28">
            <div className="parch-sheet relative p-8 sm:p-10">
              <h2 className="font-jimthompson text-center text-3xl text-[#3a2c1a]">
                {COPY.termsHeading}
              </h2>
              <InkDivider>
                <Flourish className="h-4 w-4" />
              </InkDivider>

              <ol
                className="signup-terms my-5 h-[min(34rem,62vh)] space-y-3.5 overflow-y-auto border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-5"
                style={{
                  scrollbarColor: "#b89a63 transparent",
                  scrollbarWidth: "auto",
                }}
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

              <label className="mb-6 flex cursor-pointer items-start gap-3 font-ui text-sm text-[#3a2c1a]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="parch-check mt-0.5"
                />
                <span>
                  {COPY.iAgree}{" "}
                  <span className="text-[#a68d5f]">{COPY.iAgreeRequired}</span>
                </span>
              </label>

              <button
                type="button"
                className="parch-btn"
                disabled={!agree}
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
          <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[28rem_35rem] lg:justify-center lg:gap-16">
            <form
              onSubmit={handleSubmit}
              className="parch-sheet relative mx-auto w-full max-w-md p-8 sm:p-10 lg:mx-0"
            >
              <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">
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

        {/* ── Step 3: Email verification ── */}
        {step === 3 && (
          <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
            <div className="signup-verify parch-sheet relative p-10 text-center">
              <MdEmail className="mx-auto mt-4 h-16 w-16 text-[#8a6a35]" />

              <h2 className="font-jimthompson mt-5 text-3xl text-[#3a2c1a]">
                {COPY.verifyHeading}
              </h2>
              <InkDivider>
                <Flourish className="h-4 w-4" />
              </InkDivider>

              <p className="font-serif2 mt-2 text-[15px] leading-relaxed text-[#4a3820]">
                {COPY.verifyBody}
              </p>
              <p className="font-ui mt-3 text-[13px] text-[#8a7350]">
                {COPY.verifyLetterSent}{" "}
                <span className="font-medium text-[#3a2c1a]">
                  {form.email || SAMPLE_EMAIL}
                </span>
              </p>

              <div className="mt-7">
                <p className="text-center font-ui text-[13px] text-[#8a7350]">
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

      {/* Preview state (draft only) */}
      <div className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow">
        <p className="parch-label mb-1.5">Preview state (draft only)</p>
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
    </>
  );
}
