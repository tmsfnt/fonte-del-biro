"use client";

import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const FRAME_COUNT = 96;
const framePath = (i: number): string => `/frames/frame_${String(i).padStart(3, "0")}.jpg`;

const TITLE = "Sapore di Toscana\noriginato alla fonte del Biro";
const TITLE_RANGE: [number, number] = [0.04, 0.78];
const LOGO_RANGE: [number, number] = [0.72, 0.9];

/* ------------------------------------------------------------------ */
/*  Letter — ogni lettera è un componente: gli hook stanno al top level */
/* ------------------------------------------------------------------ */

type LetterProps = {
  char: string;
  charStart: number;
  charPeak: number;
  fadeOutStart: number;
  fadeOutEnd: number;
  progress: MotionValue<number>;
  className?: string;
};

function Letter({ char, charStart, charPeak, fadeOutStart, fadeOutEnd, progress, className }: LetterProps): JSX.Element {
  const opacity = useTransform(progress, [charStart, charPeak, fadeOutStart, fadeOutEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [charStart, charPeak], [18, 0]);
  const blur = useTransform(progress, [charStart, charPeak], ["blur(6px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, y, filter: blur, display: "inline-block" }} className={className}>
      {char === " " ? " " : char}
    </motion.span>
  );
}

function buildLineClassMap(line: string, wordColors?: Record<string, string>): (string | undefined)[] {
  const map: (string | undefined)[] = new Array(line.length).fill(undefined);
  if (!wordColors) return map;
  for (const [word, cls] of Object.entries(wordColors)) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      for (let i = m.index; i < m.index + m[0].length; i++) map[i] = cls;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return map;
}

function LetterByLetter({
  text,
  range,
  progress,
  wordColors,
  lineClasses,
}: {
  text: string;
  range: [number, number];
  progress: MotionValue<number>;
  wordColors?: Record<string, string>;
  lineClasses?: string[];
}): JSX.Element {
  const [start, end] = range;
  const lines = text.split("\n");
  const totalChars = text.replace(/\n/g, "").length;
  const span = end - start;
  const revealRange = span * 0.7;
  const charSpacing = revealRange / totalChars;
  const fadeOutStart = end - span * 0.06;
  const fadeOutEnd = end;

  let charIdx = 0;
  return (
    <>
      {lines.map((line, lineIdx) => {
        const classMap = buildLineClassMap(line, wordColors);
        return (
          <span key={lineIdx} className={["block", lineClasses?.[lineIdx] ?? ""].join(" ")}>
            {line.split(" ").map((word, wIdx) => {
              const chars = wIdx < line.split(" ").length - 1 ? `${word} ` : word;
              return (
                <span key={`${lineIdx}-w${wIdx}`} className="inline-block whitespace-nowrap">
                  {Array.from(chars).map((char, i) => {
                    const cIdx = charIdx++;
                    const cStart = start + cIdx * charSpacing;
                    const cPeak = Math.min(cStart + charSpacing * 2.5, fadeOutStart);
                    const lineOffset = line.split(" ").slice(0, wIdx).join(" ").length + (wIdx > 0 ? 1 : 0);
                    return (
                      <Letter
                        key={`${lineIdx}-${wIdx}-${i}`}
                        char={char}
                        charStart={cStart}
                        charPeak={cPeak}
                        fadeOutStart={fadeOutStart}
                        fadeOutEnd={fadeOutEnd}
                        progress={progress}
                        className={classMap[lineOffset + i]}
                      />
                    );
                  })}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function Hero(): JSX.Element {
  const { t } = useLang();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.4 });

  /* 1. Preload TUTTI i frame prima di agganciare lo scroll */
  useEffect(() => {
    let count = 0;
    let cancelled = false;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      const done = (): void => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count === FRAME_COUNT) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  /* 2. Disegno con cover-scaling + HiDPI */
  const drawFrame = (index: number): void => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih); // COVER
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastFrameRef.current = index;
  };

  /* 3. Scroll → frame, solo quando tutto è pronto */
  useEffect(() => {
    if (!ready) return;
    drawFrame(Math.floor(progress.get() * (FRAME_COUNT - 1)));

    const unsubscribe = progress.on("change", (v) => {
      const frame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(v * (FRAME_COUNT - 1))));
      if (frame === lastFrameRef.current) return; // skip duplicati
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => drawFrame(frame));
    });

    const onResize = (): void => {
      const f = lastFrameRef.current;
      lastFrameRef.current = -1;
      drawFrame(Math.max(0, f));
    };
    window.addEventListener("resize", onResize);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* Overlay transforms */
  const logoOpacity = useTransform(progress, [LOGO_RANGE[0], LOGO_RANGE[1]], [0, 1]);
  const logoY = useTransform(progress, [LOGO_RANGE[0], LOGO_RANGE[1]], [24, 0]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  const progressPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section id="top" ref={wrapperRef} className="relative h-[400vh] w-full bg-canvas">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Preloader */}
        {!ready && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-canvas">
            <img src="/images/logo-granata.png" alt="" className="h-20 w-20 animate-pulse" />
            <div className="w-48">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-granata transition-[width] duration-150" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="mt-3 text-center font-display text-sm italic text-ink/60">
                {t("hero.pouring")} {progressPct}%
              </p>
            </div>
          </div>
        )}

        {/* Logo fade-in — in basso, sotto l'animazione del vino */}
        <motion.div
          style={{ opacity: logoOpacity, y: logoY }}
          className="pointer-events-none absolute bottom-24 left-0 right-0 z-20 flex flex-col items-center gap-2 px-6 text-center md:bottom-32"
        >
          <p className="font-display text-4xl font-semibold leading-none tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            Fonte del Biro
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60 md:text-sm">{t("hero.since")}</p>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-ink/50"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">{t("hero.scroll")}</span>
          <ChevronDown size={16} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
