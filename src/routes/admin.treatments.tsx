import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Sparkles, Check, ChevronRight, HelpCircle } from "lucide-react";
import { getCollectionData, setDocument, removeDocument } from "@/lib/firebase";

export const Route = createFileRoute("/admin/treatments")({
  component: AdminTreatments,
});

interface ProcessStep {
  step: string;
  detail: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface Treatment {
  id?: string;
  slug: string;
  name: string;
  sanskrit: string;
  desc: string;
  overview: string;
  indications: string[];
  benefits: string[];
  process: ProcessStep[];
  faqs: FAQItem[];
}

function AdminTreatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Treatment | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [sanskrit, setSanskrit] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [overview, setOverview] = useState("");
  const [indications, setIndications] = useState<string[]>([]);
  const [newIndication, setNewIndication] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState("");
  
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [stepTitle, setStepTitle] = useState("");
  const [stepDetail, setStepDetail] = useState("");

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const [saving, setSaving] = useState(false);

  const fetchTreatments = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<Treatment>("treatments");
      setTreatments(data);
    } catch (err) {
      console.error("Failed to load treatments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const startEdit = (t: Treatment) => {
    setEditing(t);
    setIsNew(false);
    setName(t.name);
    setSanskrit(t.sanskrit);
    setSlug(t.slug);
    setDesc(t.desc);
    setOverview(t.overview);
    setIndications(t.indications || []);
    setBenefits(t.benefits || []);
    setProcessSteps(t.process || []);
    setFaqs(t.faqs || []);
  };

  const startNew = () => {
    setEditing({} as Treatment);
    setIsNew(true);
    setName("");
    setSanskrit("");
    setSlug("");
    setDesc("");
    setOverview("");
    setIndications([]);
    setBenefits([]);
    setProcessSteps([]);
    setFaqs([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !name) return;
    setSaving(true);
    const docData = {
      slug,
      name,
      sanskrit,
      desc,
      overview,
      indications,
      benefits,
      process: processSteps,
      faqs,
    };
    try {
      await setDocument("treatments", slug, docData);
      setEditing(null);
      fetchTreatments();
    } catch (err) {
      console.error("Save treatment failed:", err);
      alert("Failed to save treatment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tSlug: string) => {
    if (!confirm("Are you sure you want to delete this treatment?")) return;
    try {
      await removeDocument("treatments", tSlug);
      fetchTreatments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Array handlers
  const addIndication = () => {
    if (!newIndication.trim()) return;
    setIndications([...indications, newIndication.trim()]);
    setNewIndication("");
  };
  const removeIndication = (idx: number) => {
    setIndications(indications.filter((_, i) => i !== idx));
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit("");
  };
  const removeBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const addProcessStep = () => {
    if (!stepTitle.trim() || !stepDetail.trim()) return;
    setProcessSteps([...processSteps, { step: stepTitle.trim(), detail: stepDetail.trim() }]);
    setStepTitle("");
    setStepDetail("");
  };
  const removeProcessStep = (idx: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== idx));
  };

  const addFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    setFaqs([...faqs, { q: faqQ.trim(), a: faqA.trim() }]);
    setFaqQ("");
    setFaqA("");
  };
  const removeFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl">{isNew ? "New Treatment" : `Edit Treatment: ${name}`}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-sand rounded-lg"><X /></button>
        </div>

        <form onSubmit={handleSave} className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold flex items-center gap-2"><Sparkles className="text-saffron" size={18} /> Basic Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-copper">Name (English)</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vamana" className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-copper">Sanskrit Name</label>
                  <input value={sanskrit} onChange={e => setSanskrit(e.target.value)} placeholder="e.g. वमन" className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper">Slug URL Path (Unique ID)</label>
                <input required disabled={!isNew} value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="e.g. vamana" className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron disabled:opacity-50" />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper">Short Description</label>
                <input required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Therapeutic emesis for Kapha detoxification..." className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper">Overview / Full Description</label>
                <textarea rows={4} value={overview} onChange={e => setOverview(e.target.value)} placeholder="Write a deep explanation of the therapy..." className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron resize-none" />
              </div>
            </div>

            {/* Indications & Benefits */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Indications */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-copper font-bold">✨ Indications</h3>
                <div className="flex gap-2">
                  <input value={newIndication} onChange={e => setNewIndication(e.target.value)} placeholder="e.g. Asthma" className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                  <button type="button" onClick={addIndication} className="px-3 py-1 bg-saffron text-ivory rounded text-xs font-bold">Add</button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2">
                  {indications.map((ind, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-sand/20 px-2 py-1 rounded text-xs">
                      <span>• {ind}</span>
                      <button type="button" onClick={() => removeIndication(idx)} className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-copper font-bold">🌿 Benefits</h3>
                <div className="flex gap-2">
                  <input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} placeholder="e.g. Clears breathing" className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                  <button type="button" onClick={addBenefit} className="px-3 py-1 bg-saffron text-ivory rounded text-xs font-bold">Add</button>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pt-2">
                  {benefits.map((ben, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-sand/20 px-2 py-1 rounded text-xs">
                      <span>✓ {ben}</span>
                      <button type="button" onClick={() => removeBenefit(idx)} className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Treatment Process */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold flex items-center gap-2"><ChevronRight className="text-saffron" size={18} /> Treatment Process Steps</h3>
              <div className="grid sm:grid-cols-[1fr_2fr] gap-3 items-end">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-copper">Step Name (e.g. Preparation)</label>
                  <input value={stepTitle} onChange={e => setStepTitle(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider text-copper">Detailed Description</label>
                    <input value={stepDetail} onChange={e => setStepDetail(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                  </div>
                  <button type="button" onClick={addProcessStep} className="px-4 py-2 bg-saffron text-ivory rounded text-xs font-bold shrink-0">Add Step</button>
                </div>
              </div>
              <div className="space-y-2 pt-2 divide-y divide-border/40">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                    <div>
                      <div className="text-xs font-bold text-copper">{idx + 1}. {step.step}</div>
                      <div className="text-xs text-charcoal/70 mt-0.5">{step.detail}</div>
                    </div>
                    <button type="button" onClick={() => removeProcessStep(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold flex items-center gap-2"><HelpCircle className="text-saffron" size={18} /> Frequently Asked Questions</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-copper">Question</label>
                  <input value={faqQ} onChange={e => setFaqQ(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider text-copper">Answer</label>
                    <input value={faqA} onChange={e => setFaqA(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-xs bg-ivory" />
                  </div>
                  <button type="button" onClick={addFaq} className="px-4 py-2 bg-saffron text-ivory rounded text-xs font-bold shrink-0">Add FAQ</button>
                </div>
              </div>
              <div className="space-y-2 pt-2 divide-y divide-border/40">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="flex justify-between items-start pt-2 first:pt-0">
                    <div>
                      <div className="text-xs font-bold text-copper">Q: {faq.q}</div>
                      <div className="text-xs text-charcoal/70 mt-0.5">A: {faq.a}</div>
                    </div>
                    <button type="button" onClick={() => removeFaq(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <button disabled={saving} type="submit" className="w-full px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition">
              {saving ? "Saving..." : "Save Treatment"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="w-full px-5 py-3 bg-card border border-border rounded-full text-sm font-semibold">
              Cancel
            </button>
          </aside>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl">Treatments CMS</h1>
          <p className="text-charcoal/60 mt-1">Manage Panchakarma therapies and details shown on the website.</p>
        </div>
        <button onClick={startNew} className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full shadow-soft text-sm font-bold">
          <Plus size={16} /> New Treatment
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching treatments database...</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-soft">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-sand/40 text-left">
              <tr>
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Sanskrit</th>
                <th className="px-6 py-3.5 font-medium">Slug Path</th>
                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {treatments.map((t) => (
                <tr key={t.slug} className="hover:bg-sand/20">
                  <td className="px-6 py-4 font-bold">{t.name}</td>
                  <td className="px-6 py-4 font-devanagari text-copper font-medium">{t.sanskrit || "-"}</td>
                  <td className="px-6 py-4 text-xs font-mono text-charcoal/50">/treatments/{t.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(t)} className="p-2 hover:bg-sand rounded-lg text-copper transition"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(t.slug)} className="p-2 hover:bg-sand rounded-lg text-destructive transition"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
