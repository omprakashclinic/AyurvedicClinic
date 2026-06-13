import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Search, CheckCircle } from "lucide-react";
import { getDocumentData, setDocument } from "@/lib/firebase";

export const Route = createFileRoute("/admin/seo")({
  component: SeoAdmin,
});

interface SeoPageMeta {
  title: string;
  description: string;
  keywords: string;
}

interface SeoSettings {
  home: SeoPageMeta;
  about: SeoPageMeta;
  treatments: SeoPageMeta;
  gallery: SeoPageMeta;
  blog: SeoPageMeta;
  reviews: SeoPageMeta;
  contact: SeoPageMeta;
}

const defaultSeo: SeoSettings = {
  home: { title: "", description: "", keywords: "" },
  about: { title: "", description: "", keywords: "" },
  treatments: { title: "", description: "", keywords: "" },
  gallery: { title: "", description: "", keywords: "" },
  blog: { title: "", description: "", keywords: "" },
  reviews: { title: "", description: "", keywords: "" },
  contact: { title: "", description: "", keywords: "" },
};

const pagesList: { key: keyof SeoSettings; label: string }[] = [
  { key: "home", label: "Home Page" },
  { key: "about", label: "About Page" },
  { key: "treatments", label: "Treatments Page" },
  { key: "gallery", label: "Gallery Page" },
  { key: "blog", label: "Blog Page" },
  { key: "reviews", label: "Reviews Page" },
  { key: "contact", label: "Contact Page" },
];

function SeoAdmin() {
  const [seo, setSeo] = useState<SeoSettings>(defaultSeo);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof SeoSettings>("home");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSeo = async () => {
    setLoading(true);
    try {
      const data = await getDocumentData<SeoSettings>("settings", "seo");
      if (data) {
        // Filter out ID field
        const { id, ...cleanData } = data as any;
        setSeo({ ...defaultSeo, ...cleanData });
      }
    } catch (err) {
      console.error("Failed to load SEO settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeo();
  }, []);

  const handleFieldChange = (pageKey: keyof SeoSettings, field: keyof SeoPageMeta, value: string) => {
    setSeo({
      ...seo,
      [pageKey]: {
        ...seo[pageKey],
        [field]: value
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await setDocument("settings", "seo", seo);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">SEO Settings</h1>
        <p className="text-charcoal/60 mt-1">Configure titles, descriptions and search keywords for each page of the clinic website.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching SEO settings...</div>
      ) : (
        <form onSubmit={handleSave} className="grid lg:grid-cols-[250px_1fr] gap-8">
          {/* Side tabs */}
          <div className="flex flex-col gap-1.5 bg-card border border-border p-3 rounded-2xl h-fit">
            {pagesList.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setActiveTab(p.key)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${activeTab === p.key ? "bg-saffron text-ivory shadow-soft" : "hover:bg-sand/30 text-charcoal/70"}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Form details */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 shadow-soft relative">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-sand text-copper rounded-xl grid place-items-center"><Search size={18} /></div>
              <div>
                <h3 className="font-serif text-xl font-bold">{pagesList.find(p => p.key === activeTab)?.label} SEO</h3>
                <p className="text-xs text-charcoal/55">Optimize how this page appears in Google search engine rankings.</p>
              </div>
            </div>

            <div className="h-px bg-border/40" />

            <div className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-bold">Meta Title Tag</label>
                <input
                  required
                  value={seo[activeTab].title}
                  onChange={e => handleFieldChange(activeTab, "title", e.target.value)}
                  placeholder="e.g. Authentic Ayurvedic Panchakarma in Pune — Shree Vishvmaharshi"
                  className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron"
                />
                <span className="text-[10px] text-charcoal/50 mt-1 block">Recommended: Under 60 characters. Current: {seo[activeTab].title.length} characters.</span>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-bold">Meta Description</label>
                <textarea
                  required
                  rows={4}
                  value={seo[activeTab].description}
                  onChange={e => handleFieldChange(activeTab, "description", e.target.value)}
                  placeholder="e.g. Dr. Omprakash Tikhe is a reputed Ayurvedic physician in Pune offering specialized Panchakarma therapies..."
                  className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron resize-none"
                />
                <span className="text-[10px] text-charcoal/50 mt-1 block">Recommended: Under 160 characters. Current: {seo[activeTab].description.length} characters.</span>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-bold">Meta Keywords</label>
                <input
                  value={seo[activeTab].keywords}
                  onChange={e => handleFieldChange(activeTab, "keywords", e.target.value)}
                  placeholder="e.g. ayurvedic clinic, dr omprakash tikhe, panchakarma pune"
                  className="mt-2 w-full px-4 py-3 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron"
                />
                <span className="text-[10px] text-charcoal/50 mt-1 block">Comma separated list of tags to enhance search indexing.</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                disabled={saving}
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition"
              >
                <Save size={16} /> {saving ? "Saving..." : "Save SEO Settings"}
              </button>
              {saved && (
                <span className="text-forest text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved successfully!</span>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
