import { SocialIcon } from "./icons"
import { FOOTER } from "../_mock/copy"

/** Wireframe footer: 4 link columns, social icons, address lines, copyright strip. Links are placeholders (no routes yet). */
export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft2-links">
          {FOOTER.columns.map((col) => (
            <div className="ft2-col" key={col.title}>
              <b>{col.title}</b>
              {col.links.map((l) => (
                <button type="button" key={l}>
                  {l}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="ft2-social">
          {FOOTER.social.map((s) => (
            <button type="button" className="ft2-soc" data-tip={s} aria-label={s} key={s}>
              <SocialIcon kind={s} />
            </button>
          ))}
        </div>
        <div className="ft2-info">
          {FOOTER.infoLines.map((l, i) => (
            <span key={l}>
              {i > 0 && <br />}
              {l}
            </span>
          ))}
        </div>
        <div className="foot-base">
          <span>{FOOTER.base[0]}</span>
          <span>{FOOTER.base[1]}</span>
        </div>
      </div>
    </footer>
  )
}
