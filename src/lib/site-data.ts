export interface TreatmentDetail {
  slug: string;
  name: string;
  sanskrit: string;
  desc: string;
  overview: string;
  indications: string[];
  benefits: string[];
  process: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
}

export interface BlogContentBlock {
  type: "paragraph" | "heading" | "blockquote";
  text: string;
}

export interface BlogPost {
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

export const treatments: TreatmentDetail[] = [
  {
    slug: "vamana",
    name: "Vamana",
    sanskrit: "वमन",
    desc: "Therapeutic emesis to cleanse Kapha doshas from the upper body.",
    overview: "Vamana is a specialized therapeutic purification procedure under Panchakarma that focuses on eliminating excess Kapha dosha from the body. It involves supervised, drug-induced vomiting to clear toxins from the respiratory and digestive tracts.",
    indications: [
      "Asthma and chronic bronchitis",
      "Psoriasis, eczema, and other Kapha-led skin disorders",
      "Chronic allergies and sinus congestion",
      "Hypothyroidism and slow metabolism"
    ],
    benefits: [
      "Clears blockages in the respiratory system",
      "Restores natural metabolic fire (Agni)",
      "Improves skin texture and reduces inflammation",
      "Enhances immunity and cellular rejuvenation"
    ],
    process: [
      { step: "Purvakarma (Prep)", detail: "7 days of internal oleation (Snehapana) using medicated ghee followed by external massage and sweating." },
      { step: "Pradhanakarma (Therapy)", detail: "Administration of natural emetic decoctions early in the morning under strict Vaidya supervision." },
      { step: "Paschatkarma (Post-care)", detail: "A structured, progressive diet plan (Samsarjana Krama) to restore digestion over 3 to 7 days." }
    ],
    faqs: [
      { q: "Is Vamana painful or exhausting?", a: "When executed correctly according to your Prakriti, it is highly controlled and immediately followed by a feeling of lightness and mental clarity, not fatigue." },
      { q: "Who should avoid Vamana?", a: "Pregnant women, elderly persons, young children, and individuals with heart conditions or high blood pressure should avoid Vamana." }
    ]
  },
  {
    slug: "virechana",
    name: "Virechana",
    sanskrit: "विरेचन",
    desc: "Purgation therapy to eliminate Pitta toxins through the intestines.",
    overview: "Virechana is a medicated purgation therapy designed to cleanse excess Pitta dosha from the liver, gallbladder, and small intestines. It is highly effective for purifying blood and addressing inflammatory conditions.",
    indications: [
      "Acne, dermatitis, and hyperpigmentation",
      "Chronic acidity and digestive ulcers",
      "Jaundice and liver disorders",
      "Chronic headaches and migraine"
    ],
    benefits: [
      "Cools down elevated internal heat and acidity",
      "Purifies blood and tissue fluids",
      "Flushes out toxins from the digestive tract",
      "Brightens skin complexion naturally"
    ],
    process: [
      { step: "Preparation", detail: "Internal oiling with herbal ghee for 3-5 days, followed by steam baths to loosen toxins." },
      { step: "Purgation Day", detail: "Drinking a customized herbal formula that stimulates controlled bowel movements to flush toxins." },
      { step: "Rest & Recovery", detail: "Adhering to a warm, easy-to-digest liquid diet for 3 days to gently rest the digestive system." }
    ],
    faqs: [
      { q: "How many purgations happen during Virechana?", a: "Typically, between 10 to 30 loose motions occur depending on the intensity of purification needed, monitored closely by our staff." },
      { q: "Can I do Virechana at home?", a: "No, authentic Virechana requires precise pulse monitoring and custom dosage by an experienced Vaidya." }
    ]
  },
  {
    slug: "basti",
    name: "Basti",
    sanskrit: "बस्ति",
    desc: "Medicated enema — the mother of all Panchakarma therapies.",
    overview: "Basti is considered the most powerful of the five Panchakarma therapies because it directly governs Vata dosha, which is the primary driver of 80% of all diseases. Medicated oils and decoctions are introduced rectally to nourish and cleanse the colon.",
    indications: [
      "Arthritis, sciatica, and chronic back pain",
      "Neurological disorders and paralysis",
      "Chronic constipation and irritable bowel syndrome (IBS)",
      "Osteoporosis and degenerative joint conditions"
    ],
    benefits: [
      "Lubricates and strengthens the skeletal structure",
      "Nourishes colon walls and promotes healthy microbiome",
      "Pacifies Vata, relieving anxiety and nervous exhaustion",
      "Improves vitality, strength, and longevity"
    ],
    process: [
      { step: "Niruha Basti", detail: "Administration of warm herbal decoctions, honey, and rock salt to cleanse the colon." },
      { step: "Anuvasana Basti", detail: "Administration of warm medicated herbal oils to nourish and lubricate the tissues." },
      { step: "Rest Phase", detail: "A brief rest period lying down to allow deep absorption of nutrients." }
    ],
    faqs: [
      { q: "Is Basti safe for long-term use?", a: "Yes, because it bypasses upper digestion, it doesn't cause liver toxicity and is highly nourishing for chronic ailments." },
      { q: "Does it feel like a modern colon hydrotherapy?", a: "No. Basti uses warm therapeutic herbal oils and decoctions designed for absorption and doshic balance, not just water pressure washing." }
    ]
  },
  {
    slug: "nasya",
    name: "Nasya",
    sanskrit: "नस्य",
    desc: "Nasal administration of herbal oils for head & sinus wellness.",
    overview: "Nasya involves administering specific herbal juices, powders, or medicated oils through the nostrils. Since the nose is the gateway to the brain, Nasya is central to curing neck, head, and nervous system disorders.",
    indications: [
      "Chronic sinusitis, migraines, and headaches",
      "Premature graying of hair and hair fall",
      "Cervical spondylosis and frozen shoulder",
      "Insomnia, stress, and hormonal imbalances"
    ],
    benefits: [
      "Clears blocked sinuses and respiratory pathways",
      "Nourishes sensory organs and sharpens mental focus",
      "Strengthens shoulders, neck, and chest muscles",
      "Promotes deep, restful sleep patterns"
    ],
    process: [
      { step: "Facial Massage", detail: "Gentle stimulation of facial acupressure (Marma) points using herbal oils." },
      { step: "Localized Steam", detail: "Mild sweating therapy over the forehead, nose, and cheeks." },
      { step: "Instillation", detail: "Drop-by-drop administration of warm medicated oil into each nostril." }
    ],
    faqs: [
      { q: "Should I do anything special after Nasya?", a: "Avoid cold water, direct air conditioning, and wind for at least an hour. Gargling with warm water is highly recommended." },
      { q: "Can it cure chronic snoring?", a: "Yes, Nasya lubricates the throat and nasal tissues, which often reduces snoring significantly." }
    ]
  },
  {
    slug: "raktamokshana",
    name: "Raktamokshana",
    sanskrit: "रक्तमोक्षण",
    desc: "Selective blood-letting to purify circulating toxins.",
    overview: "Raktamokshana is a blood-purifying therapy. It is used in conditions where deep-seated Pitta toxins are circulating in the bloodstream and cannot be easily resolved by herbs or purgation alone.",
    indications: [
      "Chronic eczema, hives, and recurrent boils",
      "Gouty arthritis and varicose veins",
      "Alopecia areata",
      "Localized inflammatory swelling"
    ],
    benefits: [
      "Provides rapid relief in localized skin eruptions",
      "Clears blockages in venous microcirculation",
      "Reduces chronic swelling and burning sensation",
      "Stimulates the production of fresh, healthy blood cells"
    ],
    process: [
      { step: "Evaluation", detail: "Checking blood pressure, hemoglobin, and clotting parameters." },
      { step: "Jalaukavacharana (Leech Therapy)", detail: "Application of sterile, medicinal leeches to draw impure blood painlessly." },
      { step: "Dressing", detail: "Wound care using antiseptic herbs like turmeric and sterile bandaging." }
    ],
    faqs: [
      { q: "Is leech therapy painful?", a: "It feels like a minor ant bite. The leech releases natural anesthetics in its saliva, making the procedure highly comfortable." },
      { q: "Are the leeches reused?", a: "Never. We use strictly sterile, single-use medical leeches that are safely disposed of after a single session." }
    ]
  },
  {
    slug: "shirodhara",
    name: "Shirodhara",
    sanskrit: "शिरोधारा",
    desc: "Continuous stream of warm oil over the forehead — deep stillness.",
    overview: "Shirodhara is a classical Ayurvedic therapy that involves gently pouring a continuous stream of warm medicated oil, milk, buttermilk, or water onto the forehead (specifically the third eye area). It induces an deep state of meditative relaxation.",
    indications: [
      "High stress, anxiety, and depression",
      "Chronic insomnia and sleep disturbances",
      "Hypertension and high blood pressure",
      "Neurological fatigue and brain fog"
    ],
    benefits: [
      "Triggers the parasympathetic nervous system for deep stress relief",
      "Stabilizes mental activity and clears racing thoughts",
      "Regulates sleep cycles and cures sleeplessness",
      "Nourishes hair follicles and prevents scalp dryness"
    ],
    process: [
      { step: "Head Massage", detail: "A brief, soothing massage of the head and shoulders to settle the energy." },
      { step: "Dhara Flow", detail: "Pouring warm herbal oil from a copper pot suspended above the forehead in a rhythmic sway for 40-50 minutes." },
      { step: "Relaxation", detail: "Resting in a quiet space with herbal tea to absorb the calm state." }
    ],
    faqs: [
      { q: "What oil is used in Shirodhara?", a: "Usually, custom sesame-based oils like Ksheerabala taila or Dhanwantharam taila are used, chosen specifically for your mind-body constitution." },
      { q: "How many sessions are recommended?", a: "While a single session is highly relaxing, chronic insomnia or anxiety responds best to a cycle of 3 to 7 consecutive days." }
    ]
  },
  {
    slug: "abhyanga",
    name: "Abhyanga",
    sanskrit: "अभ्यंग",
    desc: "Full-body warm oil massage harmonising body, mind & breath.",
    overview: "Abhyanga is a synchronized full-body massage performed by skilled therapists using warm, herb-infused oils customized to your dosha. It is designed to mobilize toxins, lubricate joints, and soothe the nervous system.",
    indications: [
      "General fatigue and muscle stiffness",
      "Dry skin and premature aging signs",
      "Joint pain and cracking joints",
      "High Vata imbalances (restlessness)"
    ],
    benefits: [
      "Improves blood and lymphatic circulation",
      "Softens skin, giving it a healthy radiant glow",
      "Reduces muscle soreness and promotes joint flexibility",
      "Flushes lactic acid and waste buildup from tissues"
    ],
    process: [
      { step: "Oil Warm-up", detail: "Custom blending herbal oils and heating them to a comfortable, skin-safe temperature." },
      { step: "Synchronized Massage", detail: "Applying rhythmic, circular, and long strokes matching the direction of hair follicles." },
      { step: "Swedana (Steam)", detail: "Sitting in a herbal steam chamber to open pores and flush loosened toxins." }
    ],
    faqs: [
      { q: "How does Abhyanga differ from a spa massage?", a: "Abhyanga uses specialized medicinal oils that penetrate deep into the tissues (Dhatus) to cure root issues, whereas spa massages focus purely on superficial relaxation." },
      { q: "Can I take a bath immediately after?", a: "It is best to leave the oil on for 20-30 minutes, followed by a warm shower using natural herbal bathing powders." }
    ]
  },
  {
    slug: "pizhichil",
    name: "Pizhichil",
    sanskrit: "पिझिचिल",
    desc: "Royal treatment of medicated oil bath for rejuvenation.",
    overview: "Pizhichil, also known as the 'Royal Treatment', is a luxurious combination of massage and oil bath. Squeezes of warm medicated oil from a cloth are poured continuously over the entire body, accompanied by a gentle massage.",
    indications: [
      "Rheumatic arthritis and joint stiffness",
      "Muscle wasting and physical weakness",
      "Nervous system disorders and mild paralysis",
      "Sexual weakness and low vitality"
    ],
    benefits: [
      "Deeply rejuvenates and retards the aging process",
      "Strengthens the entire nervous and muscular systems",
      "Increases joint mobility and alleviates chronic stiffness",
      "Enhances immunity and boosts stamina"
    ],
    process: [
      { step: "Preparation", detail: "Lying comfortably on a specialized wooden table (Droni) while two therapists work in unison." },
      { step: "Oil Bathing", detail: "Squeezing warm oil continuously over the body while massaging rhythmically." },
      { step: "Warm Bath", detail: "Gently wiping off excess oil followed by a lukewarm bath to complete the treatment." }
    ],
    faqs: [
      { q: "Why is it called the Royal Treatment?", a: "Historically, this highly rejuvenating therapy was reserved exclusively for kings and royalty due to the large quantities of premium herbal oils used." },
      { q: "Is it safe for older adults?", a: "Yes, it is excellent for elderly people experiencing joint degeneration, provided they do not have acute heart conditions." }
    ]
  },
  {
    slug: "kati-basti",
    name: "Kati Basti",
    sanskrit: "कटि बस्ति",
    desc: "Warm oil pooled on the lower back for spinal relief.",
    overview: "Kati Basti is a localized treatment for the lower back. A ring or reservoir of black gram paste is constructed over the lumbosacral region, and warm medicated oil is kept pooled inside it to deeply nourish spinal nerves and muscles.",
    indications: [
      "Sciatica and lower back pain",
      "Herniated or slipped disc",
      "Lumbar spondylosis",
      "Muscle spasms in the back"
    ],
    benefits: [
      "Relieves chronic pain and stiffness in the lower back",
      "Nourishes and strengthens the spinal discs and nerves",
      "Improves local blood circulation to accelerate healing",
      "Relaxes tight lumbar muscles and improves range of motion"
    ],
    process: [
      { step: "Reservoir Build", detail: "Kneading black gram flour paste into a ring and securing it firmly onto the lower back." },
      { step: "Oil Pooling", detail: "Pouring warm medicated oil inside the ring, replacing it periodically to maintain temperature." },
      { step: "Gentle Massage", detail: "Removing the paste and lightly massaging the area with warm oil." }
    ],
    faqs: [
      { q: "How many sessions are needed for a slipped disc?", a: "A series of 5 to 7 sessions usually provides significant relief from pain and nerve compression." },
      { q: "Does Kati Basti have any side effects?", a: "No, it is a localized, external, and highly safe thermal therapy." }
    ]
  },
  {
    slug: "janu-basti",
    name: "Janu Basti",
    sanskrit: "जानु बस्ति",
    desc: "Targeted knee therapy for joint nourishment & strength.",
    overview: "Janu Basti is a localized knee joint therapy. Similar to Kati Basti, paste reservoirs are built around both knees, and warm herb-infused oil is pooled to lubricate joint structures and rebuild cartilage.",
    indications: [
      "Osteoarthritis of the knees",
      "Knee joint stiffness and crepitus (cracking sounds)",
      "Ligament or tendon strain",
      "Difficulty walking or climbing stairs"
    ],
    benefits: [
      "Lubricates the knee joints to reduce bone-on-bone friction",
      "Rejuvenates synovial fluid and cartilage",
      "Reduces chronic swelling, pain, and tenderness",
      "Restores walking confidence and flexibility"
    ],
    process: [
      { step: "Paste Ring Creation", detail: "Building round dough reservoirs over the knee caps while the patient lies down." },
      { step: "Oil Instillation", detail: "Filling the dough ring with warm medicated oils like Sahacharadi or Murivenna." },
      { step: "Knee Massage", detail: "Gentle manipulation of the knee joint after oil removal to improve flexibility." }
    ],
    faqs: [
      { q: "Can Janu Basti help avoid knee replacement surgery?", a: "In early to moderate stages of arthritis, regular Janu Basti can delay or completely prevent the need for surgical replacement." },
      { q: "Is it suitable for sports injuries?", a: "Yes, it is highly effective for accelerating the healing of minor ligament strains and tendon stiffness." }
    ]
  }
];

export const conditions = [
  "Arthritis", "Diabetes Support", "PCOD", "Thyroid Imbalance",
  "Digestive Disorders", "Stress & Anxiety", "Obesity Management",
  "Skin Disorders", "Hair Problems", "Joint Pain",
];

export const journeySteps = [
  { step: "01", title: "Consultation", sanskrit: "परामर्श", desc: "A deep, unhurried conversation about your history & goals." },
  { step: "02", title: "Diagnosis", sanskrit: "निदान", desc: "Nadi Pariksha & Prakriti assessment to map your constitution." },
  { step: "03", title: "Customised Plan", sanskrit: "योजना", desc: "A personalised Panchakarma protocol & herbal formulary." },
  { step: "04", title: "Panchakarma", sanskrit: "पंचकर्म", desc: "Authentic five-action cleansing in our heritage suites." },
  { step: "05", title: "Follow-Up", sanskrit: "अनुगमन", desc: "Structured reviews to honour your progress." },
  { step: "06", title: "Long-Term Wellness", sanskrit: "स्वास्थ्य", desc: "Lifestyle, diet & yoga for lasting balance." },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "panchakarma-prakriya",
    title: "पंचकर्म: शरीराच्या शुद्धीकरणाची प्राचीन प्रक्रिया",
    excerpt: "पंचकर्म ही आयुर्वेदातील एक अनमोल चिकित्सा पद्धत आहे, जी शरीरातील विषारी द्रव्ये बाहेर काढून आरोग्य पुनःस्थापित करते.",
    category: "पंचकर्म",
    author: "वैद्य आदित्य शर्मा",
    date: "१५ नोव्हेंबर २०२५",
    readTime: "७ मिनिटे",
    featured: true,
    image: "shirodhara",
    content: [
      { type: "paragraph", text: "पंचकर्म ही आयुर्वेदातील अत्यंत महत्त्वपूर्ण आणि सखोल शरीर शुद्धीकरण प्रक्रिया आहे. आपल्या शरीरात साचलेले विषारी घटक (ज्याला आयुर्वेदामध्ये 'आम' असे म्हटले जाते) बाहेर टाकण्यासाठी या पंचकर्माचा उपयोग केला जातो. दैनंदिन जीवनातील चुकीचा आहार, तणाव आणि प्रदूषण यामुळे शरीरात त्रिदोषांचे (वात, पित्त आणि कफ) संतुलन बिघडते. हे संतुलन पूर्ववत करण्यासाठी पंचकर्म अत्यंत प्रभावी आहे." },
      { type: "heading", text: "पंचकर्मातील पाच मुख्य क्रिया" },
      { type: "paragraph", text: "१. वमन: कफ दोषाचा नाश करण्यासाठी औषधी वनस्पतींच्या सहाय्याने केली जाणारी उलटीची प्रक्रिया.\n२. विरेचन: पित्त दोषाच्या शुद्धीकरणासाठी दिली जाणारी जुलाबाची चिकित्सा.\n३. बस्ति: वात दोषाचे नियंत्रण करणारी आणि आतड्यांचे पोषण करणारी औषधी काढा व तेलाची एनिमा चिकित्सा.\n४. नस्य: डोके, मान आणि नाक या भागांच्या आरोग्यासाठी नाकात औषधी थेंब टाकण्याची प्रक्रिया.\n५. रक्तमोक्षण: रक्तातील दूषित घटक बाहेर काढण्याची (उदा. जळू लावून) प्राचीन पद्धत." },
      { type: "blockquote", text: "\"स्वस्थस्य स्वास्थ्य रक्षणं, आतुरस्य विकार प्रशमनं च\" — म्हणजेच निरोगी व्यक्तीचे स्वास्थ्य टिकवून ठेवणे आणि रुग्णाच्या रोगाचे निवारण करणे, हेच आयुर्वेदाचे मुख्य ध्येय आहे आणि पंचकर्म हे साध्य करते." },
      { type: "heading", text: "पंचकर्माचे आरोग्यदायी फायदे" },
      { type: "paragraph", text: "पंचकर्म केवळ आजारी लोकांसाठीच नाही, तर निरोगी आयुष्य जगू इच्छिणाऱ्या सर्वांसाठी वरदान आहे. यामुळे शरीराची पचनशक्ती सुधारते, मानसिक तणाव कमी होतो, त्वचा निरोगी व सतेज बनते आणि शरीराची रोगप्रतिकारक शक्ती प्रचंड प्रमाणात वाढते. वर्षातून किमान एकदा तरी तज्ज्ञ वैद्यांच्या मार्गदर्शनाखाली पंचकर्म करून घेणे दीर्घायुष्यासाठी अत्यंत फायदेशीर ठरते." }
    ]
  },
  {
    slug: "ayurveda-aahar",
    title: "आयुर्वेदिक आहार: ऋतूनुसार खाण्याचे नियम",
    excerpt: "प्रत्येक ऋतूत शरीराच्या गरजा बदलतात. आयुर्वेद आपल्याला ऋतूनुसार आहार कसा घ्यावा हे शिकवते.",
    category: "आहार",
    author: "वैद्य आदित्य शर्मा",
    date: "१० नोव्हेंबर २०२५",
    readTime: "५ मिनिटे",
    image: "herbs",
    content: [
      { type: "paragraph", text: "आयुर्वेदामध्ये आहाराला 'महाभेषज' म्हणजेच सर्वात मोठे औषध मानले गेले आहे. आपण जे खातो, त्याचा थेट परिणाम आपल्या शरीरावर आणि मनावर होतो. आधुनिक विज्ञानात कॅलरीजचा विचार केला जातो, तर आयुर्वेद आहाराची गुणवत्ता, चव (रस) आणि त्याचा शरीरावर होणारा उष्ण किंवा शीत परिणाम यावर भर देते." },
      { type: "heading", text: "ऋतुचर्या आणि आहार" },
      { type: "paragraph", text: "हवामानातील बदलानुसार आपल्या शरीरातील पचनशक्ती (जठराग्नी) देखील बदलते. हिवाळ्यात जठराग्नी तीव्र असतो, त्यामुळे जड आणि पौष्टिक आहार घेणे योग्य ठरते. याउलट, उन्हाळ्यात पचनशक्ती मंद असते, त्यामुळे हलका, सुपाच्य आणि थंड आहार घ्यावा. पावसाळ्यात संसर्गजन्य आजारांचा धोका वाढतो, म्हणून गरम, ताजे आणि वात शमवणारे अन्नपदार्थ खावेत." },
      { type: "blockquote", text: "\"पथ्ये सति गदार्तस्य किमौषधनिषेवणैः। पथ्येऽसति गदार्तस्य किमौषधनिषेवणैः॥\" — म्हणजेच जर आहार योग्य असेल तर औषधाची गरज उरत नाही आणि जर आहार अयोग्य असेल तर औषधाचा काहीही उपयोग होत नाही." },
      { type: "heading", text: "आरोग्यासाठी आहाराचे सोनेरी नियम" },
      { type: "paragraph", text: "१. नेहमी भूक लागल्यावरच जेवावे.\n२. अन्न ताजे, गरम आणि शांत वातावरणात चावून खावे.\n३. जेवताना पाणी पिणे टाळावे, जेवणानंतर अर्ध्या तासाने कोमट पाणी प्यावे.\n४. रात्रीचे जेवण हलके आणि झोपण्यापूर्वी किमान २ तास आधी असावे.\nया नियमांचे पालन केल्याने अपचन, गॅसेस आणि लठ्ठपणा यांसारख्या समस्या कधीही उद्भवत नाहीत." }
    ]
  },
  {
    slug: "yoga-pranayama",
    title: "योग आणि प्राणायाम: दैनंदिन जीवनात संतुलन",
    excerpt: "योगाभ्यास आणि प्राणायाम केल्याने मन शांत होते आणि शरीर निरोगी राहते.",
    category: "योग",
    author: "वैद्य आदित्य शर्मा",
    date: "५ नोव्हेंबर २०२५",
    readTime: "६ मिनिटे",
    image: "clinic",
    content: [
      { type: "paragraph", text: "योग आणि आयुर्वेद हे एकाच नाण्याच्या दोन बाजू आहेत. आयुर्वेद शरीराला निरोगी ठेवण्याचे काम करते, तर योग मनाला आणि आत्म्याला स्थिर करतो. आजच्या वेगवान आणि तणावपूर्ण जीवनात मनःशांती मिळवण्यासाठी योग आणि प्राणायामाशिवाय दुसरा उत्तम पर्याय नाही." },
      { type: "heading", text: "प्राणायामाचे फुफ्फुस आणि मनावर होणारे परिणाम" },
      { type: "paragraph", text: "प्राणायाम म्हणजे प्राणाचे (श्वासाचे) नियंत्रण. अनुलोम-विलोम, कपालभाती आणि भ्रामरी प्राणायामाच्या नियमित सरावामुळे फुफ्फुसांची कार्यक्षमता वाढते. शरीरातील प्रत्येक पेशीला ऑक्सिजनचा पुरवठा होतो, ज्यामुळे ऊर्जा वाढते. मानसिक पातळीवर, प्राणायाम मनातील नकारात्मक विचार दूर करून एकाग्रता वाढवतो." },
      { type: "blockquote", text: "\"योगश्चित्तवृत्तिनिरोधः\" — मनाच्या अस्थिर वृत्तींना शांत करणे म्हणजेच योग होय. हा केवळ शारीरिक व्यायाम नसून मनावर ताबा मिळवण्याचा मार्ग आहे." },
      { type: "heading", text: "योगाभ्यास कसा सुरू करावा?" },
      { type: "paragraph", text: "सुरुवातीला साध्या योगासनांपासून सुरुवात करावी. ताडासन, भुजंगासन, पवनमुक्तासन आणि शवासन ही आसने आरोग्यासाठी अत्यंत चांगली आहेत. योगासने नेहमी सकाळी रिकाम्या पोटी आणि मोकळ्या हवेत करावीत. नियमित १५ ते २० मिनिटे केलेला योग देखील तुमच्या संपूर्ण दिवसाची ऊर्जा बदलू शकतो." }
    ]
  },
  {
    slug: "dosha-balance",
    title: "वात, पित्त, कफ: तुमची प्रकृती ओळखा",
    excerpt: "त्रिदोषांची ओळख करून घेणे ही आरोग्याची पहिली पायरी आहे.",
    category: "आयुर्वेद",
    author: "वैद्य आदित्य शर्मा",
    date: "१ नोव्हेंबर २०२५",
    readTime: "८ मिनिटे",
    image: "abhyanga",
    content: [
      { type: "paragraph", text: "आयुर्वेदानुसार, प्रत्येक मनुष्य हा निसर्गातील पंचमहाभूतांपासून (पृथ्वी, जल, अग्नी, वायू, आकाश) बनलेला आहे. या महाभूतांच्या संयोगातूनच शरीरात तीन मुख्य शक्ती कार्यरत असतात, ज्यांना आपण 'वात', 'पित्त' आणि 'कफ' असे म्हणतो. या त्रिदोषांची रचना म्हणजेच व्यक्तीची 'प्रकृती' होय." },
      { type: "heading", text: "त्रिदोषांची लक्षणे" },
      { type: "paragraph", text: "१. वात दोष: हा वायू आणि आकाशाशी संबंधित आहे. वात प्रकृतीचे लोक चंचल, बारीक अंगकाठीचे आणि कोरड्या त्वचेचे असतात. त्यांच्यात उत्साह जास्त असतो, पण ते लवकर थकतात.\n२. पित्त दोष: हा अग्नी आणि जलाशी संबंधित आहे. पित्त प्रकृतीचे लोक हुशार, मध्यम बांध्याचे आणि उष्णता सहन न करू शकणारे असतात. त्यांना भूक तीव्र लागते आणि राग लवकर येतो.\n३. कफ दोष: हा पृथ्वी आणि जलाशी संबंधित आहे. कफ प्रकृतीचे लोक शांत, मजबूत शरीराचे आणि धीमे काम करणारे असतात. त्यांची स्मरणशक्ती उत्तम असते, पण त्यांच्यात आळस लवकर येतो." },
      { type: "blockquote", text: "शरीराचे आरोग्य हे या तीन दोषांच्या परस्पर संतुलनावर अवलंबून असते. जेव्हा हे संतुलन बिघडते, तेव्हा आजार निर्माण होतात. म्हणूनच स्वतःची प्रकृती ओळखून त्यानुसार जीवनशैली ठेवणे गरजेचे आहे." }
    ]
  },
  {
    slug: "stress-management",
    title: "तणावमुक्त जीवनशैलीसाठी आयुर्वेदिक उपाय",
    excerpt: "आधुनिक जीवनातील तणाव कमी करण्यासाठी आयुर्वेद देते सोपे आणि प्रभावी उपाय.",
    category: "जीवनशैली",
    author: "वैद्य आदित्य शर्मा",
    date: "२८ ऑक्टोबर २०२५",
    readTime: "६ मिनिटे",
    image: "shirodhara",
    content: [
      { type: "paragraph", text: "आजच्या धावपळीच्या युगात तणाव हा मानवाचा सर्वात मोठा शत्रू बनला आहे. मानसिक तणावामुळे फक्त मनच नाही, तर संपूर्ण शरीर आजारी पडते. आयुर्वेदामध्ये तणावाला केवळ मानसिक आजार न मानता, शरीरातील वात दोषाचा प्रकोप मानले गेले आहे." },
      { type: "heading", text: "तणावमुक्तीसाठी सोपे आयुर्वेदिक उपाय" },
      { type: "paragraph", text: "१. शिरोधारा: कपाळावर कोमट तेलाची संततधार सोडणे. हा तणाव कमी करण्याचा सर्वात प्रभावी मार्ग आहे.\n२. नस्य: रोज रात्री नाकात २ थेंब कोमट तूप किंवा अनु तेल टाकल्याने मेंदूला शांतता मिळते.\n३. अभ्यंग: शरीराला गरम तिळाच्या तेलाने मसाज करणे, ज्यामुळे स्नायू शिथिल होतात आणि मन शांत होते.\n४. अश्वगंधा आणि ब्राह्मी: या मेध्य (बुद्धी व मनाला पोषक) औषधी वनस्पती तणावाशी लढण्याची ताकद वाढवतात." },
      { type: "blockquote", text: "शांत झोप आणि सकारात्मक विचार हे तणावमुक्तीचे सर्वात मोठे औषध आहे. निसर्गाच्या सानिध्यात वेळ घालवणे आणि ध्यान करणे यामुळे मन स्थिर होण्यास मदत होते." }
    ]
  },
  {
    slug: "winter-wellness",
    title: "हिवाळ्यातील आरोग्य: साधे आयुर्वेदिक टिप्स",
    excerpt: "थंडीच्या ऋतूत प्रतिकारशक्ती वाढवण्यासाठी काही सोप्या सवयी.",
    category: "आरोग्य टिप्स",
    author: "वैद्य आदित्य शर्मा",
    date: "२० ऑक्टोबर २०२५",
    readTime: "४ मिनिटे",
    image: "herbs",
    content: [
      { type: "paragraph", text: "हिवाळा हा आरोग्याच्या दृष्टीने अत्यंत महत्त्वाचा ऋतू मानला जातो. या काळात आपली भूक आणि पचनक्रिया खूप चांगली असते. निसर्ग आपल्याला शरीराची ताकद आणि रोगप्रतिकारक शक्ती वाढवण्याची सुवर्णसंधी या ऋतूत देत असतो." },
      { type: "heading", text: "हिवाळ्यातील दिनचर्या" },
      { type: "paragraph", text: "१. स्नेहन आणि मसाज: कोरड्या हवेमुळे त्वचा कोरडी पडते. म्हणून रोज सकाळी गरम तेलाने संपूर्ण शरीराला मसाज करावा.\n२. व्यायाम: या ऋतूत ताकद जास्त असल्याने भरपूर व्यायाम करावा, योगासने करावीत.\n३. उष्ण आणि सुगंधी आहार: आहारात तूप, सुकामेवा, डिंकाचे लाडू, आणि गरम दुधाचा समावेश करावा.\n४. कफ वाढवणारे पदार्थ टाळणे: दिवसा झोपणे आणि अति थंड पाणी पिणे टाळावे." },
      { type: "blockquote", text: "हिवाळ्यात घेतलेला चांगला आहार आणि केलेला व्यायाम संपूर्ण वर्षभर शरीराला ऊर्जा देतो. त्यामुळे या ऋतूचा आनंद घेत आरोग्याची काळजी घ्या." }
    ]
  }
];

export const blogCategories = ["सर्व", "आयुर्वेद", "पंचकर्म", "आरोग्य टिप्स", "जीवनशैली", "आहार", "योग"];

export const testimonials = [
  { name: "Priya Deshmukh", location: "Pune", review: "Six years of chronic back pain — gone in three weeks of Kati Basti. The care here is unlike any clinic I've visited.", rating: 5 },
  { name: "Rahul Joshi", location: "Mumbai", review: "Shirodhara changed my sleep. I now wake up calm. Vaidya Sharma is a true healer.", rating: 5 },
  { name: "Anjali Kulkarni", location: "Nashik", review: "PCOD symptoms reduced dramatically after the customised Panchakarma plan. Grateful beyond words.", rating: 5 },
  { name: "Sameer Patil", location: "Aurangabad", review: "The space itself heals you. Authentic Ayurveda, modern hygiene, deeply personal attention.", rating: 5 },
];

export const faqs = [
  { q: "What is Panchakarma?", a: "Panchakarma is a five-fold purification therapy in Ayurveda that detoxifies the body, mind and consciousness — the cornerstone of authentic Ayurvedic healing." },
  { q: "How long does a typical Panchakarma program take?", a: "A complete program ranges from 7 to 28 days depending on your constitution, condition and goals. We design every protocol individually." },
  { q: "Is Panchakarma safe for everyone?", a: "Panchakarma is generally safe under qualified supervision. We conduct thorough assessment before any therapy and contraindicate where needed." },
  { q: "Do you offer outstation accommodation?", a: "Yes — we partner with curated wellness stays nearby for guests travelling from out of town." },
  { q: "Can Panchakarma be combined with modern medicine?", a: "Absolutely. Our Vaidyas coordinate with your physician when needed for an integrative path forward." },
];

export const galleryItems = [
  { cat: "Clinic Interior", img: "clinic" },
  { cat: "Panchakarma Therapies", img: "shirodhara" },
  { cat: "Herbal Medicines", img: "herbs" },
  { cat: "Panchakarma Therapies", img: "abhyanga" },
  { cat: "Wellness Activities", img: "clinic" },
  { cat: "Herbal Medicines", img: "herbs" },
  { cat: "Clinic Interior", img: "clinic" },
  { cat: "Panchakarma Therapies", img: "shirodhara" },
];

export const videos = [
  { title: "Understanding Your Dosha", duration: "8:24", views: "12K" },
  { title: "Daily Ayurvedic Routine (Dinacharya)", duration: "12:10", views: "24K" },
  { title: "What to Expect in Panchakarma", duration: "6:42", views: "18K" },
  { title: "Herbs for Immunity", duration: "9:15", views: "9K" },
];
