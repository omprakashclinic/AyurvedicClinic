import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/treatments", label: "Treatments" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-ivory/85 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 rounded-full bg-gradient-saffron grid place-items-center text-ivory font-display text-lg shadow-soft">ॐ</div>
          <div className="leading-tight">
            <div className="font-serif text-xl text-charcoal">Ayurveda</div>
            <div className="font-display text-[10px] tracking-[0.3em] text-copper uppercase">Panchakarma Sanctuary</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-charcoal/80 hover:text-saffron transition-colors relative [&.active]:text-saffron"
              activeProps={{ className: "active" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/contact" className="px-5 py-2.5 bg-gradient-saffron text-ivory text-sm font-medium rounded-full hover:opacity-90 transition shadow-soft">
            Book Consultation
          </Link>
        </nav>

        <button className="lg:hidden p-2 text-charcoal" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-ivory">
          <div className="px-6 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-charcoal/80 hover:text-saffron">
                {n.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 text-center px-5 py-3 bg-gradient-saffron text-ivory rounded-full">
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
