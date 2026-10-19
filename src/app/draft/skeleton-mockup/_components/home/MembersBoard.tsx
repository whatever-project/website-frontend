"use client"

import { Fragment } from "react"
import { useSkeleton } from "../SkeletonContext"
import SectionHead from "../SectionHead"
import { clickable } from "../clickable"
import { CitizenInfo, RoleInfo } from "../infoContent"
import { MEMBERS } from "../../_mock/copy"
import { CITIZENS, ROLES } from "../../_mock/home"

/** SEC.05 — Members: the five roles as circles, new arrivals, community stats. */
export default function MembersBoard() {
  const { openInfo } = useSkeleton()

  return (
    <section className="wrap" id="sec-members">
      <SectionHead title={MEMBERS.title} sub={MEMBERS.sub} />
      <div className="mr-board reveal d1">
        <div className="dc-head">
          <b>{MEMBERS.rolesHead}</b>
        </div>
        <div className="dc-sub">{MEMBERS.rolesSub}</div>
        <div className="role-circles" id="roleCircles">
          {ROLES.map((r) => (
            <div className="rc" key={r.name} {...clickable(() => openInfo(`กลุ่มผู้ใช้งาน — ${r.name}`, <RoleInfo role={r} />))}>
              <span className="cir" />
              <b>{r.name.toUpperCase()}</b>
              <span>
                {r.members.toLocaleString("en-US")} สมาชิก · {r.online} ออนไลน์
              </span>
            </div>
          ))}
        </div>

        <div className="mr-divider">
          <span>{MEMBERS.arrivals}</span>
        </div>
        <div className="member-grid" id="memberGrid" style={{ padding: "22px 22px 26px" }}>
          {CITIZENS.map((c) => (
            <div className="member" key={c.name} {...clickable(() => openInfo(c.name, <CitizenInfo citizen={c} />))}>
              <span className="ph">[รูป]</span>
              <span>
                <b>{c.name}</b>
                <span>
                  {c.role} · {c.joined}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mr-stats">
          {MEMBERS.stats.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && <i className="mrs-sep">✦</i>}
              <div className="mrs">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
