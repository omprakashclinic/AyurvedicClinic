import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { treatments } from "@/lib/site-data";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import { ArrowRight } from "lucide-react";

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

export const Route = createFileRoute("/treatments/")({
  head: () => ({
    meta: [
      { title: "Panchakarma Treatments — Ayurveda Sanctuary" },
      { name: "description", content: "Authentic Panchakarma: Vamana, Virechana, Basti, Nasya, Shirodhara, Abhyanga, Pizhichil and more." },
    ],
  }),
  component: TreatmentsPage,
});

function TreatmentsPage() {
  return (
    <SiteShell>
      <section className="pt-32 pb-20 bg-gradient-warm text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <span className="font-display text-xs tracking-[0.3em] text-copper uppercase">सर्व चिकित्सा</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 font-bold tracking-tight">Our <em className="text-gradient-copper not-italic font-serif">Sacred Therapies</em></h1>
        <SanskritDivider text="पंचविध शोधन कर्म"/>
        <p className="max-w-2xl mx-auto px-6 text-charcoal/70 leading-relaxed text-base md:text-lg">
          Each therapy is hand-crafted to your unique mind-body constitution (Prakriti) under the careful guidance of our Vaidyas.
        </p>
      </section>

      <section className="py-24 mx-auto max-w-6xl px-6 lg:px-10 grid gap-16">
        {treatments.map((t, i) => {
          const imageSrc = imageMap[t.slug] || abhyanga;
          return (
            <article
              key={t.name}
              className={`grid lg:grid-cols-2 gap-10 items-center bg-card/60 backdrop-blur-sm border border-border/40 p-6 md:p-8 rounded-3xl shadow-luxe hover:shadow-hover hover:border-saffron/20 transition-all duration-500 ${
                i % 2 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] relative group">
                <img
                  src={imageSrc}
                  alt={t.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition duration-500" />
              </div>
              <div className="flex flex-col justify-center py-4">
                <div className="font-devanagari text-saffron text-2xl tracking-wide">{t.sanskrit}</div>
                <h2 className="font-serif text-3xl md:text-4xl mt-2 text-charcoal font-bold">{t.name}</h2>
                <SanskritDivider />
                <p className="text-charcoal/75 leading-relaxed text-sm md:text-base mt-2">{t.desc}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/treatments/$slug"
                    params={{ slug: t.slug }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-saffron text-ivory rounded-full shadow-md hover:-translate-y-0.5 hover:shadow-lg transition duration-300 font-serif font-bold text-sm"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-copper/30 hover:border-saffron text-copper hover:text-saffron rounded-full transition duration-300 font-serif font-bold text-sm bg-sand/30"
                  >
                    Quick Enquiry
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </SiteShell>
  );
}
