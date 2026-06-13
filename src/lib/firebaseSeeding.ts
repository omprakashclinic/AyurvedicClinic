import { db } from "./firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { treatments, blogPosts, galleryItems } from "./site-data";

// Initial Google reviews from the clinic's listing
const googleReviews = [
  { name: "Yashodeep Pachghare", location: "Pune", review: "Doctor is knowledgeable and staff is cooperative.", rating: 5 },
  { name: "Nirmala Kamble", location: "Pune", review: "Doctor Omprakash Tikhe Sir is a genuine Ayurvedic Doctor in Pune.", rating: 5 },
  { name: "Sanket Bhoyar", location: "Pune", review: "This clinic providing holistic and modern approach for treatment of diseases.", rating: 5 },
  { name: "Priya Deshmukh", location: "Pune", review: "Six years of chronic back pain — gone in three weeks of Kati Basti. The care here is unlike any clinic I've visited.", rating: 5 },
  { name: "Rahul Joshi", location: "Mumbai", review: "Shirodhara changed my sleep. I now wake up calm. Dr. Omprakash Tikhe is a true healer.", rating: 5 },
  { name: "Anjali Kulkarni", location: "Nashik", review: "PCOD symptoms reduced dramatically after the customised Panchakarma plan. Grateful beyond words.", rating: 5 }
];

// Clinic details mapping
export const defaultSEO = {
  home: {
    title: "Shree Vishvmaharshi Ayurved Speciality Panchkarma Clinic",
    description: "Dr. Omprakash Tikhe offers authentic Panchakarma and Ayurvedic treatments in Pune. Over 7 years of healing experience.",
    keywords: "ayurveda pune, panchakarma clinic, dr omprakash tikhe, best ayurvedic doctor"
  },
  about: {
    title: "About Dr. Omprakash Tikhe & Clinic — Shree Vishvmaharshi",
    description: "Learn about Dr. Omprakash Tikhe (BAMS, MD), a leading Ayurvedic physician in Pune with 7+ years of experience.",
    keywords: "ayurvedic doctor profile, ayurveda lineage, clinic history"
  },
  treatments: {
    title: "Ayurvedic Treatments & Panchakarma Directory — Shree Vishvmaharshi",
    description: "Explore Vamana, Virechana, Basti, Nasya, Raktamokshana, Agnikarma, Spine Alignment, and Dorn Therapy.",
    keywords: "panchakarma treatments, basti, virechana, vaman, agnikarma"
  },
  gallery: {
    title: "Photo & Media Gallery — Shree Vishvmaharshi Clinic",
    description: "A virtual look inside our speciality Panchkarma clinic and therapy rooms in Pune.",
    keywords: "clinic interior, panchakarma therapy rooms, herbal remedies"
  },
  blog: {
    title: "Ayurvedic Health Wisdom & Blogs — Shree Vishvmaharshi",
    description: "Read Marathi articles on Ayurvedic lifestyle, seasonal diets, yoga, and natural health tips.",
    keywords: "marathi health tips, ayurvedic blog marathi, home remedies"
  },
  reviews: {
    title: "Patient Reviews & Testimonials — Shree Vishvmaharshi Clinic",
    description: "Read verified Google reviews from our patients in Pune regarding their treatment results.",
    keywords: "google reviews, patient feedback, clinic rating"
  },
  contact: {
    title: "Contact & Book Consultation — Shree Vishvmaharshi Clinic",
    description: "Visit us at Katraj-Ambegaon Rd, Pune or book an online consultation. Call +91 84850 19880.",
    keywords: "book appointment, clinic address, contact number, timing"
  }
};

const defaultClinicSettings = {
  name: "Shree Vishvmaharshi Ayurved Speciality Panchkarma Clinic",
  doctor: "Dr. Omprakash Tikhe",
  qualifications: "BAMS, MD (Ayurveda)",
  experience: "7+ years",
  phone: "084850 19880",
  address: "chhatrapati Shivaji maharaj chowk, near mahendra market, opposite to hotel jagdamb, Nilgiri Road, Katraj - Ambegaon BK Rd, Pune, Maharashtra 411046",
  hours: "Open · Closes 9 PM (Mon-Sun)",
  whatsapp: "918485019880",
  email: "contact@vishvmaharshiclinic.in",
  googleMapsUrl: "https://maps.google.com/maps?q=Shree%20Vishvmaharshi%20Ayurved%20Speciality%20Panchkarma%20Clinic%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
};

// Video attachments with real video URLs or YouTube IDs
const initialVideos = [
  { title: "Understanding Your Dosha", duration: "8:24", views: "12K", youtubeId: "c_q20v_l6eI" },
  { title: "Daily Ayurvedic Routine (Dinacharya)", duration: "12:10", views: "24K", youtubeId: "V5dG35fB79M" },
  { title: "What to Expect in Panchakarma", duration: "6:42", views: "18K", youtubeId: "Z7xRlhbE4j8" },
  { title: "Herbs for Immunity", duration: "9:15", views: "9K", youtubeId: "D8eGj1T_bT4" }
];

// Mock Patients
const mockPatients = [
  {
    id: "patient_1",
    name: "Yashodeep Pachghare",
    email: "yashodeep@gmail.com",
    phone: "084850 19880",
    age: 29,
    gender: "Male",
    condition: "Spine Alignment & Back Pain",
    notes: "Patient suffers from lower back spasms due to prolonged sitting. Administering Dorn spinal alignments and oil therapies. Progress is positive.",
    joinedDate: "2026-05-15"
  },
  {
    id: "patient_2",
    name: "Nirmala Kamble",
    email: "nirmala@yahoo.com",
    phone: "0987654322",
    age: 54,
    gender: "Female",
    condition: "Knee Joint Stiffness",
    notes: "Experiencing bilateral knee friction. Undergoing Janu Basti courses with medicated Sahacharadi taila. Knee mobility has increased.",
    joinedDate: "2026-05-20"
  },
  {
    id: "patient_3",
    name: "Sanket Bhoyar",
    email: "sanket@outlook.com",
    phone: "0987654323",
    age: 34,
    gender: "Male",
    condition: "Pitta Acidity & Migraine",
    notes: "Hyperacidity symptoms accompanied by periodic headaches. Prescribed seasonal Virechana therapy and strict dietary controls.",
    joinedDate: "2026-06-01"
  },
  {
    id: "patient_4",
    name: "Priya Deshmukh",
    email: "priya@gmail.com",
    phone: "0987654324",
    age: 42,
    gender: "Female",
    condition: "Sciatica & Lumbar Pain",
    notes: "Sciatic nerve compression on left side. Treated with Kati Basti and specialized herbal oils. Significant reduction in pain scale.",
    joinedDate: "2026-06-03"
  },
  {
    id: "patient_5",
    name: "Rahul Joshi",
    email: "rahul@gmail.com",
    phone: "0987654325",
    age: 38,
    gender: "Male",
    condition: "Insomnia & Vata Imbalance",
    notes: "Suffering from high anxiety and sleeplessness. Administering Shirodhara course to calm the nervous system.",
    joinedDate: "2026-06-05"
  }
];

// Mock Appointments
const mockAppointments = [
  {
    id: "app_1",
    patientId: "patient_1",
    patientName: "Yashodeep Pachghare",
    patientPhone: "084850 19880",
    treatment: "Spine Alignment",
    date: "2026-06-12",
    time: "10:00 AM",
    status: "Confirmed",
    type: "In-Clinic"
  },
  {
    id: "app_2",
    patientId: "patient_2",
    patientName: "Nirmala Kamble",
    patientPhone: "0987654322",
    treatment: "Janu Basti",
    date: "2026-06-12",
    time: "11:30 AM",
    status: "Confirmed",
    type: "In-Clinic"
  },
  {
    id: "app_3",
    patientId: "patient_3",
    patientName: "Sanket Bhoyar",
    patientPhone: "0987654323",
    treatment: "Virechana",
    date: "2026-06-12",
    time: "02:00 PM",
    status: "Pending",
    type: "In-Clinic"
  },
  {
    id: "app_4",
    patientId: "patient_4",
    patientName: "Priya Deshmukh",
    patientPhone: "0987654324",
    treatment: "Kati Basti",
    date: "2026-06-13",
    time: "10:00 AM",
    status: "Confirmed",
    type: "In-Clinic"
  },
  {
    id: "app_5",
    patientId: "patient_5",
    patientName: "Rahul Joshi",
    patientPhone: "0987654325",
    treatment: "Shirodhara",
    date: "2026-06-13",
    time: "04:30 PM",
    status: "Confirmed",
    type: "In-Clinic"
  },
  {
    id: "app_6",
    patientId: "patient_1",
    patientName: "Yashodeep Pachghare",
    patientPhone: "084850 19880",
    treatment: "Spine Alignment",
    date: "2026-06-05",
    time: "10:00 AM",
    status: "Completed",
    type: "In-Clinic"
  }
];

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Treatments
    const treatmentsSnapshot = await getDocs(collection(db, "treatments"));
    if (treatmentsSnapshot.empty) {
      console.log("Seeding treatments...");
      for (const t of treatments) {
        await setDoc(doc(db, "treatments", t.slug), t);
      }
    }

    // 2. Seed Blogs (Update author and initialize view/like metrics)
    const blogsSnapshot = await getDocs(collection(db, "blogs"));
    if (blogsSnapshot.empty) {
      console.log("Seeding blogs...");
      for (const p of blogPosts) {
        const updatedBlog = {
          ...p,
          author: "डॉ. ओमप्रकाश तिखे",
          views: Math.floor(Math.random() * 200) + 50, // Initial views
          likes: Math.floor(Math.random() * 40) + 10    // Initial likes
        };
        await setDoc(doc(db, "blogs", p.slug), updatedBlog);
      }
    }

    // 3. Seed Testimonials (Combine googleReviews + static ones)
    const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
    if (testimonialsSnapshot.empty) {
      console.log("Seeding testimonials...");
      for (let index = 0; index < googleReviews.length; index++) {
        const review = googleReviews[index];
        const reviewId = `review_${index + 1}`;
        await setDoc(doc(db, "testimonials", reviewId), review);
      }
    }

    // 4. Seed Gallery (Use standard keys)
    const gallerySnapshot = await getDocs(collection(db, "gallery"));
    if (gallerySnapshot.empty) {
      console.log("Seeding gallery...");
      for (let index = 0; index < galleryItems.length; index++) {
        const g = galleryItems[index];
        const galleryId = `gallery_${index + 1}`;
        await setDoc(doc(db, "gallery", galleryId), {
          cat: g.cat,
          img: g.img // Maps to local key or cloudinary URL
        });
      }
    }

    // 5. Seed Videos
    const videosSnapshot = await getDocs(collection(db, "videos"));
    if (videosSnapshot.empty) {
      console.log("Seeding videos...");
      for (let index = 0; index < initialVideos.length; index++) {
        const v = initialVideos[index];
        const videoId = `video_${index + 1}`;
        await setDoc(doc(db, "videos", videoId), v);
      }
    }

    // 6. Seed SEO Settings
    const settingsSnapshot = await getDocs(collection(db, "settings"));
    if (settingsSnapshot.empty) {
      console.log("Seeding SEO & clinic settings...");
      await setDoc(doc(db, "settings", "seo"), defaultSEO);
      await setDoc(doc(db, "settings", "clinic"), defaultClinicSettings);
    }

    // 7. Seed Patients
    const patientsSnapshot = await getDocs(collection(db, "patients"));
    if (patientsSnapshot.empty) {
      console.log("Seeding mock patients...");
      for (const p of mockPatients) {
        await setDoc(doc(db, "patients", p.id), p);
      }
    }

    // 8. Seed Appointments
    const appointmentsSnapshot = await getDocs(collection(db, "appointments"));
    if (appointmentsSnapshot.empty) {
      console.log("Seeding mock appointments...");
      for (const a of mockAppointments) {
        await setDoc(doc(db, "appointments", a.id), a);
      }
    }

    console.log("Database seed check completed successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}
