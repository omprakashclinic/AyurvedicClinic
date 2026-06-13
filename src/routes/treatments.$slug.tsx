import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Sparkles, MessageCircle, CalendarCheck, HelpCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { getDocumentData } from "@/lib/firebase";

import abhyanga from "@/assets/treatment-abhyanga.jpg";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";

import * as staticData from "@/lib/site-data";

const imageMap: Record<string, string> = {
  vamana: herbs,
  virechana: herbs,
  basti: abhyanga,
  nasya: shirodhara,
  raktamokshana: herbs,
  shirodhara: shirodhara,
  abhyanga: abhyanga,
  pizhichil: abhyanga,
  "kati-basti": abhyanga,
  "janu-basti": abhyanga,
};

function resolveImg(imgKey: string, defaultImg: string = abhyanga) {
  if (!imgKey) return defaultImg;
  if (imgKey.startsWith("http")) return imgKey;
  return imageMap[imgKey] || defaultImg;
}

export const Route = createFileRoute("/treatments/$slug")({
  component: TreatmentDetail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="py-32 text-center font-serif text-2xl text-charcoal">
        Therapy not found.
      </div>
    </SiteShell>
  ),
});

function TreatmentDetail() {
  const { slug } = Route.useParams();
  const [treatment, setTreatment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDocumentData("treatments", slug);
        if (data) {
          setTreatment(data);
        } else {
          // Check static data as fallback
          const staticT = staticData.treatments.find(t => t.slug === slug);
          if (staticT) setTreatment(staticT);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Update dynamic SEO title and meta description
  useEffect(() => {
    if (treatment) {
      document.title = `${treatment.name} Treatment — Shree Vishvmaharshi Clinic`;
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', treatment.desc || "");
    }
  }, [treatment]);

  if (loading) {
    return (
      <SiteShell>
        <div className="py-32 text-center font-serif text-xl text-charcoal/50">Loading therapy details...</div>
      </SiteShell>
    );
  }

  if (!treatment) throw notFound();

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <SiteShell>
      <article className="min-h-screen bg-sand/30 pb-24">
        {/* Hero Banner */}
        <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
          <img
            src={resolveImg(treatment.image || treatment.slug)}
            alt={treatment.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-charcoal/20" />
          <div className="relative h-full mx-auto max-w-5xl px-6 lg:px-10 flex flex-col justify-end pb-12 text-ivory">
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 text-ivory/80 hover:text-saffron mb-6 w-fit transition-all duration-300 transform hover:-translate-x-1"
            >
              <ArrowLeft size={16} /> <span>All Treatments</span>
            </Link>
            <span className="font-devanagari text-2xl text-saffron tracking-wide">
              {treatment.sanskrit}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl mt-2 leading-tight font-bold tracking-tight">
              {treatment.name}
            </h1>
            <p className="max-w-2xl text-ivory/80 mt-3 text-sm md:text-base leading-relaxed">
              {treatment.desc}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-5xl px-6 lg:px-10 py-16 grid gap-10 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-luxe hover:shadow-hover transition duration-500">
              <h2 className="font-serif text-2xl text-charcoal mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-saffron" /> Overview
              </h2>
              <p className="text-charcoal/80 leading-relaxed text-base">
                {treatment.overview}
              </p>
            </div>

            {/* Indications & Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {treatment.indications && treatment.indications.length > 0 && (
                <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-luxe">
                  <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2 font-bold">
                    ✨ Indications
                  </h3>
                  <ul className="space-y-3">
                    {treatment.indications.map((ind: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm text-charcoal/75">
                        <span className="text-saffron shrink-0 font-bold">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {treatment.benefits && treatment.benefits.length > 0 && (
                <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-luxe">
                  <h3 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2 font-bold">
                    🌿 Benefits
                  </h3>
                  <ul className="space-y-3">
                    {treatment.benefits.map((ben: string, idx: number) => (
                      <li key={idx} className="flex gap-2.5 text-sm text-charcoal/75">
                        <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Treatment Process */}
            {treatment.process && treatment.process.length > 0 && (
              <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-luxe">
                <h3 className="font-serif text-2xl text-charcoal mb-8 font-bold">
                  Our Tailored Treatment Process
                </h3>
                <div className="relative pl-8 border-l-2 border-saffron/30 space-y-8 py-2 ml-4">
                  {treatment.process.map((step: any, idx: number) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[45px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sand text-copper border-2 border-saffron font-serif text-sm font-bold shadow-md group-hover:bg-saffron group-hover:text-ivory transition duration-300">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-lg font-serif text-charcoal font-bold">
                          {step.step}
                        </h4>
                        <p className="text-sm text-charcoal/70 leading-relaxed mt-1">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {treatment.faqs && treatment.faqs.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-2 font-bold">
                  <HelpCircle size={22} className="text-saffron" /> Frequently Asked Questions
                </h3>
                <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-luxe space-y-3">
                  {treatment.faqs.map((faq: any, idx: number) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="border-b last:border-b-0 border-border/50 pb-3 last:pb-0">
                        <button
                          onClick={() => toggleFaq(idx)}
                          className="w-full text-left py-3 flex justify-between items-center text-charcoal font-serif hover:text-saffron transition"
                        >
                          <span className="font-medium text-sm md:text-base font-bold">{faq.q}</span>
                          <span className="text-saffron font-bold text-lg">{isOpen ? "−" : "+"}</span>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? "max-h-40 py-2" : ""}`}
                        >
                          <p className="text-sm text-charcoal/70 leading-relaxed pl-2">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Side Form/Booking Card */}
          <aside className="space-y-6">
            <div className="sticky top-28 bg-gradient-to-b from-copper via-copper/90 to-charcoal text-ivory rounded-3xl p-8 shadow-xl relative overflow-hidden border border-copper/20">
              <div className="absolute inset-0 bg-dot-pattern opacity-10" />
              <h3 className="font-serif text-2xl mb-4 font-bold">Schedule an Appointment</h3>
              <p className="text-xs text-ivory/80 leading-relaxed mb-6">
                Consult with Dr. Omprakash Tikhe to customize this therapy according to your specific body constitution (Prakriti).
              </p>
              
              <div className="space-y-4">
                <a
                  href={`https://wa.me/918485019880?text=${encodeURIComponent(`Hello Dr. Omprakash Tikhe, I would like to book an appointment for the ${treatment.name} treatment.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-saffron hover:bg-saffron/90 text-ivory rounded-full font-serif font-bold text-sm shadow-md hover:-translate-y-0.5 transition duration-300"
                >
                  <CalendarCheck size={16} /> Book Appointment
                </a>
                
                <a
                  href="https://wa.me/918485019880"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-forest hover:bg-forest/90 text-ivory rounded-full font-serif font-bold text-sm shadow-md hover:-translate-y-0.5 transition duration-300"
                >
                  <MessageCircle size={16} /> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}
