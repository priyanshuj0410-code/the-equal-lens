type MascotProps = {
  type: "un" | "re";
  className?: string;
  title?: string;
};

export default function Mascot({ type, className, title }: MascotProps) {
  const src = type === "un" ? "/un.svg" : "/re.svg";
  const alt =
    title || (type === "un" ? "UN, the unlearn eraser" : "RE, the relearn pencil");
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />;
}
