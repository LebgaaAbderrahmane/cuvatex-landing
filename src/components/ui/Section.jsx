// The outer shell every ordinary content section repeats: a bordered
// `<section>` with the standard gutter, wrapping a centred 1160px container.
//
// Renders exactly two elements, the same two the sections wrote by hand. That
// matters: several sections elsewhere in the app measure scroll positions, so
// this must not introduce a wrapper node.
//
// NOT used by Services, Clients, Process or Hero. Those four are not this
// component with different props — Services drops the padding entirely and runs
// its sticky stack off `minHeight: 100dvh`, Clients subtracts the measured
// header height from its own `minHeight`, Process anchors a `useScroll` track,
// and Hero has no top border and no `scrollMarginTop`. Reaching for `Section`
// there would mean adding props that exist for one caller each.
//
// Every value that differs between callers is a prop with no default. A default
// here would let one section quietly drift onto another's spacing, which is the
// exact failure this refactor is trying not to introduce.

export default function Section({
  id,
  // Upper bound of the vertical padding clamp: '120px' everywhere except
  // Contact, which uses '124px'.
  paddingBlockMax,
  // `var(--surface, #fff)` on the sections that sit on a raised panel, `null`
  // on the ones that sit on the page background.
  background,
  // Extra keys merged into the container: About and Contact make it a grid.
  containerStyle,
  children,
}) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: 80,
        padding: `clamp(64px, 10vw, ${paddingBlockMax}) clamp(20px, 5vw, 48px)`,
        ...(background ? { background } : null),
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', ...containerStyle }}>
        {children}
      </div>
    </section>
  );
}
