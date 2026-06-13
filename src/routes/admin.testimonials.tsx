import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Star } from "lucide-react";
import { getCollectionData, setDocument, removeDocument, addDocument } from "@/lib/firebase";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

interface Testimonial {
  id?: string;
  name: string;
  location: string;
  review: string;
  rating: number;
  date?: string;
}

function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<Testimonial>("testimonials");
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setIsNew(false);
    setName(t.name);
    setLocation(t.location);
    setReview(t.review);
    setRating(t.rating);
  };

  const startNew = () => {
    setEditing({} as Testimonial);
    setIsNew(true);
    setName("");
    setLocation("");
    setReview("");
    setRating(5);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !review) return;
    setSaving(true);
    
    const docData = {
      name,
      location,
      review,
      rating: Number(rating),
      date: editing?.date || "recently"
    };

    try {
      if (isNew) {
        await addDocument("testimonials", docData);
      } else if (editing?.id) {
        await setDocument("testimonials", editing.id, docData);
      }
      setEditing(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Failed to save review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert("Error: Testimonial ID is missing.");
      return;
    }
    if (typeof window !== "undefined" && !window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await removeDocument("testimonials", id);
      fetchTestimonials();
    } catch (err: any) {
      console.error("Delete review failed:", err);
      alert("Failed to delete review: " + (err.message || err));
    }
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl">{isNew ? "Add Review" : "Edit Review"}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-sand rounded-lg"><X /></button>
        </div>

        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 max-w-xl space-y-4 shadow-soft">
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Reviewer's Name</label>
            <input 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Yashodeep Pachghare" 
              className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Location / Subtitle</label>
            <input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="e.g. Pune" 
              className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Rating</label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-[#fbbc05]" : "text-charcoal/20"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Review text</label>
            <textarea 
              required 
              rows={4} 
              value={review} 
              onChange={e => setReview(e.target.value)} 
              placeholder="What they say..." 
              className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron resize-none" 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              disabled={saving} 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition"
            >
              {saving ? "Saving..." : "Save Review"}
            </button>
            <button 
              type="button" 
              onClick={() => setEditing(null)} 
              className="px-6 py-2.5 bg-card border border-border rounded-full text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl">Patient Reviews CMS</h1>
          <p className="text-charcoal/60 mt-1">Add, update, or moderate the Google reviews displayed on your website.</p>
        </div>
        <button 
          onClick={startNew} 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft animate-fade-up"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching reviews...</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-soft">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-sand/40 text-left">
              <tr>
                <th className="px-6 py-3.5 font-medium">Name</th>
                <th className="px-6 py-3.5 font-medium">Location</th>
                <th className="px-6 py-3.5 font-medium">Rating</th>
                <th className="px-6 py-3.5 font-medium">Review Snippet</th>
                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-sand/20">
                  <td className="px-6 py-4 font-bold">{t.name}</td>
                  <td className="px-6 py-4 text-charcoal/60">{t.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex text-[#fbbc05]">
                      {Array.from({ length: Math.min(5, Math.max(0, Number(t.rating) || 5)) }).map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" className="stroke-[2.5]" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-charcoal/70 max-w-xs truncate">"{t.review}"</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(t)} className="p-2 hover:bg-sand rounded-lg text-copper transition"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-sand rounded-lg text-destructive transition"><Trash2 size={14} /></button>
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
