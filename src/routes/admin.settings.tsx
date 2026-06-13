import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  User, Sparkles, Heart, Phone, Mail, Clock, MapPin, 
  Save, Loader2, Image as ImageIcon, Check, Settings, ShieldAlert
} from "lucide-react";
import { getDocumentData, setDocument } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin/settings")({
  component: ClinicSettingsCMS,
});

function ClinicSettingsCMS() {
  const [activeTab, setActiveTab] = useState<"doctor" | "clinic">("doctor");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Doctor Settings State
  const [doctor, setDoctor] = useState("Dr. Omprakash Tikhe");
  const [qualifications, setQualifications] = useState("BAMS, MD (Ayurveda Speciality)");
  const [experienceYears, setExperienceYears] = useState("7+");
  const [experience, setExperience] = useState("7+ Years in Speciality Ayurveda");
  const [specialisation, setSpecialisation] = useState("Panchakarma · Nadi Pariksha · Chronic Care");
  const [expertise, setExpertise] = useState("Basti, Agnikarma, Dorn Therapy, Structural Integra");
  const [philosophy, setPhilosophy] = useState("Holistic rejuvenation of physical structures and doshas");
  const [doctorImage, setDoctorImage] = useState("");

  // Clinic Settings State
  const [name, setName] = useState("Shree Vishvmaharshi Ayurved Speciality Panchkarma Clinic");
  const [phone, setPhone] = useState("+91 91754 53232");
  const [whatsapp, setWhatsapp] = useState("9175453232");
  const [email, setEmail] = useState("info@vishvmaharshi.com");
  const [address, setAddress] = useState("Shop No. 1, Ground Floor, Pune");
  const [hours, setHours] = useState("Mon - Sat: 9:00 AM - 1:00 PM, 5:00 PM - 9:00 PM");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getDocumentData("settings", "clinic");
        if (data) {
          if (data.doctor) setDoctor(data.doctor);
          if (data.qualifications) setQualifications(data.qualifications);
          if (data.experienceYears) setExperienceYears(data.experienceYears);
          if (data.experience) setExperience(data.experience);
          if (data.specialisation) setSpecialisation(data.specialisation);
          if (data.expertise) setExpertise(data.expertise);
          if (data.philosophy) setPhilosophy(data.philosophy);
          if (data.doctorImage) setDoctorImage(data.doctorImage);
          if (data.name) setName(data.name);
          if (data.phone) setPhone(data.phone);
          if (data.whatsapp) setWhatsapp(data.whatsapp);
          if (data.email) setEmail(data.email);
          if (data.address) setAddress(data.address);
          if (data.hours) setHours(data.hours);
        }
      } catch (err) {
        console.error("Failed to load clinic settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const url = await uploadToCloudinary(file);
      setDoctorImage(url);
      setMessage({ type: "success", text: "Doctor portrait uploaded successfully! Remember to save settings." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to upload image. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await setDocument("settings", "clinic", {
        doctor,
        qualifications,
        experienceYears,
        experience,
        specialisation,
        expertise,
        philosophy,
        doctorImage,
        name,
        phone,
        whatsapp,
        email,
        address,
        hours,
        updatedAt: Date.now()
      });
      setMessage({ type: "success", text: "Clinic settings updated successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to save settings to Firestore." });
    } finally {
      setSaving(false);
    }
  };

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
        <h1 className="font-serif text-3xl text-charcoal">Website Settings CMS</h1>
        <p className="text-charcoal/60 text-sm mt-1">Configure homepage doctor credentials, clinic hours, phone numbers, and profile photo.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm leading-relaxed ${
          message.type === "success" 
            ? "bg-forest/10 border-forest/30 text-forest" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {message.type === "success" ? <Check size={18} /> : <ShieldAlert size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("doctor")}
          className={`px-6 py-3 font-serif text-sm font-semibold border-b-2 transition ${
            activeTab === "doctor" 
              ? "border-saffron text-saffron" 
              : "border-transparent text-charcoal/60 hover:text-charcoal"
          }`}
        >
          Doctor Profile Details
        </button>
        <button
          onClick={() => setActiveTab("clinic")}
          className={`px-6 py-3 font-serif text-sm font-semibold border-b-2 transition ${
            activeTab === "clinic" 
              ? "border-saffron text-saffron" 
              : "border-transparent text-charcoal/60 hover:text-charcoal"
          }`}
        >
          Clinic Contact & Hours
        </button>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "doctor" ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2 mb-2">
                <User size={18} className="text-saffron" />
                Vaidya Profile & Credentials
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium">Doctor Name</label>
                  <input
                    required
                    type="text"
                    value={doctor}
                    onChange={e => setDoctor(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium">Qualifications (BAMS, MD etc)</label>
                  <input
                    required
                    type="text"
                    value={qualifications}
                    onChange={e => setQualifications(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium">Years of Experience (eg. 7+)</label>
                  <input
                    required
                    type="text"
                    value={experienceYears}
                    onChange={e => setExperienceYears(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium">Experience Headline</label>
                  <input
                    required
                    type="text"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                  <Sparkles size={12}/> Specialisation
                </label>
                <input
                  required
                  type="text"
                  value={specialisation}
                  onChange={e => setSpecialisation(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                  <Heart size={12}/> Expertise (Comma separated list)
                </label>
                <input
                  required
                  type="text"
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium">Vaidya Healing Philosophy</label>
                <textarea
                  rows={3}
                  value={philosophy}
                  onChange={e => setPhilosophy(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2 mb-2">
                <Settings size={18} className="text-saffron" />
                Clinic Details & Contact Channels
              </h2>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium">Clinic Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                    <Phone size={12}/> Phone Number
                  </label>
                  <input
                    required
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-copper font-medium">WhatsApp Number (For booking chat)</label>
                  <input
                    required
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="e.g. 9175453232"
                    className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                  <Mail size={12}/> Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                  <Clock size={12}/> Clinic Timing Hours
                </label>
                <input
                  required
                  type="text"
                  value={hours}
                  onChange={e => setHours(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-copper font-medium flex items-center gap-1">
                  <MapPin size={12}/> Address Line
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="mt-2 w-full px-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-saffron resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Image Uploader & Actions */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-charcoal">Save Configurations</h3>
            <button
              disabled={saving}
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-saffron text-ivory rounded-full text-sm font-bold shadow-soft hover:opacity-95 transition disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? "Saving changes..." : "Save Settings"}</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-copper font-semibold">Doctor Profile Image</h3>
            {doctorImage ? (
              <div className="aspect-[4/5] rounded-xl overflow-hidden border border-border relative group">
                <img 
                  src={doctorImage} 
                  alt="Doctor portrait preview" 
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button" 
                  onClick={() => setDoctorImage("")} 
                  className="absolute top-2 right-2 bg-charcoal/80 text-ivory p-1.5 rounded-full hover:bg-red-500 shadow-soft transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="aspect-[4/5] bg-sand/20 border-2 border-dashed border-border rounded-xl grid place-items-center text-charcoal/40 p-4">
                <div className="text-center space-y-2">
                  <ImageIcon className="mx-auto" size={36} />
                  <p className="text-xs">No profile photo uploaded yet.</p>
                </div>
              </div>
            )}

            <div className="relative border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-saffron transition bg-sand/10 cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <ImageIcon className="mx-auto mb-2 text-charcoal/40" size={20} />
              <span className="text-xs text-charcoal/60">
                {uploading ? "Uploading portrait image..." : "Upload Portrait Photo"}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
