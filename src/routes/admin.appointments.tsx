import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Calendar, Clock, Phone, Loader2, Filter } from "lucide-react";
import { getCollectionData, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const Route = createFileRoute("/admin/appointments")({
  component: AppointmentsCMS,
});

function AppointmentsCMS() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All"); // All, Today, Upcoming, Past
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    async function loadAppointments() {
      try {
        const data = await getCollectionData("appointments");
        setAppointments(data);
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    setUpdatingId(appointmentId);
    try {
      const docRef = doc(db, "appointments", appointmentId);
      await updateDoc(docRef, { status: newStatus });
      setAppointments(prev =>
        prev.map(app => (app.id === appointmentId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error("Failed to update appointment status:", err);
      alert("Failed to update appointment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const todayStr = getKolkataDateStr();

  // Filter & Sort Appointments
  const filteredAppointments = appointments
    .filter((app) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      const matchSearch =
        app.patientName.toLowerCase().includes(q) ||
        (app.patientPhone && app.patientPhone.toLowerCase().includes(q)) ||
        (app.treatment && app.treatment.toLowerCase().includes(q));

      // 2. Status Filter
      const matchStatus = statusFilter === "All" || app.status === statusFilter;

      // 3. Date Filter
      let matchDate = true;
      if (dateFilter === "Today") {
        matchDate = app.date === todayStr;
      } else if (dateFilter === "Upcoming") {
        matchDate = app.date >= todayStr;
      } else if (dateFilter === "Past") {
        matchDate = app.date < todayStr;
      }

      return matchSearch && matchStatus && matchDate;
    })
    .sort((a, b) => {
      if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
      // Sort by date and then time
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-saffron" />
        <p className="text-charcoal/60 font-devanagari text-sm">माहिती लोड होत आहे...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-3xl text-charcoal">Appointments CMS</h1>
        <p className="text-charcoal/60 text-sm mt-1">Monitor clinic bookings, filter by status or date, and update status codes.</p>
      </div>

      {/* Filters Panel */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/45" />
            <input
              type="text"
              placeholder="Search patient, phone, treatment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-saffron"
            />
          </div>

          {/* Status Filter select */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-charcoal/45 shrink-0" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-2 text-sm focus:outline-none focus:border-saffron font-medium text-charcoal"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range filter */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-charcoal/45 shrink-0" />
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-2 text-sm focus:outline-none focus:border-saffron font-medium text-charcoal"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today Only</option>
              <option value="Upcoming">Today & Future</option>
              <option value="Past">Past Sessions</option>
            </select>
          </div>

        </div>
      </div>

      {/* Appointments Grid/Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-sand/10 border-b border-border text-xs uppercase tracking-wider text-charcoal/60 font-serif">
                <th className="p-4">Patient</th>
                <th className="p-4">Treatment</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-sand/5 transition">
                    
                    {/* Patient detail */}
                    <td className="p-4">
                      <div className="font-semibold text-charcoal">{app.patientName}</div>
                      <div className="text-xs text-charcoal/50 flex items-center gap-1 mt-0.5">
                        <Phone size={10}/>
                        <a href={`tel:${app.patientPhone}`} className="hover:underline">{app.patientPhone || "N/A"}</a>
                      </div>
                    </td>

                    {/* Treatment info */}
                    <td className="p-4">
                      <div className="font-medium text-copper">{app.treatment}</div>
                      <div className="text-xs text-charcoal/55 mt-0.5">{app.type || "In-Clinic"}</div>
                    </td>

                    {/* Schedule */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-charcoal">
                        <Calendar size={13} className="text-charcoal/40" />
                        <span>{app.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-charcoal/55 mt-0.5">
                        <Clock size={13} className="text-charcoal/40" />
                        <span>{app.time}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                        app.status === "Completed"
                          ? "bg-forest/10 text-forest"
                          : app.status === "Confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-saffron/10 text-saffron"
                      }`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Action update status select */}
                    <td className="p-4 text-right">
                      {updatingId === app.id ? (
                        <div className="inline-flex items-center justify-end w-28">
                          <Loader2 size={16} className="animate-spin text-saffron" />
                        </div>
                      ) : (
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="text-xs bg-card border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-saffron font-medium text-charcoal cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-charcoal/40">
                    No appointments matched the selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
