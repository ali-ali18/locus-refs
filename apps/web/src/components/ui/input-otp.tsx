"use client";

import { cn } from "@/lib/utils";
import {
  createContext,
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// Inspired by shadcn/ui input-otp (https://ui.shadcn.com/docs/components/base/input-otp).
// Adapted to plain <input> primitives (this project uses Base UI, not Radix).

type OTPSlot = {
  char: string;
  isActive: boolean;
  hasFakeCaret: boolean;
};

type OTPContextValue = {
  slots: OTPSlot[];
  maxLength: number;
  value: string;
  setValue: (next: string) => void;
  setActiveIndex: (index: number) => void;
  focusIndex: (index: number) => void;
  refs: RefObject<(HTMLInputElement | null)[]>;
};

const OTPContext = createContext<OTPContextValue | null>(null);

function useOTPContext(component: string) {
  const ctx = useContext(OTPContext);
  if (!ctx) throw new Error(`${component} must be used inside <InputOTP />`);
  return ctx;
}

function sanitize(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

type InputOTPProps = Omit<
  InputHTMLAttributes<HTMLDivElement>,
  "value" | "onChange"
> & {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  containerClassName?: string;
};

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(
  function InputOTP(
    {
      className,
      containerClassName,
      value = "",
      onChange,
      maxLength = 6,
      ...props
    },
    ref,
  ) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const setValue = useCallback(
      (next: string) => onChange?.(sanitize(next, maxLength)),
      [maxLength, onChange],
    );

    const focusIndex = useCallback((index: number) => {
      const el = refs.current[index];
      if (!el) return;
      el.focus();
      // select() makes re-typing a digit overwrite instead of inserting
      el.select?.();
    }, []);

    const slots = useMemo<OTPSlot[]>(() => {
      return Array.from({ length: maxLength }, (_, i) => {
        const char = value[i] ?? "";
        const isActive = i === activeIndex;
        return { char, isActive, hasFakeCaret: isActive && char === "" };
      });
    }, [activeIndex, maxLength, value]);

    const ctx = useMemo<OTPContextValue>(
      () => ({
        slots,
        maxLength,
        value,
        setValue,
        setActiveIndex,
        focusIndex,
        refs,
      }),
      [slots, maxLength, value, setValue, focusIndex],
    );

    return (
      <OTPContext.Provider value={ctx}>
        <div
          ref={ref}
          data-slot="input-otp"
          className={cn(
            "flex items-center gap-2 has-disabled:opacity-50",
            containerClassName,
            className,
          )}
          {...props}
        />
      </OTPContext.Provider>
    );
  },
);

type InputOTPGroupProps = React.ComponentProps<"div">;

export const InputOTPGroup = forwardRef<HTMLDivElement, InputOTPGroupProps>(
  function InputOTPGroup({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="input-otp-group"
        className={cn("flex items-center", className)}
        {...props}
      />
    );
  },
);

type InputOTPSlotProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "ref"
> & {
  index: number;
};

export const InputOTPSlot = forwardRef<HTMLInputElement, InputOTPSlotProps>(
  function InputOTPSlot({ index, className, ...props }, _forwardedRef) {
    const { slots, setActiveIndex, setValue, focusIndex, refs } =
      useOTPContext("InputOTPSlot");
    const slot = slots[index];
    if (!slot) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digit = raw.replace(/\D/g, "").slice(-1);
      const arr = slots.map((s) => s.char);
      if (digit) {
        arr[index] = digit;
        setValue(arr.join(""));
        const nextIndex = Math.min(index + 1, slots.length - 1);
        setActiveIndex(nextIndex);
        focusIndex(nextIndex);
      } else {
        arr[index] = "";
        setValue(arr.join(""));
        focusIndex(index);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !slot.char) {
        const prev = Math.max(0, index - 1);
        setActiveIndex(prev);
        focusIndex(prev);
      } else if (e.key === "ArrowLeft") {
        const prev = Math.max(0, index - 1);
        setActiveIndex(prev);
        focusIndex(prev);
      } else if (e.key === "ArrowRight") {
        const next = Math.min(slots.length - 1, index + 1);
        setActiveIndex(next);
        focusIndex(next);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      const digits = text.replace(/\D/g, "");
      if (!digits) return;
      e.preventDefault();
      const arr = slots.map((s) => s.char);
      for (let i = 0; i < digits.length && index + i < slots.length; i++) {
        arr[index + i] = digits[i]!;
      }
      setValue(arr.join(""));
      const lastWritten = Math.min(index + digits.length, slots.length - 1);
      setActiveIndex(lastWritten);
      focusIndex(lastWritten);
    };

    return (
      <div
        data-slot="input-otp-slot"
        data-active={slot.isActive}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all outline-none",
          "first:rounded-l-md first:border-l last:rounded-r-md",
          "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
      >
        <input
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={slot.char}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          className="absolute inset-0 h-full w-full bg-transparent text-center text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        {slot.hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px bg-foreground animate-caret-blink duration-1000" />
          </div>
        )}
      </div>
    );
  },
);

type InputOTPSeparatorProps = React.ComponentProps<"div">;

export const InputOTPSeparator = forwardRef<
  HTMLDivElement,
  InputOTPSeparatorProps
>(function InputOTPSeparator({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="input-otp-separator"
      role="separator"
      className={cn("mx-1 h-4 w-px bg-border", className)}
      {...props}
    />
  );
});