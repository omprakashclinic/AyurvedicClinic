import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Play } from "lucide-react";
import { getCollectionData, setDocument, removeDocument, addDocument } from "@/lib/firebase";
import { getYouTubeId } from "@/lib/utils";

export const Route = createFileRoute("/admin/videos")({
  component: VideosAdmin,
});

interface Video {
  id?: string;
  title: string;
  duration: string;
  views: string;
  youtubeId: string;
}

function VideosAdmin() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Video | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [views, setViews] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData<Video>("videos");
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const startEdit = (v: Video) => {
    setEditing(v);
    setIsNew(false);
    setTitle(v.title);
    setDuration(v.duration);
    setViews(v.views);
    setYoutubeId(v.youtubeId);
  };

  const startNew = () => {
    setEditing({} as Video);
    setIsNew(true);
    setTitle("");
    setDuration("");
    setViews("");
    setYoutubeId("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId) return;
    setSaving(true);

    const docData = {
      title,
      duration: duration || "5:00",
      views: views || "0 views",
      youtubeId
    };

    try {
      if (isNew) {
        await addDocument("videos", docData);
      } else if (editing?.id) {
        await setDocument("videos", editing.id, docData);
      }
      setEditing(null);
      fetchVideos();
    } catch (err) {
      console.error(err);
      alert("Failed to save video.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this video?")) return;
    try {
      await removeDocument("videos", id);
      fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl">{isNew ? "Add Video" : "Edit Video"}</h1>
          <button onClick={() => setEditing(null)} className="p-2 hover:bg-sand rounded-lg"><X /></button>
        </div>

        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 max-w-xl space-y-4 shadow-soft">
          <div>
            <label className="text-xs uppercase tracking-widest text-copper">Video Title</label>
            <input 
              required 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Daily Ayurvedic Routine" 
              className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-copper">Duration (e.g. 8:24)</label>
              <input 
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                placeholder="e.g. 10:15" 
                className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-copper">Views label</label>
              <input 
                value={views} 
                onChange={e => setViews(e.target.value)} 
                placeholder="e.g. 12K views" 
                className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-copper">YouTube Video ID</label>
            <input 
              required 
              value={youtubeId} 
              onChange={e => setYoutubeId(e.target.value)} 
              placeholder="e.g. c_q20v_l6eI (found in the watch URL after v=)" 
              className="mt-2 w-full px-4 py-2.5 border border-border rounded-lg bg-ivory text-sm focus:outline-none focus:border-saffron" 
            />
          </div>

          {youtubeId && (
            <div className="aspect-video rounded-xl overflow-hidden border border-border">
              <iframe 
                src={`https://www.youtube.com/embed/${getYouTubeId(youtubeId)}`} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true}
              ></iframe>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              disabled={saving} 
              type="submit" 
              className="px-6 py-2.5 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft"
            >
              {saving ? "Saving..." : "Save Video"}
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
          <h1 className="font-serif text-4xl">Doctor Videos CMS</h1>
          <p className="text-charcoal/60 mt-1">Manage video entries and YouTube placements on the home page.</p>
        </div>
        <button 
          onClick={startNew} 
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-charcoal/50">Fetching videos database...</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-sand/40 text-left">
              <tr>
                <th className="px-6 py-3.5 font-medium">Video Title</th>
                <th className="px-6 py-3.5 font-medium">Duration</th>
                <th className="px-6 py-3.5 font-medium">Views</th>
                <th className="px-6 py-3.5 font-medium">YouTube Embed ID</th>
                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-sand/20">
                  <td className="px-6 py-4 font-bold flex items-center gap-2.5">
                    <Play size={14} className="text-saffron fill-saffron" />
                    <span>{v.title}</span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/60">{v.duration}</td>
                  <td className="px-6 py-4 text-charcoal/60">{v.views}</td>
                  <td className="px-6 py-4 text-xs font-mono text-copper">{v.youtubeId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(v)} className="p-2 hover:bg-sand rounded-lg text-copper transition"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-sand rounded-lg text-destructive transition"><Trash2 size={14} /></button>
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
