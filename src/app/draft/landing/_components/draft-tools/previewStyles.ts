/** Button look shared by every developer-preview control (PreviewPanel, the device launcher and the device preview host). */
export const buttonClass = (active: boolean) =>
  `border px-2.5 py-1 ${active ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] text-[#6b5533]"}`
