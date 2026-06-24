/** Animated aurora blobs + grain overlay — ported from the prototype. */
export default function Background() {
  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="grain" aria-hidden="true" />
    </>
  )
}
