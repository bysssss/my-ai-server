import { useEffect, type RefObject } from 'react'

type AbyssRefs = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  navRef: RefObject<HTMLElement | null>
  readRef: RefObject<HTMLSpanElement | null>
  dotRef: RefObject<HTMLSpanElement | null>
}

type Particle = { x: number; y: number; r: number; sp: number; dx: number }

/**
 * 심연 하강 캔버스 + 스크롤 연동(수심계·nav 상태).
 * 스크롤마다 React state를 갱신하면 무거우므로 ref로 직접 DOM/canvas를 다룬다 (목업 로직 이식).
 */
export function useAbyss({ canvasRef, navRef, readRef, dotRef }: AbyssRefs) {
  useEffect(() => {
    const cvEl = canvasRef.current
    if (!cvEl) return
    const ctx0 = cvEl.getContext('2d')
    if (!ctx0) return
    // 가드로 비-null 보장되지만 TS는 클로저 내부에서 좁힘을 잃는다 → 비-null 타입으로 재바인딩.
    const cv: HTMLCanvasElement = cvEl
    const ctx: CanvasRenderingContext2D = ctx0

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const mix = (c1: number[], c2: number[], t: number) => [
      lerp(c1[0], c2[0], t),
      lerp(c1[1], c2[1], t),
      lerp(c1[2], c2[2], t),
    ]
    const rgb = (c: number[]) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
    const surfTop = [22, 58, 82]
    const surfBot = [10, 35, 53]
    const floorTop = [2, 8, 14]
    const floorBot = [1, 3, 7]

    let particles: Particle[] = []
    function seed() {
      particles = []
      const n = reduce ? 0 : Math.min(120, Math.floor(window.innerWidth / 12))
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          r: Math.random() * 1.7 + 0.4,
          sp: Math.random() * 0.0006 + 0.0002,
          dx: (Math.random() - 0.5) * 0.0004,
        })
      }
    }
    function resize() {
      W = cv.width = Math.floor(window.innerWidth * dpr)
      H = cv.height = Math.floor(window.innerHeight * dpr)
      cv.style.width = window.innerWidth + 'px'
      cv.style.height = window.innerHeight + 'px'
      seed()
    }

    let depthT = 0
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      depthT = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      navRef.current?.classList.toggle('scrolled', window.scrollY > 40)
      const meters = Math.round(depthT * 6000)
      if (readRef.current) {
        readRef.current.textContent =
          depthT >= 0.992 ? 'THE FLOOR' : '−' + meters.toLocaleString('en-US') + ' m'
      }
      if (dotRef.current) dotRef.current.style.top = depthT * 100 + '%'
    }

    let raf = 0
    function draw() {
      const t = depthT
      const top = mix(surfTop, floorTop, t)
      const bot = mix(surfBot, floorBot, t)
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, rgb(top))
      g.addColorStop(1, rgb(bot))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      // god rays near surface, fade with depth
      const rayA = (1 - t) * 0.1
      if (rayA > 0.004) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        for (let i = 0; i < 4; i++) {
          const x = (0.12 + i * 0.24) * W
          const rg = ctx.createLinearGradient(x, 0, x - 60 * dpr, H)
          rg.addColorStop(0, `rgba(150,235,250,${rayA})`)
          rg.addColorStop(1, 'rgba(150,235,250,0)')
          ctx.fillStyle = rg
          ctx.beginPath()
          ctx.moveTo(x - 40 * dpr, 0)
          ctx.lineTo(x + 40 * dpr, 0)
          ctx.lineTo(x - 90 * dpr, H)
          ctx.lineTo(x - 200 * dpr, H)
          ctx.closePath()
          ctx.fill()
        }
        ctx.restore()
      }

      // marine snow
      const pA = Math.max(0, 0.5 - t * 0.32)
      ctx.fillStyle = `rgba(190,228,238,${pA})`
      for (const p of particles) {
        if (!reduce) {
          p.y -= p.sp
          p.x += p.dx
          if (p.y < 0) p.y = 1
          if (p.x < 0) p.x = 1
          if (p.x > 1) p.x = 0
        }
        ctx.beginPath()
        ctx.arc(p.x * W, p.y * H, p.r * dpr, 0, 6.283)
        ctx.fill()
      }

      // floor glow near the bottom as we approach
      if (t > 0.62) {
        const a = (t - 0.62) / 0.38
        const gx = W / 2
        const gy = H * 0.92
        const rad = H * 0.7
        const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad)
        rg.addColorStop(0, `rgba(95,224,239,${0.16 * a})`)
        rg.addColorStop(1, 'rgba(95,224,239,0)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, W, H)
      }
      raf = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    resize()
    onScroll()
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [canvasRef, navRef, readRef, dotRef])
}
