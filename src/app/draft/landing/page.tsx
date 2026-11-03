"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { getTimeState } from "@/utils/timeOfDay";
import { routes } from "@/config/routes";
import { FaGlobe, FaSun } from "react-icons/fa";
import { PiClockCounterClockwise } from "react-icons/pi";
import { FaRegSun } from "react-icons/fa6";
import { MdSunny } from "react-icons/md";
import { BsMoonStarsFill } from "react-icons/bs";
import Stars from "./_components/Stars";
import LoginModal from "./_components/LoginModal";
import sliderStyles from "./_components/TimeSlider.module.css";
import { COPY_BY_LANG, type DraftLang } from "./_mock/copy";

// Both auth buttons share one size; nowrap keeps the label on a single line.
// Inline fontFamily so it wins over `.gallery-btn`'s own font-family.
const AUTH_BTN =
  "gallery-btn inline-flex h-12 w-52 items-center justify-center whitespace-nowrap px-4 text-center text-base tracking-[0.15em]";
const AUTH_BTN_STYLE = {
  fontFamily: "'Jim Thompson Roman', 'Charmonman', 'Prompt', serif",
  background: "rgba(12, 14, 22, 0.55)", // darker than .gallery-btn so labels stay legible on a bright backdrop
  textShadow: "0 1px 10px rgba(0,0,0,.8)",
};

export default function LandingDraft() {
  const nowHour = () => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  };

  const [hour, setHour] = useState(nowHour());
  const [live, setLive] = useState(true);
  const [lang, setLang] = useState<DraftLang>("th");
  const COPY = COPY_BY_LANG[lang];
  const [loginOpen, setLoginOpen] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    window.requestAnimationFrame(() => loginButtonRef.current?.focus());
  }, []);

  // `?t=<hour>` forces a time of day (handy for designers: /draft/landing?t=21)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = parseFloat(params.get("t") ?? "");
    if (Number.isFinite(forced)) {
      setHour(((forced % 24) + 24) % 24);
      setLive(false);
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setHour(nowHour()), 30_000);
    setHour(nowHour());
    return () => clearInterval(id);
  }, [live]);

  // Device clock for the toggle label. Starts empty so server and first client render match.
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 5_000);
    return () => clearInterval(id);
  }, []);

  const ts = getTimeState(hour);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#10131f] select-none">
      {/* village backdrop */}
      <img
        src="/assets/village.jpg"
        alt="Arcane Vale Village"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* drifting mist layers */}
      <div
        className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[38vh] opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(60% 100% at 30% 100%, rgba(200,220,255,.35), transparent 70%), radial-gradient(50% 100% at 75% 100%, rgba(210,225,255,.28), transparent 70%)",
          animation: "mist-drift 26s ease-in-out infinite alternate",
        }}
      />

      {/* time-of-day colour grade */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{ background: ts.grade }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{ background: ts.wash }}
      />

      {/* stars */}
      <Stars opacity={ts.stars} />

      {/* warm window glows at night */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: ts.windowGlow }}
      >
        {[
          { l: "56%", t: "62%", s: 90 },
          { l: "79%", t: "66%", s: 120 },
          { l: "87%", t: "60%", s: 80 },
          { l: "41%", t: "70%", s: 70 },
        ].map((w, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: w.l,
              top: w.t,
              width: w.s,
              height: w.s,
              background:
                "radial-gradient(circle, rgba(255,178,80,.55) 0%, rgba(255,150,50,.22) 45%, transparent 70%)",
              animation: `candle-flicker ${3 + i * 1.3}s ease-in-out ${i * 0.7}s infinite`,
            }}
          />
        ))}
      </div>

      {/* bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="font-ui text-[11px] tracking-[0.5em] text-amber-100/80 uppercase">
          {COPY.arcaneVale}
        </div>
        {/* Draft-local toggle: the shared LanguageSwitcher renders nothing on /draft/*, so it swaps mock copy instead */}
        <button
          type="button"
          onClick={() => setLang((l) => (l === "th" ? "en" : "th"))}
          aria-label={
            lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
          }
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-100/30 px-3 py-1 font-ui text-[11px] tracking-[0.2em] whitespace-nowrap text-amber-100/80 uppercase transition hover:border-amber-100/60 hover:text-amber-50"
        >
          <span aria-hidden className="text-sm leading-none tracking-normal">
            <FaGlobe />
          </span>
          {lang}
        </button>
      </header>

      {/* soft dark scrim behind the title block so text stays readable on the bright daytime backdrop */}
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 52%, rgba(10,12,22,.62) 0%, rgba(10,12,22,.35) 55%, transparent 100%)",
        }}
      />

      {/* centre title */}
      <main className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p
          className="rise-in font-jimthompson text-2xl tracking-[0.55em] text-[#f1e8d8]/85 uppercase sm:text-3xl"
          style={{
            textShadow: "0 2px 6px rgba(0,0,0,.7), 0 2px 24px rgba(0,0,0,.7)",
          }}
        >
          {COPY.welcome}
        </p>
        <h1
          className="rise-in-1 font-jimthompson mt-3 text-[13vw] leading-[1.05] tracking-[0.06em] text-[#f2ead9] uppercase sm:text-[9vw] lg:text-[7.5vw]"
          style={{
            textShadow:
              "0 2px 8px rgba(0,0,0,.75), 0 2px 34px rgba(0,0,0,.7), 0 0 60px rgba(233,196,106,.18)",
          }}
        >
          {COPY.title}
        </h1>
        <p
          className="rise-in-2 font-josefin mt-6 text-xs font-normal tracking-[0.32em] text-amber-50 uppercase"
          style={{
            textShadow: "0 1px 6px rgba(0,0,0,.85), 0 1px 14px rgba(0,0,0,.7)",
          }}
        >
          {COPY.subtitle}
        </p>

        <div className="rise-in-3 mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          <button
            ref={loginButtonRef}
            type="button"
            onClick={() => setLoginOpen(true)}
            className={AUTH_BTN}
            style={AUTH_BTN_STYLE}
          >
            {COPY.logIn}
          </button>
          <Link
            href={routes.signup}
            className={AUTH_BTN}
            style={AUTH_BTN_STYLE}
          >
            {COPY.signUp}
          </Link>
        </div>
      </main>

      {/* time scrubber */}
      <footer className="absolute inset-x-0 bottom-0 z-20 px-6 pb-7 sm:px-10">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          {/* relative z-10: stays above the slider's enlarged click area, which reaches a few px up */}
          <div className="relative z-10 flex items-center justify-center font-josefin text-[10px] font-light tracking-[0.25em] text-amber-100/40 uppercase">
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 transition ${
                live
                  ? "text-amber-100/90"
                  : "text-amber-100/45 hover:text-amber-100/80"
              }`}
            >
              {COPY.realTime(clock)}
            </button>
          </div>
          <div className={sliderStyles.wrap}>
            <input
              type="range"
              min={0}
              max={24}
              step={0.05}
              value={hour}
              onChange={(e) => {
                setLive(false);
                setHour(parseFloat(e.target.value));
              }}
              className={`sun-slider ${sliderStyles.timeSlider}`}
              aria-label={COPY.timeLabel}
            />
            {/* Icon follows the thumb: sun 06:00-18:00, moon 18:01-05:59 */}
            {hour >= 6 && hour <= 18 ? (
              <MdSunny
                aria-hidden
                className={`${sliderStyles.icon} ${sliderStyles.sun}`}
                style={{ "--pos": hour / 24 } as CSSProperties}
              />
            ) : (
              <BsMoonStarsFill
                aria-hidden
                className={`${sliderStyles.icon} ${sliderStyles.moon}`}
                style={{ "--pos": hour / 24 } as CSSProperties}
              />
            )}
          </div>
        </div>
      </footer>

      {loginOpen && <LoginModal onClose={closeLogin} />}
    </div>
  );
}
