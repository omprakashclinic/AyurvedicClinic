import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CalendarCheck, Users, FileText, TrendingUp, Eye, Heart, Phone, Check, Clock, Loader2 } from "lucide-react";
import { getCollectionData, removeDocument, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [callbacks, setCallbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Helper to format Date into YYYY-MM-DD in India/Kolkata timezone
  const getKolkataDateStr = () => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = formatter.formatToParts(new Date());
    const month = parts.find(p => p.type === "month")?.value;
    const day = parts.find(p => p.type === "day")?.value;
    const year = parts.find(p => p.type === "year")?.value;
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [appts, pts, blgs, calls] = await Promise.all([
          getCollectionData("appointments"),
          getCollectionData("patients"),
          getCollectionData("blogs"),
          getCollectionData("callback_requests")
        ]);
        setAppointments(appts);
        setPatients(pts);
        setBlogs(blgs);
        setCallbacks(calls);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
    setIsClient(true);
  }, []);

  // Calculate charts data
  const getLast7DaysData = () => {
    const data = [];
    const dateMap: Record<string, number> = {};
    
    // Last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-CA");
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dateMap[dateStr] = 0;
      data.push({ dateStr, label, bookings: 0 });
    }
    
    appointments.forEach(app => {
      if (app.date && dateMap[app.date] !== undefined) {
        dateMap[app.date]++;
      }
    });
    
    return data.map(item => ({
      ...item,
      bookings: dateMap[item.dateStr] || 0
    }));
  };

  const getTreatmentData = () => {
    const counts: Record<string, number> = {};
    appointments.forEach(app => {
      const t = app.treatment || "General Consultation";
      counts[t] = (counts[t] || 0) + 1;
    });
    
    const COLORS = ["#C26D2C", "#355E3B", "#B77B3A", "#D97706", "#2A2A2A"];
    
    return Object.entries(counts)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  // Action to mark a callback request as resolved (deletes it from Firestore)
  const handleResolveCallback = async (id: string) => {
    try {
      await removeDocument("callback_requests", id);
      setCallbacks(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Failed to delete callback request:", err);
      alert("Failed to mark callback as resolved.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-saffron" />
        <p className="text-charcoal/60 font-devanagari text-sm">माहिती लोड होत आहे...</p>
      </div>
    );
  }

  // Stats Calculations
  const todayStr = getKolkataDateStr();
  const appointmentsToday = appointments.filter(a => a.date === todayStr);
  const totalPatientsCount = patients.length;
  const publishedBlogsCount = blogs.length;
  const totalBlogViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  const stats = [
    { label: "Appointments Today", value: appointmentsToday.length, Icon: CalendarCheck, color: "saffron" },
    { label: "Total Patients", value: totalPatientsCount, Icon: Users, color: "forest" },
    { label: "Published Blogs", value: publishedBlogsCount, Icon: FileText, color: "copper" },
    { label: "Total Blog Views", value: totalBlogViews.toLocaleString(), Icon: TrendingUp, color: "saffron" },
  ];

  // Pending Callbacks List
  const pendingCallbacks = callbacks
    .filter(c => c.status === "Pending")
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Upcoming appointments (sort by latest booked/enquired first)
  const upcomingAppointments = appointments
    .filter(a => a.status !== "Completed" && a.status !== "Cancelled")
    .sort((a, b) => {
      if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    })
    .slice(0, 5);

  // Top Blog Posts (sort by views desc)
  const topBlogs = [...blogs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif text-4xl text-charcoal">Welcome back, Dr. Tikhe</h1>
        <p className="text-charcoal/60 mt-2">Here's what's happening at Shree Vishvmaharshi Clinic today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const colorMap: Record<string, string> = {
            saffron: "bg-saffron text-ivory",
            forest: "bg-forest text-ivory",
            copper: "bg-copper text-ivory",
          };
          return (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-xl grid place-items-center ${colorMap[s.color] || "bg-saffron text-ivory"}`}>
                  <s.Icon size={20}/>
                </div>
              </div>
              <div className="mt-5 font-serif text-3xl font-bold text-charcoal">{s.value}</div>
              <div className="text-sm text-charcoal/60 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Graphs section */}
      {isClient && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Booking Trends Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                <TrendingUp size={18} className="text-saffron" />
                Booking & Lead Trends
              </h2>
              <p className="text-xs text-charcoal/50 mt-0.5">Appointment volume count over the last 7 days.</p>
            </div>
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getLast7DaysData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C26D2C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C26D2C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="label" tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fill: "#64748B", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    labelStyle={{ fontWeight: "bold", color: "#1E293B" }}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#C26D2C" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" name="Bookings" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treatment Popularity Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                <Heart size={18} className="text-forest" />
                Treatment Breakdown
              </h2>
              <p className="text-xs text-charcoal/50 mt-0.5">Distribution of patient appointments by therapy.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <div className="h-48 w-48 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTreatmentData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {getTreatmentData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold font-serif text-charcoal">{appointments.length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-charcoal/45">Total</span>
                </div>
              </div>
              
              <div className="space-y-2 w-full max-w-[200px]">
                {getTreatmentData().map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="text-charcoal/70 truncate max-w-[120px] font-medium">{entry.name}</span>
                    </div>
                    <span className="font-bold text-charcoal">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Appointments & Callback requests */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming / Active Appointments */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold text-charcoal">Active Appointments</h2>
              <span className="text-xs px-2.5 py-1 bg-saffron/10 text-saffron rounded-full font-medium">Next {upcomingAppointments.length} sessions</span>
            </div>
            <div className="divide-y divide-border">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((app) => (
                  <div key={app.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div>
                      <div className="font-medium text-charcoal flex items-center gap-2.5">
                        <span>{app.patientName}</span>
                        {app.patientPhone && (
                          <a href={`tel:${app.patientPhone}`} className="text-xs text-charcoal/45 hover:text-saffron hover:underline flex items-center gap-1 font-sans">
                            <Phone size={10} />
                            <span>{app.patientPhone}</span>
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-charcoal/55 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-copper">{app.treatment}</span>
                        <span>•</span>
                        <span>{app.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-charcoal">{app.time}</div>
                        <div className="text-[10px] text-charcoal/45">{app.date}</div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        app.status === "Confirmed" 
                          ? "bg-forest/10 text-forest" 
                          : "bg-saffron/10 text-saffron"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-charcoal/40 text-sm">No active appointments scheduled.</div>
              )}
            </div>
          </div>

          {/* Callback Lead Requests */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                  <Phone size={18} className="text-saffron"/>
                  Pending Callback Leads
                </h2>
                <p className="text-xs text-charcoal/50 mt-0.5">Patients requesting a return phone call.</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-saffron/10 text-saffron rounded-full font-bold">
                {pendingCallbacks.length} leads
              </span>
            </div>

            <div className="divide-y divide-border max-h-[350px] overflow-y-auto pr-1">
              {pendingCallbacks.length > 0 ? (
                pendingCallbacks.map((cb) => (
                  <div key={cb.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 group">
                    <div className="space-y-1">
                      <div className="font-medium text-charcoal flex items-center gap-2">
                        {cb.name}
                      </div>
                      <div className="text-sm font-semibold text-copper hover:underline flex items-center gap-1.5">
                        <Phone size={12}/>
                        <a href={`tel:${cb.phone}`}>{cb.phone}</a>
                      </div>
                      <div className="text-xs text-charcoal/40 flex items-center gap-1">
                        <Clock size={12}/>
                        Requested: {cb.requestedAt || "Unknown"}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleResolveCallback(cb.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold bg-forest text-ivory rounded-lg hover:bg-forest/90 transition shadow-sm"
                      title="Mark callback as resolved and remove from active list"
                    >
                      <Check size={14}/>
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-charcoal/40 text-sm font-devanagari">
                  सर्व कॉल बॅक विनंत्या पूर्ण झाल्या आहेत! 🎉
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Top Blogs & Analytics */}
        <div className="space-y-6">
          
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-charcoal mb-4">Top Blog Posts</h2>
            <div className="space-y-4">
              {topBlogs.length > 0 ? (
                topBlogs.map((b) => (
                  <div key={b.slug} className="text-sm bg-sand/10 border border-border/40 rounded-xl p-3.5 hover:bg-sand/20 transition">
                    <div className="font-devanagari font-bold text-charcoal line-clamp-1">{b.title}</div>
                    <div className="text-xs text-charcoal/50 mt-1">{b.category}</div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-charcoal/55">
                      <span className="flex items-center gap-1 font-medium"><Eye size={13}/> {b.views || 0} views</span>
                      <span className="flex items-center gap-1 font-medium text-saffron"><Heart size={13} className="fill-saffron text-saffron"/> {b.likes || 0} likes</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-charcoal/40 text-sm">No blog analytics available.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

