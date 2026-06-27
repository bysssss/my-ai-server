const LINKS = ['Platform', 'Research', 'Pricing', 'Company']

export default function Footer() {
  return (
    <footer>
      <nav className="flinks">
        {LINKS.map((l) => (
          <a key={l} href="#">
            {l}
          </a>
        ))}
      </nav>
      <span>© 2026 Abyssey.ai</span>
    </footer>
  )
}
