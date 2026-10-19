import { getPhotoSrc } from "../_mock/options"

interface PhotoCircleProps {
  /** preset id ("" = placeholder) */
  photo: string
  className?: string
}

/** Round profile picture: the chosen preset, or a ✦ placeholder before one is picked. */
export default function PhotoCircle({ photo, className = "h-40 w-40" }: PhotoCircleProps) {
  const src = getPhotoSrc(photo)
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#b89a63] bg-[#efe3c6]/60`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="รูปโปรไฟล์ตัวละคร" className="h-full w-full object-cover" />
      ) : (
        <span className="text-2xl text-[#a3854e]" aria-hidden>
          ✦
        </span>
      )}
    </div>
  )
}
