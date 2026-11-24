import type { DraftLang } from "@/components/DraftLang";

/**
 * Mock data + copy for the email-verification modal (signup step 3 and the "log in with an unverified email" path).
 * Draft only: nothing is sent anywhere. The numbers below are what the real back end is expected to enforce (see CONTEXT.md §5).
 */
export const MOCK_CODE = "123456";
export const CODE_LENGTH = 6;
export const MAX_ATTEMPTS = 5;
export const RESEND_COOLDOWN_SECONDS = 60;
/** A code is valid for this long; the "it expires in N minutes" text and the draft's mock expiry both use it. */
export const CODE_EXPIRY_MINUTES = 5;
/** Fake network delay of "Verify email", in ms. */
export const VERIFY_DELAY_MS = 600;

export type VerifyView = "code" | "change" | "verified";
export type VerifyError = "wrong" | "expired" | null;

/** Starting state of the modal; the draft's Preview panel uses it to jump to each state. */
export interface VerifyInitial {
  view?: VerifyView;
  error?: VerifyError;
  attemptsLeft?: number;
  secondsLeft?: number;
  /** Draft preview: the first "send a code" request (resend / change email) fails, the retry succeeds. */
  resendFails?: boolean;
  /** Draft preview: the verified view starts in the "automatic redirect did not happen" state (fallback link shown). */
  navStalled?: boolean;
  /** Draft preview: open straight on the exit confirmation ("Verify your email later?"). */
  confirmExit?: boolean;
}

/** Preview panel buttons (Thai, draft-only chrome). */
export const VERIFY_PREVIEW_OPTIONS: { id: string; label: string; initial: VerifyInitial }[] = [
  { id: "code", label: "กรอกรหัส", initial: {} },
  { id: "wrong", label: "รหัสผิด (เหลือ 4)", initial: { error: "wrong", attemptsLeft: 4 } },
  { id: "locked", label: "ลองครบ 5 ครั้ง", initial: { error: "wrong", attemptsLeft: 0 } },
  { id: "expired", label: "รหัสหมดอายุ", initial: { error: "expired", secondsLeft: 0 } },
  { id: "resend", label: "ส่งซ้ำได้แล้ว", initial: { secondsLeft: 0 } },
  { id: "resendfail", label: "ส่งรหัสไม่สำเร็จ", initial: { secondsLeft: 0, resendFails: true } },
  { id: "change", label: "เปลี่ยนอีเมล", initial: { view: "change" } },
  { id: "exit", label: "ยืนยันอีเมลภายหลัง?", initial: { confirmExit: true } },
  { id: "verified", label: "ยืนยันแล้ว", initial: { view: "verified" } },
  { id: "redirectfail", label: "ยืนยันแล้ว (redirect ไม่ทำงาน)", initial: { view: "verified", navStalled: true } },
];

export const VERIFY_COPY = {
  close: "ปิด",
  title: "ยืนยันอีเมลของคุณ",
  sentBefore: "เราส่งรหัส 6 หลักไปที่",
  validFor: (time: string) => `รหัสนี้ใช้ได้อีก ${time} นาที`,
  codeInvalid: "รหัสนี้ใช้ไม่ได้แล้ว",
  codeIncomplete: "กรุณากรอกรหัสให้ครบ 6 หลัก",
  loginNoticeBefore: "อีเมลของคุณยังไม่ได้รับการยืนยัน เราส่งรหัส 6 หลักใหม่ไปที่",
  codeLabel: "รหัสยืนยัน 6 หลัก",
  digitLabel: (n: number) => `หลักที่ ${n} จาก 6`,
  verify: "ยืนยันอีเมล",
  verifyLogin: "ยืนยันและเข้าสู่ระบบ",
  verifying: "กำลังตรวจสอบ…",
  wrongCode: (left: number) => `รหัสไม่ถูกต้อง เหลือโอกาสอีก ${left} ครั้ง`,
  locked: "ใส่รหัสผิดครบ 5 ครั้งแล้ว กรุณาขอรหัสใหม่",
  expired: "รหัสนี้หมดอายุแล้ว กรุณาขอรหัสใหม่เพื่อยืนยันอีเมล",
  noEmail: "ไม่ได้รับอีเมล?",
  resendIn: (time: string) => `ส่งรหัสอีกครั้งได้ใน ${time}`,
  resend: "ส่งรหัสอีกครั้ง",
  resending: "กำลังส่ง…",
  resendReady: "ส่งรหัสอีกครั้งได้แล้ว",
  newCodeCta: "ส่งรหัสใหม่",
  newCodeSent: "ส่งรหัสใหม่แล้ว โปรดใช้รหัสล่าสุดเท่านั้น",
  sendFailed: "ไม่สามารถส่งรหัสได้ในขณะนี้ กรุณาลองอีกครั้ง",
  confirmTitle: "ยืนยันอีเมลภายหลัง?",
  confirmBody: "อีเมลของคุณยังไม่ได้รับการยืนยัน\nและยังไม่สามารถเข้าใช้งานเว็บไซต์ได้",
  // the end of the sentence, split off so Mobile S / M can drop it onto its own line (see .verify-tail in VerifyEmailModal)
  confirmBodyTail: "จนกว่าจะยืนยันอีเมล",
  confirmStay: "กลับไปยืนยันอีเมล",
  confirmLeave: "ไว้ภายหลัง",
  resumeBefore: "อีเมลของคุณยังไม่ได้รับการยืนยัน เราส่งรหัสไปที่",
  resumeAction: "ใส่รหัสยืนยัน",
  spamHint: "กรุณาตรวจสอบโฟลเดอร์ Spam หากไม่ได้รับอีเมล",
  changeBefore: "อีเมลผิด?",
  changeLink: "เปลี่ยนอีเมล",
  useDifferent: "ใช้บัญชีอื่น",
  changeTitle: "เปลี่ยนอีเมล",
  currentEmail: "อีเมลปัจจุบัน",
  newEmail: "อีเมลใหม่",
  newEmailPlaceholder: "wanderer@example.com",
  sendNewCode: "ส่งรหัสยืนยันไปยังอีเมลใหม่",
  backToCode: "กลับไปยืนยันอีเมล",
  emailErrFormat: "กรุณากรอกอีเมลให้ถูกต้อง",
  emailErrSame: "กรุณาใช้อีเมลที่ต่างจากอีเมลปัจจุบัน",
  verifiedTitle: "ยืนยันอีเมลสำเร็จ",
  // follows the (bold) email address on the same line: "<email> ได้รับการยืนยันเป็นที่เรียบร้อย"
  verifiedBody: "ได้รับการยืนยันเป็นที่เรียบร้อย",
  redirecting: (n: number) => `กำลังนำคุณไปยังหน้าเลือกตัวละครใน ${n} วินาที...`,
  redirectingSr: "กำลังนำคุณไปยังหน้าเลือกตัวละคร",
  redirectFallbackText: "คุณสามารถไปยังหน้าเลือกตัวละครได้โดยตรง",
  redirectFallback: "ไปยังหน้าเลือกตัวละคร",
};

export const VERIFY_COPY_EN: typeof VERIFY_COPY = {
  close: "Close",
  title: "Verify Your Email",
  sentBefore: "We sent a 6-digit code to",
  validFor: (time: string) => `This code is valid for another ${time}`,
  codeInvalid: "This code can no longer be used",
  codeIncomplete: "Please enter all 6 digits",
  loginNoticeBefore: "Your email isn't verified yet. We sent a new 6-digit code to",
  codeLabel: "6-digit verification code",
  digitLabel: (n: number) => `Digit ${n} of 6`,
  verify: "Verify email",
  verifyLogin: "Verify and log in",
  verifying: "Verifying…",
  wrongCode: (left: number) => `That code isn't right. ${left} ${left === 1 ? "attempt" : "attempts"} left.`,
  locked: "Too many wrong attempts. Please request a new code.",
  expired: "This code has expired. Please request a new one to verify your email.",
  noEmail: "Didn't get the email?",
  resendIn: (time: string) => `You can resend in ${time}`,
  resend: "Resend code",
  resending: "Sending…",
  resendReady: "You can resend the code now",
  newCodeCta: "Send a new code",
  newCodeSent: "A new code was sent. Only the newest code works.",
  sendFailed: "We couldn't send the code right now. Please try again.",
  confirmTitle: "Verify your email later?",
  confirmBody: "Your email isn't verified yet,\nand you won't be able to use the website ",
  confirmBodyTail: "until it is.",
  confirmStay: "Back to verification",
  confirmLeave: "Later",
  resumeBefore: "Your email isn't verified yet. We sent a code to",
  resumeAction: "Enter verification code",
  spamHint: "Check your spam folder too.",
  changeBefore: "Wrong email?",
  changeLink: "Change it",
  useDifferent: "Use a different account",
  changeTitle: "Change Email",
  currentEmail: "Current email",
  newEmail: "New email",
  newEmailPlaceholder: "wanderer@example.com",
  sendNewCode: "Send code to new email",
  backToCode: "Back to verification",
  emailErrFormat: "Please enter a valid email address",
  emailErrSame: "Please use an email different from the current one",
  verifiedTitle: "Email Verified",
  verifiedBody: "has been verified.",
  redirecting: (n: number) => `Redirecting to Character Selection in ${n}s...`,
  redirectingSr: "Redirecting to Character Selection",
  redirectFallbackText: "You can go to Character Selection directly",
  redirectFallback: "Go to Character Selection",
};

export const VERIFY_COPY_BY_LANG: Record<DraftLang, typeof VERIFY_COPY> = { th: VERIFY_COPY, en: VERIFY_COPY_EN };
