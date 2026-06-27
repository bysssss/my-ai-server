export default function Floor() {
  return (
    <section className="floor" id="floor">
      <div className="relic rise">
        <div className="beam-wrap">
          <div className="beam" />
        </div>
        <div className="seafloor" />
        <img
          className="relic-img"
          src="/abyss.jpg"
          alt="Treasure chests stacked on the seafloor with a trident planted at the center"
        />
      </div>
      <h2 className="rise">You've reached the floor.</h2>
      <p className="rise">
        Every odyssey ends with what you came for. Plant your trident — and bring the deep back to
        the surface.
      </p>
      <div className="cta-row rise">
        <a className="btn btn-primary" href="#">
          Start your odyssey →
        </a>
        <a className="btn btn-ghost" href="#">
          Talk to us
        </a>
      </div>
    </section>
  )
}
