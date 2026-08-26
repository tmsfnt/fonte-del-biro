"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Droplets, Heart, MoreHorizontal, Search, ShoppingBag, Wine, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Dati — modifica qui                                                */
/* ------------------------------------------------------------------ */

type Product = {
  id: string;
  name: string;
  description: string;
  notes?: string[]; // tag mostrati nel dettaglio
  price: number;
  year?: string;
  size: string;
  gradient: string;
  image?: string; // se presente, sovrascrive il gradient
  group?: string; // sottosezione (es. Rossi / Ros\u00e9 / Spumante)
};

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  blurb: string;
  groups?: string[]; // ordine delle sottosezioni
  products: Product[];
};

const CATEGORIES: Category[] = [
  {
    id: "vini",
    label: "Vini",
    icon: <Wine size={16} />,
    title: "Vini",
    blurb: "Cinque etichette dalla collina della fonte: tre rossi, un ros\u00e9 e uno spumante metodo classico.",
    groups: ["Rossi", "Ros\u00e9", "Spumante"],
    products: [
      {
        id: "tresangres",
        name: "Tresangres",
        group: "Rossi",
        year: "2022",
        size: "75 cl",
        price: 11,
        description: "Un taglio di tre uve del podere.\n60% Sangiovese \u00b7 20% Merlot \u00b7 20% Syrah.",
        notes: ["13,5% vol.", "75 cl", "IGT Toscana", "Sangiovese \u00b7 Merlot \u00b7 Syrah"],
        gradient: "linear-gradient(135deg, #9A2F40 0%, #6F1725 55%, #3A0B13 100%)",
      },
      {
        id: "fonteblu",
        name: "Fonteblu",
        group: "Rossi",
        year: "2023",
        size: "75 cl",
        price: 13,
        description: "100% Merlot, affinato in barrique.",
        notes: ["13,5% vol.", "75 cl", "IGT Toscana", "Merlot"],
        gradient: "linear-gradient(135deg, #40507E 0%, #2A3350 55%, #141A2C 100%)",
        image: "/images/fonteblu.png",
      },
      {
        id: "birosso",
        name: "Birosso",
        group: "Rossi",
        year: "2023",
        size: "75 cl",
        price: 16,
        description: "100% Syrah, affinato in barrique.",
        notes: ["13,5% vol.", "75 cl", "IGT Toscana", "Syrah"],
        gradient: "linear-gradient(135deg, #B24D5E 0%, #7D1F30 60%, #4A0F19 100%)",
        image: "/images/bottle-cutout.png",
      },
      {
        id: "rosa-della-fonte",
        name: "Rosa della Fonte",
        group: "Ros\u00e9",
        year: "2024",
        size: "75 cl",
        price: 10,
        description: "Ros\u00e9 fresco e sapido.",
        notes: ["12,5% vol.", "75 cl", "Rosato"],
        gradient: "linear-gradient(135deg, #F3C7C9 0%, #E08A93 55%, #B85A6A 100%)",
      },
      {
        id: "roibo",
        name: "Roib\u00f3",
        group: "Spumante",
        year: "2023",
        size: "75 cl",
        price: 20,
        description: "Spumante metodo classico.",
        notes: ["12,5% vol.", "75 cl", "Metodo classico"],
        gradient: "linear-gradient(135deg, #F8F4EC 0%, #E6DCCB 50%, #C9B38E 100%)",
        image: "/images/roibo.png",
      },
    ],
  },
  {
    id: "bottega",
    label: "Olio & Bottega",
    icon: <Droplets size={16} />,
    title: "Olio & Bottega",
    blurb: "L\u2019olio delle nostre 400 piante, in due versioni: il blend multicultivar e il monocultivar Leccio del Corno.",
    products: [
      {
        id: "olio-multicultivar",
        name: "Olio Extravergine Multicultivar",
        year: "Raccolta 2025",
        size: "50 cl",
        price: 10,
        description: "Un blend delle cultivar della tenuta.\nSpremitura a freddo, filtrato.",
        notes: ["Multicultivar", "Spremuto a freddo", "Filtrato", "50 cl"],
        gradient: "linear-gradient(135deg, #C9D66A 0%, #7E9A2E 55%, #3F5614 100%)",
      },
      {
        id: "olio-leccio-del-corno",
        name: "Olio Extravergine Leccio del Corno",
        year: "Raccolta 2025",
        size: "50 cl",
        price: 13,
        description: "Monocultivar Leccio del Corno.\nSpremitura a freddo, filtrato.",
        notes: ["Monocultivar", "Spremuto a freddo", "Filtrato", "50 cl"],
        gradient: "linear-gradient(135deg, #A8B860 0%, #5E7A22 55%, #2C3D10 100%)",
      },
    ],
  },
];

const EN_DESCRIPTIONS: Record<string, string> = {
  tresangres: "A blend of three estate grapes.\n60% Sangiovese \u00b7 20% Merlot \u00b7 20% Syrah.",
  fonteblu: "100% Merlot, aged in barrique.",
  birosso: "100% Syrah, aged in barrique.",
  "rosa-della-fonte": "A fresh, savoury ros\u00e9.",
  roibo: "Classic-method sparkling wine.",
  "olio-multicultivar": "A blend of the estate cultivars.\nCold-pressed, filtered.",
  "olio-leccio-del-corno": "Single-cultivar Leccio del Corno.\nCold-pressed, filtered.",
};

const BACKDROP_IMAGE = "/images/cellar.jpg";

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }): JSX.Element {
  const { t } = useLang();
  return (
    <aside className="flex flex-col gap-1 border-b border-white/10 p-4 md:w-64 md:border-b-0 md:border-r md:p-5">
      <div className="mb-4 hidden items-center justify-between md:flex">
        <div className="flex items-center gap-2">
          <img src="/images/logo-white.png" alt="" className="h-7 w-7 opacity-90" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/70">{t("shop.sidebar")}</span>
        </div>
        <button type="button" className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={[
                "flex shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition md:w-full",
                isActive
                  ? "bg-white/20 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-xl",
                  isActive ? "bg-granata text-white" : "bg-white/10 text-white/80",
                ].join(" ")}
              >
                {c.icon}
              </span>
              <span className="whitespace-nowrap font-medium">{t(c.id === "vini" ? "shop.wines" : "shop.oil")}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function ProductCard({ p, onOpen }: { p: Product; onOpen: (p: Product) => void }): JSX.Element {
  const { lang } = useLang();
  const desc = lang === "en" ? EN_DESCRIPTIONS[p.id] ?? p.description : p.description;
  const [liked, setLiked] = useState(false);
  return (
    <motion.button
      layout
      type="button"
      onClick={() => onOpen(p)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2.5 text-left transition hover:bg-white/10"
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
        style={{ background: p.image ? "#FFFFFF" : p.gradient }}
      >
        {p.image && <img src={p.image} alt={p.name} className="h-full w-full object-contain p-3" />}
        {!p.image && (
          <img
            src="/images/logo-white.png"
            alt=""
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-40 transition group-hover:scale-110 group-hover:opacity-60"
          />
        )}
        <span
          role="button"
          tabIndex={0}
          aria-label="Preferito"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setLiked((v) => !v);
            }
          }}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
        >
          <Heart size={14} className={liked ? "fill-granata-soft text-granata-soft" : ""} />
        </span>
        {p.year && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            {p.year}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <h4 className="font-display text-lg font-semibold leading-tight text-white">{p.name}</h4>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/60">{desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">€ {p.price}</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/50">{p.size}</span>
        </div>
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }): JSX.Element {
  const { lang, t } = useLang();
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm md:items-center md:p-6"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-4xl overflow-hidden rounded-t-[2rem] bg-cream shadow-2xl md:grid-cols-2 md:rounded-[2rem]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-ink shadow hover:bg-white"
            >
              <X size={16} />
            </button>
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[28rem]" style={{ background: product.image ? "#FFFFFF" : product.gradient }}>
              {product.image ? (
                <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-6" />
              ) : (
                <img src="/images/logo-white.png" alt="" className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-50" />
              )}
            </div>
            <div className="flex flex-col p-7 md:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-granata">
                {product.year ?? "Bottega"} · {product.size}
              </p>
              <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">{product.name}</h3>
              <p className="mt-4 whitespace-pre-line font-display text-lg font-medium leading-relaxed text-ink/80">
                {lang === "en" ? EN_DESCRIPTIONS[product.id] ?? product.description : product.description}
              </p>
              {product.notes && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.notes.map((n) => (
                    <li key={n} className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs text-ink/75">
                      {n}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex items-center justify-between pt-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink/50">{t("shop.price")}</p>
                  <p className="font-display text-3xl font-semibold text-ink">€ {product.price}</p>
                </div>
                <a
                  href={`https://wa.me/393386679322?text=${encodeURIComponent(`${t("shop.order.msg")} ${product.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-granata px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_-10px_rgba(111,23,37,0.8)] transition hover:bg-granata-deep"
                >
                  <ShoppingBag size={16} />
                  {t("shop.order")}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function Catalogue(): JSX.Element {
  const { lang, t } = useLang();
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const close = useCallback(() => setSelected(null), []);

  const category = CATEGORIES.find((c) => c.id === active) ?? CATEGORIES[0];
  const filtered = useMemo(() => {
    if (!query.trim()) return category.products;
    const q = query.toLowerCase();
    return category.products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [category.products, query]);

  return (
    <section id="vini" className="relative z-30 -mt-[91vh] w-full overflow-hidden px-4 py-24 md:px-10 md:py-32">
      {/* Backdrop: foto + blobs colorati + scrim */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BACKDROP_IMAGE})` }} />
      <div className="absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-granata-soft/50 blur-[120px]" />
      <div className="absolute -right-20 bottom-10 h-[30rem] w-[30rem] rounded-full bg-sky/40 blur-[120px]" />
      <div className="absolute left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-beige/30 blur-[120px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/40" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-cream/80">{t("shop.eyebrow")}</p>
          <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-tightest text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] md:text-7xl">
            La bottega <span className="italic">del Biro</span>
          </h2>
        </div>

        {/* Glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-black/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md md:flex-row"
        >
          <Sidebar active={active} onSelect={(id) => { setActive(id); setQuery(""); }} />

          <div className="flex-1 p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-3xl font-semibold leading-none text-white md:text-4xl">{t(category.id === "vini" ? "shop.wines" : "shop.oil")}</h3>
                <p className="mt-2 max-w-lg text-sm text-white/65">{t(category.id === "vini" ? "shop.wines.blurb" : "shop.oil.blurb")}</p>
              </div>
              <img src="/images/logo-white.png" alt="" className="hidden h-12 w-12 opacity-70 md:block" />
            </div>

            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/80 focus-within:bg-white/15">
              <Search size={16} className="shrink-0 text-white/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`${t("shop.search")} ${t(category.id === "vini" ? "shop.wines" : "shop.oil")}…`}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
            </label>

            <div className="mt-5 min-h-[24rem] md:min-h-[30rem]">
              {(category.groups ?? [undefined]).map((g) => {
                const items = g ? filtered.filter((p) => p.group === g) : filtered;
                if (items.length === 0) return null;
                return (
                  <div key={g ?? "all"} className="mb-6 last:mb-0">
                    {g && (
                      <div className="mb-3 flex items-center gap-3">
                        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">{t(`group.${g}` as never)}</span>
                        <span className="h-px flex-1 bg-white/15" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 content-start gap-3 md:grid-cols-3 lg:grid-cols-4">
                      <AnimatePresence mode="popLayout">
                        {items.map((p) => (
                          <ProductCard key={p.id} p={p} onOpen={setSelected} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-10 text-center text-sm text-white/60">{t("shop.noresults")} “{query}”.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ProductModal product={selected} onClose={close} />
    </section>
  );
}
