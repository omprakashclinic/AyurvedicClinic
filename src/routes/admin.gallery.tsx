import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, X, Image as ImageIcon, Check } from "lucide-react";
import { getCollectionData, addDocument, removeDocument } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

interface GalleryItem {
  id: string;
  cat: string;
  img: string;
}

const CATS = ["Clinic Interior", "Panchakarma Therapies", "Wellness Activities", "Herbal Medicines", "Patient Events"];

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload states
  const [uploading, setUploading] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Clinic Interior");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<GalleryItem>("gallery");
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setUploadedUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!uploadedUrl) return;
    try {
      await addDocument("gallery", {
        cat: selectedCat,
        img: uploadedUrl
      });
      setUploadedUrl("");
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert("Failed to save gallery item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await removeDocument("gallery", id);
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl">Gallery CMS</h1>
        <p className="text-charcoal/60 mt-1">Upload and organize images by categories displayed on the website.</p>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Side: Photo Grid */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="font-serif text-xl font-bold">Uploaded Images ({items.length})</h2>
          {loading ? (
            <div className="py-12 text-center text-charcoal/50">Loading gallery database...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((it) => (
                <div key={it.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-sand/20">
                  <img 
                    src={it.img.startsWith("http") ? it.img : `/assets/${it.img}.jpg`} 
                    alt={it.cat} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-between p-3">
                    <span className="text-[10px] uppercase bg-saffron text-ivory px-2 py-0.5 rounded-full w-fit">{it.cat}</span>
                    <button 
                      onClick={() => handleDelete(it.id)} 
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-ivory rounded-lg ml-auto transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Upload Box */}
        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-soft">
            <h3 className="font-serif text-lg font-semibold">Upload New Image</h3>
            
            <div>
              <label className="text-xs uppercase tracking-widest text-copper">Category</label>
              <select 
                value={selectedCat} 
                onChange={e => setSelectedCat(e.target.value)}
                className="mt-2 w-full px-3 py-2 bg-sand/30 border border-border rounded text-xs focus:outline-none focus:border-saffron"
              >
                {CATS.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest text-copper">Choose File</label>
              {uploadedUrl && (
                <div className="aspect-video rounded-lg overflow-hidden border border-border relative mb-2">
                  <img src={uploadedUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setUploadedUrl("")} className="absolute top-1 right-1 bg-charcoal/70 text-ivory p-1.5 rounded-full">✕</button>
                </div>
              )}
              
              <div className="relative border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-saffron transition bg-sand/10">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
                <ImageIcon className="mx-auto mb-2 text-charcoal/40" size={32} />
                <span className="text-xs text-charcoal/60">
                  {uploading ? "Uploading to Cloudinary..." : "Click to select a file"}
                </span>
              </div>
            </div>

            <button 
              type="button"
              disabled={!uploadedUrl}
              onClick={handleSaveItem}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50"
            >
              <Plus size={16} /> Save to Gallery
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
