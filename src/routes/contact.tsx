import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { conditions } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Ayurveda Sanctuary" }, { name: "description", content: "Book your Ayurvedic consultation in Pune." }] }),
  component: Contact,
});

function Contact() {
  return (
    <SiteShell>
      <section className="pt-32 pb-10 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">REACH US</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Begin Your <em className="text-gradient-copper not-italic">Journey</em></h1>
        <SanskritDivider text="स्वागतम्"/>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div className="space-y-6">
          {[
            { Icon: MapPin, title: "Visit", lines: ["Heritage Wellness Lane", "Koregaon Park, Pune 411001"] },
            { Icon: Phone, title: "Call", lines: ["+91 98765 43210", "+91 20 1234 5678"] },
            { Icon: Mail, title: "Email", lines: ["care@ayurvedasanctuary.in"] },
            { Icon: Clock, title: "Hours", lines: ["Mon–Sat · 8:00 – 19:00", "Sunday · By appointment"] },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-saffron grid place-items-center text-ivory"><c.Icon size={20}/></div>
              <div>
                <div className="font-serif text-xl">{c.title}</div>
                {c.lines.map((l) => <div key={l} className="text-sm text-charcoal/70">{l}</div>)}
              </div>
            </div>
          ))}
          <a href="https://wa.me/919876543210" className="flex items-center justify-center gap-2 w-full py-4 bg-forest text-ivory rounded-2xl hover:opacity-90 transition">
            <MessageCircle size={20}/> Chat on WhatsApp
          </a>
          <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-card grid place-items-center text-charcoal/40 text-sm">
            <MapPin size={36}/><span className="mt-2">Google Maps Embed</span>
          </div>
        </div>

        <form className="bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-soft space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {[["First Name", "text"], ["Last Name", "text"]].map(([l, t]) => (
              <div key={l}>
                <label className="text-xs uppercase tracking-widest text-copper">{l}</label>
                <input type={t} className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron"/>
              </div>
            ))}
          </div>
          {[["Phone", "tel"], ["Email", "email"]].map(([l, t]) => (
            <div key={l}>
              <label className="text-xs uppercase tracking-widest text-copper">{l}</label>
              <input type={t} className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron"/>
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Primary Concern</label>
            <select className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory">
              <option>General Consultation</option>
              {conditions.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Preferred Date</label>
            <input type="date" className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory"/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Message</label>
            <textarea rows={4} className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory resize-none"/>
          </div>
          <button className="w-full px-6 py-4 bg-gradient-saffron text-ivory rounded-full font-medium">Request Appointment</button>
        </form>
      </section>
    </SiteShell>
  );
}
