import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="shirink 0 w-4 sm:w-6 md:w-12 bg-background top-0 z-[-1] left-0" />
      <div className="shirink 0 w-4 sm:w-6 md:w-12 bg-background top-0 z-[-1] right-0" />
      <div className="relative overflow-clip">
        <div className="relative transition-[transform,border-radius] duration-400ms ease-[cubic-bezier(0.32,0.72,0,1)] origin-[center_top] will-change-transform data-[active]:[transform:scale(0.98)_translateY(0.25rem)] data-[active]:[border-top-left-radius:0.5rem] data-[active]:[border-top-right-radius:0.5rem]">
          <div className="relative flex min-h-screen w-screen flex-none flex-col justify-start overflow-x-clip">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export const baseClassContent =
  "w-full max-w-5xl flex-7 pl-3 lg:pl-3.5 pr-3 relative isolate items-center justify-center [--node-horizontal-offset:-3.5px]";
