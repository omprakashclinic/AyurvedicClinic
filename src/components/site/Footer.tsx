import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/90 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-11 w-11 rounded-full bg-gradient-saffron grid place-items-center text-ivory font-display">ॐ</div>
            <div className="font-serif text-xl">Ayurveda Sanctuary</div>
          </div>
          <p className="font-devanagari text-sm text-ivory/70 leading-relaxed">
            स्वस्थस्य स्वास्थ्य रक्षणम्<br/>आतुरस्य विकार प्रशमनम्
          </p>
          <div className="flex gap-3 mt-6">
            {[Facebook, Instagram, Youtube, Twitter, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border border-ivory/20 grid place-items-center hover:bg-saffron hover:border-saffron transition">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links" items={[
          { label: "About", to: "/" }, { label: "Treatments", to: "/treatments" },
          { label: "Blog", to: "/blog" }, { label: "Gallery", to: "/gallery" }, { label: "Contact", to: "/contact" },
        ]} />
        <FooterCol title="Treatments" items={[
          { label: "Shirodhara", to: "/treatments/shirodhara" }, { label: "Abhyanga", to: "/treatments/abhyanga" },
          { label: "Panchakarma", to: "/treatments/vamana" }, { label: "Kati Basti", to: "/treatments/kati-basti" }, { label: "Pizhichil", to: "/treatments/pizhichil" },
        ]} />
        <div>
          <h4 className="font-serif text-lg mb-4 text-saffron">Visit Us</h4>
          <p className="text-sm text-ivory/70 leading-relaxed">
            Heritage Wellness Lane<br/>Koregaon Park, Pune 411001<br/>Maharashtra, India
          </p>
          <p className="text-sm text-ivory/70 mt-3">+91 98765 43210<br/>care@ayurvedasanctuary.in</p>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50 font-devanagari">
        © 2025 Ayurveda Sanctuary · शरीरं आद्यं खलु धर्मसाधनम्
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-serif text-lg mb-4 text-saffron">{title}</h4>
      <ul className="space-y-2.5 text-sm text-ivory/70">
        {items.map((i) => (
          <li key={i.label}><Link to={i.to} className="hover:text-saffron transition">{i.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
