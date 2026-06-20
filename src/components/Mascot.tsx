type MascotProps = {
  type: "un" | "re";
  className?: string;
  title?: string;
};

const label = {
  fontFamily: "var(--font-baloo), system-ui, sans-serif",
  fontWeight: 800,
} as const;

export default function Mascot({ type, className, title }: MascotProps) {
  if (type === "un") {
    return (
      <svg
        viewBox="0 0 120 150"
        className={className}
        role="img"
        aria-label={title || "UN, the unlearn eraser"}
      >
        <ellipse cx="60" cy="142" rx="29" ry="5" fill="#221436" opacity="0.1" />
        {/* legs */}
        <path d="M51 104 L49 126" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
        <path d="M69 104 L71 126" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="47" cy="129" rx="8" ry="5" fill="#553286" />
        <ellipse cx="73" cy="129" rx="8" ry="5" fill="#553286" />
        {/* arms */}
        <path d="M34 84 L18 95" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
        <circle cx="16" cy="97" r="6" fill="#553286" />
        <path d="M86 80 L102 63" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
        <circle cx="104" cy="61" r="6" fill="#553286" />
        {/* body */}
        <rect x="32" y="44" width="56" height="64" rx="14" fill="#553286" />
        {/* white eraser top */}
        <path d="M32 64 L32 58 Q32 44 46 44 L74 44 Q88 44 88 58 L88 64 Z" fill="#FCFBFF" />
        {/* face */}
        <ellipse cx="50" cy="80" rx="4" ry="5.5" fill="#2E1B4A" />
        <ellipse cx="70" cy="80" rx="4" ry="5.5" fill="#2E1B4A" />
        <circle cx="48.7" cy="78" r="1.3" fill="#fff" />
        <circle cx="68.7" cy="78" r="1.3" fill="#fff" />
        <ellipse cx="42" cy="88" rx="5" ry="3" fill="#FF9D8A" />
        <ellipse cx="78" cy="88" rx="5" ry="3" fill="#FF9D8A" />
        <path d="M54 89 Q60 94 66 89" fill="none" stroke="#2E1B4A" strokeWidth="2.4" strokeLinecap="round" />
        <text x="60" y="103" textAnchor="middle" fill="#fff" style={label} fontSize="16">UN</text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      role="img"
      aria-label={title || "RE, the relearn pencil"}
    >
      <ellipse cx="60" cy="150" rx="26" ry="5" fill="#221436" opacity="0.1" />
      {/* legs */}
      <path d="M53 116 L51 136" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
      <path d="M67 116 L69 136" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="49" cy="139" rx="8" ry="5" fill="#553286" />
      <ellipse cx="71" cy="139" rx="8" ry="5" fill="#553286" />
      {/* left arm */}
      <path d="M44 92 L30 104" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
      <circle cx="28" cy="106" r="6" fill="#553286" />
      {/* right arm holding a tiny pencil */}
      <path d="M76 88 L92 76" stroke="#553286" strokeWidth="8" strokeLinecap="round" />
      <g transform="rotate(-32 94 74)">
        <rect x="90" y="58" width="8" height="20" rx="2" fill="#FFC94D" stroke="#2E1B4A" strokeWidth="1.4" />
        <path d="M90 58 L98 58 L94 51 Z" fill="#E8C58A" stroke="#2E1B4A" strokeWidth="1.4" strokeLinejoin="round" />
      </g>
      <circle cx="94" cy="74" r="6" fill="#553286" />
      {/* body */}
      <rect x="42" y="40" width="36" height="78" rx="7" fill="#553286" />
      {/* sharpened wood tip on top */}
      <path d="M42 40 L78 40 L60 12 Z" fill="#E8C58A" stroke="#2E1B4A" strokeWidth="2" strokeLinejoin="round" />
      <path d="M53 24 L67 24 L60 12 Z" fill="#2E1B4A" />
      {/* face */}
      <ellipse cx="52" cy="60" rx="3.7" ry="5" fill="#2E1B4A" />
      <ellipse cx="68" cy="60" rx="3.7" ry="5" fill="#2E1B4A" />
      <circle cx="50.8" cy="58.3" r="1.2" fill="#fff" />
      <circle cx="66.8" cy="58.3" r="1.2" fill="#fff" />
      <ellipse cx="46" cy="68" rx="4.5" ry="2.8" fill="#FF9D8A" />
      <ellipse cx="74" cy="68" rx="4.5" ry="2.8" fill="#FF9D8A" />
      <path d="M54 69 Q60 74 66 69" fill="none" stroke="#2E1B4A" strokeWidth="2.2" strokeLinecap="round" />
      <text x="60" y="100" textAnchor="middle" fill="#fff" style={label} fontSize="16">RE</text>
    </svg>
  );
}
