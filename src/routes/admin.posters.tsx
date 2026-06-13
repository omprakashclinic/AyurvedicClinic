import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Link as LinkIcon, Check, Eye, EyeOff, Sparkles, Megaphone } from "lucide-react";
import { getCollectionData, setDocument, removeDocument, addDocument } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/posters")({
  component: PostersAdmin,
});

interface Poster {
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
  link: string;
  status: string; // "Active" | "Inactive"
  createdAt?: number;
}

const TAG_OPTIONS = ["Offer", "Camp", "Event", "News", "Announcement"];

function PostersAdmin() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Poster | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tag, setTag] = useState("Offer");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<Poster>("posters");
      // Sort descending by createdAt
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setPosters(data);
    } catch (err) {
      console.error("Failed to fetch posters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const startEdit = (p: Poster) => {
    setEditing(p);
    setIsNew(false);
    setTitle(p.title || "");
    setDescription(p.description || "");
    setImageUrl(p.imageUrl || "");
    setTag(p.tag || "Offer");
    setLink(p.link || "");
    setStatus(p.status || "Active");
  };

  const startNew = () => {
    setEditing({} as Poster);
    setIsNew(true);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setTag("Offer");
    setLink("");
    setStatus("Active");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert("Title and Image are required.");
      return;
    }
    setSaving(true);

    const docData: Omit<Poster, "id"> = {
      title,
      description,
      imageUrl,
      tag,
      link,
      status,
      createdAt: editing?.createdAt || Date.now()
    };

    try {
      if (isNew) {
        docData.createdAt = Date.now();
        await addDocument("posters", docData);
      } else if (editing?.id) {
        await setDocument("posters", editing.id, docData);
      }
      setEditing(null);
      fetchPosters();
    } catch (err) {
      console.error(err);
      alert("Failed to save poster.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this poster/offer?")) return;
    try {
      await removeDocument("posters", id);
      fetchPosters();
    } catch (err) {
      console.error(err);
      alert("Failed to delete poster.");
    }
  };

  const toggleStatus = async (p: Poster) => {
    if (!p.id) return;
    const newStatus = p.status === "Active" ? "Inactive" : "Active";
    try {
      await setDocument("posters", p.id, {
        ...p,
        status: newStatus
      });
      fetchPosters();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  // Helper to resolve seeded image keys to local assets or use direct cloudinary URLs
  const resolvePosterImg = (imgKey: string) => {
    if (!imgKey) return "";
    if (imgKey.startsWith("http")) return imgKey;
    // Fallback names corresponding to seeded assets
    if (imgKey === "monsoon_offer") return "/assets/monsoon_offer.png";
    if (imgKey === "spine_camp") return "/assets/spine_camp.png";
    if (imgKey === "swarnaprashan") return "/assets/swarnaprashan.png";
    return imgKey;
  };

  if (editing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">
              {isNew ? "Create Poster / Offer" : "Edit Poster / Offer"}
            </h1>
            <p className="text-xs text-charcoal/60 mt-1">
              Add details and upload a high-quality poster to display on the clinic home page.
            </p>
          </div>
          <button 
            onClick={() => setEditing(null)} 
            className="p-2 hover:bg-sand rounded-full text-charcoal/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="grid md:grid-cols-[1.2fr_1fr] gap-8">
          {/* Left Side fields */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-soft">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Title / Heading</label>
              <input 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Monsoon Rejuvenation Package 20% Off" 
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-copper font-semibold">Description / Subtext</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={4}
                placeholder="Describe the promotion or event details. e.g. Valid until end of August. Includes Abhyanga, Swedana, and Shirodhara..." 
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron resize-none" 
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-copper font-semibold">Category Tag</label>
                <select 
                  value={tag} 
                  onChange={e => setTag(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron"
                >
                  {TAG_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-copper font-semibold">Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-copper font-semibold flex items-center gap-1.5">
                <LinkIcon size={13} />
                Action Link (Optional)
              </label>
              <input 
                value={link} 
                onChange={e => setLink(e.target.value)} 
                placeholder="e.g. https://yoursite.com/register or leave blank for WhatsApp" 
                className="w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
              />
              <p className="text-[10px] text-charcoal/50 leading-relaxed">
                If left blank, clicking &quot;Enquire Now&quot; on the website will automatically redirect patients to the clinic&apos;s WhatsApp with a prefilled question about this specific poster.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                disabled={saving || uploading} 
                type="submit" 
                className="px-6 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : isNew ? "Create Announcement" : "Save Changes"}
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(null)} 
                className="px-6 py-3 bg-card border border-border rounded-full text-sm font-semibold text-charcoal/70 hover:bg-sand/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right Side: Image Uploader and Preview */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
              <h3 className="font-serif text-lg font-semibold text-charcoal">Poster Artwork</h3>

              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-border bg-sand/10 shadow-inner">
                    <img 
                      src={resolvePosterImg(imageUrl)} 
                      alt="Poster Artwork Preview" 
                      className="w-full h-full object-contain bg-sand/15" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl("")} 
                      className="absolute top-3 right-3 bg-charcoal/70 hover:bg-charcoal/90 text-ivory p-2 rounded-full shadow-md transition-colors"
                      title="Remove Image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs text-forest bg-forest/10 px-3 py-1 rounded-full font-semibold">
                      <Check size={14} /> Ready to save
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative border-2 border-dashed border-border hover:border-saffron/50 rounded-xl p-10 text-center transition bg-sand/10 min-h-[300px] flex flex-col items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    {uploading ? (
                      <div className="space-y-3">
                        <div className="h-10 w-10 rounded-full border-3 border-saffron border-t-transparent animate-spin mx-auto" />
                        <span className="text-xs font-semibold text-copper tracking-wider">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-saffron/10 text-saffron flex items-center justify-center mx-auto mb-2">
                          <ImageIcon size={24} />
                        </div>
                        <span className="block text-sm font-semibold text-charcoal">Select Flyer / Poster Artwork</span>
                        <span className="block text-xs text-charcoal/50">Supports PNG, JPG, WEBP. Recommend 4:5 vertical aspect ratio.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Live Preview Card */}
            {title && (
              <div className="bg-card border border-border rounded-[2rem] overflow-hidden p-1 shadow-soft max-w-[280px] mx-auto opacity-75">
                <div className="text-center py-2 border-b border-border/40 bg-sand/20">
                  <span className="text-[10px] tracking-wider uppercase text-charcoal/50 font-bold">Live Preview on Home</span>
                </div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand/10">
                  {imageUrl ? (
                    <img 
                      src={resolvePosterImg(imageUrl)} 
                      alt="" 
                      className="h-full w-full object-contain bg-sand/15" 
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-sand/20 text-charcoal/40 text-xs">
                      No poster uploaded
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 bg-saffron text-ivory rounded-full">
                      {tag}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1.5 bg-card">
                  <h4 className="font-serif text-sm font-bold text-charcoal truncate">{title}</h4>
                  <p className="text-[10px] text-charcoal/70 line-clamp-2 leading-relaxed">{description || "No description provided."}</p>
                  <div className="pt-2">
                    <div className="w-full text-center py-1.5 bg-sand/40 border border-border text-[10px] font-bold rounded-full">
                      Enquire Now
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-charcoal">Posters & Offers CMS</h1>
          <p className="text-charcoal/60 mt-1">
            Publish offers, flyers, discounts, and latest announcements. The latest 3 active posters are displayed on the home page.
          </p>
        </div>
        <button 
          onClick={startNew} 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition"
        >
          <Plus size={16} /> Add Poster / Offer
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching posters database...</div>
      ) : posters.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl max-w-2xl mx-auto p-8 space-y-4">
          <div className="h-16 w-16 rounded-full bg-saffron/10 text-saffron flex items-center justify-center mx-auto">
            <Megaphone size={28} />
          </div>
          <h3 className="font-serif text-xl font-bold text-charcoal">No Posters or Offers Seeded</h3>
          <p className="text-sm text-charcoal/60 max-w-md mx-auto">
            Get started by creating your first announcement, medical camp flyer, or seasonal discount poster.
          </p>
          <button 
            onClick={startNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft"
          >
            Create First Poster
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((p) => {
            const isActive = p.status === "Active";
            return (
              <div 
                key={p.id} 
                className={`group relative bg-card border rounded-[2rem] overflow-hidden shadow-soft flex flex-col justify-between transition-all duration-300 ${
                  isActive ? "border-border hover:border-saffron/40 hover:shadow-luxe" : "border-border/60 opacity-60"
                }`}
              >
                <div>
                  <div className="relative aspect-[4/5] bg-sand/10 overflow-hidden border-b border-border/40">
                    <img 
                      src={resolvePosterImg(p.imageUrl)} 
                      alt={p.title} 
                      className="w-full h-full object-contain bg-sand/15 transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    
                    {/* Tag badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] tracking-widest uppercase font-bold px-3 py-1 bg-saffron text-ivory rounded-full shadow-soft">
                        {p.tag}
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => toggleStatus(p)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1 rounded-full shadow-soft transition-colors ${
                          isActive 
                            ? "bg-forest text-ivory hover:bg-forest/90" 
                            : "bg-charcoal text-ivory/60 hover:bg-charcoal/90"
                        }`}
                        title={isActive ? "Deactivate poster" : "Activate poster"}
                      >
                        {isActive ? (
                          <>
                            <Eye size={10} /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff size={10} /> Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal leading-snug truncate-2-lines min-h-[50px]">
                      {p.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3">
                      {p.description || "No description provided."}
                    </p>
                    {p.link && (
                      <div className="flex items-center gap-1.5 text-[10px] text-copper font-medium pt-1 truncate">
                        <LinkIcon size={10} />
                        <span>{p.link}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-border/30 bg-sand/5 flex items-center justify-between">
                  <span className="text-[10px] text-charcoal/40 font-medium">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Custom"}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEdit(p)} 
                      className="p-2 bg-sand hover:bg-saffron/10 hover:text-saffron text-copper rounded-lg transition"
                      title="Edit Poster"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-2 bg-sand hover:bg-red-50 hover:text-destructive text-destructive/80 rounded-lg transition"
                      title="Delete Poster"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
