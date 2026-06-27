import type { RefObject } from 'react'

const LINKS = ['Platform', 'Research', 'Pricing', 'Company']

export default function Nav({ navRef }: { navRef: RefObject<HTMLElement | null> }) {
  return (
    <nav ref={navRef}>
      <a className="brand" href="#top" aria-label="Abyssey home">
        <img className="brandlogo" src="/abyssey.png" alt="" />
        <span className="wordmark">
          <span className="word">
            Abyss<b>ey</b>
            <span className="ai">.ai</span>
          </span>
          <span className="tagline">Deep Alive Odyssey</span>
        </span>
      </a>
      <div className="navlinks">
        {LINKS.map((l) => (
          <a key={l} href="#">
            {l}
          </a>
        ))}
      </div>
      <div className="navactions">
        <a className="signin" href="#">
          Sign in
        </a>
        <a className="btn btn-primary" href="#">
          Get started
        </a>
      </div>
    </nav>
  )
}
