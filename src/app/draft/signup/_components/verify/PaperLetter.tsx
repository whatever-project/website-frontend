"use client";

import type { ReactNode } from "react";

/*
 * The paper letter: the real /assets/paper.png, drawn as a stretchable 9-slice (CSS border-image) so the sheet grows with its content.
 * The torn edges, stained corners and soft shadow keep their size; only the pale centre stretches.
 *
 * paper.png is a 1500x1500 canvas with transparent margins. Measured (alpha > 50%): the sheet is x 62-1433, y 296-1103 (1372 x 808 px).
 * Margins around it: top 296, left 62, right 66, bottom 396. The stain band along the edges is about 120px wide (the colour is cream by
 * then, and the torn edge wobbles by at most 12px), so each slice = margin + 120.
 *
 * --u is one image pixel at the displayed size (the sheet is 100cqw wide), so the paper scales as a whole and is only stretched vertically.
 * border-image-outset = the transparent margins, so the element's box is exactly the visible paper.
 */
const PAPER_CSS = `
.paper-letter { container-type: inline-size; width: 100%; filter: drop-shadow(0 14px 18px rgba(60, 40, 15, 0.3)); }
.paper-letter-sheet {
  --u: calc(100cqw / 1372);
  position: relative;
  display: flex; flex-direction: column; justify-content: center;
  box-sizing: border-box;
  min-height: calc(var(--u) * 808);
  padding: calc(var(--u) * 140) calc(var(--u) * 150);
  border: 1px solid transparent;
  border-image-source: url(/assets/paper.png);
  border-image-slice: 416 186 516 182 fill;
  border-image-width: calc(var(--u) * 416) calc(var(--u) * 186) calc(var(--u) * 516) calc(var(--u) * 182);
  border-image-outset: calc(var(--u) * 296) calc(var(--u) * 66) calc(var(--u) * 396) calc(var(--u) * 62);
  border-image-repeat: stretch;
}
/* phones: content a little smaller (see VERIFY_CSS) so it stays clear of the stained edge: 110 image px (about 29px on a 390px phone) instead of 150 */
@media (max-width: 479px) {
  .paper-letter-sheet { padding-inline: calc(var(--u) * 110); padding-block: calc(var(--u) * 175); }
}
`;

export default function PaperLetter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`paper-letter ${className}`}>
      <style>{PAPER_CSS}</style>
      <div className="paper-letter-sheet">{children}</div>
    </div>
  );
}
