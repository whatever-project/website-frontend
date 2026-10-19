"use client"

import { Fragment } from "react"
import { useSkeleton } from "../SkeletonContext"
import { TICKER } from "../../_mock/copy"

/** Scrolling emergency / patch / welcome strip. The items are rendered twice so the loop is seamless. */
export default function Ticker() {
  const { open } = useSkeleton()
  return (
    <div className="ticker" aria-label="ประกาศด่วน">
      <div className="ticker-track">
        {[0, 1].map((copy) =>
          TICKER.items.map((item) => (
            <Fragment key={`${copy}-${item.bold}`}>
              <span>
                {item.alert && (
                  <button type="button" className="alert" onClick={() => open("emergency")}>
                    {TICKER.alert}
                  </button>
                )}
                <b>{item.bold}</b>
                {item.text}
              </span>
              <span className="sep">✦</span>
            </Fragment>
          )),
        )}
      </div>
    </div>
  )
}
