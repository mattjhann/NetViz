// Transparent full-viewport scroll-snap targets that sit behind the sticky
// stage. They provide both the scroll height and the rest points so the page
// snaps section-to-section (one step per scroll gesture).
//
// Renders `count` snap cells plus one non-snapping tail cell — the tail is the
// final pin room that keeps the last step centred. Together they total
// (count + 1) * 100vh which, with the `-100vh` margin in CSS, reproduces the
// original track height and the useScrollSteps progress mapping exactly.
export default function SnapCells({ count }) {
  return (
    <div className="encap-snap" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="encap-snap__cell" />
      ))}
      <div className="encap-snap__cell is-tail" />
    </div>
  );
}
