export default function DepthLine({
  meta,
  title,
  alt = false,
}: {
  meta: string
  title: string
  alt?: boolean
}) {
  return (
    <section className={alt ? 'depthline alt' : 'depthline'}>
      <div className="wrap">
        <div className="inner rise" style={alt ? { marginLeft: 'auto' } : undefined}>
          <p className="meta">{meta}</p>
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  )
}
