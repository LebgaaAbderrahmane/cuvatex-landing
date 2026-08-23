// Shared shell: bordered <section> + centred 1160px container.
// NOT used by Clients/Process/Hero (each has its own layout contract) or by
// standalone pages (Section's top border would double against the header's).
// No default prop values on purpose — a forgotten prop should break loudly,
// not silently inherit another section's spacing.

export default function Section({
  id,
  paddingBlockMax, // e.g. '120px'; Contact uses '124px'
  background, // var(--surface, #fff) on raised panels, null otherwise
  containerStyle, // extra keys merged into the container (About/Contact use a grid)
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
