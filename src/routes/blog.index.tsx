import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, ArrowRight, Eye, Heart } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { getCollectionData, getDocumentData } from "@/lib/firebase";

import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import clinic from "@/assets/clinic-interior.jpg";

import * as staticData from "@/lib/site-data";

const imageMap: Record<string, string> = { shirodhara, herbs, abhyanga, clinic };

function resolveImg(imgKey: string, defaultImg: string = herbs) {
  if (!imgKey) return defaultImg;
  if (imgKey.startsWith("http")) return imgKey;
  return imageMap[imgKey] || defaultImg;
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "मराठी आरोग्य ब्लॉग — Shree Vishvmaharshi Clinic" },
      { name: "description", content: "आयुर्वेद, पंचकर्म, योग, आहार आणि निरोगी जीवनशैलीवरील मराठी लेख." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>(staticData.blogPosts);
  const [categories, setCategories] = useState<string[]>(staticData.blogCategories);
  const [cat, setCat] = useState("सर्व");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollectionData("blogs");
        if (data.length > 0) {
          setBlogs(data);
          
          // Generate categories list dynamically
          const cats = ["सर्व", ...Array.from(new Set(data.map((item: any) => item.category)))];
          setCategories(cats);
        }

        const dbSeo = await getDocumentData("settings", "seo");
        if (dbSeo && dbSeo.blog) {
          setSeo(dbSeo.blog);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dynamic SEO application
  useEffect(() => {
    if (seo) {
      document.title = seo.title || "मराठी आरोग्य ब्लॉग";
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', seo.description || "");
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) keywordsMeta.setAttribute('content', seo.keywords || "");
    }
  }, [seo]);

  const featured = blogs.find((p) => p.featured) || blogs[0];
  const filtered = blogs.filter((p) =>
    (cat === "सर्व" || p.category === cat) &&
    (q === "" || 
      (p.title && p.title.toLowerCase().includes(q.toLowerCase())) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <SiteShell>
      <section className="pt-28 pb-12 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">मराठी ब्लॉग</span>
        <h1 className="font-devanagari font-serif text-5xl md:text-7xl mt-4 leading-tight font-bold">
          आरोग्याचे <em className="text-gradient-copper not-italic">शाश्वत ज्ञान</em>
        </h1>
        <SanskritDivider text="ज्ञानं परमं बलम्"/>
        <p className="max-w-2xl mx-auto px-6 text-charcoal/70 font-devanagari">
          आयुर्वेदिक जीवनशैली, पंचकर्म, आणि निरोगी आहारावरील सखोल लेख
        </p>
      </section>

      {/* Featured */}
      {featured && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 -mt-2 mb-16">
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="group grid lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden border border-border shadow-luxe">
            <div className="h-72 lg:h-full overflow-hidden">
              <img src={resolveImg(featured.image, shirodhara)} alt="" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="font-display text-xs tracking-[0.3em] text-saffron">FEATURED · वैशिष्ट्यपूर्ण</span>
              <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-sand text-copper font-devanagari w-fit">{featured.category}</span>
              <h2 className="font-devanagari font-serif text-3xl md:text-4xl mt-4 leading-snug group-hover:text-saffron transition font-bold">{featured.title}</h2>
              <p className="font-devanagari mt-4 text-charcoal/70 leading-relaxed text-sm">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-5 text-sm text-charcoal/60">
                <span className="flex items-center gap-1.5"><Calendar size={14}/> {featured.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14}/> {featured.readTime}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`font-devanagari px-4 py-2 rounded-full text-sm border transition ${cat===c?"bg-saffron text-ivory border-saffron":"bg-card text-charcoal/70 border-border hover:border-saffron"}`}>{c}</button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="लेख शोधा..." className="font-devanagari w-full pl-10 pr-4 py-2.5 rounded-full bg-card border border-border focus:outline-none focus:border-saffron"/>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        {loading ? (
          <div className="py-16 text-center text-charcoal/50">Fetching articles...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link to="/blog/$slug" params={{ slug: p.slug }} key={p.slug} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-luxe transition flex flex-col justify-between">
                <div>
                  <div className="h-52 overflow-hidden">
                    <img src={resolveImg(p.image, herbs)} alt="" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                  </div>
                  <div className="p-6">
                    <span className="font-devanagari text-xs px-2.5 py-1 rounded-full bg-sand text-copper font-medium">{p.category}</span>
                    <h3 className="font-devanagari font-serif text-xl mt-3 leading-snug group-hover:text-saffron transition font-bold">{p.title}</h3>
                    <p className="font-devanagari text-sm text-charcoal/65 mt-2 leading-relaxed line-clamp-2">{p.excerpt}</p>
                  </div>
                </div>
                <div className="mt-5 px-6 pb-6 flex items-center justify-between text-[11px] text-charcoal/50">
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-0.5"><Eye size={12}/>{p.views || 0}</span>
                    <span className="flex items-center gap-0.5"><Heart size={12} className="text-saffron fill-saffron"/>{p.likes || 0}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-saffron font-bold">वाचा <ArrowRight size={12}/></span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-charcoal/50 font-devanagari py-16">कोणतेही लेख सापडले नाहीत.</p>
        )}
      </section>
    </SiteShell>
  );
}
