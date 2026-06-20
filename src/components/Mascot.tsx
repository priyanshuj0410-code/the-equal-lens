type MascotProps = {
  type: "un" | "re";
  className?: string;
  title?: string;
};

export default function Mascot({ type, className, title }: MascotProps) {
  if (type === "un") {
    return (
      <svg
        viewBox="0 0 120 150"
        className={className}
        role="img"
        aria-label={title || "UN, the unlearn eraser mascot"}
      >
        <defs>
          <linearGradient id="g-un-body" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#8467C9" />
            <stop offset="0.55" stopColor="#5C3690" />
            <stop offset="1" stopColor="#3E2468" />
          </linearGradient>
          <linearGradient id="g-un-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EDE6FB" />
            <stop offset="1" stopColor="#C3AEE8" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="140" rx="38" ry="7" fill="#221436" opacity="0.12" />
        {/* arm */}
        <path d="M24 96 Q7 92 10 74" fill="none" stroke="#4A2C7A" strokeWidth="9" strokeLinecap="round" />
        <circle cx="10" cy="73" r="6" fill="#5C3690" stroke="#221436" strokeWidth="2.5" />
        {/* body */}
        <rect x="22" y="46" width="76" height="80" rx="16" fill="url(#g-un-body)" stroke="#221436" strokeWidth="3" />
        {/* eraser top band */}
        <path d="M22 72 L22 62 Q22 46 38 46 L82 46 Q98 46 98 62 L98 72 Z" fill="url(#g-un-top)" stroke="#221436" strokeWidth="3" />
        {/* gloss */}
        <ellipse cx="44" cy="92" rx="12" ry="20" fill="#ffffff" opacity="0.14" />
        {/* legs */}
        <path d="M44 124 L44 138 M76 124 L76 138" stroke="#221436" strokeWidth="6" strokeLinecap="round" />
        {/* face */}
        <ellipse cx="49" cy="94" rx="6.5" ry="7.5" fill="#fff" />
        <ellipse cx="71" cy="94" rx="6.5" ry="7.5" fill="#fff" />
        <circle cx="50" cy="96" r="3.2" fill="#221436" />
        <circle cx="72" cy="96" r="3.2" fill="#221436" />
        <circle cx="48.5" cy="94.5" r="1.2" fill="#fff" />
        <circle cx="70.5" cy="94.5" r="1.2" fill="#fff" />
        <circle cx="38" cy="103" r="6" fill="#FF7A5C" opacity="0.55" />
        <circle cx="82" cy="103" r="6" fill="#FF7A5C" opacity="0.55" />
        <path d="M52 106 Q60 114 68 106" fill="none" stroke="#221436" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      role="img"
      aria-label={title || "RE, the relearn pencil mascot"}
    >
      <defs>
        <linearGradient id="g-re-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C5BC4" />
          <stop offset="0.5" stopColor="#5C3690" />
          <stop offset="1" stopColor="#3E2468" />
        </linearGradient>
        <linearGradient id="g-re-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F4DDAE" />
          <stop offset="1" stopColor="#D6AC66" />
        </linearGradient>
        <linearGradient id="g-re-eraser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF9C82" />
          <stop offset="1" stopColor="#F26A4B" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="150" rx="26" ry="6" fill="#221436" opacity="0.12" />
      {/* arm */}
      <path d="M82 78 Q100 74 99 58" fill="none" stroke="#4A2C7A" strokeWidth="8" strokeLinecap="round" />
      <circle cx="99" cy="57" r="5.5" fill="#5C3690" stroke="#221436" strokeWidth="2.5" />
      {/* eraser top */}
      <rect x="44" y="18" width="32" height="14" rx="7" fill="url(#g-re-eraser)" stroke="#221436" strokeWidth="2.5" />
      {/* ferrule */}
      <rect x="44" y="31" width="32" height="8" fill="#C7BBE2" stroke="#221436" strokeWidth="2.5" />
      {/* body */}
      <rect x="42" y="39" width="36" height="74" rx="5" fill="url(#g-re-body)" stroke="#221436" strokeWidth="3" />
      <rect x="48" y="44" width="5" height="64" rx="2.5" fill="#ffffff" opacity="0.18" />
      {/* wood tip */}
      <path d="M42 113 L78 113 L60 143 Z" fill="url(#g-re-wood)" stroke="#221436" strokeWidth="3" strokeLinejoin="round" />
      <path d="M53 128 L67 128 L60 143 Z" fill="#2E1B4A" />
      {/* legs */}
      <path d="M52 113 L52 124 M68 113 L68 124" stroke="#221436" strokeWidth="5.5" strokeLinecap="round" />
      {/* face */}
      <ellipse cx="52" cy="66" rx="5.5" ry="6.5" fill="#fff" />
      <ellipse cx="68" cy="66" rx="5.5" ry="6.5" fill="#fff" />
      <circle cx="53" cy="68" r="2.8" fill="#221436" />
      <circle cx="69" cy="68" r="2.8" fill="#221436" />
      <circle cx="51.5" cy="66.5" r="1" fill="#fff" />
      <circle cx="67.5" cy="66.5" r="1" fill="#fff" />
      <circle cx="44" cy="74" r="5" fill="#FF7A5C" opacity="0.5" />
      <circle cx="76" cy="74" r="5" fill="#FF7A5C" opacity="0.5" />
      <path d="M54 77 Q60 83 66 77" fill="none" stroke="#221436" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
