"use client";

import { ArrowDown01Icon, Check } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState, forwardRef } from "react";
import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export function SelectLanguage({
  options,
  value,
  onChange,
}: {
  options: Option[];
  value?: string | null;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(value ?? null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === selected);
      setFocusedIndex(idx >= 0 ? idx : 0);
    } else {
      setFocusedIndex(-1);
    }
  }, [open, options, selected]);

  useEffect(() => {
    if (!open) return;
    const item = containerRef.current?.querySelector<HTMLElement>(
      "[data-focused='true']"
    );
    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next].disabled) next++;
          return next < options.length ? next : prev;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) next--;
          return next >= 0 ? next : prev;
        });
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        const opt = options[focusedIndex];
        if (opt && !opt.disabled) {
          setSelected(opt.value);
          setOpen(false);
          triggerRef.current?.focus();
          onChange?.(opt.value);
        }
        break;
      }
      case "Escape":
      case "Tab":
        setOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  const handleSelect = (opt: Option) => {
    setSelected(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
    onChange?.(opt.value);
  };

  return (
    <div ref={containerRef} className="relative w-52">
      <SelectTrigger
        ref={triggerRef}
        open={open}
        selectedLabel={selectedLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
      />

      {open && (
        <SelectContent onKeyDown={handleKeyDown}>
          {options.map((opt, i) => (
            <SelectItem
              key={opt.value}
              option={opt}
              isSelected={selected === opt.value}
              isFocused={focusedIndex === i}
              onMouseEnter={() => !opt.disabled && setFocusedIndex(i)}
              onClick={() => handleSelect(opt)}
            />
          ))}
        </SelectContent>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Sub-components                               */
/* -------------------------------------------------------------------------- */

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  {
    open: boolean;
    selectedLabel?: string;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  }
>(({ open, selectedLabel, onClick, onKeyDown }, ref) => (
  <button
    ref={ref}
    type="button"
    role="combobox"
    aria-expanded={open}
    aria-haspopup="listbox"
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={cn(
      "flex h-9 w-full items-center font-semibold justify-between rounded-xl px-3 py-2 text-sm bg-popover",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      open && "ring-1 ring-ring"
    )}
  >
    <span className={cn(!selectedLabel && "text-muted-foreground")}>
      {selectedLabel ?? "Selecione..."}
    </span>
    <Icon icon={ArrowDown01Icon} />
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

function SelectContent({
  children,
  onKeyDown,
}: {
  children: React.ReactNode;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div
      role="listbox"
      onKeyDown={onKeyDown}
      className="absolute top-full max-h-40 overflow-y-auto z-50 mt-1 w-full overflow-hidden rounded-xl border bg-popover border-border text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

function SelectItem({
  option,
  isSelected,
  isFocused,
  onMouseEnter,
  onClick,
}: {
  option: Option;
  isSelected: boolean;
  isFocused: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      data-focused={isFocused}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={cn(
        "relative rounded-xl flex cursor-default w-full select-none items-center py-1.5 pl-2 pr-8 text-sm outline-none transition-colors",
        isFocused && !option.disabled && "bg-accent text-accent-foreground",
        isSelected && "font-medium",
        option.disabled && "pointer-events-none opacity-50"
      )}
    >
      {isSelected && (
        <span className="absolute right-2">
          <Icon icon={Check} />
        </span>
      )}
      {option.label}
    </button>
  );
}
