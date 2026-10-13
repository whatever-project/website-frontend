/** Decorative letter-scene illustration used beside the login and signup forms. */
export default function LetterStack() {
  return (
    <div className="absolute inset-0 flex items-center justify-end">
      <img
        src="/assets/letter-scene.png"
        alt=""
        className="-mr-6 w-[560px] max-w-none [filter:drop-shadow(0_16px_22px_rgba(60,40,15,.42))]"
      />
    </div>
  )
}
