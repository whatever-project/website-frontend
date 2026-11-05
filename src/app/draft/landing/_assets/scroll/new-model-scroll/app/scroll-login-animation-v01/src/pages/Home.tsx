import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  LogOut,
  RotateCcw,
  ScrollText,
  Sparkles,
  X,
} from "lucide-react";
import { ScrollLoginAnimation } from "../scroll_login_animation_v05.js";
import type { ScrollState, ScrollView } from "../scroll_login_animation_v05.js";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import "../scroll_login_animation_v01.css";

type Settings = {
  openDuration: number;
  closeDuration: number;
  view: ScrollView;
};

const defaultSettings: Settings = { openDuration: 1650, closeDuration: 1350, view: "elevated" };

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);
  return url.toString();
}

const stateLabels: Record<ScrollState, string> = {
  closed: "Tightly rolled",
  opening: "Releasing paper",
  open: "Open & settled",
  closing: "Returning to roll",
  scrubbing: "Frame held",
};

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ScrollLoginAnimation | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scrollState, setScrollState] = useState<ScrollState>("closed");
  const [formActive, setFormActive] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [notesOpen, setNotesOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth({ redirectPath: "/" });
  const preferences = trpc.preferences.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const updatePreferences = trpc.preferences.update.useMutation({
    onMutate: () => setSaveState("saving"),
    onSuccess: () => setSaveState("saved"),
    onError: () => setSaveState("error"),
  });

  useEffect(() => {
    if (!mountRef.current) return;
    let active = true;
    setReady(false);
    setLoadError(false);
    const engine = new ScrollLoginAnimation(mountRef.current, {
      onReady: () => {
        if (!active) return;
        setReady(true);
        if (!new URLSearchParams(window.location.search).has("capture")) {
          window.setTimeout(() => engine.playOpen(), 280);
        }
      },
      onError: () => active && setLoadError(true),
      onProgress: (value) => active && setProgress(value),
      onStateChange: (value) => active && setScrollState(value),
      onFormState: (value) => active && setFormActive(value),
    });
    engineRef.current = engine;
    engine.init().catch(() => undefined);
    return () => {
      active = false;
      engine.dispose();
      engineRef.current = null;
    };
  }, [reloadToken]);

  useEffect(() => {
    if (!preferences.data) return;
    setSettings({
      openDuration: preferences.data.openDuration,
      closeDuration: preferences.data.closeDuration,
      view: preferences.data.view,
    });
  }, [preferences.data]);

  useEffect(() => {
    engineRef.current?.setTiming(settings.openDuration, settings.closeDuration);
  }, [settings.openDuration, settings.closeDuration]);

  useEffect(() => {
    engineRef.current?.setView(settings.view);
  }, [settings.view]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (notesOpen) setNotesOpen(false);
        else if (engineRef.current && engineRef.current.progress > 0) engineRef.current.playClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notesOpen]);

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      if (isAuthenticated) {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => updatePreferences.mutate(next), 450);
      }
      return next;
    });
  }, [isAuthenticated, updatePreferences]);

  const openScroll = () => engineRef.current?.playOpen();
  const closeScroll = () => engineRef.current?.playClose();
  const isMoving = scrollState === "opening" || scrollState === "closing";
  const loginActive = formActive && (settings.view === "front" || settings.view === "elevated");

  return (
    <div className="archive-app">
      <header className="archive-header">
        <a className="archive-brand" href="/" aria-label="The Rolling Archive home">
          <span className="archive-sigil" aria-hidden="true"><span /></span>
          <span>The Rolling Archive</span>
        </a>
        <div className="header-edition">Interface specimen <span>№ 001</span></div>
        <button className="text-button header-notes" type="button" onClick={() => setNotesOpen(true)}>
          Motion notes <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </header>

      <main className="archive-workspace">
        <section className="archive-intro" aria-labelledby="archive-title">
          <div className="section-index">Study 01 / Reversible matter</div>
          <h1 id="archive-title">Paper, with<br /> a memory.</h1>
          <p className="intro-copy">
            A continuous sheet that rolls, releases, and returns. Not a reveal effect—every frame is geometry.
          </p>
          <dl className="material-facts">
            <div><dt>Surface</dt><dd>Ivory parchment</dd></div>
            <div><dt>Vertices</dt><dd>42,334</dd></div>
            <div><dt>Thickness</dt><dd>Preserved</dd></div>
            <div><dt>Playback</dt><dd>Fully reversible</dd></div>
          </dl>
          <div className="intro-footnote">
            <Sparkles size={15} strokeWidth={1.4} aria-hidden="true" />
            <span>Drag the stage to inspect the curl.<br />Press Esc to roll it closed.</span>
          </div>
        </section>

        <section className="scroll-stage" aria-label="Parchment animation stage">
          <div className="stage-topline">
            <div className="live-status"><span className={isMoving ? "status-dot is-moving" : "status-dot"} />{stateLabels[scrollState]}</div>
            {progress > 0.001 && (
              <button className="stage-close" type="button" onClick={closeScroll} aria-label="Close parchment scroll">
                <X size={18} strokeWidth={1.5} />
              </button>
            )}
          </div>
          <div className="scene-mount" ref={mountRef} />
          {!ready && !loadError && (
            <div className="scene-loading" role="status">
              <span className="loading-roll" aria-hidden="true" />
              Preparing the parchment…
            </div>
          )}
          {loadError && (
            <div className="scene-error" role="alert">
              <img src="/assets/scroll_login_animation_v01.png" alt="Fully opened ivory parchment reference" />
              <div>
                <strong>The 3D renderer could not start.</strong>
                <p>The original open pose is shown instead.</p>
                <button type="button" className="outline-button" onClick={() => setReloadToken((value) => value + 1)}>Try again</button>
              </div>
            </div>
          )}

          <div
            className={`login-parchment ${loginActive ? "is-active" : ""}`}
            role="dialog"
            aria-label={isAuthenticated ? "Archive account" : "Sign in to the archive"}
            aria-hidden={!loginActive}
          >
            <div className="login-ornament" aria-hidden="true"><BookOpen size={23} strokeWidth={1.2} /></div>
            {isAuthenticated && user ? (
              <>
                <p className="login-kicker">The archive recognizes you</p>
                <h2>Welcome back,<br />{user.name?.split(" ")[0] || "traveler"}.</h2>
                <p className="login-copy">Your preferred timing and inspection angle are kept with your account.</p>
                <button className="parchment-button" type="button" onClick={() => logout()} disabled={!loginActive}>
                  Sign out <LogOut size={16} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <>
                <p className="login-kicker">A little magic awaits</p>
                <h2>Enter the<br />archive.</h2>
                <p className="login-copy">Sign in to keep your scroll settings across every visit.</p>
                <button
                  className="parchment-button"
                  type="button"
                  onClick={() => window.location.assign(getOAuthUrl())}
                  disabled={!loginActive || authLoading}
                >
                  Continue with Kimi <ChevronRight size={17} strokeWidth={1.5} />
                </button>
                <button className="parchment-secondary" type="button" onClick={closeScroll} disabled={!loginActive}>
                  Not now
                </button>
              </>
            )}
          </div>

          <div className="stage-caption">
            <span>Continuous mesh deformation</span>
            <span>{Math.round(progress * 100).toString().padStart(3, "0")}%</span>
          </div>
        </section>

        <aside className="motion-panel" aria-label="Animation controls">
          <div className="panel-heading">
            <span>Motion controls</span>
            <RotateCcw size={15} strokeWidth={1.4} aria-hidden="true" />
          </div>

          <div className="control-section">
            <label htmlFor="frame-scrubber">Animation frame</label>
            <input
              id="frame-scrubber"
              className="archive-range"
              type="range"
              min="0"
              max="1000"
              value={Math.round(progress * 1000)}
              onChange={(event) => engineRef.current?.setProgress(Number(event.target.value) / 1000)}
              disabled={!ready}
            />
            <div className="range-labels"><span>Roll</span><span>Sheet</span></div>
          </div>

          <div className="control-section">
            <div className="control-label-row">
              <label htmlFor="open-duration">Open duration</label>
              <output htmlFor="open-duration">{(settings.openDuration / 1000).toFixed(2)} s</output>
            </div>
            <input
              id="open-duration"
              className="archive-range"
              type="range"
              min="800"
              max="3000"
              step="50"
              value={settings.openDuration}
              onChange={(event) => updateSettings({ openDuration: Number(event.target.value) })}
            />
          </div>

          <div className="control-section">
            <div className="control-label-row">
              <label htmlFor="close-duration">Close duration</label>
              <output htmlFor="close-duration">{(settings.closeDuration / 1000).toFixed(2)} s</output>
            </div>
            <input
              id="close-duration"
              className="archive-range"
              type="range"
              min="700"
              max="3000"
              step="50"
              value={settings.closeDuration}
              onChange={(event) => updateSettings({ closeDuration: Number(event.target.value) })}
            />
          </div>

          <div className="control-section">
            <span className="control-label">Inspection angle</span>
            <div className="view-switch" role="group" aria-label="Inspection angle">
              {(["front", "elevated", "perspective", "side"] as ScrollView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  aria-pressed={settings.view === view}
                  onClick={() => updateSettings({ view })}
                >
                  {view === "front" ? "Front" : view === "elevated" ? "5° view" : view === "perspective" ? "¾ view" : "Side"}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-status" aria-live="polite">
            {!isAuthenticated && <><span className="preference-mark" />Sign in to save these settings</>}
            {isAuthenticated && saveState === "saving" && <><span className="preference-mark is-busy" />Saving to your archive…</>}
            {isAuthenticated && saveState === "saved" && <><Check size={14} />Preferences saved</>}
            {isAuthenticated && saveState === "error" && <><span className="preference-mark is-error" />Couldn’t save. Adjust again to retry.</>}
            {isAuthenticated && saveState === "idle" && <><span className="preference-mark" />Account preferences</>}
          </div>

          <div className="implementation-links">
            <a href="/assets/scroll_login_animation_v01.glb" download>
              <span><ScrollText size={16} strokeWidth={1.4} />Animation-ready mesh</span>
              <ArrowDownToLine size={15} strokeWidth={1.4} />
            </a>
            <a href="/downloads/scroll_login_animation_v05.js" download>
              <span><BookOpen size={16} strokeWidth={1.4} />Animation module</span>
              <ArrowDownToLine size={15} strokeWidth={1.4} />
            </a>
          </div>
        </aside>
      </main>

      <footer className="playback-bar">
        <div className="playback-meta">
          <span className="playback-number">01</span>
          <div><strong>Parchment login</strong><span>Field Guide motion study</span></div>
        </div>
        <div className="playback-actions">
          <button className="play-button" type="button" onClick={openScroll} disabled={!ready || scrollState === "opening" || scrollState === "open"}>
            <Sparkles size={16} strokeWidth={1.5} /> Unroll scroll
          </button>
          <button className="close-button" type="button" onClick={closeScroll} disabled={!ready || scrollState === "closing" || progress === 0}>
            Roll closed <X size={16} strokeWidth={1.5} />
          </button>
        </div>
        <div className="playback-hint"><span>Reversible at any frame</span><span>Three.js · GLB · HTML</span></div>
      </footer>

      {notesOpen && (
        <div className="notes-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setNotesOpen(false);
        }}>
          <section className="notes-dialog" role="dialog" aria-modal="true" aria-labelledby="notes-title">
            <button className="notes-close" type="button" autoFocus onClick={() => setNotesOpen(false)} aria-label="Close motion notes">
              <X size={19} strokeWidth={1.5} />
            </button>
            <p className="section-index">Field Guide / motion transcription</p>
            <h2 id="notes-title">The paper leads.<br />The magic follows.</h2>
            <ol className="timing-list">
              <li><span>00</span><div><strong>Compact roll</strong><p>The full width remains visible as a tight horizontal cylinder.</p></div></li>
              <li><span>01</span><div><strong>Release</strong><p>The bottom roll rotates while the free edge travels upward. Paper feeds into the visible sheet rather than scaling into place.</p></div></li>
              <li><span>02</span><div><strong>Settle</strong><p>A small damped movement resolves into backward upper and forward lower curls. Only then does the HTML login become active.</p></div></li>
            </ol>
            <p className="notes-detail">Closing runs the same deformation backward from the current frame. The compact roll disappears only when its geometry has finished rolling.</p>
          </section>
        </div>
      )}
    </div>
  );
}
