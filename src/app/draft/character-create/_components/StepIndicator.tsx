interface StepIndicatorProps {
  current: number
  total: number
  labels: readonly string[]
  onStep: (step: number) => void
}

/** Vertical parchment step rail; completed steps lead back to that part of the form. */
export default function StepIndicator({ current, total, labels, onStep }: StepIndicatorProps) {
  return (
    <nav className="step-rail" aria-label={`ลำดับการกรอก ขั้นที่ ${current} จาก ${total}`}>
      <p className="parch-label">ลำดับการจารึก</p>
      <ol>
        {Array.from({ length: total }, (_, index) => index + 1).map((number) => {
          const completed = number < current
          const active = number === current
          return (
            <li key={number} className={`${completed ? "is-complete" : ""} ${active ? "is-current" : ""}`}>
              <button
                type="button"
                disabled={!completed}
                onClick={() => completed && onStep(number)}
                aria-current={active ? "step" : undefined}
                aria-label={`${labels[number - 1]}${completed ? " — กดเพื่อกลับไป" : ""}`}
                title={completed ? "กดเพื่อกลับไปขั้นตอนนี้" : labels[number - 1]}
              >
                <span className="step-number">{number}</span>
                <span className="step-copy">
                  <strong>{labels[number - 1]}</strong>
                  <small>{active ? "กำลังกรอก" : completed ? "กดเพื่อกลับไป" : "รอดำเนินการ"}</small>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="step-rail-note">✦ สามารถกดย้อนกลับมายังขั้นตอนที่ผ่านแล้ว</p>
    </nav>
  )
}
