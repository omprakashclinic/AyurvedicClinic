import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Leaf, Flame, Droplet, Wind, Sparkles, ArrowRight, Star,
  ChevronDown, MapPin, Phone, MessageCircle, Play, Quote,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { treatments, conditions, journeySteps, testimonials, faqs, videos, blogPosts } from "@/lib/site-data";
import hero from "@/assets/hero-ayurveda.jpg";
import doctor from "@/assets/doctor.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import clinic from "@/assets/clinic-interior.jpg";
import mandala from "@/assets/mandala.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayurveda Sanctuary — Authentic Panchakarma in Pune" },
      { name: "description", content: "Personalised Panchakarma therapies rooted in ancient wisdom and modern healing. Restore balance through authentic Ayurveda." },
      { property: "og:title", content: "Ayurveda Sanctuary — Authentic Panchakarma" },
      { property: "og:description", content: "Personalised Panchakarma therapies rooted in ancient wisdom and modern healing." },
    ],
  }),
  component: Home,
});

const treatmentImages: Record<string, string> = {
  Shirodhara: shirodhara, Abhyanga: abhyanga, Pizhichil: abhyanga,
  Vamana: herbs, Virechana: herbs, Basti: shirodhara, Nasya: abhyanga,
  Raktamokshana: herbs, "Kati Basti": shirodhara, "Janu Basti": abhyanga,
};

function Home() {
  return (
    <SiteShell>
      <Hero />
      <AboutAyurveda />
      <Doctor />
      <Treatments />
      <Conditions />
      <Journey />
      <BlogPreview />
      <VideoCenter />
      <GalleryStrip />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </SiteShell>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      <img src={hero} alt="Ayurvedic Panchakarma treatment room" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1280}/>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/45 to-charcoal/85" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-20 min-h-[100vh] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-ivory">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-saffron"/>
            <span className="font-devanagari text-sm tracking-wider text-saffron">आयुर्वेद · पंचकर्म · आरोग्य</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-7">
            Restore Balance Through <em className="text-gradient-copper not-italic font-medium">Authentic Ayurveda</em>
          </h1>
          <p className="text-lg md:text-xl text-ivory/85 max-w-2xl leading-relaxed mb-9">
            Personalised Panchakarma therapies rooted in five-thousand-year-old wisdom — delivered in a heritage sanctuary built for deep healing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="group inline-flex items-center gap-2 px-7 py-4 bg-gradient-saffron text-ivory rounded-full font-medium shadow-luxe hover:scale-[1.02] transition">
              Book Consultation <ArrowRight size={18} className="group-hover:translate-x-1 transition"/>
            </Link>
            <Link to="/treatments" className="inline-flex items-center gap-2 px-7 py-4 border border-ivory/30 text-ivory rounded-full font-medium hover:bg-ivory hover:text-charcoal transition">
              Explore Treatments
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-ivory/80">
            {[["25+","Years of Lineage"],["10K+","Lives Restored"],["50+","Authentic Therapies"]].map(([n,l])=>(
              <div key={l}>
                <div className="font-serif text-3xl text-saffron">{n}</div>
                <div className="text-xs uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ivory/60 animate-bounce"><ChevronDown/></div>
    </section>
  );
}

function AboutAyurveda() {
  const pillars = [
    { icon: Leaf, title: "Holistic Healing", desc: "Body, mind and spirit treated as one indivisible whole." },
    { icon: Flame, title: "Agni Balance", desc: "Reigniting your digestive fire — the seat of all wellness." },
    { icon: Droplet, title: "Dosha Harmony", desc: "Calibrating Vata, Pitta & Kapha to your unique prakriti." },
    { icon: Wind, title: "Natural Wisdom", desc: "Pure herbs, oils and rituals — nothing synthetic." },
  ];
  return (
    <section className="relative py-28 bg-gradient-warm overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] opacity-[0.06] animate-mandala-spin pointer-events-none"/>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-display text-xs tracking-[0.3em] text-copper">THE PHILOSOPHY</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-4 leading-tight">The Science of <em className="text-gradient-copper not-italic">Life Itself</em></h2>
          <SanskritDivider text="आयुः वेदः इति आयुर्वेदः"/>
          <p className="text-lg text-charcoal/75 leading-relaxed">
            Ayurveda is not a treatment of disease — it is the cultivation of life. For over five millennia, this living tradition has guided seekers toward equilibrium of body, breath and being. We honour that lineage in every ritual we offer.
          </p>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group bg-card p-8 rounded-2xl border border-border hover:border-saffron/40 hover:shadow-luxe transition-all">
              <div className="h-14 w-14 rounded-xl bg-gradient-saffron grid place-items-center text-ivory mb-5 group-hover:scale-110 transition">
                <p.icon size={22}/>
              </div>
              <h3 className="font-serif text-2xl mb-2">{p.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Doctor() {
  return (
    <section className="py-28 bg-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-40 top-1/2 -translate-y-1/2 w-[550px] opacity-[0.05] animate-mandala-spin pointer-events-none"/>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="absolute -inset-6 bg-gradient-saffron rounded-[2rem] opacity-20 blur-2xl"/>
          <div className="relative rounded-[2rem] overflow-hidden shadow-luxe">
            <img src={doctor} alt="Vaidya Aditya Sharma" className="w-full h-[640px] object-cover" loading="lazy" width={1024} height={1280}/>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl px-6 py-5 shadow-luxe">
            <div className="font-serif text-3xl text-saffron">25+</div>
            <div className="text-xs uppercase tracking-widest text-charcoal/60">Years Practising</div>
          </div>
        </motion.div>

        <div>
          <span className="font-display text-xs tracking-[0.3em] text-copper">MEET THE VAIDYA</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Vaidya <em className="text-gradient-copper not-italic">Aditya Sharma</em></h2>
          <p className="font-devanagari text-copper mt-2">वैद्य आदित्य शर्मा · BAMS, MD (Panchakarma)</p>
          <SanskritDivider/>
          <p className="text-charcoal/75 leading-relaxed mb-6">
            A third-generation Vaidya trained in the Keralite Ashtavaidya tradition, Dr. Sharma has guided over ten thousand patients back to balance — from chronic auto-immune conditions to lifestyle disorders rooted in modern stress.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["Specialisation", "Panchakarma · Nadi Pariksha · Chronic Care"],
              ["Education", "BAMS, MD — Pune University · Gold Medalist"],
              ["Lineage", "Ashtavaidya Kerala Tradition"],
              ["Philosophy", "Treat the patient, not the disease"],
            ].map(([k,v])=>(
              <div key={k} className="border-l-2 border-saffron pl-4">
                <div className="text-xs uppercase tracking-widest text-copper">{k}</div>
                <div className="text-sm mt-1 text-charcoal/80">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section className="py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-xs tracking-[0.3em] text-copper">SACRED THERAPIES</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-4">Panchakarma <em className="text-gradient-copper not-italic">Treatments</em></h2>
          <SanskritDivider text="पंचविध शोधन कर्म"/>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t, i) => (
            <motion.article key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-luxe transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img src={treatmentImages[t.name] ?? abhyanga} alt={t.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover group-hover:scale-110 transition duration-700"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent"/>
                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-ivory">
                    <div>
                      <div className="font-devanagari text-saffron text-lg">{t.sanskrit}</div>
                      <h3 className="font-serif text-2xl">{t.name}</h3>
                    </div>
                    <Sparkles className="text-saffron" size={20}/>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-charcoal/70 leading-relaxed">{t.desc}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <Link to="/treatments/$slug" params={{ slug: t.slug }} className="inline-flex items-center gap-1 text-sm font-medium text-saffron hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14}/>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Conditions() {
  return (
    <section className="py-28 bg-forest text-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-40 -bottom-40 w-[700px] opacity-[0.08] animate-mandala-spin pointer-events-none"/>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-14 items-start">
          <div>
            <span className="font-display text-xs tracking-[0.3em] text-saffron">CONDITIONS WE TREAT</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Where modern medicine leaves off, <em className="text-saffron not-italic">Ayurveda begins</em></h2>
            <p className="mt-6 text-ivory/75 leading-relaxed">From chronic conditions to subtle imbalances, our protocols address root causes — not just symptoms.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {conditions.map((c) => (
              <div key={c} className="group flex items-center gap-3 p-4 rounded-xl border border-ivory/15 bg-ivory/5 hover:bg-saffron hover:border-saffron transition-all">
                <Leaf size={18} className="text-saffron group-hover:text-ivory"/>
                <span className="font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="py-28 bg-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-48 -bottom-48 w-[500px] opacity-[0.04] animate-mandala-spin pointer-events-none"/>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-display text-xs tracking-[0.3em] text-copper">WELLNESS JOURNEY</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-4">Your Path to <em className="text-gradient-copper not-italic">Balance</em></h2>
          <SanskritDivider text="आरोग्य यात्रा"/>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper to-transparent"/>
          <div className="grid gap-10 lg:grid-cols-6">
            {journeySteps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} className="relative text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-saffron grid place-items-center text-ivory shadow-luxe relative z-10">
                  <span className="font-display text-xl">{s.step}</span>
                </div>
                <div className="font-devanagari text-copper text-sm mt-4">{s.sanskrit}</div>
                <h3 className="font-serif text-xl mt-1">{s.title}</h3>
                <p className="text-xs text-charcoal/65 mt-2 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const blogImages: Record<string, string> = { shirodhara, herbs, abhyanga, clinic };
  return (
    <section className="py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <span className="font-display text-xs tracking-[0.3em] text-copper">मराठी ब्लॉग</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">Wisdom in <em className="text-gradient-copper not-italic font-devanagari">मराठी</em></h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-saffron font-medium">Read all articles <ArrowRight size={16}/></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link to="/blog/$slug" params={{ slug: post.slug }} key={post.slug} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-luxe transition flex flex-col justify-between">
              <div>
                <img src={blogImages[post.image] ?? herbs} alt="" loading="lazy" width={1024} height={1024} className="h-52 w-full object-cover group-hover:scale-105 transition duration-700"/>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-widest text-copper font-devanagari">{post.category}</span>
                  <h3 className="font-devanagari font-serif text-xl mt-2 leading-snug group-hover:text-saffron transition">
                    {post.title}
                  </h3>
                  <p className="font-devanagari text-xs text-charcoal/60 mt-2 line-clamp-2">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0 text-xs text-charcoal/50 flex justify-between items-center">
                <span>{post.date}</span>
                <span className="text-saffron font-medium">Read article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCenter() {
  return (
    <section className="py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-display text-xs tracking-[0.3em] text-copper">VIDEO KNOWLEDGE</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Learn from the <em className="text-gradient-copper not-italic">Vaidya</em></h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v, i) => (
            <div key={v.title} className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-charcoal">
                <img src={[shirodhara, abhyanga, clinic, herbs][i]} alt={v.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"/>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-14 w-14 rounded-full bg-saffron/90 grid place-items-center text-ivory group-hover:scale-110 transition">
                    <Play size={22} fill="currentColor"/>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-charcoal/80 text-ivory">{v.duration}</div>
              </div>
              <h3 className="font-serif text-lg mt-3 group-hover:text-saffron transition">{v.title}</h3>
              <p className="text-xs text-charcoal/55 mt-1">{v.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  const imgs = [clinic, shirodhara, herbs, abhyanga, clinic];
  return (
    <section className="py-28 bg-sand">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <span className="font-display text-xs tracking-[0.3em] text-copper">SANCTUARY</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">Inside our <em className="text-gradient-copper not-italic">heritage clinic</em></h2>
          </div>
          <Link to="/gallery" className="text-saffron font-medium inline-flex items-center gap-2">Full gallery <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {imgs.map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl ${i===0?"col-span-2 row-span-2 md:row-span-1":""}`}>
              <img src={src} alt="" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover aspect-square hover:scale-110 transition duration-700"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  return (
    <section className="py-28 bg-charcoal text-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -left-40 -top-40 w-[600px] opacity-[0.06] animate-mandala-spin"/>
      <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
        <span className="font-display text-xs tracking-[0.3em] text-saffron">PATIENT STORIES</span>
        <h2 className="font-serif text-4xl md:text-5xl mt-3 mb-12">What they whisper, <em className="text-saffron not-italic">we hold dear</em></h2>
        <Quote className="mx-auto text-saffron mb-6" size={42}/>
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-2xl md:text-3xl font-serif leading-relaxed italic text-ivory/95">"{t.review}"</p>
          <div className="flex justify-center gap-1 mt-6 text-saffron">{Array.from({length:t.rating}).map((_,k)=><Star key={k} size={16} fill="currentColor"/>)}</div>
          <div className="mt-4 font-serif text-xl">{t.name}</div>
          <div className="text-sm text-ivory/60">{t.location}</div>
        </motion.div>
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k===i?"w-10 bg-saffron":"w-2 bg-ivory/30"}`}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-28 bg-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -left-48 -bottom-48 w-[500px] opacity-[0.04] animate-mandala-spin pointer-events-none"/>
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="font-display text-xs tracking-[0.3em] text-copper">QUESTIONS</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Frequently <em className="text-gradient-copper not-italic">Asked</em></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
              <button onClick={() => setOpen(open===i?null:i)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                <span className="font-serif text-lg">{f.q}</span>
                <ChevronDown className={`transition-transform shrink-0 ml-4 ${open===i?"rotate-180 text-saffron":""}`}/>
              </button>
              {open===i && (
                <div className="px-6 pb-5 text-charcoal/70 leading-relaxed animate-fade-up">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section id="contact" className="py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="font-display text-xs tracking-[0.3em] text-copper">BEGIN YOUR JOURNEY</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">Book your <em className="text-gradient-copper not-italic">consultation</em></h2>
          <p className="mt-5 text-charcoal/75 leading-relaxed max-w-md">A 45-minute conversation with our Vaidya to map your constitution and chart the way forward.</p>
          <div className="mt-8 space-y-4 text-charcoal/80">
            <div className="flex items-center gap-3"><MapPin className="text-saffron"/> Heritage Wellness Lane, Koregaon Park, Pune</div>
            <div className="flex items-center gap-3"><Phone className="text-saffron"/> +91 98765 43210</div>
            <a href="https://wa.me/919876543210" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-forest text-ivory rounded-full hover:opacity-90 transition">
              <MessageCircle size={18}/> Chat on WhatsApp
            </a>
          </div>
          <div className="mt-8 aspect-video rounded-2xl overflow-hidden border border-border bg-card grid place-items-center text-charcoal/40">
            <MapPin size={42}/> <span className="ml-3">Google Maps placeholder</span>
          </div>
        </div>

        <form className="bg-card p-8 rounded-2xl border border-border shadow-soft space-y-5">
          {[
            { label: "Full Name", type: "text", ph: "Your name" },
            { label: "Phone", type: "tel", ph: "+91" },
            { label: "Email", type: "email", ph: "you@example.com" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs uppercase tracking-widest text-copper">{f.label}</label>
              <input type={f.type} placeholder={f.ph} className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron transition"/>
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Concern</label>
            <select className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron">
              <option>General Consultation</option>
              {conditions.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Message</label>
            <textarea rows={4} placeholder="Briefly describe your concern..." className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron resize-none"/>
          </div>
          <button type="submit" className="w-full px-6 py-4 bg-gradient-saffron text-ivory rounded-full font-medium shadow-soft hover:opacity-95 transition">
            Request Appointment
          </button>
          <p className="text-xs text-charcoal/55 text-center">Our team will reach you within 12 hours.</p>
        </form>
      </div>
    </section>
  );
}
