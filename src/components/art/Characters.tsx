"use client";

import { useId } from "react";

// Original flat mascots with soft gradient shading — bucket hat + overalls, floating on clouds.
// Colours are intentional illustration art (not theme tokens).

type AccentName = "orange" | "indigo" | "coral" | "sky";

const ACCENTS: Record<AccentName, { light: string; base: string; dark: string }> = {
  orange: { light: "#ffc27a", base: "#ffa54e", dark: "#ef8f22" },
  indigo: { light: "#c3c5ff", base: "#9a9eff", dark: "#6f74ee" },
  coral: { light: "#ffb0b0", base: "#ff7a7a", dark: "#ef5a5a" },
  sky: { light: "#c3ecff", base: "#91d4ff", dark: "#5cb3ef" },
};

const SKIN = { light: "#f7d3ae", base: "#ecbb8f", dark: "#dba476" };
const CREAM = "#fdeacd";
const CREAM_DK = "#f3d9b4";
const INK = "#3a2f2a";

export function Mascot({
  accent = "orange",
  size = 300,
  className,
  style,
}: {
  accent?: AccentName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const uid = useId().replace(/:/g, "");
  const a = ACCENTS[accent];
  const g = (n: string) => `${uid}-${n}`;

  return (
    <svg viewBox="0 0 240 280" width={size} height={(size * 280) / 240} className={className} style={style} role="img" aria-label="Playful mascot floating on a cloud" fill="none">
      <defs>
        <linearGradient id={g("acc")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={a.light} />
          <stop offset="0.55" stopColor={a.base} />
          <stop offset="1" stopColor={a.dark} />
        </linearGradient>
        <linearGradient id={g("skin")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={SKIN.light} />
          <stop offset="0.6" stopColor={SKIN.base} />
          <stop offset="1" stopColor={SKIN.dark} />
        </linearGradient>
        <linearGradient id={g("cloud")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e7edfa" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="120" cy="256" rx="66" ry="11" fill="rgba(30,30,50,0.08)" />

      {/* clouds (behind) */}
      <g fill={`url(#${g("cloud")})`}>
        <ellipse cx="196" cy="96" rx="34" ry="22" />
        <ellipse cx="176" cy="104" rx="26" ry="18" />
        <ellipse cx="44" cy="150" rx="30" ry="20" />
        <ellipse cx="120" cy="206" rx="86" ry="46" />
        <ellipse cx="62" cy="200" rx="44" ry="30" />
        <ellipse cx="180" cy="198" rx="46" ry="32" />
        <ellipse cx="98" cy="176" rx="50" ry="32" />
        <ellipse cx="150" cy="178" rx="48" ry="30" />
      </g>

      {/* legs + striped socks + shoes */}
      <g>
        <rect x="97" y="192" width="19" height="54" rx="9.5" fill={`url(#${g("acc")})`} />
        <rect x="124" y="192" width="19" height="54" rx="9.5" fill={`url(#${g("acc")})`} />
        {/* socks */}
        <g>
          <rect x="97" y="238" width="19" height="18" rx="6" fill="#ffffff" />
          <rect x="124" y="238" width="19" height="18" rx="6" fill="#ffffff" />
          {[241, 247, 253].map((y) => (
            <g key={y}>
              <rect x="97" y={y} width="19" height="3" fill={a.base} />
              <rect x="124" y={y} width="19" height="3" fill={a.base} />
            </g>
          ))}
        </g>
        {/* shoes */}
        <ellipse cx="104" cy="262" rx="16" ry="10" fill="#ffffff" />
        <ellipse cx="136" cy="262" rx="16" ry="10" fill="#ffffff" />
        <ellipse cx="104" cy="266" rx="16" ry="5" fill="#e7e7ee" />
        <ellipse cx="136" cy="266" rx="16" ry="5" fill="#e7e7ee" />
      </g>

      {/* arms resting on cloud */}
      <g fill={`url(#${g("skin")})`}>
        <g transform="rotate(22 78 168)">
          <rect x="66" y="138" width="24" height="62" rx="12" />
        </g>
        <g transform="rotate(-22 162 168)">
          <rect x="150" y="138" width="24" height="62" rx="12" />
        </g>
        <ellipse cx="60" cy="196" rx="13" ry="11" />
        <ellipse cx="180" cy="196" rx="13" ry="11" />
      </g>

      {/* torso: tee + overalls */}
      <rect x="80" y="118" width="80" height="90" rx="34" fill={CREAM} />
      <path d="M80 175 q40 22 80 0 v-2 q-40 20 -80 0 z" fill={CREAM_DK} opacity="0.7" />
      {/* straps */}
      <rect x="97" y="108" width="10" height="40" rx="5" fill={a.base} />
      <rect x="133" y="108" width="10" height="40" rx="5" fill={a.base} />
      <circle cx="102" cy="146" r="3.4" fill={a.dark} />
      <circle cx="138" cy="146" r="3.4" fill={a.dark} />
      {/* bib */}
      <rect x="94" y="138" width="52" height="70" rx="20" fill={`url(#${g("acc")})`} />
      <rect x="122" y="138" width="24" height="70" rx="18" fill="rgba(0,0,0,0.06)" />
      <rect x="106" y="158" width="28" height="22" rx="8" fill="rgba(0,0,0,0.08)" />

      {/* head */}
      <circle cx="120" cy="80" r="46" fill={`url(#${g("skin")})`} />
      <ellipse cx="103" cy="66" rx="15" ry="19" fill="#ffffff" opacity="0.14" />

      {/* hat */}
      <rect x="84" y="22" width="72" height="46" rx="30" fill={`url(#${g("acc")})`} />
      <rect x="84" y="52" width="72" height="9" rx="4" fill="rgba(0,0,0,0.10)" />
      <ellipse cx="120" cy="60" rx="64" ry="15" fill={`url(#${g("acc")})`} />
      <ellipse cx="120" cy="64" rx="64" ry="8" fill="rgba(0,0,0,0.10)" />

      {/* face */}
      <ellipse cx="106" cy="84" rx="5" ry="7" fill={INK} />
      <ellipse cx="134" cy="84" rx="5" ry="7" fill={INK} />
      <circle cx="108" cy="82" r="1.6" fill="#fff" />
      <circle cx="136" cy="82" r="1.6" fill="#fff" />
      <circle cx="97" cy="98" r="6.5" fill="#ff8a6a" opacity="0.22" />
      <circle cx="143" cy="98" r="6.5" fill="#ff8a6a" opacity="0.22" />
      <path d="M112 99 q8 7 16 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.75" />
    </svg>
  );
}

/** Small round head-and-hat badge for feature cards / accents. */
export function MiniMascot({ accent = "orange", size = 56 }: { accent?: AccentName; size?: number }) {
  const uid = useId().replace(/:/g, "");
  const a = ACCENTS[accent];
  const g = (n: string) => `${uid}-${n}`;
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} role="img" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={g("s")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={SKIN.light} /><stop offset="1" stopColor={SKIN.dark} />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill={a.light} opacity="0.35" />
      <circle cx="40" cy="47" r="22" fill={`url(#${g("s")})`} />
      <rect x="24" y="18" width="32" height="20" rx="12" fill={a.base} />
      <ellipse cx="40" cy="35" rx="28" ry="7" fill={a.base} />
      <ellipse cx="40" cy="37" rx="28" ry="4" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="34" cy="48" rx="2.6" ry="3.6" fill={INK} />
      <ellipse cx="46" cy="48" rx="2.6" ry="3.6" fill={INK} />
      <path d="M36 55 q4 4 8 0" stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/** Decorative soft cloud. */
export function Cloud({ width = 160, className, style }: { width?: number; className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 110" width={width} height={(width * 110) / 200} className={className} style={style} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`${uid}-c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e7edfa" />
        </linearGradient>
      </defs>
      <g fill={`url(#${uid}-c)`}>
        <ellipse cx="100" cy="66" rx="80" ry="38" />
        <ellipse cx="52" cy="60" rx="38" ry="28" />
        <ellipse cx="150" cy="58" rx="42" ry="30" />
        <ellipse cx="92" cy="42" rx="46" ry="30" />
      </g>
    </svg>
  );
}
