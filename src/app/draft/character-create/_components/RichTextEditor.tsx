import { useEffect, useRef, useState, type ReactNode } from "react"
import { cleanRichText } from "./form"

type Command =
  | "bold"
  | "italic"
  | "underline"
  | "strikeThrough"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight"
  | "insertUnorderedList"
  | "insertOrderedList"

/** Inline icons (no icon library in this project). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const TOOLS: { command: Command; label: string; icon: ReactNode }[] = [
  { command: "bold", label: "ตัวหนา", icon: <Icon><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" /></Icon> },
  { command: "italic", label: "ตัวเอียง", icon: <Icon><path d="M19 4h-9M14 20H5M15 4 9 20" /></Icon> },
  { command: "underline", label: "ขีดเส้นใต้", icon: <Icon><path d="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" /></Icon> },
  { command: "strikeThrough", label: "ขีดฆ่า", icon: <Icon><path d="M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16" /></Icon> },
  { command: "justifyLeft", label: "จัดชิดซ้าย", icon: <Icon><path d="M3 6h18M3 12h12M3 18h16" /></Icon> },
  { command: "justifyCenter", label: "จัดกึ่งกลาง", icon: <Icon><path d="M3 6h18M6 12h12M4 18h16" /></Icon> },
  { command: "justifyRight", label: "จัดชิดขวา", icon: <Icon><path d="M3 6h18M9 12h12M5 18h16" /></Icon> },
  { command: "insertUnorderedList", label: "รายการแบบจุด", icon: <Icon><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" /></Icon> },
  { command: "insertOrderedList", label: "รายการแบบตัวเลข", icon: <Icon><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></Icon> },
]
/** a divider is drawn before the first alignment tool and the first list tool */
const GROUP_START: Partial<Record<Command, string>> = { justifyLeft: "align-tools", insertUnorderedList: "list-tools" }

interface RichTextEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  minHeight?: number
}

/** contentEditable editor limited to bold / italic / alignment; stores sanitised HTML. */
export default function RichTextEditor({ id, value, onChange, label, placeholder, minHeight = 270 }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [empty, setEmpty] = useState(!value.replace(/<[^>]*>/g, "").trim())

  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== value) {
      el.innerHTML = cleanRichText(value)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keep placeholder in sync with external value
      setEmpty(!el.textContent?.trim())
    }
  }, [value])

  const sync = () => {
    const el = ref.current
    if (!el) return
    setEmpty(!el.textContent?.trim())
    onChange(cleanRichText(el.innerHTML))
  }

  const format = (command: Command) => {
    ref.current?.focus()
    document.execCommand(command, false)
    sync()
  }

  return (
    <div className="rich-editor">
      <div className="rich-toolbar" role="toolbar" aria-label={`จัดรูปแบบ${label}`}>
        {TOOLS.map((tool) => (
          <span key={tool.command} className={GROUP_START[tool.command] ?? ""}>
            <button
              type="button"
              title={tool.label}
              aria-label={`${tool.label}: ${label}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => format(tool.command)}
            >
              {tool.icon}
            </button>
          </span>
        ))}
      </div>
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        contentEditable
        suppressContentEditableWarning
        className={`rich-content font-serithai ${empty ? "empty" : ""}`}
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={sync}
        onBlur={sync}
        onPaste={(event) => {
          event.preventDefault()
          document.execCommand("insertText", false, event.clipboardData.getData("text/plain"))
          sync()
        }}
      />
    </div>
  )
}
