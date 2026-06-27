import type { RefObject } from 'react'

export default function DepthRail({
  readRef,
  dotRef,
}: {
  readRef: RefObject<HTMLSpanElement | null>
  dotRef: RefObject<HTMLSpanElement | null>
}) {
  return (
    <div className="rail" aria-hidden="true">
      <span className="cap">Surface</span>
      <div className="track">
        <span className="dot" ref={dotRef} />
      </div>
      <span className="read" ref={readRef}>
        −0 m
      </span>
      <span className="cap">The floor</span>
    </div>
  )
}
