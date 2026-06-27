/** 재사용 SVG 심볼 정의 (카드 아이콘용 트라이던트 마크). 한 번만 렌더. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="mark" viewBox="0 0 120 132">
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M60 16 V76" />
          <path d="M51 29 L60 15 L69 29" />
          <path d="M40 31 V50" />
          <path d="M32 41 L40 30 L48 41" />
          <path d="M80 31 V50" />
          <path d="M72 41 L80 30 L88 41" />
          <path d="M40 50 Q60 61 80 50" />
          <path d="M29 76 Q60 99 91 76" />
          <path d="M31 76 L89 76" />
          <path d="M31 76 Q25 67 32 63" />
          <path d="M89 76 Q95 67 88 63" />
          <path d="M43 90 L37 102 M55 94 L49 106 M65 94 L59 106 M77 90 L71 102" />
        </g>
      </symbol>
    </svg>
  )
}
