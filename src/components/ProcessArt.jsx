import { Search, PenTool, Code2, Rocket } from 'lucide-react';

// One real icon per step, from the same lucide-react set the client-type
// icons in Clients.jsx already use. Pure decoration (aria-hidden), so no
// text and no translation key.
const ICONS = [Search, PenTool, Code2, Rocket];

const RING = 216;
const BADGE = 132;
const ICON_SIZE = 60;

export default function ProcessArt({ index }) {
  const Icon = ICONS[index] || ICONS[0];
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Clears the dot row pinned to the panel's bottom edge.
        paddingBlockEnd: 44,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 45%, var(--accent, #0E7A69), transparent 65%)',
        opacity: 0.07,
      }} />
      <div style={{
        position: 'relative',
        width: RING,
        height: RING,
        borderRadius: '50%',
        border: '1px solid var(--line, rgba(21,18,15,0.13))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}>
        <div style={{
          width: BADGE,
          height: BADGE,
          borderRadius: '50%',
          background: 'color-mix(in srgb, var(--accent, #0E7A69) 12%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={ICON_SIZE} color="var(--accent, #0E7A69)" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
