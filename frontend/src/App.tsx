import { useRef } from 'react'
import { useAbyss } from './abyss'
import { useReveal } from './useReveal'
import SvgDefs from './components/SvgDefs'
import Nav from './components/Nav'
import DepthRail from './components/DepthRail'
import Hero from './components/Hero'
import DepthLine from './components/DepthLine'
import Features from './components/Features'
import Floor from './components/Floor'
import Footer from './components/Footer'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const readRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

  useAbyss({ canvasRef, navRef, readRef, dotRef })
  useReveal()

  return (
    <>
      <SvgDefs />
      <canvas ref={canvasRef} className="abyss-canvas" />
      <Nav navRef={navRef} />
      <DepthRail readRef={readRef} dotRef={dotRef} />
      <main id="top">
        <Hero />
        <DepthLine meta="−800 m · Twilight zone" title="This is where most tools lose the light." />
        <DepthLine
          meta="−2,400 m · Crushing pressure"
          title="Reasoning that holds where others implode."
          alt
        />
        <Features />
        <DepthLine meta="−4,000 m · The abyssal plain" title="You're almost at the floor." />
        <Floor />
        <Footer />
      </main>
    </>
  )
}
