import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Users, FileText, TrendingUp, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { label: "Appointments Today", value: "24", change: "+12%", Icon: CalendarCheck, color: "saffron" },
    { label: "Total Patients", value: "1,847", change: "+8%", Icon: Users, color: "forest" },
    { label: "Published Blogs", value: "63", change: "+3", Icon: FileText, color: "copper" },
    { label: "Monthly Visitors", value: "12.4K", change: "+22%", Icon: TrendingUp, color: "saffron" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Welcome back, Dr. Sharma</h1>
        <p className="text-charcoal/60 mt-2">Here's what's happening at your clinic today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className={`h-11 w-11 rounded-xl grid place-items-center text-ivory bg-${s.color === "forest" ? "forest" : s.color === "copper" ? "copper" : "saffron"}`}>
                <s.Icon size={20}/>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-forest/10 text-forest font-medium">{s.change}</span>
            </div>
            <div className="mt-5 font-serif text-3xl">{s.value}</div>
            <div className="text-sm text-charcoal/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl mb-4">Upcoming Appointments</h2>
          <div className="divide-y divide-border">
            {[
              ["Priya Deshmukh", "Shirodhara", "10:00 AM", "Confirmed"],
              ["Rahul Joshi", "Consultation", "11:30 AM", "Confirmed"],
              ["Anjali Kulkarni", "Abhyanga + Steam", "2:00 PM", "Pending"],
              ["Sameer Patil", "Kati Basti", "4:30 PM", "Confirmed"],
            ].map(([n, t, time, status]) => (
              <div key={n} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{n}</div>
                  <div className="text-xs text-charcoal/55">{t}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-charcoal/70">{time}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${status==="Confirmed"?"bg-forest/10 text-forest":"bg-saffron/10 text-saffron"}`}>{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-serif text-xl mb-4">Top Blog Posts</h2>
          <div className="space-y-4">
            {[
              ["पंचकर्म प्रक्रिया", "2.4K", "184"],
              ["आयुर्वेदिक आहार", "1.8K", "142"],
              ["योग आणि प्राणायाम", "1.5K", "98"],
            ].map(([t, v, l]) => (
              <div key={t} className="text-sm">
                <div className="font-devanagari font-medium">{t}</div>
                <div className="mt-1 flex items-center gap-4 text-xs text-charcoal/55">
                  <span className="flex items-center gap-1"><Eye size={12}/>{v}</span>
                  <span className="flex items-center gap-1"><Heart size={12}/>{l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
