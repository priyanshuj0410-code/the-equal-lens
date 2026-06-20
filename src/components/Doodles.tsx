type DoodleName =
  | "squiggle"
  | "sparkle"
  | "spiral"
  | "arrow"
  | "heart"
  | "star"
  | "zigzag"
  | "swirl";

export function Doodle({
  name,
  className,
  color = "currentColor",
}: {
  name: DoodleName;
  className?: string;
  color?: string;
}) {
  const common = {
    className,
    "aria-hidden": true as const,
    xmlns: "http://www.w3.org/2000/svg",
  };
  switch (name) {
    case "squiggle":
      return (
        <svg viewBox="0 0 60 24" {...common}>
          <path d="M3 14 Q12 2 21 14 T39 14 T57 14" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 40 40" {...common}>
          <path d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z" fill={color} />
        </svg>
      );
    case "spiral":
      return (
        <svg viewBox="0 0 40 40" {...common}>
          <path d="M20 20 m0 0 a4 4 0 1 1 -6 2 a9 9 0 1 1 14 3 a14 14 0 1 1 -22 -5" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 54 40" {...common}>
          <path d="M4 22 C18 2 32 2 44 16" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M36 9 L46 15 L39 25" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 30 28" {...common}>
          <path d="M15 26 C2 17 4 5 15 11 C26 5 28 17 15 26 Z" fill={color} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 34 34" {...common}>
          <path d="M17 2 L21 13 L33 13 L23 20 L27 32 L17 24 L7 32 L11 20 L1 13 L13 13 Z" fill={color} />
        </svg>
      );
    case "zigzag":
      return (
        <svg viewBox="0 0 56 20" {...common}>
          <path d="M3 10 L13 3 L23 17 L33 3 L43 17 L53 10" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "swirl":
      return (
        <svg viewBox="0 0 50 40" {...common}>
          <path d="M4 20 C4 8 22 8 22 20 C22 30 10 30 12 20 C14 12 26 12 30 22 C33 30 44 28 46 18" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
  }
}
