"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useEffect, useState } from "react";

const LINKS = [
  { key: "nav.about", href: "#chi-siamo" },
  { key: "nav.products", href: "#vini" },
  { key: "nav.buy", href: "#vini", cta: true },
] as const;

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const toggleLang = (): void => setLang(lang === "it" ? "en" : "it");

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 w-full">
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-end px-5 md:px-10">
        {/* Glass pill — desktop */}
        <ul
          className={[
            "pointer-events-auto absolute left-1/2 top-12 hidden -translate-x-1/2 -translate-y-1/2",
            "items-center gap-2 rounded-full py-1.5 pl-2 pr-2 md:flex",
            "border border-white/60 backdrop-blur-2xl backdrop-saturate-150",
            "shadow-[0_12px_40px_-6px_rgba(111,23,37,0.18),inset_0_1px_0_0_rgba(255,255,255,0.6)]",
            "transition-[background-color] duration-300",
            scrolled ? "bg-white/55" : "bg-white/35",
          ].join(" ")}
        >
          <li className="flex items-center gap-2 pl-1 pr-3">
            <a href="#top" className="flex items-center gap-2">
              <img
                src="/images/logo-granata.png"
                alt="Fonte del Biro"
                className="-my-2 h-11 w-11 object-contain"
              />
              <span className="font-display text-[17px] font-semibold leading-none tracking-tight text-ink">
                Fonte del Biro
              </span>
            </a>
          </li>
          <li className="h-6 w-px bg-ink/10" />
          {LINKS.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                className={
                  "cta" in l && l.cta
                    ? "inline-flex items-center rounded-full bg-granata px-4 py-2 text-[13px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(111,23,37,0.7)] transition hover:bg-granata-deep"
                    : "inline-flex items-center rounded-full px-3.5 py-2 text-[13px] font-medium text-ink/80 transition hover:bg-white/60 hover:text-ink"
                }
              >
                {t(l.key)}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === "it" ? "Switch to English" : "Passa all'italiano"}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-ink/70 transition hover:bg-white/60 hover:text-ink"
            >
              <Globe size={13} />
              {lang === "it" ? "EN" : "IT"}
            </button>
          </li>
        </ul>

        {/* Mobile: logo + hamburger */}
        <a href="#top" className="pointer-events-auto absolute left-5 top-4 md:hidden">
          <img src="/images/logo-granata.png" alt="Fonte del Biro" className="h-9 w-9" />
        </a>
        <button
          type="button"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-2xl border border-white/50 bg-white/60 text-ink backdrop-blur-xl md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-auto mx-4 mt-1 rounded-3xl border border-white/60 bg-white/75 p-3 shadow-xl backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setOpen(false)}
                className={
                  "cta" in l && l.cta
                    ? "mt-1 block rounded-2xl bg-granata px-4 py-3 text-center text-sm font-medium text-white"
                    : "block rounded-2xl px-4 py-3 text-sm font-medium text-ink/85 hover:bg-white"
                }
              >
                {t(l.key)}
              </a>
            ))}
            <button
              type="button"
              onClick={() => { toggleLang(); setOpen(false); }}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold uppercase text-ink/70 hover:bg-white"
            >
              <Globe size={14} />
              {lang === "it" ? "English" : "Italiano"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
