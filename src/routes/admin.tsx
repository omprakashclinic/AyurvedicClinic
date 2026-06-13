import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, CalendarCheck, Users, FileText, Image, MessageSquare,
  Video, Settings, Search, Bell, LogOut, KeyRound, Sparkles, Megaphone,
  Menu, X
} from "lucide-react";
import { auth, getCollectionData } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Shree Vishvmaharshi" }] }),
  component: AdminLayout,
});

const sidebarItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/blogs", label: "Blog Management", icon: FileText },
  { to: "/admin/treatments", label: "Treatments CMS", icon: Sparkles },
  { to: "/admin/posters", label: "Posters & Offers", icon: Megaphone },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { to: "/admin/videos", label: "Doctor Videos", icon: Video },
  { to: "/admin/seo", label: "SEO Settings", icon: Search },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch pending enquiries for notifications bell
  useEffect(() => {
    async function loadNotifications() {
      if (!user) return;
      try {
        const [appts, calls] = await Promise.all([
          getCollectionData("appointments"),
          getCollectionData("callback_requests")
        ]);

        const list: any[] = [];
        
        appts.forEach((app: any) => {
          if (app.status === "Pending") {
            list.push({
              id: app.id,
              type: "appointment",
              title: "New Appointment Request",
              desc: `${app.patientName} — ${app.treatment}`,
              timestamp: app.timestamp || Date.now(),
              date: app.date
            });
          }
        });

        calls.forEach((cb: any) => {
          if (cb.status === "Pending") {
            list.push({
              id: cb.id,
              type: "callback",
              title: "New Callback Request",
              desc: `${cb.name} — ${cb.phone}`,
              timestamp: cb.timestamp || Date.now(),
              date: cb.requestedAt
            });
          }
        });

        list.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(list);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-sand/20 grid place-items-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-saffron border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-copper tracking-wider">Securing panel access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-sand/40">
      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal z-40 lg:hidden"
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-charcoal text-ivory flex flex-col z-50 lg:hidden shadow-luxe"
            >
              <div className="p-6 border-b border-ivory/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-saffron grid place-items-center font-display">ॐ</div>
                  <div>
                    <div className="font-serif text-lg leading-tight">Vishvmaharshi</div>
                    <div className="text-[10px] tracking-[0.25em] text-saffron uppercase">Admin Panel</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-ivory/10 rounded-lg text-ivory/70 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarItems.map((it) => {
                  const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
                  return (
                    <Link 
                      key={it.to} 
                      to={it.to} 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${active ? "bg-saffron text-ivory" : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"}`}
                    >
                      <it.icon size={17} /> {it.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-ivory/10 flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }} 
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-left"
                >
                  <LogOut size={17} /> Sign Out
                </button>
                <div className="text-xs text-ivory/50 px-4">v1.1 · 2026</div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-ivory/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-saffron grid place-items-center font-display">ॐ</div>
            <div>
              <div className="font-serif text-lg leading-tight">Vishvmaharshi</div>
              <div className="text-[10px] tracking-[0.25em] text-saffron uppercase">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${active ? "bg-saffron text-ivory" : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"}`}>
                <it.icon size={17} /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-ivory/10 flex flex-col gap-2">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition text-left">
            <LogOut size={17} /> Sign Out
          </button>
          <div className="text-xs text-ivory/50 px-4">v1.1 · 2026</div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 flex-1 lg:flex-initial">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-sand rounded-lg text-charcoal/70 transition-colors lg:hidden shrink-0"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full sm:w-80 max-w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input placeholder="Search..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-sand/60 border border-border focus:outline-none focus:border-saffron text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-sand rounded-lg text-charcoal/70 transition-colors"
                title="Latest Patient Enquiries"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-saffron text-[9px] font-bold text-ivory flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-85 bg-card border border-border rounded-2xl shadow-luxe py-2 z-50 animate-fade-up">
                  <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-charcoal">Latest Patient Enquiries</span>
                    <span className="text-[10px] bg-saffron/10 text-saffron font-bold px-2 py-0.5 rounded-full">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="divide-y divide-border max-h-64 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3.5 hover:bg-sand/10 transition text-left flex flex-col gap-0.5">
                          <div className="font-semibold text-xs text-charcoal flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${n.type === "appointment" ? "bg-saffron" : "bg-forest"}`} />
                            {n.title}
                          </div>
                          <div className="text-xs text-charcoal/70 pl-3">{n.desc}</div>
                          <div className="text-[10px] text-charcoal/40 pl-3 mt-0.5">{n.date || "Just now"}</div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-charcoal/40 text-xs">No pending enquiries.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-saffron grid place-items-center text-ivory text-sm font-medium">OT</div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-medium">Dr. Tikhe</div>
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

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate({ to: "/admin" });
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      <div className="relative bg-card border border-border rounded-3xl p-8 max-w-md w-full shadow-luxe space-y-6">
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-gradient-saffron grid place-items-center text-ivory font-display text-2xl mx-auto shadow-soft">ॐ</div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Clinic Admin Control</h1>
          <p className="text-xs text-charcoal/55 tracking-wider uppercase font-semibold">Shree Vishvmaharshi Clinic</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Email Address</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@clinic.com"
              className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory focus:outline-none focus:border-saffron text-sm"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-saffron text-ivory rounded-full font-serif font-bold text-sm shadow-soft hover:opacity-95 transition disabled:opacity-50 mt-6"
          >
            <KeyRound size={16} /> {loading ? "Signing in..." : "Enter Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}
