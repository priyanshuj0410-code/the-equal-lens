"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  id?: string;
};

// A dropdown in the site's design language (rounded, mist border, brand focus,
// branded option list) rather than the native OS select. Keyboard: Enter/Space
// toggles, Escape closes, Arrow keys move the highlight, Enter picks it.
export default function BrandSelect({ options, value, onChange, placeholder = "Select…", invalid, id }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(Math.max(0, options.indexOf(value)));
        return;
      }
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + options.length) % options.length;
      });
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) pick(options[active]);
      else {
        setOpen(true);
        setActive(Math.max(0, options.indexOf(value)));
      }
    }
  }

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        id={id}
        role="combobox"
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-activedescendant={open ? `${listId}-opt-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => {
          setOpen((o) => !o);
          setActive(Math.max(0, options.indexOf(value)));
        }}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between rounded-lg border bg-surface px-3 py-2 text-left focus:border-violet-400 focus:outline-none ${
          invalid ? "border-error" : "border-mist"
        } ${value ? "text-ink" : "text-ink/70"}`}
      >
        <span>{value || placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-mist bg-surface py-1 shadow-lg"
        >
          {options.map((o, i) => {
            const selected = o === value;
            return (
              <li
                key={o}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  selected ? "font-bold text-brand" : "text-ink"
                } ${i === active ? "bg-mist" : ""}`}
              >
                {o}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
