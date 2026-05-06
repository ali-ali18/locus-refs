'use client';

import { Database02Icon, Github } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Icon } from "../shared/Icon";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "../ui/carousel";
import { LandingContent, LandingWrapper } from "./structure/LandingLayout";

interface StackItem {
  name: string;
  role: string;
  preview: string;
  icon?: ReactNode;
  panelClassName: string;
}

function BetterAuthMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-14 fill-white">
      <path d="M0 3.39v17.22h5.783v-5.55h6.434V8.939H5.783V3.39Zm12.217 5.55h5.638v6.122h-5.638v5.548H24V3.391H12.217Z" />
    </svg>
  );
}

function TypeScriptMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 17.5c.32 .32 .754 .5 1.207 .5h.543c.69 0 1.25 -.56 1.25 -1.25v-.25a1.5 1.5 0 0 0 -1.5 -1.5a1.5 1.5 0 0 1 -1.5 -1.5v-.25c0 -.69 .56 -1.25 1.25 -1.25h.543c.453 0 .887 .18 1.207 .5" />
      <path d="M9 12h4" />
      <path d="M11 12v6" />
      <path d="M21 19v-14a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2z" />
    </svg>
  );
}

function ReactQueryMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-16">
      <path
        fill="#00435b"
        d="m14.7521 14.55545 -0.45075 0.78275c-0.1358 0.235775 -0.387175 0.3811 -0.659275 0.3811H10.188925c-0.2721 0 -0.523475 -0.145325 -0.659275 -0.3811l-0.4508 -0.78275h5.67325Zm1.26195 -2.1912 -0.794825 1.380075h-6.6075l-0.794775 -1.380075h8.1971Zm-0.765625 -2.142725 0.7669 1.33165H7.815675l0.766875 -1.33165h6.665875Zm-1.60635 -2.0256c0.2721 0 0.523475 0.145325 0.659275 0.3811l0.47995 0.833375H9.049675l0.479975 -0.833375c0.1358 -0.235775 0.387175 -0.3811 0.659275 -0.3811h3.45315Z"
      />
      <path
        fill="#002b3b"
        d="M5.163225 7.832825c-0.382525 -1.85485 -0.4646 -3.2775 -0.21735 -4.310525 0.14705 -0.6144 0.4159 -1.115615 0.824725 -1.4772325 0.4316 -0.3817725 0.977275 -0.56911 1.5904 -0.56911 1.0115 0 2.0748 0.46125 3.21115 1.3374925 0.4635 0.357425 0.94455 0.788225 1.444125 1.29265 0.039775 -0.0512 0.084725 -0.099475 0.1348 -0.1441 1.412425 -1.258675 2.60155 -2.04069 3.618625 -2.342215 0.60475 -0.179285 1.17255 -0.1963675 1.6896 -0.0223625 0.545775 0.1836725 0.98065 0.5633475 1.287475 1.0951525 0.50635 0.877675 0.639875 2.03095 0.4511 3.454925 -0.07695 0.580425 -0.2085 1.2127 -0.394375 1.89775 0.070125 0.008475 0.140425 0.024025 0.210025 0.047075 1.79205 0.59385 3.061 1.232475 3.82925 1.962325 0.4571 0.434225 0.755575 0.91765 0.863475 1.452775 0.1139 0.564825 0.00285 1.131375 -0.3036 1.662775 -0.505425 0.8764 -1.434725 1.567625 -2.75865 2.1151 -0.5316 0.219825 -1.133075 0.418925 -1.8051 0.598 0.030675 0.069225 0.05445 0.14275 0.070375 0.2199 0.382525 1.854825 0.4646 3.277475 0.21735 4.310525 -0.14705 0.6144 -0.415925 1.1156 -0.824725 1.477225 -0.4316 0.381775 -0.977275 0.5691 -1.590425 0.5691 -1.011475 0 -2.0748 -0.46125 -3.21115 -1.3375 -0.468425 -0.3612 -0.954775 -0.797375 -1.460075 -1.30875 -0.052 0.081325 -0.115825 0.1569 -0.191325 0.2242 -1.412425 1.25865 -2.60155 2.040675 -3.618625 2.3422 -0.60475 0.179275 -1.17255 0.19635 -1.6896 0.02235 -0.545775 -0.183675 -0.98065 -0.56335 -1.287475 -1.09515 -0.50635 -0.877675 -0.639875 -2.030925 -0.4511 -3.454925 0.079725 -0.6014 0.218075 -1.258475 0.414725 -1.97225 -0.07685 -0.007775 -0.15405 -0.024025 -0.230375 -0.049325 -1.79205 -0.593875 -3.0609975 -1.2325 -3.829255 -1.962325 -0.4570925 -0.434225 -0.75558 -0.91765 -0.86348 -1.452775 -0.11389075 -0.564825 -0.00284 -1.131375 0.30362 -1.662775 0.5054175 -0.8764 1.4347275 -1.567625 2.75864 -2.1151 0.54745 -0.2264 1.168975 -0.430775 1.86535 -0.61395 -0.0248 -0.06075 -0.0444 -0.1246 -0.058125 -0.19115Z"
      />
      <path
        fill="#ff4154"
        d="M17.658925 16.28545c0.1782 -0.031575 0.348925 0.082675 0.388725 0.257925l0.002175 0.010375 0.019 0.098625c0.615925 3.238275 0.18205 4.857425 -1.301675 4.857425 -1.45165 0 -3.2996 -1.3816 -5.543825 -4.14485 -0.0496 -0.06105 -0.07635 -0.137475 -0.075675 -0.216125 0.001625 -0.183225 0.14865 -0.331125 0.330575 -0.3351l0.010525 -0.00005 0.118175 0.000825c0.9444 0.005125 1.862475 -0.0278 2.75425 -0.098775 1.0527 -0.083775 2.15195 -0.2272 3.29775 -0.430275Zm-10.18955 -2.447825 0.005675 0.0096 0.0593 0.1035c0.475225 0.826175 0.97035 1.610325 1.48535 2.35245 0.606525 0.873975 1.288575 1.758725 2.046175 2.65425 0.1172 0.13855 0.1038 0.344175 -0.0284 0.466475l-0.0086 0.0077 -0.07625 0.0656c-2.5066 2.147775 -4.135775 2.576525 -4.887575 1.2863 -0.735875 -1.262925 -0.469075 -3.5593 0.8004 -6.8891 0.0279 -0.073175 0.080325 -0.1344 0.148325 -0.1732 0.15895 -0.090725 0.360475 -0.03835 0.4556 0.116425ZM18.9309 9.05925l0.010275 0.00335 0.09435 0.032575C22.1295 10.17145 23.305 11.35425 22.561975 12.64355c-0.7267 1.26095 -2.839275 2.17905 -6.33775 2.754275 -0.078025 0.012825 -0.158075 -0.0021 -0.226225 -0.042175 -0.160975 -0.094625 -0.214775 -0.30185 -0.120125 -0.46285 0.501075 -0.85235 0.952375 -1.70045 1.353875 -2.544275 0.455375 -0.957025 0.8827 -1.98425 1.282 -3.081675 0.06055 -0.1664 0.238375 -0.256775 0.40685 -0.2106l0.0103 0.003Zm-10.92905 -0.541875c0.160975 0.094625 0.214775 0.30185 0.120125 0.46285 -0.501075 0.85235 -0.952375 1.70045 -1.353875 2.5443 -0.455375 0.957 -0.8827 1.984225 -1.282 3.081675 -0.061775 0.169775 -0.2457 0.2604 -0.41715 0.207575l-0.010275 -0.00335 -0.09435 -0.032575C1.87034 13.701575 0.6948525 12.518775 1.4378675 11.2295c0.7266925 -1.260975 2.8392825 -2.179075 6.3377575 -2.7543 0.078025 -0.012825 0.15805 0.0021 0.226225 0.042175Zm9.93295 -5.30105c0.735875 1.262925 0.469075 3.5593 -0.8004 6.8891 -0.0279 0.073175 -0.080325 0.1344 -0.148325 0.173225 -0.15895 0.0907 -0.360475 0.038325 -0.4556 -0.11645l-0.005675 -0.0096 -0.0593 -0.1035c-0.475225 -0.826175 -0.97035 -1.610325 -1.48535 -2.35245 -0.606525 -0.87395 -1.288575 -1.758725 -2.046175 -2.65425 -0.1172 -0.13855 -0.103825 -0.344175 0.0284 -0.466475l0.0086 -0.0077 0.076225 -0.0656C15.5538 2.3548625 17.183 1.9261 17.9348 3.216325ZM7.359475 2.447755c1.451675 0 3.299625 1.38162 5.54385 4.144845 0.0496 0.06105 0.07635 0.137475 0.075675 0.216125 -0.001625 0.183225 -0.14865 0.331125 -0.330575 0.3351l-0.010525 0.000075 -0.118175 -0.00085c-0.9444 -0.005125 -1.862475 0.0278 -2.75425 0.098775 -1.0527 0.0838 -2.15195 0.227225 -3.29775 0.430275 -0.1782 0.031575 -0.34895 -0.08265 -0.388725 -0.2579l-0.002175 -0.0104 -0.019 -0.098625c-0.61595 -3.238275 -0.18205 -4.85742 1.30165 -4.85742Z"
      />
      <path
        fill="#ffd94c"
        d="M10.4664 8.2384h2.898575c0.4239 0 0.815425 0.226725 1.026425 0.594375l1.4554 2.535975c0.209375 0.364825 0.209375 0.81335 0 1.17815l-1.4554 2.535975c-0.211 0.36765 -0.602525 0.594375 -1.026425 0.594375H10.4664c-0.4239 0 -0.815425 -0.226725 -1.026425 -0.594375l-1.455425 -2.535975c-0.20935 -0.3648 -0.20935 -0.813325 0 -1.17815l1.455425 -2.535975c0.211 -0.36765 0.602525 -0.594375 1.026425 -0.594375Z"
      />
    </svg>
  );
}

function NextJsMark() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="size-21">
      <defs>
        <linearGradient
          id="nextjs-wordmark"
          x1="60.5555"
          y1="64.7213"
          x2="80.2778"
          y2="89.1656"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="nextjs-stem"
          x1="67.2225"
          y1="29.999"
          x2="67.1109"
          y2="59.3741"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M83.06 87.5104L38.4122 29.999H30V69.9824H36.7298V38.5454L77.7773 91.5797C79.6294 90.3399 81.394 88.9798 83.06 87.5104Z"
        fill="url(#nextjs-wordmark)"
      />
      <path
        d="M70.5558 29.999H63.8892V69.999H70.5558V29.999Z"
        fill="url(#nextjs-stem)"
      />
    </svg>
  );
}

function NoiseOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full opacity-45"
      style={{ mixBlendMode: "overlay" }}
      preserveAspectRatio="none"
    >
      <filter id="noise">
        <title>Noise overlay</title>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="4"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

const stackItems: StackItem[] = [
  {
    name: "Next.js",
    role: "App Router e rendering",
    preview: "N",
    icon: <NextJsMark />,
    panelClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_45%),linear-gradient(180deg,rgba(48,48,48,0.95),rgba(10,10,10,1))]",
  },
  {
    name: "PostgreSQL",
    role: "Persistencia relacional",
    preview: "DB",
    icon: <Icon icon={Database02Icon} className="size-16 text-white" />,
    panelClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,220,150,0.28),transparent_42%),linear-gradient(180deg,rgba(255,168,55,0.95),rgba(202,84,14,1))]",
  },
  {
    name: "TypeScript",
    role: "Contratos e manutencao",
    preview: "TS",
    icon: <TypeScriptMark />,
    panelClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_40%),linear-gradient(135deg,rgba(49,120,198,0.98),rgba(23,47,108,0.98))]",
  },
  {
    name: "React Query",
    role: "Cache e sincronizacao",
    preview: "RQ",
    icon: <ReactQueryMark />,
    panelClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_42%),linear-gradient(135deg,rgba(255,92,146,0.98),rgba(43,14,28,0.98))]",
  },
  {
    name: "Better Auth",
    role: "Sessao e controle de acesso",
    preview: "Key",
    icon: <BetterAuthMark />,
    panelClassName:
      "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_45%),linear-gradient(180deg,rgba(40,40,40,0.95),rgba(8,8,8,1))]",
  },
];

export function StackContainer() {
  return (
    <LandingWrapper containerClassName="border-b">
      <StackContent />
    </LandingWrapper>
  );
}

function StackContent() {
  return (
    <LandingContent as="section" className="min-w-0">
      <div className="-ml-3 sm:-ml-3.5 -mr-3 border-b px-5 py-8 ">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h3 className="max-w-lg text-xl font-semibold tracking-tight text-balance">
                Base moderna para manter o produto rapido de evoluir.
              </h3>
              <Button size="lg" className="w-full sm:w-fit">
                Ver repositorio
                <Icon icon={Github} data-icon="inline-end" />
              </Button>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            A implementacao combina Next.js, TypeScript, PostgreSQL, Better Auth
            e outras pecas que fazem sentido para uma plataforma de referencias
            colaborativas. O objetivo aqui nao e empilhar modismo, e sim manter
            uma base clara para operar, testar e continuar expandindo.
          </p>
        </div>
      </div>

      <div className="-ml-3 sm:-ml-3.5 -mr-3  bg-stripes px-5 py-6 ">
        <Carousel opts={{ align: "start" }} className="mx-auto w-full">
          <CarouselMaskWrapper>
            <CarouselContent className="-ml-3 md:-ml-4 min-w-0">
              {stackItems.map((item) => (
                <CarouselItem
                  key={item.name}
                  className="basis-[248px] pl-3 md:pl-4"
                >
                  <article className="flex flex-col gap-1.5 rounded-2xl border-x border-t bg-background px-0.5">
                    <div className="flex items-center justify-center px-2">
                      <h4 className="text-center text-lg font-semibold tracking-tight text-foreground mt-1">
                        {item.name}
                      </h4>
                    </div>

                    <div
                      className={cn(
                        "relative flex aspect-[0.92] items-center justify-center rounded-xl border border-white/10 text-center text-xl font-semibold tracking-tight text-white overflow-hidden",
                        item.panelClassName,
                      )}
                    >
                      <NoiseOverlay />
                      {item.icon ?? (
                        <span className="relative text-5xl font-semibold text-white/18">
                          {item.preview}
                        </span>
                      )}
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </CarouselMaskWrapper>
          <CarouselPrevious
            size={"icon-sm"}
            className="left-2 top-[calc(58%-8px)] z-10 md:-left-2 border-none bg-accent-foreground/70 text-white hover:bg-accent-foreground/80 hover:text-white"
          />
          <CarouselNext
            size={"icon-sm"}
            className="right-2 top-[calc(58%-8px)] z-10 md:-right-2 border-none bg-accent-foreground/70 text-white hover:bg-accent-foreground/80 hover:text-white"
          />
        </Carousel>
      </div>
    </LandingContent>
  );
}

function CarouselMaskWrapper({ children }: { children: ReactNode }) {
  const { canScrollPrev, canScrollNext } = useCarousel();

  let maskClass =
    "[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]";

  if (!canScrollPrev && !canScrollNext) {
    maskClass = "[mask-image:none]";
  } else if (!canScrollPrev) {
    maskClass =
      "[mask-image:linear-gradient(to_right,black_0px,black_calc(100%-48px),transparent)]";
  } else if (!canScrollNext) {
    maskClass =
      "[mask-image:linear-gradient(to_right,transparent,black_48px,black_100%)]";
  }

  return (
    <div
      className={cn(
        "w-full transition-[mask-image] duration-300 md:mask-none",
        maskClass,
      )}
    >
      {children}
    </div>
  );
}
