import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { blogPosts, blogCategories } from "@/lib/site-data";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import clinic from "@/assets/clinic-interior.jpg";

const imageMap: Record<string, string> = { shirodhara, herbs, abhyanga, clinic };

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "मराठी आरोग्य ब्लॉग — Ayurveda Sanctuary" },
      { name: "description", content: "आयुर्वेद, पंचकर्म, योग, आहार आणि निरोगी जीवनशैलीवरील मराठी लेख." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [cat, setCat] = useState("सर्व");
  const [q, setQ] = useState("");
  const featured = blogPosts.find((p) => p.featured)!;
  const filtered = blogPosts.filter((p) =>
    (cat === "सर्व" || p.category === cat) &&
    (q === "" || p.title.includes(q))
  );

  return (
    <SiteShell>
      <section className="pt-28 pb-12 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">मराठी ब्लॉग</span>
        <h1 className="font-devanagari font-serif text-5xl md:text-7xl mt-4 leading-tight">
          आरोग्याचे <em className="text-gradient-copper not-italic">शाश्वत ज्ञान</em>
        </h1>
        <SanskritDivider text="ज्ञानं परमं बलम्"/>
        <p className="max-w-2xl mx-auto px-6 text-charcoal/70 font-devanagari">
          आयुर्वेदिक जीवनशैली, पंचकर्म, आणि निरोगी आहारावरील सखोल लेख
        </p>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 -mt-2 mb-16">
        <Link to="/blog/$slug" params={{ slug: featured.slug }} className="group grid lg:grid-cols-2 gap-8 bg-card rounded-3xl overflow-hidden border border-border shadow-luxe">
          <div className="h-72 lg:h-full overflow-hidden">
            <img src={imageMap[featured.image]} alt="" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-105 transition duration-700"/>
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <span className="font-display text-xs tracking-[0.3em] text-saffron">FEATURED · वैशिष्ट्यपूर्ण</span>
            <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-sand text-copper font-devanagari w-fit">{featured.category}</span>
            <h2 className="font-devanagari font-serif text-3xl md:text-4xl mt-4 leading-snug group-hover:text-saffron transition">{featured.title}</h2>
            <p className="font-devanagari mt-4 text-charcoal/70 leading-relaxed">{featured.excerpt}</p>
            <div className="mt-6 flex items-center gap-5 text-sm text-charcoal/60">
              <span className="flex items-center gap-1.5"><Calendar size={14}/> {featured.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={14}/> {featured.readTime}</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((c) => (
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link to="/blog/$slug" params={{ slug: p.slug }} key={p.slug} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-luxe transition">
              <div className="h-52 overflow-hidden">
                <img src={imageMap[p.image]} alt="" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
              </div>
              <div className="p-6">
                <span className="font-devanagari text-xs px-2.5 py-1 rounded-full bg-sand text-copper">{p.category}</span>
                <h3 className="font-devanagari font-serif text-xl mt-3 leading-snug group-hover:text-saffron transition">{p.title}</h3>
                <p className="font-devanagari text-sm text-charcoal/65 mt-2 leading-relaxed line-clamp-2">{p.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-charcoal/55">
                  <span>{p.date}</span>
                  <span className="inline-flex items-center gap-1 text-saffron">वाचा <ArrowRight size={12}/></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-charcoal/50 font-devanagari py-16">कोणतेही लेख सापडले नाहीत.</p>
        )}
      </section>
    </SiteShell>
  );
}
