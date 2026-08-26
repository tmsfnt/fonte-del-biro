"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useLang } from "@/lib/i18n";

// TODO: sostituire con i contatti reali
const CONTACT = {
  email: "fontedelbiro@gmail.com",
  phone: "+39 338 667 9322",
  address: "Azienda Agricola Fonte del Biro — Chianti, Toscana",
  maps: "https://www.google.com/maps/place/Azienda+Agricola+Fonte+del+Biro/@43.5955278,11.1748515,17z/data=!3m1!4b1!4m6!3m5!1s0x132a49e4a0f22f6b:0x4ee621525d5934bb!8m2!3d43.5955239!4d11.1774264!16s%2Fg%2F11xm77vdqm?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D",
};

const SITEMAP = [
  { key: "nav.about", href: "#chi-siamo" },
  { key: "nav.products", href: "#vini" },
  { key: "nav.buy", href: "#vini" },
  { key: "footer.top", href: "#top" },
] as const;

export default function Footer(): JSX.Element {
  const { t } = useLang();
  return (
    <footer className="relative w-full bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/images/logo-white.png" alt="Fonte del Biro" className="h-14 w-14" />
              <div>
                <p className="font-display text-2xl font-semibold leading-none">Fonte del Biro</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream/50">{t("footer.tag")}</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
              {t("footer.blurb")}
            </p>
          </div>

          {/* Sitemap */}
          <div className="md:col-span-3">
            <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-cream/45">{t("footer.sitemap")}</p>
            <ul className="space-y-2.5">
              {SITEMAP.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-sm text-cream/75 transition hover:text-cream">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div className="md:col-span-4">
            <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-cream/45">{t("footer.contacts")}</p>
            <ul className="space-y-3 text-sm text-cream/75">
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-granata-soft" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-cream">{CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-granata-soft" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-cream">{CONTACT.phone}</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-granata-soft" />
                <a href={CONTACT.maps} target="_blank" rel="noreferrer" className="hover:text-cream">{CONTACT.address}</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {t("footer.legal")}</p>
          <p className="font-display italic">{t("footer.drink")}</p>
        </div>
      </div>
    </footer>
  );
}
