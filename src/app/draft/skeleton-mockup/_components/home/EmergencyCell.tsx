"use client"

import { useEffect, useRef, useState } from "react"
import { useSkeleton } from "../SkeletonContext"
import Placeholder from "../Placeholder"
import { OwlSvg } from "../icons"
import { EMERGENCY, NEWS } from "../../_mock/copy"

type EmgView = "emg" | "news"
/** locked → (pay) → paying → paid → gone */
type Gate = "locked" | "paying" | "paid" | "gone"

/**
 * Dark cell with two views: the live emergency report and "The Veymour Prophet" newspaper
 * (behind an owl gate that asks for 20 เคล). The demo button simulates "no emergency".
 */
export default function EmergencyCell() {
  const { open } = useSkeleton()
  const [emgActive, setEmgActive] = useState(true)
  const [view, setView] = useState<EmgView>("emg")
  const [gate, setGate] = useState<Gate>("locked")
  const thumbRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Partial<Record<EmgView, HTMLButtonElement | null>>>({})
  const timers = useRef<number[]>([])

  /* white pill under the active segment tab */
  useEffect(() => {
    const place = () => {
      const btn = tabRefs.current[view]
      const thumb = thumbRef.current
      if (!btn || !thumb || btn.offsetParent === null) return
      thumb.style.left = `${btn.offsetLeft}px`
      thumb.style.width = `${btn.offsetWidth}px`
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [view, emgActive])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const toggleDemo = () => {
    const next = !emgActive
    setEmgActive(next)
    setView(next ? "emg" : "news")
  }

  const pay = () => {
    if (gate !== "locked") return
    setGate("paying")
    timers.current.push(
      window.setTimeout(() => {
        setGate("paid")
        timers.current.push(window.setTimeout(() => setGate("gone"), 650))
      }, 1250),
    )
  }

  const isEmg = view === "emg"

  return (
    <div className="cell-dark cell-emg" id="emgCell">
      <div className="emg-head">
        <div className="emg-htitle">
          <b>{isEmg ? EMERGENCY.label : EMERGENCY.newsLabel}</b>
          <span>{isEmg ? EMERGENCY.sub : EMERGENCY.newsSub}</span>
        </div>
        <div className="emg-head-ctrl">
          <div className="emg-seg" style={{ display: emgActive ? "flex" : "none" }}>
            <div className="emg-thumb" ref={thumbRef} />
            <button
              type="button"
              ref={(el) => {
                tabRefs.current.emg = el
              }}
              className={`etab${isEmg ? " on" : ""}`}
              onClick={() => setView("emg")}
            >
              เหตุการณ์ฉุกเฉิน
            </button>
            <button
              type="button"
              ref={(el) => {
                tabRefs.current.news = el
              }}
              className={`etab${!isEmg ? " on" : ""}`}
              onClick={() => setView("news")}
            >
              หนังสือพิมพ์
            </button>
          </div>
          <button type="button" className="etab demo" onClick={toggleDemo}>
            {emgActive ? EMERGENCY.demoOn : EMERGENCY.demoOff}
          </button>
        </div>
      </div>

      <div id="emgView" hidden={!isEmg}>
        <span className="emg-live">
          <span className="dot" />
          {EMERGENCY.live}
        </span>
        <div className="emg-title">{EMERGENCY.title}</div>
        <Placeholder style={{ height: 130, flex: "none", borderColor: "#4a4a4a" }} tag={EMERGENCY.image} />
        <div className="emg-desc">{EMERGENCY.quote}</div>
        <div className="emg-desc">{EMERGENCY.report}</div>
        <button type="button" className="btn" style={{ marginTop: "auto", alignSelf: "flex-start" }} onClick={() => open("emergency")}>
          {EMERGENCY.cta}
        </button>
      </div>

      <div className="prophet" id="prophetView" hidden={isEmg}>
        <div className="pr-mast">
          {NEWS.mast.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="pr-title">{NEWS.title}</div>
        <div className="pr-head">{NEWS.head}</div>
        <div className="pr-cols">
          <div className="pr-col">
            <Placeholder className="pr-img" tag={NEWS.col1.imageTag} />
            <p className="pr-cap">{NEWS.col1.caption}</p>
            <p className="pr-txt pr-lead">{NEWS.col1.lead}</p>
            <p className="pr-txt">{NEWS.col1.body}</p>
          </div>
          <div className="pr-col">
            {NEWS.col2.map((a) => (
              <div key={a.head}>
                <h4 className="pr-sub">{a.head}</h4>
                <p className="pr-txt">{a.text}</p>
              </div>
            ))}
          </div>
          <div className="pr-col">
            <h4 className="pr-sub">{NEWS.col3.head}</h4>
            <p className="pr-txt">{NEWS.col3.text}</p>
            <Placeholder className="pr-img" style={{ height: 90 }} tag={NEWS.col3.adTag} />
            <p className="pr-cap">{NEWS.col3.adCaption}</p>
            <p className="pr-txt">{NEWS.col3.weather}</p>
          </div>
        </div>

        {!isEmg && gate !== "gone" && (
          <div className={`owl-gate${gate === "paying" ? " paying" : ""}${gate === "paid" ? " paid" : ""}`} id="owlGate">
            <OwlSvg label={NEWS.owl.label} />
            <p className="owl-txt">
              {NEWS.owl.textLine1}
              <br />
              {NEWS.owl.textLine2Prefix}
              <b>{NEWS.owl.price}</b>
              {NEWS.owl.textLine2Suffix}
            </p>
            <button type="button" className="btn" id="owlPay" onClick={pay} disabled={gate !== "locked"}>
              {gate === "locked" ? NEWS.owl.pay : gate === "paying" ? NEWS.owl.paying : NEWS.owl.paid}
            </button>
            <p className="owl-note">{NEWS.owl.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}
