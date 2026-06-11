import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, CalendarCheck, Users, FileText, Image, MessageSquare,
  Video, Settings, Search, Bell,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Ayurveda Sanctuary" }] }),
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/blogs", label: "Blog Management", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/videos", label: "Doctor Videos", icon: Video },
  { to: "/admin/settings", label: "Website Settings", icon: Settings },
  { to: "/admin/seo", label: "SEO Settings", icon: Search },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-sand/40">
      <aside className="w-64 bg-charcoal text-ivory flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-ivory/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-saffron grid place-items-center font-display">ॐ</div>
            <div>
              <div className="font-serif text-lg leading-tight">Ayurveda</div>
              <div className="text-[10px] tracking-[0.25em] text-saffron uppercase">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${active?"bg-saffron text-ivory":"text-ivory/70 hover:bg-ivory/5 hover:text-ivory"}`}>
                <it.icon size={17}/> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-ivory/10 text-xs text-ivory/50">v1.0 · 2025</div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-80 max-w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"/>
            <input placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-sand/60 border border-border focus:outline-none focus:border-saffron text-sm"/>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-sand rounded-lg"><Bell size={18}/><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-saffron"/></button>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-saffron grid place-items-center text-ivory text-sm font-medium">AS</div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium">Dr. Sharma</div>
                <div className="text-xs text-charcoal/55">Administrator</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
