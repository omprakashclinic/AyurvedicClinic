import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, User, Phone, Mail, Calendar, FileText, Save, Loader2, AlertCircle } from "lucide-react";
import { getCollectionData, setDocument } from "@/lib/firebase";

export const Route = createFileRoute("/admin/patients")({
  component: PatientsCMS,
});

function PatientsCMS() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [pts, appts, calls] = await Promise.all([
          getCollectionData("patients"),
          getCollectionData("appointments"),
          getCollectionData("callback_requests")
        ]);
        
        // Dynamically synthesize unique patients from appointments and callback requests
        const synthesizedPatients = [...pts];
        
        const hasPatient = (phone: string, name: string) => {
          return synthesizedPatients.some(
            p => 
              (p.phone && phone && p.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) || 
              (p.name.toLowerCase() === name.toLowerCase())
          );
        };

        // Synthesize from appointments
        appts.forEach((app: any) => {
          if (app.patientName && app.patientPhone && !hasPatient(app.patientPhone, app.patientName)) {
            synthesizedPatients.push({
              id: app.patientId || `synth_${app.id}`,
              name: app.patientName,
              phone: app.patientPhone,
              email: app.email || "",
              age: app.age || "N/A",
              gender: app.gender || "N/A",
              condition: app.treatment || "General Consultation",
              notes: app.message || "Booked via online form.",
              joinedDate: app.date || new Date(app.timestamp || Date.now()).toLocaleDateString("en-CA"),
              timestamp: app.timestamp || Date.now(),
              isSynthesized: true
            });
          }
        });

        // Synthesize from callback requests
        calls.forEach((cb: any) => {
          if (cb.name && cb.phone && !hasPatient(cb.phone, cb.name)) {
            synthesizedPatients.push({
              id: `synth_cb_${cb.id || Date.now()}`,
              name: cb.name,
              phone: cb.phone,
              email: "",
              age: "N/A",
              gender: "N/A",
              condition: "Callback Lead",
              notes: "Requested a callback from website popup.",
              joinedDate: cb.requestedAt?.split(",")[0] || new Date(cb.timestamp || Date.now()).toLocaleDateString("en-CA"),
              timestamp: cb.timestamp || Date.now(),
              isSynthesized: true
            });
          }
        });

        // Sort patients: latest joined first
        const sorted = synthesizedPatients.sort((a, b) => {
          if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
          return (b.joinedDate || "").localeCompare(a.joinedDate || "");
        });

        setPatients(sorted);
        setAppointments(appts);
        
        if (sorted.length > 0) {
          setSelectedPatientId(sorted[0].id);
          setEditingNotes(sorted[0].notes || "");
        }
      } catch (err) {
        console.error("Error loading patient data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Filter patients based on search query
  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.phone && p.phone.toLowerCase().includes(q)) ||
      (p.condition && p.condition.toLowerCase().includes(q))
    );
  });

  const handleSelectPatient = (p: any) => {
    setSelectedPatientId(p.id);
    setEditingNotes(p.notes || "");
  };

  const handleSaveNotes = async () => {
    if (!selectedPatient) return;
    setSavingNotes(true);
    try {
      await setDocument("patients", selectedPatient.id, {
        name: selectedPatient.name,
        phone: selectedPatient.phone || "",
        email: selectedPatient.email || "",
        age: selectedPatient.age === "N/A" ? 0 : selectedPatient.age,
        gender: selectedPatient.gender || "N/A",
        condition: selectedPatient.condition || "General",
        notes: editingNotes,
        joinedDate: selectedPatient.joinedDate || new Date().toLocaleDateString("en-CA"),
        timestamp: selectedPatient.timestamp || Date.now()
      });
      // Update local state
      setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, notes: editingNotes, isSynthesized: false } : p));
      alert("Notes updated successfully and patient saved to directory!");
    } catch (err) {
      console.error("Error saving patient notes:", err);
      alert("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  // Get appointments for the selected patient
  const patientAppointments = selectedPatient
    ? appointments
        .filter(a => a.patientId === selectedPatient.id || a.patientPhone === selectedPatient.phone)
        .sort((a, b) => {
          if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return b.time.localeCompare(a.time);
        })
    : [];

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
        <h1 className="font-serif text-3xl text-charcoal">Patient Directory CMS</h1>
        <p className="text-charcoal/60 text-sm mt-1">Search patients, update medical notes, and inspect appointment history.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Search and Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/45" />
            <input
              type="text"
              placeholder="Search by name, phone, condition..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-saffron"
            />
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm max-h-[600px] overflow-y-auto divide-y divide-border">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className={`w-full text-left p-4 transition ${
                      isSelected 
                        ? "bg-sand/30 border-l-4 border-l-saffron" 
                        : "hover:bg-sand/10 border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="font-medium text-charcoal">{p.name}</div>
                    <div className="text-xs text-charcoal/60 mt-1 flex items-center gap-1.5">
                      <span>Age: {p.age}</span>
                      <span>•</span>
                      <span>{p.gender}</span>
                    </div>
                    <div className="text-xs text-copper font-medium mt-1 truncate">{p.condition}</div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-charcoal/45 text-sm">No patients found.</div>
            )}
          </div>
        </div>

        {/* Right column: Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Header profile info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-saffron/10 text-saffron flex items-center justify-center text-2xl font-serif font-bold">
                    {selectedPatient.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-charcoal">{selectedPatient.name}</h2>
                    <div className="text-xs text-charcoal/60 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1"><User size={12}/> {selectedPatient.gender}, {selectedPatient.age} yrs</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={12}/> Joined: {selectedPatient.joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact info cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-3 bg-sand/10 border border-border/50 rounded-xl flex items-center gap-3">
                  <Phone size={16} className="text-copper shrink-0" />
                  <div>
                    <div className="text-[10px] text-charcoal/45 uppercase tracking-wider">Phone Number</div>
                    <a href={`tel:${selectedPatient.phone}`} className="text-sm font-semibold text-charcoal hover:underline">
                      {selectedPatient.phone || "N/A"}
                    </a>
                  </div>
                </div>
                <div className="p-3 bg-sand/10 border border-border/50 rounded-xl flex items-center gap-3">
                  <Mail size={16} className="text-copper shrink-0" />
                  <div>
                    <div className="text-[10px] text-charcoal/45 uppercase tracking-wider">Email Address</div>
                    <a href={`mailto:${selectedPatient.email}`} className="text-sm font-semibold text-charcoal hover:underline truncate block max-w-[200px]">
                      {selectedPatient.email || "N/A"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Diagnosis / Present Condition */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-charcoal">Primary Diagnosis / Condition</h3>
                <div className="p-4 bg-saffron/5 border border-saffron/20 rounded-xl text-sm text-copper font-medium">
                  {selectedPatient.condition || "No specific condition recorded."}
                </div>
              </div>

              {/* Treatment Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                    <FileText size={18} className="text-copper" />
                    Doctor's Treatment Notes
                  </h3>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron text-ivory text-xs font-semibold rounded-lg hover:bg-saffron/90 transition shadow-sm"
                  >
                    {savingNotes ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    <span>Save Notes</span>
                  </button>
                </div>
                <textarea
                  value={editingNotes}
                  onChange={e => setEditingNotes(e.target.value)}
                  placeholder="Enter medical history, progress tracker, dosha analysis, or herbs prescribed..."
                  className="w-full h-36 p-4 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-saffron resize-none leading-relaxed"
                />
              </div>

              {/* Clinical History / Appointments */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif text-lg font-bold text-charcoal">Appointment & Therapy History</h3>
                <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map((app) => (
                      <div key={app.id} className="p-4 flex items-center justify-between text-sm hover:bg-sand/5 transition">
                        <div>
                          <div className="font-semibold text-charcoal">{app.treatment}</div>
                          <div className="text-xs text-charcoal/50 mt-0.5">{app.type}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-charcoal">{app.date}</div>
                            <div className="text-xs text-charcoal/45">{app.time}</div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-charcoal/40 text-sm">No appointment history found.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center text-charcoal/40 flex flex-col items-center justify-center gap-3">
              <AlertCircle size={32} className="text-charcoal/30" />
              <p className="font-serif text-lg">No patient selected</p>
              <p className="text-sm">Please select a patient from the directory list to load their medical file.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
