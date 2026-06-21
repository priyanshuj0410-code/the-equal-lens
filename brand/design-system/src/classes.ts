/* Class-name helpers — for when you want the brand styles on your *own*
   element (e.g. a Next.js <Link>, a framework Router link) instead of the
   wrapper components. They return the same classes components.css defines. */
import { cn } from "./cn";

export type ButtonVariant = "primary" | "sun" | "outline" | "ghost";

export const buttonClass = (
  opts: { variant?: ButtonVariant; size?: "sm" } = {},
): string =>
  cn("btn", `btn--${opts.variant ?? "primary"}`, opts.size === "sm" && "btn--sm");

export const tagClass = "tag";
export const eyebrowClass = "eyebrow";

export const cardClass = (soft = false): string => cn("card", soft && "card--soft");

export type NoteTone = "yellow" | "mint" | "peach" | "violet";
export const noteClass = (tone: NoteTone = "yellow"): string =>
  cn("note", `note--${tone}`);

export const navLinkClass = (active = false): string =>
  cn("nav-link", active && "is-active");

export const tabClass = (active = false): string => cn("tab", active && "is-active");

export const segmentedOptionClass = (active = false): string =>
  cn("segmented__option", active && "is-active");

export const toolbarButtonClass = (active = false): string =>
  cn("toolbar__btn", active && "is-active");
