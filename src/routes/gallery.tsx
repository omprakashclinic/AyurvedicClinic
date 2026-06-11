import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import clinic from "@/assets/clinic-interior.jpg";
import hero from "@/assets/hero-ayurveda.jpg";

const items = [
  { cat: "Clinic Interior", src: clinic, h: "tall" },
  { cat: "Panchakarma Therapies", src: shirodhara, h: "short" },
  { cat: "Herbal Medicines", src: herbs, h: "med" },
  { cat: "Panchakarma Therapies", src: abhyanga, h: "tall" },
  { cat: "Wellness Activities", src: hero, h: "med" },
  { cat: "Herbal Medicines", src: herbs, h: "short" },
  { cat: "Clinic Interior", src: clinic, h: "med" },
  { cat: "Panchakarma Therapies", src: shirodhara, h: "tall" },
  { cat: "Wellness Activities", src: abhyanga, h: "short" },
  { cat: "Patient Events", src: clinic, h: "med" },
];

const cats = ["All", "Clinic Interior", "Panchakarma Therapies", "Wellness Activities", "Herbal Medicines", "Patient Events"];
const heights: Record<string, string> = { short: "h-52", med: "h-72", tall: "h-96" };

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery — Ayurveda Sanctuary" }, { name: "description", content: "A glimpse inside our heritage Ayurvedic clinic." }] }),
  component: Gallery,
});

function Gallery() {
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const filtered = items.filter((i) => cat === "All" || i.cat === cat);
  return (
    <SiteShell>
      <section className="pt-32 pb-12 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">SANCTUARY</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Visual <em className="text-gradient-copper not-italic">Journey</em></h1>
        <SanskritDivider/>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm border transition ${cat===c?"bg-saffron text-ivory border-saffron":"bg-card border-border hover:border-saffron"}`}>{c}</button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((it, i) => (
            <button key={i} onClick={() => setLightbox(it.src)} className={`group block w-full ${heights[it.h]} relative overflow-hidden rounded-2xl break-inside-avoid`}>
              <img src={it.src} alt={it.cat} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                <span className="text-ivory text-sm">{it.cat}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 bg-charcoal/95 z-[100] grid place-items-center p-6 animate-fade-up">
          <button className="absolute top-6 right-6 text-ivory"><X size={28}/></button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-luxe"/>
        </div>
      )}
    </SiteShell>
  );
}
