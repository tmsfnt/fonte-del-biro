"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Grape, MapPin, Phone, Sparkles, Wheat, Wine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Dati — modifica qui                                                */
/* ------------------------------------------------------------------ */

type Location = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  mapsUrl: string;
  bgImage: string;
  cutoutImage: string;
  video?: string; // se presente, sostituisce la foto nello specchietto
  stats: { label: string; value: string }[];
};

type ComingSoon = {
  id: string;
  eyebrow: string;
  title: string;
  note: string;
  bgImage: string;
  phone?: string; // se presente, mostra il bottone "Prenota ora"
  tasting?: { icon: "wine" | "rose" | "spumante" | "local"; value: string; label: string; sub: string }[];
};

const TASTING_ICONS: Record<string, React.ReactNode> = {
  wine: <Wine size={16} />,
  rose: <Wine size={16} className="opacity-80" />,
  spumante: <Sparkles size={16} />,
  local: <Wheat size={16} />,
};

const LOCATION: Location = {
  id: "tenuta",
  eyebrow: "La tenuta · 01",
  title: "Fonte del\nBiro",
  subtitle: "Prima del vino, prima degli ulivi, c\u2019era l\u2019acqua. Il resto \u00e8 venuto dopo. La sorgente del Biro ha reso fertile questa collina molto prima che qualcuno pensasse di piantarci una vigna. Dal 1992 lavoriamo la terra che ha preparato lei.",
  mapsUrl: "https://www.google.com/maps/place/Azienda+Agricola+Fonte+del+Biro/@43.5955278,11.1748515,17z/data=!3m1!4b1!4m6!3m5!1s0x132a49e4a0f22f6b:0x4ee621525d5934bb!8m2!3d43.5955239!4d11.1774264!16s%2Fg%2F11xm77vdqm?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D",
  bgImage: "/images/tenuta.jpg",
  cutoutImage: "/images/tenuta-drone.jpg",
  video: "/images/tenuta-video.mp4",
  stats: [
    { label: "estate.stat.hectares", value: "16" },
    { label: "estate.stat.vineyard", value: "5" },
    { label: "estate.stat.olives", value: "400" },
    { label: "estate.stat.wines", value: "5" },
  ],
};

const COMING: ComingSoon[] = [
  {
    id: "cantina",
    eyebrow: "Cantina & degustazioni · 02",
    title: "Visite in cantina\ne Degustazione",
    note: "Vi facciamo vedere da dove viene, e poi lo assaggiate. Su prenotazione, tutto l'anno.",
    bgImage: "/images/cellar.jpg",
    phone: "+39 338 667 9322",
    tasting: [
      { icon: "wine", value: "3", label: "cellar.reds", sub: "Tresangres \u00b7 Fonteblu \u00b7 Birosso" },
      { icon: "rose", value: "1", label: "cellar.rose", sub: "Rosa della Fonte" },
      { icon: "spumante", value: "1", label: "cellar.sparkling", sub: "Roib\u00f3" },
      { icon: "local", value: "+", label: "cellar.local", sub: "cellar.local.sub" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Sticky card wrapper                                                */
/* ------------------------------------------------------------------ */

function StackedCard({ index, total, children }: { index: number; total: number; children: React.ReactNode }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const isLast = index === total - 1;
  // Solo le card che vengono coperte svaniscono; l'ultima resta piena mentre i vini le scorrono sopra
  const coveredScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);
  const coveredOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 0.85, 0]);
  const scale = isLast ? 1 : coveredScale;
  const opacity = isLast ? 1 : coveredOpacity;
  const topOffset = 96; // tutte le card si fermano alla stessa altezza, perfettamente sovrapposte

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `${topOffset}px`, marginBottom: isLast ? 0 : "20vh", zIndex: 10 + index }}
    >
      <motion.div style={{ scale, opacity, transformOrigin: "top center" }}>{children}</motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card principale con cutout                                         */
/* ------------------------------------------------------------------ */

function MainCard({ loc }: { loc: Location }): JSX.Element {
  const { t } = useLang();
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom]);
  return (
    <article
      className="relative aspect-[4/5] max-h-[calc(100vh-11rem)] overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-30px_rgba(26,20,22,0.5)] sm:aspect-[16/10]"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${loc.bgImage})` }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,20,22,0.10) 0%, rgba(26,20,22,0.0) 50%, rgba(26,20,22,0.35) 100%)",
        }}
      />

      {/* Media della tenuta */}
      <div
        className="pointer-events-none absolute right-10 top-[22%] z-30 hidden overflow-hidden rounded-[1.6rem] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.55)] md:block lg:right-12"
        style={{ height: "46%", aspectRatio: "4/3" }}
      >
        {loc.video ? (
          <video
            src={loc.video}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full select-none object-cover"
          />
        ) : (
          <img src={loc.cutoutImage} alt="La tenuta vista dall'alto" className="h-full w-full select-none object-cover" style={{ objectPosition: "center 70%" }} />
        )}
      </div>

      {/* Glass panel */}
      <div
        className="absolute left-5 right-5 top-[14%] z-20 overflow-visible rounded-[2rem] border border-white/40 md:left-8 md:right-8"
        style={{
          height: "62%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)",
          boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.55), inset 0 -1px 0 0 rgba(255,255,255,0.12), 0 24px 60px -20px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px) saturate(170%) brightness(1.05)",
          WebkitBackdropFilter: "blur(10px) saturate(170%) brightness(1.05)",
        }}
      >
        <div className="flex h-full flex-col justify-between p-6 md:p-10">
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/80">{t("estate.eyebrow")}</span>
          <div className="max-w-[56%]">
            <h3 className="whitespace-pre-line font-display text-4xl font-semibold leading-[0.95] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl">
              {loc.title}
            </h3>
            <p className="mt-4 hidden max-w-lg font-display text-base font-medium italic leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] [text-wrap:pretty] sm:block md:text-lg">
              {t("estate.subtitle")}
            </p>
          </div>
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition hover:bg-cream md:translate-y-4"
          >
            <MapPin size={16} className="text-granata" />
            {t("estate.directions")}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="absolute bottom-5 left-5 right-5 z-30 grid grid-cols-4 divide-x divide-white/25 rounded-[1.6rem] border border-white/35 px-2 py-3 backdrop-blur-[18px] md:bottom-8 md:left-8 md:right-8 md:rounded-full md:px-6"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.10))" }}
      >
        {loc.stats.map((s) => (
          <div key={s.label} className="px-2 text-center md:px-4">
            <p className="font-display text-xl font-semibold leading-none text-white md:text-2xl">{s.value}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/75 md:text-[10px]">{t(s.label as never)}</p>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[90] flex cursor-zoom-out items-center justify-center bg-ink/80 p-6 backdrop-blur-sm md:p-12"
          >
            {loc.video ? (
              <video
                src={loc.video}
                autoPlay
                muted
                loop
                playsInline
                controls
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full rounded-xl shadow-2xl"
              />
            ) : (
              <img src={loc.cutoutImage} alt="La tenuta vista dall'alto" className="max-h-full max-w-full rounded-xl shadow-2xl" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Coming soon                                                        */
/* ------------------------------------------------------------------ */

function ComingSoonCard({ item, icon }: { item: ComingSoon; icon: React.ReactNode }): JSX.Element {
  const { t: tr } = useLang();
  return (
    <article
      className="relative aspect-[4/5] max-h-[calc(100vh-11rem)] overflow-hidden rounded-[2.5rem] shadow-[0_40px_80px_-30px_rgba(26,20,22,0.5)] sm:aspect-[16/10]"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.bgImage})` }} />
      <div className="absolute inset-0 bg-ink/40" />
      {/* blobs colorati per dare vita al glass */}
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-granata-soft/60 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-sky/50 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-beige/50 blur-3xl" />

      {/* Bottiglia — sporge sopra il glass */}
      <img
        src="/images/bottle-cutout.png"
        alt=""
        className="pointer-events-none absolute right-16 top-0 z-30 hidden h-[88%] w-auto select-none object-contain object-top drop-shadow-[0_22px_36px_rgba(0,0,0,0.55)] md:right-28 md:block"
      />


      <div className="glass-light absolute inset-5 z-20 rounded-[2rem] md:inset-8">
        <div className="flex h-full flex-col justify-between p-6 md:p-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/80">{tr("cellar.eyebrow")}</span>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white">{icon}</span>
          </div>
          <div>
            <h3 className="whitespace-pre-line font-display text-4xl font-semibold leading-[1.02] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
              {tr("cellar.title")}
            </h3>
            <p className="mt-3 max-w-lg whitespace-pre-line font-display text-base font-medium italic leading-relaxed text-white/90 lg:mt-4 lg:text-lg">{tr("cellar.note")}</p>

            {item.tasting && (
              <div className="mt-4 max-w-lg md:max-w-[56%] lg:mt-6">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.3em] text-white/55">{tr("cellar.tasting")}</p>
                {item.tasting.map((t) => (
                  <div key={t.label} className="flex items-baseline gap-2 border-b border-white/15 py-2 last:border-b-0 lg:py-2.5">
                    <span className="w-5 shrink-0 text-right font-display text-xl font-semibold leading-none text-white">{t.value}</span>
                    <span className="shrink-0 whitespace-nowrap font-display text-lg font-medium leading-none text-white">{tr(t.label as never)}</span>
                    <span className="mx-1 min-w-[1.5rem] flex-1 self-center border-b border-dotted border-white/30" />
                    <span className="max-w-[52%] text-right text-xs italic leading-snug text-white/65">
                      {t.sub.startsWith("cellar.") ? tr(t.sub as never) : t.sub}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            {item.phone && (
              <a
                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(tr("cellar.book.msg"))}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition hover:bg-cream"
              >
                <Phone size={16} className="text-granata" />
                {tr("cellar.book")}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Locations(): JSX.Element {
  const { t } = useLang();
  const total = 1 + COMING.length;
  return (
    <section id="chi-siamo" className="relative w-full bg-canvas px-5 pb-6 pt-24 md:px-10 md:pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center md:mb-20">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-granata">{t("about.eyebrow")}</p>
          <h2 className="font-display text-5xl font-medium leading-[1.02] tracking-tightest text-ink [text-wrap:balance] md:text-7xl">
            {t("about.title1")}
            <br />
            <span className="italic text-granata">{t("about.title2")}</span>
          </h2>
          <span aria-hidden="true" className="my-8 inline-flex items-center gap-3 text-granata/70">
            <span className="h-px w-12 bg-granata/30" />
            <img src="/images/logo-granata.png" alt="" className="h-7 w-7 opacity-80" />
            <span className="h-px w-12 bg-granata/30" />
          </span>
          <p className="font-display text-xl font-medium leading-[1.65] text-ink/80 [text-wrap:pretty] md:text-[1.4rem]">
            {t("about.p1")}
          </p>
          <p className="mt-5 font-display text-xl font-medium leading-[1.65] text-ink/80 [text-wrap:pretty] md:text-[1.4rem]">
            {t("about.p2a")}
            <em className="text-granata">Merlot</em>
            {t("about.p2b")}
            <em className="text-granata">Sangiovese</em>
            {t("about.p2c")}
            <em className="text-granata">{t("about.spumante")}</em>
            {t("about.p2d")}
          </p>
        </div>

        <div className="relative">
          <StackedCard index={0} total={total}>
            <MainCard loc={LOCATION} />
          </StackedCard>
          {COMING.map((item, i) => (
            <StackedCard key={item.id} index={i + 1} total={total}>
              <ComingSoonCard item={item} icon={<Grape size={18} />} />
            </StackedCard>
          ))}
          {/* La card resta fissata mentre la sezione vini le sale sopra */}
          <div aria-hidden="true" className="h-[152vh]" />
        </div>
      </div>
    </section>
  );
}
