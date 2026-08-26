"use client";

import { createContext, useContext, useState } from "react";

export type Lang = "it" | "en";

const STR = {
  it: {
    // Navbar
    "nav.about": "Chi siamo",
    "nav.products": "I nostri prodotti",
    "nav.buy": "Compra ora",
    // Hero
    "hero.pouring": "Versando…",
    "hero.scroll": "Scorri",
    "hero.since": "Chianti · dal 1962",
    // Chi siamo
    "about.eyebrow": "Chi siamo",
    "about.title1": "Una sorgente,",
    "about.title2": "tre generazioni.",
    "about.p1":
      "Fonte del Biro è un'azienda agricola immersa tra le colline del Chianti Fiorentino, nel comune di Barberino Tavarnelle. Attiva dal 1992, si estende su una superficie di circa 16 ettari, di cui 5 coltivati a vigneto, e ospita circa 400 piante di olivo.",
    "about.p1.hl": "Chianti Fiorentino",
    "about.p2a": "La produzione comprende tre vini: un ",
    "about.p2b": " in purezza, un ",
    "about.p2c": " in purezza e uno ",
    "about.p2d": ".",
    "about.spumante": "spumante metodo classico",
    // Tenuta
    "estate.eyebrow": "La tenuta · 01",
    "estate.subtitle":
      "Prima del vino, prima degli ulivi, c'era l'acqua. Il resto è venuto dopo. La sorgente del Biro ha reso fertile questa collina molto prima che qualcuno pensasse di piantarci una vigna. Dal 1992 lavoriamo la terra che ha preparato lei.",
    "estate.stat.hectares": "Ettari",
    "estate.stat.vineyard": "Ettari a vigneto",
    "estate.stat.olives": "Piante di olivo",
    "estate.stat.wines": "Vini prodotti",
    "estate.directions": "Get directions",
    // Cantina
    "cellar.eyebrow": "Cantina & degustazioni · 02",
    "cellar.title": "Visite in cantina\ne Degustazione",
    "cellar.note": "Vi facciamo vedere da dove viene, e poi lo assaggiate. Su prenotazione, tutto l'anno.",
    "cellar.tasting": "La degustazione",
    "cellar.reds": "Rossi",
    "cellar.rose": "Rosé",
    "cellar.sparkling": "Spumante",
    "cellar.local": "Prodotti locali",
    "cellar.local.sub": "Pane, olio, olive e salumi",
    "cellar.sparkling.sub": "Roibó",
    "cellar.book": "Prenota su WhatsApp",
    "cellar.book.msg": "Ciao! Vorrei prenotare una visita in cantina con degustazione.",
    // Catalogo
    "shop.eyebrow": "I nostri prodotti",
    "shop.sidebar": "Bottega",
    "shop.wines": "Vini",
    "shop.wines.blurb": "Cinque etichette dalla collina della fonte: tre rossi, un rosé e uno spumante metodo classico.",
    "shop.oil": "Olio & Bottega",
    "shop.oil.blurb": "L'olio delle nostre 400 piante, in due versioni: il blend multicultivar e il monocultivar Leccio del Corno.",
    "shop.search": "Cerca in",
    "shop.noresults": "Nessun risultato per",
    "shop.price": "Prezzo",
    "shop.order": "Ordina su WhatsApp",
    "shop.order.msg": "Ciao! Vorrei ordinare una bottiglia di",
    "group.Rossi": "Rossi",
    "group.Rosé": "Rosé",
    "group.Spumante": "Spumante",
    // Footer
    "footer.tag": "Azienda agricola · Chianti",
    "footer.blurb": "Sapore di Toscana, originato alla fonte del Biro. Vino, olio e ospitalità tra le colline del Chianti.",
    "footer.sitemap": "Sitemap",
    "footer.contacts": "Contatti",
    "footer.top": "Torna su",
    "footer.legal": "Fonte del Biro · Azienda Agricola · P.IVA 04696170481",
    "footer.drink": "Bevi responsabilmente. Il vino è per chi ha più di 18 anni.",
  },
  en: {
    "nav.about": "About us",
    "nav.products": "Our products",
    "nav.buy": "Buy now",
    "hero.pouring": "Pouring…",
    "hero.scroll": "Scroll",
    "hero.since": "Chianti · since 1962",
    "about.eyebrow": "About us",
    "about.title1": "One spring,",
    "about.title2": "three generations.",
    "about.p1":
      "Fonte del Biro is a family farm nestled in the hills of the Florentine Chianti, in the municipality of Barberino Tavarnelle. Founded in 1992, it covers around 16 hectares — 5 of them planted with vines — and is home to some 400 olive trees.",
    "about.p1.hl": "Florentine Chianti",
    "about.p2a": "We make three wines: a single-varietal ",
    "about.p2b": ", a single-varietal ",
    "about.p2c": " and a ",
    "about.p2d": ".",
    "about.spumante": "classic-method sparkling wine",
    "estate.eyebrow": "The estate · 01",
    "estate.subtitle":
      "Before the wine, before the olive trees, there was water. Everything else came later. The Biro spring made this hillside fertile long before anyone thought of planting a vineyard here. Since 1992 we have worked the land it prepared.",
    "estate.stat.hectares": "Hectares",
    "estate.stat.vineyard": "Vineyard hectares",
    "estate.stat.olives": "Olive trees",
    "estate.stat.wines": "Wines produced",
    "estate.directions": "Get directions",
    "cellar.eyebrow": "Cellar & tastings · 02",
    "cellar.title": "Cellar visits\n& Tasting",
    "cellar.note": "We show you where it comes from — then you taste it. By reservation, all year round.",
    "cellar.tasting": "The tasting",
    "cellar.reds": "Reds",
    "cellar.rose": "Rosé",
    "cellar.sparkling": "Sparkling",
    "cellar.local": "Local products",
    "cellar.local.sub": "Bread, oil, olives and cured meats",
    "cellar.sparkling.sub": "Roibó",
    "cellar.book": "Book on WhatsApp",
    "cellar.book.msg": "Hi! I would like to book a cellar visit with tasting.",
    "shop.eyebrow": "Our products",
    "shop.sidebar": "Shop",
    "shop.wines": "Wines",
    "shop.wines.blurb": "Five labels from the hill of the spring: three reds, a rosé and a classic-method sparkling wine.",
    "shop.oil": "Oil & Pantry",
    "shop.oil.blurb": "The oil of our 400 trees, in two versions: the multi-cultivar blend and the single-cultivar Leccio del Corno.",
    "shop.search": "Search",
    "shop.noresults": "No results for",
    "shop.price": "Price",
    "shop.order": "Order on WhatsApp",
    "shop.order.msg": "Hi! I would like to order a bottle of",
    "group.Rossi": "Reds",
    "group.Rosé": "Rosé",
    "group.Spumante": "Sparkling",
    "footer.tag": "Farm & winery · Chianti",
    "footer.blurb": "A taste of Tuscany, born at the Biro spring. Wine, oil and hospitality in the Chianti hills.",
    "footer.sitemap": "Sitemap",
    "footer.contacts": "Contacts",
    "footer.top": "Back to top",
    "footer.legal": "Fonte del Biro · Farm & Winery · VAT 04696170481",
    "footer.drink": "Drink responsibly. Wine is for adults 18+.",
  },
} as const;

type Key = keyof (typeof STR)["it"];

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "it",
  setLang: () => undefined,
});

export function LangProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [lang, setLang] = useState<Lang>("it");
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string } {
  const { lang, setLang } = useContext(LangContext);
  const t = (k: Key): string => STR[lang][k];
  return { lang, setLang, t };
}
