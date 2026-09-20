/**
 * Built-in hero illustration: a modern Florida home at dusk.
 * The gold rooflines draw themselves once on load; that is the hero's single orchestrated moment.
 * Replace with real photography via HERO_IMAGE in lib/config.ts.
 */
const draw = { strokeDasharray: 2400, strokeDashoffset: 2400 } as const;

function Palm({ x, h = 220, lean = 1 }: { x: number; h?: number; lean?: number }) {
  const top = 690 - h;
  return (
    <g stroke="#0A1830" strokeLinecap="round" fill="none">
      <path d={`M${x} 690 C ${x - 8 * lean} ${690 - h * 0.4}, ${x + 12 * lean} ${690 - h * 0.7}, ${x + 4 * lean} ${top}`} strokeWidth="9" />
      {[-1, -0.55, -0.15, 0.25, 0.65, 1].map((d, i) => (
        <path
          key={i}
          d={`M${x + 4 * lean} ${top} q ${d * 55} ${-28 + Math.abs(d) * 10} ${d * 105} ${18 + Math.abs(d) * 28}`}
          strokeWidth="6"
        />
      ))}
    </g>
  );
}

export function HeroArt() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--ink))" }} />
          <stop offset="0.55" style={{ stopColor: "rgb(var(--navy))" }} />
          <stop offset="0.8" style={{ stopColor: "rgb(var(--sky))", stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--gold))", stopOpacity: 0.55 }} />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: "rgb(var(--gold))", stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--gold))", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--gold))", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--gold))", stopOpacity: 0.55 }} />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1A31" />
          <stop offset="1" style={{ stopColor: "rgb(var(--ink))" }} />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#sky)" />
      <circle cx="1120" cy="690" r="340" fill="url(#sun)" />

      {/* ground + pool */}
      <rect y="690" width="1600" height="210" fill="url(#ground)" />
      <rect x="720" y="706" width="780" height="46" rx="4" style={{ fill: "rgb(var(--sky))", fillOpacity: 0.35 }} />
      <rect x="850" y="712" width="490" height="6" rx="3" style={{ fill: "rgb(var(--gold))", fillOpacity: 0.55 }} />

      {/* house volumes */}
      <rect x="820" y="560" width="600" height="130" fill="#0C1F3A" />
      <rect x="980" y="470" width="320" height="90" fill="#10284A" />

      {/* glazing */}
      {[850, 1020, 1190].map((x) => (
        <rect key={x} x={x} y="586" width="140" height="104" fill="url(#lit)" />
      ))}
      {[1006, 1156].map((x) => (
        <rect key={x} x={x} y="492" width="122" height="60" fill="url(#lit)" />
      ))}
      {[990, 1160, 1330, 1150].map((x, i) => (
        <rect key={i} x={x} y={i === 3 ? 492 : 586} width="4" height={i === 3 ? 60 : 104} fill="#0C1F3A" />
      ))}

      {/* gold entry blade */}
      <rect x="1388" y="560" width="6" height="130" style={{ fill: "rgb(var(--gold))" }} />

      {/* roof slabs */}
      <rect x="800" y="552" width="640" height="9" fill="#132C50" />
      <rect x="960" y="462" width="360" height="9" fill="#132C50" />

      {/* self-drawing gold rooflines */}
      <g style={{ stroke: "rgb(var(--gold))" }} strokeWidth="3" fill="none" strokeLinecap="round">
        <path className="draw-path animate-draw" style={draw} d="M800 552 H1440 M1440 552 V690 M960 462 H1320 M1320 462 V552 M960 462 V552" />
      </g>

      {/* palms */}
      <Palm x={740} h={230} lean={-1} />
      <Palm x={1500} h={260} lean={1} />
      <Palm x={1560} h={190} lean={1} />
    </svg>
  );
}
