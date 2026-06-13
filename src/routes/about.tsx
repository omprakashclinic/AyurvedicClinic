import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { Leaf, Award, Compass, Heart, Activity, Check } from "lucide-react";
import { getDocumentData } from "@/lib/firebase";
import doctorImg from "@/assets/doctor.jpg";
import clinicImg from "@/assets/clinic-interior.jpg";
import mandala from "@/assets/mandala.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dr. Omprakash Tikhe & Clinic — Shree Vishvmaharshi" },
      { name: "description", content: "Learn about Dr. Omprakash Tikhe (BAMS, MD), a leading Ayurvedic physician in Pune with 7+ years of experience specializing in Panchkarma." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getDocumentData("settings", "clinic");
        if (data) setSettings(data);
      } catch (err) {
        console.error("Failed to load clinic settings on about page:", err);
      }
    }
    loadSettings();
  }, []);

  const doctorName = settings?.doctor || "Dr. Omprakash Tikhe";
  const qualifications = settings?.qualifications || "BAMS, MD (Ayurveda Speciality)";
  const experienceYears = settings?.experienceYears || "7+";
  const experienceText = settings?.experience || "7+ Years of Clinical Practice";
  const specialisation = settings?.specialisation || "Panchakarma & Spine Alignment";
  const doctorImgSrc = settings?.doctorImage || doctorImg;

  const credentials = [
    { title: "Education", value: qualifications, icon: Award },
    { title: "Experience", value: experienceText, icon: Activity },
    { title: "Specialisation", value: specialisation, icon: Compass },
    { title: "Approach", value: "Holistic & Patient-Centric Healing", icon: Heart },
  ];

  const specialtyServices = [
    "All Panchakarma (Basti, Virechana, Vamana, Nasya, Raktamokshana)",
    "Agnikarma (Therapeutic cauterization for pain)",
    "Spine Alignment & Dorn Therapy",
    "Structural Integration Therapy",
    "Chronic Care: Blocked Fallopian Tubes, Obesity, Heart, and Kidney issues"
  ];

  return (
    <SiteShell>
      {/* Header Banner */}
      <section className="pt-32 pb-16 bg-gradient-warm text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        <span className="font-display text-xs tracking-[0.3em] text-copper uppercase">वैद्य परिचय</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 font-bold tracking-tight">About Us & <em className="text-gradient-copper not-italic">Our Vaidya</em></h1>
        <SanskritDivider text="स्वस्थवृत्तम् समाचरेत्"/>
        <p className="max-w-2xl mx-auto px-6 text-charcoal/70 leading-relaxed">
          Dedicated to restoring complete balance through authentic Ayurvedic therapies, Panchakarma, and advanced structural alignment techniques.
        </p>
      </section>

      {/* Doctor Introduction */}
      <section className="py-20 bg-ivory relative overflow-hidden">
        <img src={mandala} alt="" aria-hidden className="absolute -left-40 top-1/3 w-[600px] opacity-[0.05] animate-mandala-spin pointer-events-none"/>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-[1.2fr_1.8fr] gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute -inset-6 bg-gradient-saffron rounded-[2rem] opacity-20 blur-2xl"/>
            <div className="relative rounded-[2rem] overflow-hidden shadow-luxe border border-border bg-card">
              <img src={doctorImgSrc} alt={doctorName} className="w-full h-[600px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-2xl px-6 py-5 shadow-luxe">
              <div className="font-serif text-3xl text-saffron font-bold">{experienceYears}</div>
              <div className="text-[10px] uppercase tracking-widest text-charcoal/65">Years of Healing</div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div>
              <span className="font-display text-xs tracking-[0.3em] text-copper">THE PHYSICIAN</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-2 text-charcoal font-bold">{doctorName} <span className="text-2xl block lg:inline text-saffron font-sans font-medium">({qualifications})</span></h2>
              <p className="font-devanagari text-copper mt-1">तज्ज्ञ आयुर्वेदिक चिकित्सक आणि पंचकर्म तज्ज्ञ</p>
              <div className="h-0.5 w-16 bg-saffron mt-4" />
            </div>

            <p className="text-charcoal/75 leading-relaxed text-base md:text-lg">
              {doctorName} is one of the most reputed and respected Ayurvedic doctors in Pune, Maharashtra. Over the past {experienceYears.replace('+', '')} years, he has successfully treated thousands of patients suffering from acute and chronic diseases, combining ancient knowledge with modern clinical safety standards.
            </p>
            <p className="text-charcoal/75 leading-relaxed text-base">
              His clinic, <strong>Shree Vishvmaharshi Ayurved Speciality Panchkarma Clinic</strong>, offers a peaceful environment designed for deep recovery. Dr. Tikhe specializes not only in the traditional five cleansing actions (Panchakarma) but also in advanced physical therapies such as Spine Alignment, Dorn Therapy, and Structural Integration, providing immediate relief for structural issues and joint pain.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {credentials.map((c) => (
                <div key={c.title} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-sand text-copper grid place-items-center"><c.icon size={18}/></div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-copper">{c.title}</h4>
                    <p className="text-sm font-medium text-charcoal/80 mt-1">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Details and Specialities */}
      <section className="py-20 bg-gradient-warm relative overflow-hidden">
        <img src={mandala} alt="" aria-hidden className="absolute -right-40 top-1/4 w-[550px] opacity-[0.04] animate-mandala-spin pointer-events-none"/>
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-[1.7fr_1.3fr] gap-16 items-center">
          <div className="space-y-6">
            <div>
              <span className="font-display text-xs tracking-[0.3em] text-copper">OUR CLINICAL SANCTUARY</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-2 text-charcoal font-bold">Holistic Health & Speciality Care</h2>
              <div className="h-0.5 w-16 bg-saffron mt-4" />
            </div>

            <p className="text-charcoal/75 leading-relaxed">
              At Shree Vishvmaharshi clinic, we understand that every individual possesses a unique bio-identity (Prakriti). Under the expert supervision of Dr. Omprakash Tikhe, we formulate personalized health programs addressing the root cause of illnesses rather than just managing outward symptoms.
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-2xl text-charcoal font-semibold">Speciality Offerings:</h3>
              <div className="grid gap-3.5">
                {specialtyServices.map((service, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-forest/10 text-forest grid place-items-center shrink-0 mt-0.5"><Check size={14} className="stroke-[3]"/></div>
                    <p className="text-charcoal/80 font-medium text-sm md:text-base">{service}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-saffron text-ivory rounded-full font-serif font-bold text-sm shadow-luxe hover:opacity-90 transition">
                Schedule a Consultation
              </Link>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute -inset-6 bg-gradient-saffron rounded-[2rem] opacity-10 blur-2xl"/>
            <div className="relative rounded-[2rem] overflow-hidden shadow-luxe border border-border">
              <img src={clinicImg} alt="Shree Vishvmaharshi Clinic Interior" className="w-full h-[450px] object-cover" />
            </div>
          </motion.div>
        </div>
      </section>
    </SiteShell>
  );
}
