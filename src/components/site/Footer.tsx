import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/90 mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-11 w-11 rounded-full bg-gradient-saffron grid place-items-center text-ivory font-display">ॐ</div>
            <div className="font-serif text-xl leading-tight">Shree Vishvmaharshi Clinic</div>
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
          { label: "About", to: "/about" }, 
          { label: "Treatments", to: "/treatments" },
          { label: "Gallery", to: "/gallery" }, 
          { label: "Blog", to: "/blog" }, 
          { label: "Reviews", to: "/reviews" },
          { label: "Contact", to: "/contact" },
        ]} />
        <FooterCol title="Treatments" items={[
          { label: "Vamana", to: "/treatments/vamana" }, 
          { label: "Virechana", to: "/treatments/virechana" },
          { label: "Basti", to: "/treatments/basti" }, 
          { label: "Nasya", to: "/treatments/nasya" }, 
          { label: "Raktamokshana", to: "/treatments/raktamokshana" },
        ]} />
        <div>
          <h4 className="font-serif text-lg mb-4 text-saffron">Visit Us</h4>
          <p className="text-sm text-ivory/70 leading-relaxed font-devanagari">
            Chhatrapati Shivaji Maharaj Chowk,<br/>
            Near Mahendra Market, Opposite Hotel Jagdamb,<br/>
            Nilgiri Road, Katraj - Ambegaon BK Rd, Pune
          </p>
          <p className="text-sm text-ivory/70 mt-3">+91 84850 19880<br/>care@vishvmaharshiclinic.in</p>
        </div>
      </div>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/50 font-devanagari flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>© 2026 Shree Vishvmaharshi Clinic · शरीरं आद्यं खलु धर्मसाधनम्</span>
        <span className="hidden sm:inline">·</span>
        <Link to="/admin" className="hover:text-saffron transition underline">Admin Login</Link>
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
