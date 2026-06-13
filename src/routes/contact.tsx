import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SanskritDivider } from "@/components/site/SanskritDivider";
import { conditions } from "@/lib/site-data";
import { useState } from "react";
import { addDocument } from "@/lib/firebase";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Ayurveda Sanctuary" }, { name: "description", content: "Book your Ayurvedic consultation in Pune." }] }),
  component: Contact,
});

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [concern, setConcern] = useState("General Consultation");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone) return;
    setSubmitting(true);
    try {
      await addDocument("appointments", {
        patientName: `${firstName} ${lastName}`.trim(),
        patientPhone: phone,
        email: email,
        treatment: concern,
        message: message,
        date: date || new Date().toLocaleDateString("en-CA"),
        time: "TBD",
        status: "Pending",
        type: "In-Clinic",
        timestamp: Date.now()
      });
      setSuccess(true);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setConcern("General Consultation");
      setDate("");
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
    <SiteShell>
      <section className="pt-32 pb-10 bg-gradient-warm text-center">
        <span className="font-display text-xs tracking-[0.3em] text-copper">REACH US</span>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Begin Your <em className="text-gradient-copper not-italic">Journey</em></h1>
        <SanskritDivider text="स्वागतम्"/>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <div className="space-y-6">
          {[
            { Icon: MapPin, title: "Visit", lines: ["Chhatrapati Shivaji Maharaj Chowk, near Mahendra Market,", "Opposite to Hotel Jagdamb, Nilgiri Road,", "Katraj - Ambegaon BK Rd, Pune, Maharashtra 411046"] },
            { Icon: Phone, title: "Call / WhatsApp", lines: ["+91 84850 19880"] },
            { Icon: Mail, title: "Email", lines: ["care@vishvmaharshiclinic.in"] },
            { Icon: Clock, title: "Hours", lines: ["Mon–Sun · 9:00 AM – 9:00 PM"] },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 p-6 bg-card rounded-2xl border border-border shadow-soft">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-saffron grid place-items-center text-ivory"><c.Icon size={20}/></div>
              <div>
                <div className="font-serif text-xl">{c.title}</div>
                {c.lines.map((l) => <div key={l} className="text-sm text-charcoal/70 mt-0.5">{l}</div>)}
              </div>
            </div>
          ))}
          <a href="https://wa.me/918485019880" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-forest text-ivory rounded-2xl hover:opacity-90 transition font-bold shadow-soft">
            <MessageCircle size={20}/> Chat on WhatsApp
          </a>
          <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-card shadow-soft h-[300px]">
            <iframe 
              src="https://maps.google.com/maps?q=Shree%20Vishvmaharshi%20Ayurved%20Speciality%20Panchkarma%20Clinic%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed" 
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
          <div className="bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-soft py-20 text-center space-y-4">
            <div className="h-16 w-16 bg-forest/15 text-forest rounded-full grid place-items-center mx-auto text-3xl font-bold">✓</div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Enquiry Submitted</h3>
            <p className="text-sm text-charcoal/60">Your booking request has been successfully recorded. We will contact you soon!</p>
          </div>
        ) : (
          <form className="bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-soft space-y-5" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-semibold">First Name</label>
                <input 
                  required
                  type="text" 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-semibold">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Phone</label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Primary Concern</label>
              <select 
                value={concern}
                onChange={e => setConcern(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm font-medium text-charcoal"
              >
                <option>General Consultation</option>
                {conditions.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Preferred Date</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm font-medium text-charcoal"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Message</label>
              <textarea 
                rows={4} 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory resize-none text-sm focus:outline-none focus:border-saffron"
              />
            </div>
            <button 
              disabled={submitting}
              type="submit" 
              className="w-full px-6 py-4 bg-gradient-saffron text-ivory rounded-full font-serif font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? "Requesting..." : "Request Appointment"}
            </button>
          </form>
        )}
      </section>
    </SiteShell>
  );
}
