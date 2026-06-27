const CARDS = [
  { title: 'Sonar', body: 'Maps the depth of your data so nothing important stays hidden in the dark.' },
  {
    title: 'Pressure-tested',
    body: 'Models that keep their reasoning intact under the hardest, deepest problems.',
  },
  { title: 'Salvage', body: 'Brings the treasure back up — the one answer that was worth the dive.' },
]

export default function Features() {
  return (
    <section className="sketch">
      <div className="wrap">
        <p className="lead rise">What Abyssey surfaces from the deep</p>
        <div className="cards">
          {CARDS.map((c, i) => (
            <div className="card rise" key={c.title} style={{ transitionDelay: `${i * 0.08}s` }}>
              <svg className="ic" viewBox="0 0 120 132">
                <use href="#mark" />
              </svg>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
