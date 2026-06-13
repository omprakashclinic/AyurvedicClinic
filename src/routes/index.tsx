import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Leaf, Flame, Droplet, Wind, Sparkles, ArrowRight, Star,
  ChevronDown, MapPin, Phone, MessageCircle, Play, Mail, CheckCircle2, ShieldCheck, X, Check
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { getCollectionData, getDocumentData, addDocument } from "@/lib/firebase";

import hero from "@/assets/hero-ayurveda.jpg";
import doctor from "@/assets/doctor.jpg";
import abhyanga from "@/assets/treatment-abhyanga.jpg";
import shirodhara from "@/assets/treatment-shirodhara.jpg";
import herbs from "@/assets/herbs.jpg";
import clinic from "@/assets/clinic-interior.jpg";
import mandala from "@/assets/mandala.png";
import spine from "@/assets/spine.png";
import monsoonOffer from "@/assets/monsoon_offer.png";
import spineCamp from "@/assets/spine_camp.png";
import swarnaprashan from "@/assets/swarnaprashan.png";

// Load static fallbacks in case Firestore is loading or empty
import * as staticData from "@/lib/site-data";
import { getYouTubeId } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shree Vishvmaharshi Clinic — Speciality Panchkarma in Pune" },
      { name: "description", content: "Dr. Omprakash Tikhe offers authentic Panchakarma & specialized spine alignment treatments in Pune." },
    ],
  }),
  component: Home,
});

const staticImageMap: Record<string, string> = {
  Shirodhara: shirodhara, shirodhara: shirodhara,
  Abhyanga: abhyanga, abhyanga: abhyanga,
  Pizhichil: abhyanga, pizhichil: abhyanga,
  Vamana: herbs, vamana: herbs,
  Virechana: herbs, virechana: herbs,
  Basti: shirodhara, basti: shirodhara,
  Nasya: abhyanga, nasya: abhyanga,
  Raktamokshana: herbs, raktamokshana: herbs,
  "Kati Basti": shirodhara, "kati-basti": shirodhara,
  "Janu Basti": abhyanga, "janu-basti": abhyanga,
  clinic: clinic,
  herbs: herbs,
  monsoon_offer: monsoonOffer,
  spine_camp: spineCamp,
  swarnaprashan: swarnaprashan
};

function resolveImg(imgKey: string, defaultImg: string = abhyanga) {
  if (!imgKey) return defaultImg;
  if (imgKey.startsWith("http")) return imgKey;
  return staticImageMap[imgKey] || defaultImg;
}

const staticPosters = [
  {
    id: "monsoon_offer",
    title: "Monsoon Rejuvenation Offer",
    description: "Rebalance your doshas and revitalize your body with 20% off on detox packages including Abhyanga, Swedana, and Shirodhara.",
    imageUrl: "monsoon_offer",
    tag: "Offer",
    link: "",
    status: "Active"
  },
  {
    id: "spine_camp",
    title: "Free Spinal Alignment Camp",
    description: "Get your posture assessed and natural spine curvature restored. Book a free checkup slot with Dr. Omprakash Tikhe.",
    imageUrl: "spine_camp",
    tag: "Camp",
    link: "",
    status: "Active"
  },
  {
    id: "swarnaprashan",
    title: "Swarnaprashan Sanskar Event",
    description: "Boost your child's immunity, memory, and cognitive growth naturally with traditional Ayurvedic gold and honey drops.",
    imageUrl: "swarnaprashan",
    tag: "Event",
    link: "",
    status: "Active"
  }
];

function Home() {
  const [treatments, setTreatments] = useState<any[]>(staticData.treatments);
  const [blogs, setBlogs] = useState<any[]>(staticData.blogPosts);
  const [gallery, setGallery] = useState<any[]>(staticData.galleryItems);
  const [testimonials, setTestimonials] = useState<any[]>(staticData.testimonials);
  const [videos, setVideos] = useState<any[]>([]);
  const [seo, setSeo] = useState<any>(null);
  const [clinicSettings, setClinicSettings] = useState<any>(null);
  const [posters, setPosters] = useState<any[]>(staticPosters);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const dbTreatments = await getCollectionData("treatments");
        if (dbTreatments.length > 0) setTreatments(dbTreatments);

        const dbBlogs = await getCollectionData("blogs");
        if (dbBlogs.length > 0) setBlogs(dbBlogs);

        const dbGallery = await getCollectionData("gallery");
        if (dbGallery.length > 0) setGallery(dbGallery);

        const dbTestimonials = await getCollectionData("testimonials");
        if (dbTestimonials.length > 0) setTestimonials(dbTestimonials);

        const dbVideos = await getCollectionData("videos");
        if (dbVideos.length > 0) setVideos(dbVideos);

        const dbSeoSettings = await getDocumentData("settings", "seo");
        if (dbSeoSettings && dbSeoSettings.home) {
          setSeo(dbSeoSettings.home);
        }

        const dbClinicSettings = await getDocumentData("settings", "clinic");
        if (dbClinicSettings) setClinicSettings(dbClinicSettings);

        const dbPosters = await getCollectionData("posters");
        if (dbPosters.length > 0) {
          const activePosters = dbPosters
            .filter((p: any) => p.status === "Active")
            .sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
            .slice(0, 3);
          setPosters(activePosters);
        }
      } catch (err) {
        console.error("Failed to load home page content from Firestore:", err);
      }
    }
    loadData();
  }, []);

  // Popup trigger logic
  useEffect(() => {
    const hasSubmitted = localStorage.getItem("has_submitted_callback");
    if (hasSubmitted !== "true") {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Re-trigger popup logic if closed without submitting
  const handleClosePopup = () => {
    setShowPopup(false);
    setTimeout(() => {
      const hasSubmitted = localStorage.getItem("has_submitted_callback");
      if (hasSubmitted !== "true") {
        setShowPopup(true);
      }
    }, 60000); // 60 seconds
  };

  // Update DOM Title and Meta for Dynamic SEO
  useEffect(() => {
    if (seo) {
      document.title = seo.title || "Shree Vishvmaharshi Clinic";
      let descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', seo.description || "");
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) keywordsMeta.setAttribute('content', seo.keywords || "");
    }
  }, [seo]);

  return (
    <SiteShell>
      <Hero />
      <Promotions posters={posters} />
      <AboutAyurveda />
      <Doctor settings={clinicSettings} />
      <TreatmentsSection treatments={treatments} />
      <Conditions />
      <Journey />
      <BlogPreview blogs={blogs} />
      <VideoCenter videos={videos} />
      <GalleryStrip gallery={gallery} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQ />
      <ContactCTA settings={clinicSettings} />

      {/* Callback Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <CallbackModal 
            onClose={handleClosePopup} 
            onSubmitSuccess={() => {
              localStorage.setItem("has_submitted_callback", "true");
              setShowPopup(false);
            }}
          />
        )}
      </AnimatePresence>
    </SiteShell>
  );
}

function CallbackModal({ onClose, onSubmitSuccess }: { onClose: () => void; onSubmitSuccess: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      await addDocument("callback_requests", {
        name,
        phone,
        status: "Pending",
        requestedAt: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
        timestamp: Date.now()
      });
      setSuccess(true);
      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-luxe space-y-6"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal p-2 rounded-lg"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 bg-forest/15 text-forest rounded-full grid place-items-center mx-auto text-3xl font-bold">✓</div>
            <h3 className="font-serif text-2xl font-bold">Request Logged</h3>
            <p className="text-sm text-charcoal/60">Our team will call you back shortly. Thank you!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-gradient-saffron grid place-items-center text-ivory font-display text-lg mx-auto">ॐ</div>
              <h2 className="font-serif text-2xl font-bold text-charcoal">Get a Quick Callback</h2>
              <p className="text-xs text-charcoal/60 leading-relaxed">Enter your details below and our Ayurvedic specialists will contact you to discuss your health concerns.</p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Your Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name" 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Phone Number</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 084850 19880" 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
              />
            </div>

            <button 
              disabled={submitting}
              type="submit" 
              className="w-full py-3.5 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50 mt-6"
            >
              {submitting ? "Requesting Call..." : "Request Free Callback"}
            </button>
            <p className="text-[10px] text-center text-charcoal/50">Your privacy is respected. No spam guaranteed.</p>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      <img src={hero} alt="Ayurvedic Panchakarma treatment room" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1280}/>
      {/* Dark left-to-right gradient to cover the left side behind text block */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-transparent" />
      {/* Top and bottom shade gradients for vertical balance */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/80" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-20 min-h-[100vh] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-ivory">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-saffron"/>
            <span className="font-devanagari text-sm tracking-wider text-saffron">आयुर्वेद · पंचकर्म · आरोग्य</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-7 drop-shadow-md">
            Restore Balance Through <em className="text-gradient-copper not-italic font-medium">Authentic Ayurveda</em>
          </h1>
          <p className="text-lg md:text-xl text-ivory/95 max-w-2xl leading-relaxed mb-9 drop-shadow-sm">
            Personalised Panchakarma and specialized alignment therapies under the guidance of Dr. Omprakash Tikhe (BAMS, MD) in Pune.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="https://wa.me/918485019880?text=Hello%20Dr.%20Omprakash%20Tikhe%2C%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20consultation." target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 px-7 py-4 bg-gradient-saffron text-ivory rounded-full font-medium shadow-luxe hover:scale-[1.02] transition">
              Book Consultation <ArrowRight size={18} className="group-hover:translate-x-1 transition"/>
            </a>
            <Link to="/treatments" className="inline-flex items-center gap-2 px-7 py-4 border border-ivory/30 text-ivory rounded-full font-medium hover:bg-ivory hover:text-charcoal transition">
              Explore Treatments
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 text-ivory/90">
            {[["7+","Years of Practice"],["5K+","Happy Recoveries"],["30+","Speciality Therapies"]].map(([n,l])=>(
              <div key={l} className="drop-shadow-sm">
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

interface PromotionsProps {
  posters: any[];
}

function Promotions({ posters }: PromotionsProps) {
  if (!posters || posters.length === 0) return null;

  return (
    <section className="py-20 bg-ivory relative overflow-hidden border-b border-border/40">
      <img src={mandala} alt="" aria-hidden className="absolute -right-48 top-1/2 -translate-y-1/2 w-[500px] opacity-[0.03] animate-mandala-spin pointer-events-none"/>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-display text-xs tracking-[0.3em] text-copper uppercase">LATEST NEWS & OFFERS</span>
          <h2 className="font-serif text-3.5xl md:text-5xl mt-3 leading-tight">Announcements & <em className="text-gradient-copper not-italic">Special Events</em></h2>
          <SanskritDivider text="सूचना आणि घोषणा"/>
        </div>

        <div className={`grid gap-8 justify-center ${
          posters.length === 1 
            ? "max-w-xl mx-auto grid-cols-1" 
            : posters.length === 2 
            ? "max-w-4xl mx-auto md:grid-cols-2" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {posters.map((p, i) => {
            const waText = encodeURIComponent(`Hello Dr. Omprakash Tikhe, I am interested in the "${p.title}" ${p.tag || "announcement"} I saw on your website. Please share more details.`);
            const waLink = `https://wa.me/918485019880?text=${waText}`;
            const actionLink = p.link || waLink;
            
            return (
              <motion.article 
                key={p.id || i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="group relative bg-card border border-border rounded-[2rem] overflow-hidden hover:shadow-luxe hover:border-saffron/40 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/10 border-b border-border/60">
                  <img 
                    src={resolveImg(p.imageUrl, herbs)} 
                    alt={p.title} 
                    loading="lazy" 
                    width={800} 
                    height={1000} 
                    className="h-full w-full object-contain bg-sand/15 transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] tracking-widest uppercase font-bold px-3 py-1 bg-saffron text-ivory rounded-full shadow-soft">
                      {p.tag || "Announcement"}
                    </span>
                  </div>
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-charcoal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 mb-5">
                    <h3 className="font-serif text-xl font-bold text-charcoal line-clamp-2 leading-snug group-hover:text-saffron transition-colors duration-300">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    )}
                  </div>
                  
                  <a 
                    href={actionLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-card border border-border text-charcoal group-hover:bg-saffron group-hover:text-ivory group-hover:border-saffron rounded-full text-xs font-bold shadow-soft transition-all duration-300"
                  >
                    <span>Enquire Now</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
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
            Ayurveda is not a treatment of disease — it is the cultivation of life. Shree Vishvmaharshi clinic offers a dedicated pathway to recover balance and vitality.
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

function Doctor({ settings }: { settings?: any }) {
  const doctorName = settings?.doctor || "Dr. Omprakash Tikhe";
  const cleanName = doctorName.replace(/^Dr\.\s*/i, "");
  const qualifications = settings?.qualifications || "BAMS, MD (Ayurveda Speciality)";
  const experienceYears = settings?.experienceYears || "7+";
  const experience = settings?.experience || "7+ Years in Speciality Ayurveda";
  const specialisation = settings?.specialisation || "Panchakarma · Nadi Pariksha · Chronic Care";
  const expertise = settings?.expertise || "Basti, Agnikarma, Dorn Therapy, Structural Integra";
  const philosophy = settings?.philosophy || "Holistic rejuvenation of physical structures and doshas";
  const doctorImgSrc = settings?.doctorImage || doctor;

  return (
    <section className="py-28 bg-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-40 top-1/2 -translate-y-1/2 w-[550px] opacity-[0.05] animate-mandala-spin pointer-events-none"/>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="absolute -inset-6 bg-gradient-saffron rounded-[2rem] opacity-20 blur-2xl"/>
          <div className="relative rounded-[2rem] overflow-hidden shadow-luxe border border-border">
            <img src={doctorImgSrc} alt={doctorName} className="w-full h-[640px] object-cover" loading="lazy" width={1024} height={1280}/>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl px-6 py-5 shadow-luxe">
            <div className="font-serif text-3xl text-saffron">{experienceYears}</div>
            <div className="text-xs uppercase tracking-widest text-charcoal/60">Years Practising</div>
          </div>
        </motion.div>

        <div>
          <span className="font-display text-xs tracking-[0.3em] text-copper">MEET THE VAIDYA</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Dr. <em className="text-gradient-copper not-italic">{cleanName}</em></h2>
          <p className="font-devanagari text-copper mt-2">डॉ. {cleanName} · {qualifications}</p>
          <SanskritDivider/>
          <p className="text-charcoal/75 leading-relaxed mb-6">
            A reputed Ayurvedic physician specializing in Panchkarma and physical body alignments. Dr. {cleanName} combines traditional healing sciences with specialized alignment therapies to cure spinal, metabolic, and chronic conditions.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              ["Specialisation", specialisation],
              ["Experience", experience],
              ["Expertise", expertise],
              ["Philosophy", philosophy],
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

function TreatmentsSection({ treatments }: { treatments: any[] }) {
  return (
    <section className="py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-display text-xs tracking-[0.3em] text-copper">SACRED THERAPIES</span>
          <h2 className="font-serif text-4xl md:text-6xl mt-4">Panchakarma & <em className="text-gradient-copper not-italic">Specialities</em></h2>
          <SanskritDivider text="पंचविध शोधन कर्म"/>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.slice(0, 6).map((t, i) => (
            <motion.article key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-luxe transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img src={resolveImg(t.image || t.slug)} alt={t.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover group-hover:scale-110 transition duration-700"/>
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
        <div className="text-center mt-12">
          <Link to="/treatments" className="inline-flex items-center gap-2 px-8 py-4 bg-card border border-border text-charcoal hover:bg-saffron hover:text-ivory rounded-full text-sm font-bold shadow-soft transition">
            View All Specialities <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Conditions() {
  const conditionsList = [
    "Blocked Fallopian Tubes", "Heart Problems Support", "Obesity Management", "Kidney Problems Support",
    "Spinal Alignment Issues", "Digestive Disorders", "Stress & Anxiety",
    "Skin Disorders (Eczema, Psoriasis)", "Hair Problems", "Joint Pain & Sciatica",
  ];
  return (
    <section className="py-28 bg-forest text-ivory relative overflow-hidden">
      <img src={mandala} alt="" aria-hidden className="absolute -right-40 -bottom-40 w-[700px] opacity-[0.08] animate-mandala-spin pointer-events-none"/>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.2fr_2fr] gap-14 items-start">
          <div className="flex flex-col gap-8">
            <div>
              <span className="font-display text-xs tracking-[0.3em] text-saffron">CONDITIONS WE TREAT</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Where modern medicine leaves off, <em className="text-saffron not-italic">Ayurveda begins</em></h2>
              <p className="mt-6 text-ivory/75 leading-relaxed">From chronic joint pain to organ support, our personalized protocols target structural and metabolic root causes.</p>
            </div>
            
            {/* Extended Spine Illustration Container */}
            <div className="flex items-center gap-6 bg-ivory/5 border border-ivory/10 rounded-2xl p-5 shadow-soft transition-all duration-300 hover:border-saffron/30 hover:bg-ivory/10">
              <img 
                src={spine} 
                alt="Ayurvedic Spine Alignment" 
                className="h-36 w-auto object-contain shrink-0 filter drop-shadow-[0_4px_12px_rgba(194,109,44,0.3)] transition-transform duration-500 hover:scale-105"
              />
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-saffron">Spinal Correction & Alignment</h4>
                <p className="text-xs text-ivory/75 leading-relaxed">
                  Specialized therapies for vertebrae alignment, neck/back pain, gap correction, disc prolapse, herniation, and spinal stenosis.
                </p>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {conditionsList.map((c) => (
              <div key={c} className="group flex items-center gap-3 p-4 rounded-xl border border-ivory/15 bg-ivory/5 hover:bg-saffron hover:border-saffron transition-all">
                <Leaf size={18} className="text-saffron group-hover:text-ivory"/>
                <span className="font-medium text-sm">{c}</span>
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
            {staticData.journeySteps.map((s, i) => (
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

function BlogPreview({ blogs }: { blogs: any[] }) {
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
          {blogs.slice(0, 3).map((post) => (
            <Link to="/blog/$slug" params={{ slug: post.slug }} key={post.slug} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-luxe transition flex flex-col justify-between">
              <div>
                <img src={resolveImg(post.image, herbs)} alt="" loading="lazy" width={1024} height={1024} className="h-52 w-full object-cover group-hover:scale-105 transition duration-700"/>
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

function VideoCenter({ videos }: { videos: any[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // If no videos fetched, load some standard fallbacks
  const defaultVideos = [
    { title: "Understanding Your Dosha", duration: "8:24", views: "12K", youtubeId: "c_q20v_l6eI" },
    { title: "Daily Ayurvedic Routine (Dinacharya)", duration: "12:10", views: "24K", youtubeId: "V5dG35fB79M" },
    { title: "What to Expect in Panchakarma", duration: "6:42", views: "18K", youtubeId: "Z7xRlhbE4j8" },
    { title: "Herbs for Immunity", duration: "9:15", views: "9K", youtubeId: "D8eGj1T_bT4" }
  ];
  const list = videos.length > 0 ? videos : defaultVideos;

  return (
    <section className="py-28 bg-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-display text-xs tracking-[0.3em] text-copper">VIDEO KNOWLEDGE</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Learn from the <em className="text-gradient-copper not-italic">Vaidya</em></h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((v, i) => (
            <div key={v.title} onClick={() => setActiveVideo(v.youtubeId)} className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-charcoal shadow-soft border border-border">
                <img src={[shirodhara, abhyanga, clinic, herbs][i % 4]} alt={v.title} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500"/>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-14 w-14 rounded-full bg-saffron/90 grid place-items-center text-ivory group-hover:scale-110 transition shadow-md">
                    <Play size={22} fill="currentColor"/>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-charcoal/80 text-ivory font-semibold">{v.duration}</div>
              </div>
              <h3 className="font-serif text-lg mt-3 group-hover:text-saffron transition font-bold">{v.title}</h3>
              <p className="text-xs text-charcoal/55 mt-1">{v.views} views</p>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} className="fixed inset-0 bg-charcoal/90 z-[100] grid place-items-center p-6 backdrop-blur-sm animate-fade-up">
          <div className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black shadow-luxe" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 bg-charcoal/70 hover:bg-red-500 text-ivory p-2 rounded-full z-10 transition">✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo)}?autoplay=1`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="autoplay; encrypted-media"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}

function GalleryStrip({ gallery }: { gallery: any[] }) {
  return (
    <section className="py-28 bg-sand/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <span className="font-display text-xs tracking-[0.3em] text-copper">SANCTUARY</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">Inside our <em className="text-gradient-copper not-italic">speciality clinic</em></h2>
          </div>
          <Link to="/gallery" className="text-saffron font-medium inline-flex items-center gap-2">Full gallery <ArrowRight size={16}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {gallery.slice(0, 5).map((it, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl aspect-square shadow-soft ${i===0?"col-span-2 row-span-2 md:row-span-1":""}`}>
              <img src={resolveImg(it.img, clinic)} alt="" loading="lazy" width={1024} height={1024} className="h-full w-full object-cover aspect-square hover:scale-110 transition duration-700"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const GoogleGIcon = () => (
  <svg className="h-5 w-5 shrink-0 animate-pulse-subtle" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.66-.35-1.36-.35-2.09z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  // Use first 2 reviews for display in the grid
  const displayReviews = testimonials.slice(0, 2);

  return (
    <section className="py-20 bg-gradient-warm border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        
        {/* Outer Card with Grid Background */}
        <div 
          className="bg-card border border-border/80 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 shadow-luxe grid gap-10 lg:grid-cols-5 items-center relative overflow-hidden"
          style={{ 
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }}
        >
          {/* Left Side: Summary block (col-span-2) */}
          <div className="lg:col-span-2 space-y-5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF8E7] border border-[#FFE8B3] text-[#B8860B] rounded-full text-xs font-bold font-sans tracking-wide">
              ⭐ Google Verified Patients
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="font-serif font-black text-6xl text-charcoal leading-none">5.0</span>
              <div className="space-y-1">
                <div className="flex text-[#FBBC05] gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={18} fill="currentColor" className="text-[#FBBC05] fill-current" />
                  ))}
                </div>
                <div className="text-xs text-charcoal/50 font-bold">Based on 77+ reviews</div>
              </div>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal leading-snug">
              Why patients trust Shree Vishvmaharshi Clinic
            </h3>
            
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Patients consistently appreciate Dr. Omprakash Tikhe's detailed diagnosis, clear explanation of root causes, and genuine Ayurvedic care that ensures no unnecessary treatments are pushed.
            </p>

            <div className="pt-2">
              <Link 
                to="/reviews" 
                className="inline-flex items-center justify-center px-6 py-3 bg-[#6E5950] hover:bg-[#5C4A42] text-ivory rounded-full text-sm font-semibold transition shadow-md hover:scale-[1.02] transform"
              >
                Read all verified reviews
              </Link>
            </div>
          </div>

          {/* Right Side: Stack of Reviews (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {displayReviews.length > 0 ? (
              displayReviews.map((r, idx) => {
                const letter = r.name ? r.name.charAt(0).toUpperCase() : "P";
                const colors = ["bg-[#009688]", "bg-[#E91E63]", "bg-[#3F51B5]", "bg-[#FF9800]"];
                const avatarColor = colors[idx % colors.length];
                
                return (
                  <div key={r.id || idx} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full ${avatarColor} text-ivory font-serif font-bold text-sm flex items-center justify-center shrink-0`}>
                          {letter}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-charcoal">{r.name}</h4>
                          <span className="text-[10px] text-charcoal/45 font-bold uppercase tracking-wider block mt-0.5">
                            VERIFIED REVIEW · {r.location ? r.location.toUpperCase() : "PUNE"}
                          </span>
                        </div>
                      </div>
                      <GoogleGIcon />
                    </div>

                    <div className="flex text-[#FBBC05] text-xs gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={14} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-sm text-charcoal/85 leading-relaxed italic">
                      "{r.review}"
                    </p>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-charcoal/50">
                      <span className="inline-flex items-center gap-1.5">
                        <GoogleGIcon /> Posted on Google
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#0F9D58] bg-[#E6F4EA] px-2.5 py-0.5 rounded-full">
                        <Check size={11} className="stroke-[3]" /> Google Verified
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-charcoal/40 bg-card border border-border rounded-2xl">
                No verified reviews found.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "What is specialized Spine Alignment & Dorn Therapy?", a: "It is a safe, non-manipulative therapy to align the vertebrae and joints, relieving neck, back, and sciatic nerve pain using natural body movements." },
    { q: "What is Panchakarma?", a: "Panchakarma is a five-fold detoxification and rejuvenation process in Ayurveda designed to cleanse biological waste (Ama) and balance the Vata, Pitta, and Kapha doshas." },
    { q: "How long does a typical Panchakarma treatment take?", a: "Depending on your condition, it can range from 7 to 21 days. Every program is customized specifically by Dr. Omprakash Tikhe." },
    { q: "Are treatments safe?", a: "Yes, under the professional supervision of Dr. Tikhe (BAMS, MD), all treatments are highly controlled, safe, and tailored to your clinical metrics." },
    { q: "Do you offer online consultations?", a: "Yes. We offer both In-Clinic and Online (Audio/Video) consultations. You can book an appointment online easily." }
  ];

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
            <div key={i} className="border border-border rounded-xl bg-card overflow-hidden shadow-soft">
              <button onClick={() => setOpen(open===i?null:i)} className="w-full px-6 py-5 flex items-center justify-between text-left">
                <span className="font-serif text-lg font-bold">{f.q}</span>
                <ChevronDown className={`transition-transform shrink-0 ml-4 ${open===i?"rotate-180 text-saffron":""}`}/>
              </button>
              {open===i && (
                <div className="px-6 pb-5 text-charcoal/70 leading-relaxed animate-fade-up text-sm">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function ContactCTA({ settings }: { settings: any }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [concern, setConcern] = useState("General Consultation");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    try {
      await addDocument("appointments", {
        patientName: name,
        patientPhone: phone,
        email: email,
        treatment: concern,
        message: message,
        date: new Date().toLocaleDateString("en-CA"),
        time: "TBD",
        status: "Pending",
        type: "In-Clinic",
        timestamp: Date.now()
      });
      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setConcern("General Consultation");
      setMessage("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-gradient-warm">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="font-display text-xs tracking-[0.3em] text-copper">BEGIN YOUR JOURNEY</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">Book your <em className="text-gradient-copper not-italic font-serif">consultation</em></h2>
          <p className="mt-5 text-charcoal/75 leading-relaxed max-w-md">Contact our team to secure an in-clinic slot or video session with {settings?.doctor || "Dr. Omprakash Tikhe"}.</p>
          <div className="mt-8 space-y-4 text-charcoal/80">
            <div className="flex items-start gap-3">
              <MapPin className="text-saffron shrink-0" />
              <div className="text-sm">{settings?.address || "Chhatrapati Shivaji Maharaj Chowk, near Mahendra Market, Opposite Hotel Jagdamb, Nilgiri Road, Katraj - Ambegaon BK Rd, Pune"}</div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-saffron shrink-0" />
              <a href={`tel:${settings?.phone || "+918485019880"}`} className="text-sm font-bold hover:underline">{settings?.phone || "+91 84850 19880"}</a>
            </div>
            <a href={`https://wa.me/${settings?.whatsapp || "918485019880"}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-forest text-ivory rounded-full hover:opacity-90 transition font-bold shadow-soft">
              <MessageCircle size={18}/> Chat on WhatsApp
            </a>
          </div>
          <div className="mt-8 aspect-video rounded-2xl overflow-hidden border border-border bg-card shadow-soft h-[260px]">
            <iframe 
              src={settings?.googleMapsUrl || "https://maps.google.com/maps?q=Shree%20Vishvmaharshi%20Ayurved%20Speciality%20Panchkarma%20Clinic,%20chhatrapati%20Shivaji%20maharaj%20chowk,%20near%20mahendra%20market,%20opposite%20to%20hotel%20jagdamb,%20Nilgiri%20Road,%20Katraj%20-%20Ambegaon%20BK%20Rd,%20Pune,%20Maharashtra%20411046,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {success ? (
          <div className="bg-card p-8 rounded-2xl border border-border shadow-luxe py-16 text-center space-y-4 w-full">
            <div className="h-16 w-16 bg-forest/15 text-forest rounded-full grid place-items-center mx-auto text-3xl font-bold">✓</div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Enquiry Submitted</h3>
            <p className="text-sm text-charcoal/60">Your request has been saved. Our team will contact you shortly.</p>
          </div>
        ) : (
          <form className="bg-card p-8 rounded-2xl border border-border shadow-luxe space-y-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Full Name</label>
              <input 
                required 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name" 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron transition text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Phone</label>
              <input 
                required 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 84850 19880" 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron transition text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron transition text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Concern</label>
              <select 
                value={concern}
                onChange={e => setConcern(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm font-medium text-charcoal"
              >
                <option>General Consultation</option>
                <option>Spine Alignment / Back Pain</option>
                <option>Panchakarma Detox</option>
                <option>Blocked Fallopian Tubes</option>
                <option>Obesity</option>
                <option>Kidney / Heart Wellness</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Message</label>
              <textarea 
                required 
                rows={4} 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Briefly describe your concern..." 
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron resize-none text-sm"
              />
            </div>
            <button 
              disabled={submitting}
              type="submit" 
              className="w-full px-6 py-4 bg-gradient-saffron text-ivory rounded-full font-serif font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Appointment"}
            </button>
            <p className="text-xs text-charcoal/55 text-center">Our team will reach you within 12 hours.</p>
          </form>
        )}
      </div>
    </section>
  );
}
