import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { getCollectionData, getDocumentData } from "@/lib/firebase";

import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import clinic from "@/assets/clinic-interior.jpg";
import hero from "@/assets/hero-ayurveda.jpg";

import * as staticData from "@/lib/site-data";

const imageMap: Record<string, string> = { shirodhara, herbs, abhyanga, clinic, hero };

function resolveImg(imgKey: string, defaultImg: string = clinic) {
  if (!imgKey) return defaultImg;
  if (imgKey.startsWith("http")) return imgKey;
  return imageMap[imgKey] || defaultImg;
}

export const Route = createFileRoute("/gallery")({
  head: () => ({ 
    meta: [
      { title: "Photo Gallery — Shree Vishvmaharshi Clinic" }, 
      { name: "description", content: "A glimpse inside our speciality Panchkarma clinic and therapy suites." }
    ] 
  }),
  component: Gallery,
});

const cats = ["All", "Clinic Interior", "Panchakarma Therapies", "Wellness Activities", "Herbal Medicines", "Patient Events"];

function Gallery() {
  const [items, setItems] = useState<any[]>(staticData.galleryItems);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [seo, setSeo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollectionData("gallery");
        if (data.length > 0) setItems(data);

        const dbSeo = await getDocumentData("settings", "seo");
        if (dbSeo && dbSeo.gallery) {
          setSeo(dbSeo.gallery);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update dynamic SEO
  useEffect(() => {
    if (seo) {
      document.title = seo.title || "Photo Gallery";
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', seo.description || "");
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) keywordsMeta.setAttribute('content', seo.keywords || "");
    }
  }, [seo]);

  const filtered = items.filter((i) => cat === "All" || i.cat === cat);
  
  // Rhythmic heights for the masonry layout
  const heights = ["h-52", "h-72", "h-96", "h-72", "h-52"];

  return (
    <SiteShell>
      <section className="pt-32 pb-12 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">SANCTUARY</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 font-bold">Visual <em className="text-gradient-copper not-italic font-serif">Journey</em></h1>
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
        {loading ? (
          <div className="py-20 text-center text-charcoal/50">Loading gallery...</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((it, i) => {
              const imageSrc = resolveImg(it.img || it.image, clinic);
              const cardHeight = heights[i % heights.length];
              return (
                <button 
                  key={it.id || i} 
                  onClick={() => setLightbox(imageSrc)} 
                  className={`group block w-full ${cardHeight} relative overflow-hidden rounded-2xl break-inside-avoid`}
                >
                  <img src={imageSrc} alt={it.cat} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                    <span className="text-ivory text-sm font-serif">{it.cat}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-charcoal/50 py-12">No images found in this category.</p>
        )}
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 bg-charcoal/95 z-[100] grid place-items-center p-6 animate-fade-up">
          <button className="absolute top-6 right-6 text-ivory"><X size={28}/></button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-luxe border border-ivory/10"/>
        </div>
      )}
    </SiteShell>
  );
}
