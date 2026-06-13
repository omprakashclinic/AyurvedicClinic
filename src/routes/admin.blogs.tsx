import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Check } from "lucide-react";
import { getCollectionData, setDocument, removeDocument } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/blogs")({
  component: BlogAdmin,
});

interface BlogContentBlock {
  type: "paragraph" | "heading" | "blockquote";
  text: string;
}

interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  image: string;
  content?: BlogContentBlock[];
}

function BlogAdmin() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<BlogPost>("blogs");
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await removeDocument("blogs", slug);
      fetchBlogs();
    } catch (err) {
      console.error("Delete blog failed:", err);
    }
  };

  if (editing) {
    return (
      <BlogEditor 
        post={editing} 
        isNew={isNew} 
        onClose={() => setEditing(null)} 
        onSave={() => {
          setEditing(null);
          fetchBlogs();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl">Blog Management</h1>
          <p className="text-charcoal/60 mt-1">Create, edit and publish Marathi articles.</p>
        </div>
        <button 
          onClick={() => {
            setEditing({} as BlogPost);
            setIsNew(true);
          }} 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft"
        >
          <Plus size={16}/> New Article
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching articles...</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-sand/40 text-left">
              <tr>
                <th className="px-6 py-3.5 font-medium">Title</th>
                <th className="px-6 py-3.5 font-medium">Category</th>
                <th className="px-6 py-3.5 font-medium">Date</th>
                <th className="px-6 py-3.5 font-medium">Author</th>
                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {blogs.map((p) => (
                <tr key={p.slug} className="hover:bg-sand/20">
                  <td className="px-6 py-4 font-devanagari font-bold text-base max-w-xs truncate">{p.title}</td>
                  <td className="px-6 py-4 font-devanagari text-copper font-medium">{p.category}</td>
                  <td className="px-6 py-4 font-devanagari text-charcoal/60">{p.date}</td>
                  <td className="px-6 py-4 font-devanagari text-charcoal/60">{p.author}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(p); setIsNew(false); }} className="p-2 hover:bg-sand rounded-lg text-copper transition"><Edit2 size={14}/></button>
                      <button onClick={() => handleDelete(p.slug)} className="p-2 hover:bg-sand rounded-lg text-destructive transition"><Trash2 size={14}/></button>
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

interface EditorProps {
  post: BlogPost;
  isNew: boolean;
  onClose: () => void;
  onSave: () => void;
}

function BlogEditor({ post, isNew, onClose, onSave }: EditorProps) {
  const [title, setTitle] = useState(post.title || "");
  const [slug, setSlug] = useState(post.slug || "");
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [category, setCategory] = useState(post.category || "आयुर्वेद");
  const [author, setAuthor] = useState(post.author || "डॉ. ओमप्रकाश तिखे");
  const [date, setDate] = useState(post.date || "");
  const [readTime, setReadTime] = useState(post.readTime || "5 मिनिटे");
  const [image, setImage] = useState(post.image || "");
  const [featured, setFeatured] = useState(post.featured || false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Content string mapping
  const [rawContent, setRawContent] = useState("");

  useEffect(() => {
    if (post.content) {
      // Map blocks back to a text representation
      const text = post.content.map(block => {
        if (block.type === "heading") return `## ${block.text}`;
        if (block.type === "blockquote") return `> ${block.text}`;
        return block.text;
      }).join("\n\n");
      setRawContent(text);
    } else {
      setRawContent("");
    }
  }, [post]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImage(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload image to Cloudinary.");
    } finally {
      setUploading(false);
    }
  };

  const parseContent = (text: string): BlogContentBlock[] => {
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map(p => {
      const clean = p.trim();
      if (clean.startsWith("## ")) {
        return { type: "heading", text: clean.replace("## ", "") };
      }
      if (clean.startsWith("> ")) {
        return { type: "blockquote", text: clean.replace("> ", "") };
      }
      return { type: "paragraph", text: clean };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    setSaving(true);
    
    // Auto-calculate date if empty
    const displayDate = date || new Date().toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });
    
    const docData: BlogPost = {
      slug,
      title,
      excerpt,
      category,
      author,
      date: displayDate,
      readTime,
      featured,
      image: image || "shirodhara", // Fallback
      content: parseContent(rawContent)
    };

    try {
      await setDocument("blogs", slug, docData);
      onSave();
    } catch (err) {
      console.error("Save article failed:", err);
      alert("Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">{isNew ? "New Article" : `Edit Article: ${title}`}</h1>
        <button onClick={onClose} className="p-2 hover:bg-sand rounded-lg"><X/></button>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <input 
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="लेखाचे शीर्षक..." 
            className="w-full px-5 py-4 text-2xl font-devanagari font-serif bg-card border border-border rounded-xl focus:outline-none focus:border-saffron"
          />
          <input 
            required
            disabled={!isNew}
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="URL slug (e.g. panchakarma-process)" 
            className="w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron disabled:opacity-50"
          />

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-copper tracking-wider font-bold">
              <span>ARTICLE BODY (MARATHI)</span>
              <span className="text-[10px] text-charcoal/50">Tip: Use "## Heading" for headings and "&gt; Quote" for quotes</span>
            </div>
            <textarea 
              rows={16} 
              value={rawContent}
              onChange={e => setRawContent(e.target.value)}
              placeholder="आपला लेख येथे लिहा..." 
              className="w-full px-5 py-4 font-devanagari text-lg leading-relaxed bg-ivory border border-border rounded-xl focus:outline-none focus:border-saffron resize-none"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-serif text-lg font-semibold">Excerpt / Summary</h3>
            <textarea 
              rows={3} 
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="लेखाचा संक्षिप्त परिचय..." 
              className="w-full px-4 py-2.5 bg-ivory border border-border rounded-lg text-sm focus:outline-none focus:border-saffron resize-none"
            />
          </div>
        </div>

        <aside className="space-y-4">
          <button disabled={saving} type="submit" className="w-full px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft">
            {saving ? "Publishing..." : "Publish Article"}
          </button>
          
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-copper mb-2">Featured Image</h4>
            {image && (
              <div className="aspect-video rounded-lg overflow-hidden border border-border relative group mb-2">
                <img src={image.startsWith("http") ? image : `/assets/${image}.jpg`} alt="Featured" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImage("")} className="absolute top-1 right-1 bg-charcoal/70 text-ivory p-1.5 rounded-full hover:bg-red-500">✕</button>
              </div>
            )}
            <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-saffron transition bg-sand/10">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <ImageIcon className="mx-auto mb-2 text-charcoal/40" size={24} />
              <span className="text-xs text-charcoal/60">{uploading ? "Uploading to Cloudinary..." : "Choose featured image"}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-copper">Settings</h4>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-copper">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 bg-sand/30 border border-border rounded text-xs">
                <option>आयुर्वेद</option>
                <option>पंचकर्म</option>
                <option>आरोग्य टिप्स</option>
                <option>जीवनशैली</option>
                <option>आहार</option>
                <option>योग</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-copper">Author Name</label>
              <input value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2 bg-sand/30 border border-border rounded text-xs" />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-copper">Read Time (e.g. 5 मिनिटे)</label>
              <input value={readTime} onChange={e => setReadTime(e.target.value)} className="mt-1 w-full px-3 py-2 bg-sand/30 border border-border rounded text-xs" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="featured-check" checked={featured} onChange={e => setFeatured(e.target.checked)} className="rounded border-border text-saffron focus:ring-saffron" />
              <label htmlFor="featured-check" className="text-xs text-charcoal/70">Featured Post</label>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
