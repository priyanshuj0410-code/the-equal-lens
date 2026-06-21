/* The Equal Lens — React components (the atoms & molecules).

   These are stateless / presentational: they apply the brand classes from
   components.css and forward props. They use no hooks, so they're safe in
   React Server Components — make the *parent* a client component when you
   pass interactive handlers (onClick, onChange, …).

   Styling comes from the bundled CSS — import it once in your app:
       import "@equal-lens/brand/styles.css";
*/
import * as React from "react";
import { cn } from "./cn";
import {
  buttonClass,
  cardClass,
  navLinkClass,
  noteClass,
  segmentedOptionClass,
  tabClass,
  toolbarButtonClass,
  type ButtonVariant,
  type NoteTone,
} from "./classes";

/* ───────────────────────────  ATOMS  ─────────────────────────── */

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: "sm";
};

/** Pill button. Pass `href` to render an <a> instead of a <button>. */
export type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

export function Button({ variant, size, className, ...rest }: ButtonProps) {
  const cls = cn(buttonClass({ variant, size }), className);
  if (rest.href !== undefined) {
    return <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }
  return <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
}

/** Shadowed pill label that sits above headings. */
export function Tag({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("tag", className)} {...rest} />;
}

/** Uppercase mini section-label (no box). */
export function Eyebrow({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("eyebrow", className)} {...rest} />;
}

/** The signature sticker cut-out card. `soft` = violet-shadow variant. */
export function Card({
  soft,
  className,
  ...rest
}: { soft?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(cardClass(soft), className)} {...rest} />;
}

/** Pastel sticky note. */
export function Note({
  tone = "yellow",
  className,
  ...rest
}: { tone?: NoteTone } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(noteClass(tone), className)} {...rest} />;
}

/** The status chip on a note ("myth" / "truth ✓"). */
export function NoteChip({
  truth,
  className,
  ...rest
}: { truth?: boolean } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("note__chip", truth && "note__chip--truth", className)} {...rest} />
  );
}

/* ─────────────────────────  MOLECULES  ───────────────────────── */

export type SegmentedOption<T extends string = string> = { value: T; label: React.ReactNode };

/** Controlled segmented toggle (e.g. Kids / Adult). */
export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  className,
  optionClassName,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  optionClassName?: string;
}) {
  return (
    <div className={cn("segmented", className)} role="group">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            className={cn(segmentedOptionClass(active), optionClassName)}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Header nav pill. Renders an <a>; for a router link, use `navLinkClass()`. */
export function NavLink({
  active,
  className,
  ...rest
}: { active?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(navLinkClass(active), className)}
      aria-current={active ? "page" : undefined}
      {...rest}
    />
  );
}

export type TabItem<T extends string = string> = {
  key: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

/** Controlled pill-tab row that drives a panel. */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("tabs", className)} role="tablist">
      {items.map((it) => {
        const active = it.key === value;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={tabClass(active)}
            onClick={() => onChange(it.key)}
          >
            {it.icon ? <span className="tab__icon">{it.icon}</span> : null}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Toolbar ──────────────────────────────────────────────────── */

/** The floating bottom tool pill. `dock` pins it bottom-centre (fixed). */
export function Toolbar({
  dock,
  className,
  ...rest
}: { dock?: boolean } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("toolbar", dock && "toolbar--dock", className)} {...rest} />;
}

export function ToolbarButton({
  active,
  className,
  ...rest
}: { active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(toolbarButtonClass(active), className)}
      {...rest}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("toolbar__sep", className)} aria-hidden {...rest} />;
}

/** Lensy's round ship dock. Pass a ship SVG via `src`, or custom `children`. */
export function ShipDock({
  src,
  alt = "",
  className,
  children,
  ...rest
}: {
  src?: string;
  alt?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn("ship-bubble", className)} {...rest}>
      {children ?? (src ? <img src={src} alt={alt} /> : null)}
    </button>
  );
}

/* ── Popover + speech bubble ──────────────────────────────────── */

export function Popover({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("popover", className)} {...rest} />;
}

export function Bubble({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bubble", className)} {...rest} />;
}
