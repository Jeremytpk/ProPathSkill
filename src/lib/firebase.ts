import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, getDoc, doc, getDocs, 
  setDoc, deleteDoc, updateDoc, writeBatch, query, limit 
} from "firebase/firestore";

// Config parsed from firebase-applet-config.json values
const firebaseConfig = {
  apiKey: "AIzaSyBSGmKNoeRaYdyGScnGwOLw6fMu4IEkvvY",
  authDomain: "aura-55447.firebaseapp.com",
  projectId: "aura-55447",
  storageBucket: "aura-55447.firebasestorage.app",
  messagingSenderId: "723937303605",
  appId: "1:723937303605:web:22521aea7a8753fe48657c"
};

let app: ReturnType<typeof initializeApp> | null = null;
let db: any = null;

try {
  app = initializeApp(firebaseConfig);
  // Specify the exact firestoreDatabaseId "ai-studio-740c2bf7-4af9-40ed-8a9c-85d810e5d532"
  db = getFirestore(app, "ai-studio-740c2bf7-4af9-40ed-8a9c-85d810e5d532");
  console.log("Firebase initialized with database:", "ai-studio-740c2bf7-4af9-40ed-8a9c-85d810e5d532");
} catch (error) {
  console.error("Failed to initialize Firebase client:", error);
}

export { db, app as firebaseApp };

// -------------------------------------------------------------------------
// FIRESTORE ERROR HANDLING (MANDATED BY FIREBASE SKILL)
// -------------------------------------------------------------------------

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: "anonymous_sandbox_user",
      email: "sandbox@propath.io",
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------------------
// CAREER REPORT FUNCTIONS
// -------------------------------------------------------------------------

// Helper to save a career alignment report
export async function saveReport(reportData: any): Promise<string | null> {
  if (!db) {
    console.error("Firestore db is not initialized.");
    return null;
  }
  const collectionName = "reports";
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...reportData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, collectionName);
  }
}

// Helper to fetch a career alignment report
export async function getReport(reportId: string): Promise<any | null> {
  if (!db) {
    console.error("Firestore db is not initialized.");
    return null;
  }
  const docPath = `reports/${reportId}`;
  try {
    const docRef = doc(db, "reports", reportId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, docPath);
  }
}

// -------------------------------------------------------------------------
// PARTNER DIRECTORY FUNCTIONS
// -------------------------------------------------------------------------

export async function getPartners(): Promise<any[]> {
  if (!db) return [];
  const colName = "partners";
  try {
    const querySnapshot = await getDocs(collection(db, colName));
    const list = querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.country === "Cameroon") {
        data.country = "DRCongo";
      }
      return { id: doc.id, ...data };
    });
    
    // Auto-seed if database has zero partners (first time boot or empty sandbox)
    if (list.length === 0) {
      await seedInitialData();
      const freshSnapshot = await getDocs(collection(db, colName));
      return freshSnapshot.docs.map(doc => {
        const data = doc.data();
        if (data.country === "Cameroon") {
          data.country = "DRCongo";
        }
        return { id: doc.id, ...data };
      });
    }
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, colName);
  }
}

export async function savePartner(partner: any): Promise<void> {
  if (!db) return;
  const docId = partner.id || `partner_${Date.now()}`;
  const docPath = `partners/${docId}`;
  try {
    await setDoc(doc(db, "partners", docId), {
      name: partner.name || "",
      description: partner.description || "",
      industry: partner.industry || "Technology",
      location: partner.location || "Remote",
      website: partner.website || "https://propath.io",
      country: partner.country || "United States",
      createdAt: partner.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deletePartner(partnerId: string): Promise<void> {
  if (!db) return;
  const docPath = `partners/${partnerId}`;
  try {
    await deleteDoc(doc(db, "partners", partnerId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

// -------------------------------------------------------------------------
// PARTNER TRAINING PROGRAMS FUNCTIONS
// -------------------------------------------------------------------------

export async function getPrograms(): Promise<any[]> {
  if (!db) return [];
  const colName = "programs";
  try {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.country === "Cameroon") {
        data.country = "DRCongo";
      }
      return { id: doc.id, ...data };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, colName);
  }
}

export async function saveProgram(program: any): Promise<void> {
  if (!db) return;
  const docId = program.id || `program_${Date.now()}`;
  const docPath = `programs/${docId}`;
  try {
    await setDoc(doc(db, "programs", docId), {
      partnerId: program.partnerId || "",
      partnerName: program.partnerName || "",
      title: program.title || "",
      description: program.description || "",
      duration: program.duration || "Self-Paced",
      cost: program.cost || "Free",
      level: program.level || "Beginner",
      link: program.link || "https://propath.io",
      trackId: program.trackId || "General",
      country: program.country || "United States",
      createdAt: program.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function deleteProgram(programId: string): Promise<void> {
  if (!db) return;
  const docPath = `programs/${programId}`;
  try {
    await deleteDoc(doc(db, "programs", programId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

// -------------------------------------------------------------------------
// TEAM APPLICATION (PLACEMENT JOINING) FUNCTIONS
// -------------------------------------------------------------------------

export async function getTeamApplications(): Promise<any[]> {
  if (!db) return [];
  const colName = "team_applications";
  try {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, colName);
  }
}

export async function submitTeamApplication(appData: any): Promise<string> {
  if (!db) return "";
  const colName = "team_applications";
  try {
    const docRef = await addDoc(collection(db, colName), {
      userId: appData.userId || "anonymous",
      userName: appData.userName || "ProPath Explorer",
      userEmail: appData.userEmail || "explorer@propath.io",
      partnerId: appData.partnerId || "",
      partnerName: appData.partnerName || "",
      programId: appData.programId || "",
      programTitle: appData.programTitle || "",
      trackTitle: appData.trackTitle || "General Track",
      status: appData.status || "Pending",
      notes: appData.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, colName);
  }
}

export async function updateTeamApplicationStatus(appId: string, status: string, notes?: string): Promise<void> {
  if (!db) return;
  const docPath = `team_applications/${appId}`;
  try {
    const updateObj: any = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (notes !== undefined) {
      updateObj.adminNotes = notes;
    }
    await updateDoc(doc(db, "team_applications", appId), updateObj);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, docPath);
  }
}

export async function deleteTeamApplication(appId: string): Promise<void> {
  if (!db) return;
  const docPath = `team_applications/${appId}`;
  try {
    await deleteDoc(doc(db, "team_applications", appId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
  }
}

// -------------------------------------------------------------------------
// SEEDING SERVICE FOR INITIAL HIGH-FIDELITY EXPERIENCE
// -------------------------------------------------------------------------

async function seedInitialData() {
  if (!db) return;
  console.log("Seeding high-fidelity partners & training programs database...");
  try {
    // 1. Initial Partners
    const seedPartners = [
      // United States
      {
        id: "partner_consensys",
        name: "ConsenSys Academy",
        description: "The global leader in Ethereum training and smart contract engineering. Powers programs that equip developers to build robust DeFi architectures.",
        industry: "Blockchain & Web3",
        location: "New York, NY (Remote Friendly)",
        website: "https://consensys.io/academy",
        country: "United States"
      },
      {
        id: "partner_gcloud",
        name: "Google Cloud Pathways",
        description: "Structured certification pathways and development cycles designed to train cloud infrastructure professionals on AI scaling and real-time streaming pipelines.",
        industry: "Cloud & AI Engineering",
        location: "Sunnyvale, CA (Hybrid)",
        website: "https://cloud.google.com/training",
        country: "United States"
      },
      {
        id: "partner_aquant",
        name: "Aquant Quantitative Risk Lab",
        description: "High-tier quantitative risk analytics and stress simulation firm providing early-career development opportunities and fellowship programs.",
        industry: "Quantitative Finance",
        location: "Chicago, IL",
        website: "https://aquantrisk.com",
        country: "United States"
      },

      // France
      {
        id: "partner_simplon_fr",
        name: "Simplon.co",
        description: "Réseau d'écoles inclusives offrant des formations intensives gratuites aux métiers du numérique, notamment le DevOps, le Cloud et le Web3.",
        industry: "Cloud & AI Engineering",
        location: "Paris, France (Hybride)",
        website: "https://simplon.co",
        country: "France"
      },
      {
        id: "partner_ecole42_fr",
        name: "École 42 Paris",
        description: "Établissement supérieur d'auto-formation d'excellence en programmation informatique et algorithmique, gratuit et sans condition de diplôme.",
        industry: "Blockchain & Web3",
        location: "Paris, France (Présentiel)",
        website: "https://42.fr",
        country: "France"
      },

      // Canada
      {
        id: "partner_bcit_ca",
        name: "British Columbia Institute of Technology",
        description: "A premier Canadian polytechnic institution specializing in applied computer science, cybersecurity, and cloud system administration.",
        industry: "Cloud & AI Engineering",
        location: "Vancouver, BC, Canada",
        website: "https://www.bcit.ca",
        country: "Canada"
      },
      {
        id: "partner_humber_ca",
        name: "Humber College Technology",
        description: "Leading Toronto college providing practical engineering pathways and advanced training in algorithmic trading systems and digital assets.",
        industry: "Quantitative Finance",
        location: "Toronto, ON, Canada",
        website: "https://humber.ca",
        country: "Canada"
      },

      // DRCongo
      {
        id: "partner_ista_cd",
        name: "Institut Supérieur de Techniques Appliquées (ISTA-Kinshasa)",
        description: "Centre d'excellence technologique de la RDC, formant des ingénieurs et techniciens de haut niveau en systèmes de télécommunication et informatique.",
        industry: "Cloud & AI Engineering",
        location: "Kinshasa, RDC",
        website: "https://www.ista.ac.cd",
        country: "DRCongo"
      },
      {
        id: "partner_unikin_cd",
        name: "Département de Mathématiques & Informatique (UNIKIN)",
        description: "Institution publique historique formant l'élite de la recherche algorithmique, de la cryptographie et de la cybersécurité en Afrique Centrale.",
        industry: "Blockchain & Web3",
        location: "Kinshasa, RDC",
        website: "https://www.unikin.ac.cd",
        country: "DRCongo"
      },

      // Ivory Coast
      {
        id: "partner_inphb_ci",
        name: "Institut National Polytechnique Félix Houphouët-Boigny",
        description: "La plus prestigieuse grande école publique d'ingénieurs en Afrique de l'Ouest, formant l'élite de l'ingénierie et de la finance.",
        industry: "Quantitative Finance",
        location: "Yamoussoukro, Côte d'Ivoire",
        website: "https://inphb.ci",
        country: "Ivory Coast"
      },
      {
        id: "partner_gomycode_ci",
        name: "GOMYCODE Abidjan",
        description: "Académie numérique moderne proposant des programmes accélérés sur la blockchain, l'intelligence artificielle et le développement.",
        industry: "Blockchain & Web3",
        location: "Abidjan, Côte d'Ivoire",
        website: "https://gomycode.com/CI",
        country: "Ivory Coast"
      },

      // Senegal
      {
        id: "partner_ucad_sn",
        name: "Université Cheikh Anta Diop (ESP)",
        description: "L'École Supérieure Polytechnique de l'UCAD, leader ouest-africain en mathématiques appliquées, science des données et technologies.",
        industry: "Quantitative Finance",
        location: "Dakar, Sénégal",
        website: "https://esp.sn",
        country: "Senegal"
      },
      {
        id: "partner_force_n_sn",
        name: "Force-N Sénégal",
        description: "Initiative nationale d'acquisition des compétences de pointe dans le cloud computing, la cybersécurité et l'ingénierie des données.",
        industry: "Cloud & AI Engineering",
        location: "Dakar, Sénégal (Hybride)",
        website: "https://force-n.sn",
        country: "Senegal"
      }
    ];

    // 2. Initial Programs
    const seedPrograms = [
      // United States
      {
        id: "program_defisec",
        partnerId: "partner_consensys",
        partnerName: "ConsenSys Academy",
        title: "DeFi Smart Contract Security Masterclass",
        description: "Learn advanced Solidity security analysis, transaction reentrancy prevention, mathematical formal verification methods, and participate in active test audits.",
        duration: "12 Weeks",
        cost: "Scholarships Available",
        level: "Advanced",
        link: "https://consensys.io/academy",
        trackId: "DeFi Security Engineer & Smart Contract Auditor",
        country: "United States"
      },
      {
        id: "program_gdevops",
        partnerId: "partner_gcloud",
        partnerName: "Google Cloud Pathways",
        title: "Cloud DevOps & AI Operations Pathway",
        description: "Intensive training program focused on automated deployment, stress testing distributed servers, Kubernetes management, and scaling AI API pipelines.",
        duration: "8 Weeks",
        cost: "Free (Sponsored)",
        level: "Intermediate",
        link: "https://cloud.google.com/training",
        trackId: "Cloud DevOps Engineer & Infrastructure Architect",
        country: "United States"
      },
      {
        id: "program_quantflow",
        partnerId: "partner_aquant",
        partnerName: "Aquant Quantitative Risk Lab",
        title: "Quantitative Risk Rotational Fellowship",
        description: "A professional development program integrating financial stress testing, high-frequency trade simulations, and quantitative modeling with senior mentors.",
        duration: "6 Months",
        cost: "Paid Fellowship ($5,000/mo stipend)",
        level: "Advanced",
        link: "https://aquantrisk.com",
        trackId: "AI-Driven Quantitative Risk Architect",
        country: "United States"
      },

      // France
      {
        id: "program_simplon_devops",
        partnerId: "partner_simplon_fr",
        partnerName: "Simplon.co",
        title: "Administrateur Cloud et DevOps Certifié",
        description: "Parcours d'excellence sur l'architecture Cloud, le déploiement continu CI/CD, l'administration Kubernetes et la gestion des serveurs résilients.",
        duration: "6 Mois",
        cost: "Entièrement Financé (CPF/Pôle Emploi)",
        level: "Intermediate",
        link: "https://simplon.co",
        trackId: "Cloud DevOps Engineer & Infrastructure Architect",
        country: "France"
      },
      {
        id: "program_ecole42_algo",
        partnerId: "partner_ecole42_fr",
        partnerName: "École 42 Paris",
        title: "Piscine et Spécialisation Smart Contracts & Cryptographie",
        description: "Auto-apprentissage guidé de la programmation de contrats intelligents et de la cryptographie décentralisée. Prépare aux audits de protocoles majeurs.",
        duration: "18 Mois",
        cost: "Gratuit",
        level: "Advanced",
        link: "https://42.fr",
        trackId: "DeFi Security Engineer & Smart Contract Auditor",
        country: "France"
      },

      // Canada
      {
        id: "program_bcit_cloud",
        partnerId: "partner_bcit_ca",
        partnerName: "British Columbia Institute of Technology",
        title: "Applied Cloud Security & Automation Diploma",
        description: "Rigorous polytechnic diploma preparing professionals for infrastructure automation, stress testing networks, and cloud security governance.",
        duration: "1 Year",
        cost: "Co-op Eligible (Tuition Applies)",
        level: "Intermediate",
        link: "https://www.bcit.ca",
        trackId: "Cloud DevOps Engineer & Infrastructure Architect",
        country: "Canada"
      },
      {
        id: "program_humber_fintech",
        partnerId: "partner_humber_ca",
        partnerName: "Humber College Technology",
        title: "Post-Graduate Program in Quantitative Fintech Systems",
        description: "Equips graduates with the skills required to design high-frequency trade simulators and perform complex quantitative stress simulations.",
        duration: "8 Months",
        cost: "Paid Co-op Placements Included",
        level: "Advanced",
        link: "https://humber.ca",
        trackId: "AI-Driven Quantitative Risk Architect",
        country: "Canada"
      },

      // DRCongo
      {
        id: "program_ista_sysadmin",
        partnerId: "partner_ista_cd",
        partnerName: "Institut Supérieur de Techniques Appliquées (ISTA-Kinshasa)",
        title: "Certification Internationale en DevOps & Sécurité Cloud",
        description: "Formation de haut niveau axée sur la mise en place de serveurs hautement disponibles, l'automatisation Ansible, Docker et l'hébergement sécurisé.",
        duration: "9 Mois",
        cost: "Bourses Nationales Disponibles",
        level: "Intermediate",
        link: "https://www.ista.ac.cd",
        trackId: "Cloud DevOps Engineer & Infrastructure Architect",
        country: "DRCongo"
      },
      {
        id: "program_unikin_webdev",
        partnerId: "partner_unikin_cd",
        partnerName: "Département de Mathématiques & Informatique (UNIKIN)",
        title: "Cursus Pratique Développeur Blockchain & Web Sécurisé",
        description: "Formation d'insertion rapide apprenant l'écriture de smart contracts Solidity et la conception d'applications décentralisées résilientes.",
        duration: "6 Mois",
        cost: "Subventionné (Frais minimes)",
        level: "Beginner",
        link: "https://www.unikin.ac.cd",
        trackId: "DeFi Security Engineer & Smart Contract Auditor",
        country: "DRCongo"
      },

      // Ivory Coast
      {
        id: "program_inphb_ai",
        partnerId: "partner_inphb_ci",
        partnerName: "Institut National Polytechnique Félix Houphouët-Boigny",
        title: "Mastère Spécialisé en Ingénierie Quantitative & Modélisation Financière",
        description: "Formation d'élite axée sur l'analyse des risques financiers, le machine learning pour la finance quantitative et la simulation stochastique.",
        duration: "1 An",
        cost: "Financement d'Entreprise Possible",
        level: "Advanced",
        link: "https://inphb.ci",
        trackId: "AI-Driven Quantitative Risk Architect",
        country: "Ivory Coast"
      },
      {
        id: "program_gomycode_blockchain",
        partnerId: "partner_gomycode_ci",
        partnerName: "GOMYCODE Abidjan",
        title: "Solidity & Decentralized Finance (DeFi) Professional Certificate",
        description: "Apprentissage accéléré de la programmation de smart contracts et d'audit de sécurité DeFi avec encadrement de mentors d'industrie.",
        duration: "3 Mois",
        cost: "Facilités de paiement disponibles",
        level: "Intermediate",
        link: "https://gomycode.com/CI",
        trackId: "DeFi Security Engineer & Smart Contract Auditor",
        country: "Ivory Coast"
      },

      // Senegal
      {
        id: "program_ucad_data",
        partnerId: "partner_ucad_sn",
        partnerName: "Université Cheikh Anta Diop (ESP)",
        title: "Master de Modélisation Aléatoire et Sciences de Décision Quantitative",
        description: "Programme de pointe combinant théorie stochastique, gestion du risque financier global et simulations informatiques de crise économique.",
        duration: "2 Ans",
        cost: "Financement Ministériel (Bourses d'excellence)",
        level: "Advanced",
        link: "https://esp.sn",
        trackId: "AI-Driven Quantitative Risk Architect",
        country: "Senegal"
      },
      {
        id: "program_force_n_cloud",
        partnerId: "partner_force_n_sn",
        partnerName: "Force-N Sénégal",
        title: "Bootcamp National d'Ingénieur Cloud Computing & Kubernetes",
        description: "Programme intensif apprenant à déployer et gérer des infrastructures de production à grande échelle, avec simulations réelles d'incidents.",
        duration: "6 Mois",
        cost: "100% Financé par l'État pour les jeunes",
        level: "Intermediate",
        link: "https://force-n.sn",
        trackId: "Cloud DevOps Engineer & Infrastructure Architect",
        country: "Senegal"
      }
    ];

    // Save partners
    for (const p of seedPartners) {
      await setDoc(doc(db, "partners", p.id), {
        ...p,
        createdAt: new Date().toISOString()
      });
    }

    // Save programs
    for (const pr of seedPrograms) {
      await setDoc(doc(db, "programs", pr.id), {
        ...pr,
        createdAt: new Date().toISOString()
      });
    }

    // Seeding Digital Marketing & Social Media AI Native Course (English)
    const digitalMarketingNativeCourse = {
      title: "Digital Marketing & Social Media Content Strategy",
      description: "Master multi-channel acquisition, growth hacking loops, and professional content creation workflows guided by ProPathSkill AI mentors.",
      industry: "Digital Marketing & Social Media",
      partnerId: "partner_propath_native",
      programId: "program_propath_dm_native",
      aiTutorPersona: "ProPath AI Growth Advisor",
      chapters: [
        {
          title: "Foundations of Organic Acquisition & SEO",
          content: "Organic growth starts with identifying high-intent keywords and matching search intent with premium educational content. In this chapter, you will learn the mechanics of search engine spiders, the math behind PageRank and link profiles, and how modern search platforms optimize search results with NLP engines.\n\nKey pillars:\n1. Keyword Intent Mapping (Informational, Navigational, Transactional)\n2. Technical SEO Crawlability & Schema Markup\n3. Backlink Velocity & Domain Authority Modeling",
          quiz: {
            question: "Which keyword type exhibits the highest immediate commercial intent?",
            options: [
              "Informational keyword (e.g., 'what is marketing')",
              "Transactional keyword (e.g., 'buy digital marketing course online')",
              "Navigational keyword (e.g., 'ProPath login')",
              "Branded keyword with general interest"
            ],
            correctIndex: 1
          }
        },
        {
          title: "Social Media Algorithms & Viral Copywriting",
          content: "Viral distribution on TikTok, Instagram, and YouTube is governed by dynamic recommendation engines. These algorithms measure instantaneous engagement, view duration, retention curves, and share velocities.\n\nTo capture consumer attention in a highly saturated feed, you must write compelling hooks and structure persuasive visual narratives:\n1. The 3-Second Hook (Visual and Textual Contrast)\n2. The Tension Arc (Conflict, Climax, Resolution)\n3. Clear CTA (Call To Action) Integration",
          quiz: {
            question: "Which metric is most highly weighted by modern video feed recommendation algorithms to sustain viral reach?",
            options: [
              "The number of likes on a video",
              "Video file size and upload resolution",
              "Audience retention rate and average watch duration percentage",
              "The time of day the video was posted"
            ],
            correctIndex: 2
          }
        },
        {
          title: "Marketing Data Analytics & Conversion Optimization",
          content: "Without data modeling, creative campaigns are a gamble. Growth hacking relies on clean tracking pipelines, conversion rate optimization (CRO), and A/B testing frameworks to validate hypotheses.\n\nBy measuring Customer Acquisition Cost (CAC) against Lifetime Value (LTV), you can optimize campaign spends and maximize return on investment (ROI):\n1. Event-based tracking and UTM structures\n2. Defining and designing A/B test experiments\n3. Scaling high-performing customer acquisition funnels",
          quiz: {
            question: "If a marketing campaign has a high Customer Acquisition Cost (CAC) that exceeds its Customer Lifetime Value (LTV), what is the long-term implication?",
            options: [
              "The company will grow highly profitable over time",
              "The company is losing money on every acquired customer and the funnel is unsustainable",
              "The website conversion rate will automatically increase to balance the cost",
              "The ad platform will refund the difference to the company"
            ],
            correctIndex: 1
          }
        }
      ]
    };

    await setDoc(doc(db, "ai_courses", "digital_marketing_native"), {
      ...digitalMarketingNativeCourse,
      createdAt: new Date().toISOString()
    });

    // Seeding Digital Marketing & Social Media AI Native Course (French)
    const digitalMarketingNativeCourseFR = {
      title: "Stratégie de Marketing Digital & Création de Contenu",
      description: "Maîtrisez l'acquisition multi-canal, les boucles de growth hacking et les processus de création de contenu professionnel, guidés par les mentors IA de ProPathSkill.",
      industry: "Marketing Digital & Médias Sociaux",
      partnerId: "partner_propath_native",
      programId: "program_propath_dm_native",
      aiTutorPersona: "Conseiller de Croissance IA ProPath",
      chapters: [
        {
          title: "Fondements de l'Acquisition Organique & SEO",
          content: "La croissance organique commence par l'identification des mots-clés à forte intention et la mise en correspondance de l'intention de recherche avec un contenu éducatif de premier ordre. Dans ce chapitre, vous découvrirez les mécanismes des robots des moteurs de recherche, les calculs derrière le PageRank et les profils de liens, et comment les moteurs modernes optimisent la pertinence grâce au traitement automatique du langage (NLP).\n\nPilliers clés :\n1. Cartographie de l'intention des mots-clés (Informative, Navigationnelle, Transactionnelle)\n2. Optimisation technique pour l'indexation (SEO technique et données structurées)\n3. Vélocité des backlinks et autorité de domaine",
          quiz: {
            question: "Quel type de mot-clé présente l'intention commerciale immédiate la plus forte ?",
            options: [
              "Un mot-clé informatif (ex. : 'qu'est-ce que le marketing')",
              "Un mot-clé transactionnel (ex. : 'acheter formation marketing digital')",
              "Un mot-clé de marque (ex. : 'ProPath connexion')",
              "Un mot-clé de navigation générale"
            ],
            correctIndex: 1
          }
        },
        {
          title: "Algorithmes des Médias Sociaux & Rédaction Persuasive",
          content: "La distribution virale sur TikTok, Instagram et YouTube est régie par des moteurs de recommandation dynamiques. Ces algorithmes mesurent l'engagement instantané, la durée de visionnage, les courbes de rétention et la vélocité des partages.\n\nPour capter l'attention de l'utilisateur dans un flux saturé, vous devez concevoir des accroches percutantes et structurer des récits visuels captivants :\n1. L'accroche des 3 premières secondes (contraste visuel et textuel)\n2. L'arc de tension narrative (conflit, climax, résolution)\n3. Intégration claire d'un appel à l'action (CTA)",
          quiz: {
            question: "Quel indicateur est le plus valorisé par les algorithmes de recommandation vidéo pour propager un contenu de manière virale ?",
            options: [
              "Le nombre de likes sur une vidéo",
              "La taille du fichier vidéo et sa résolution d'encodage",
              "Le taux de rétention de l'audience et le pourcentage moyen de visionnage",
              "L'heure précise de publication de la vidéo"
            ],
            correctIndex: 2
          }
        },
        {
          title: "Analyses de Données Marketing & Optimisation des Conversions",
          content: "Sans modélisation de données, les campagnes créatives sont un pari risqué. Le growth hacking repose sur des pipelines de suivi précis, l'optimisation des taux de conversion (CRO) et des cadres d'A/B testing pour valider vos hypothèses de croissance.\n\nEn mesurant le Coût d'Acquisition Client (CAC) par rapport à la Valeur de Vie Client (LTV), vous pouvez optimiser vos budgets publicitaires et maximiser votre retour sur investissement (ROI) :\n1. Suivi basé sur les événements et structures de liens UTM\n2. Conception et exécution d'expériences d'A/B testing rigoureuses\n3. Passage à l'échelle des entonnoirs d'acquisition performants",
          quiz: {
            question: "Si une campagne marketing a un Coût d'Acquisition Client (CAC) supérieur à la Valeur de Vie Client (LTV), quelle est l'implication à long terme ?",
            options: [
              "L'entreprise deviendra très rentable avec le temps",
              "L'entreprise perd de l'argent sur chaque client acquis et le modèle n'est pas viable",
              "Le taux de conversion du site va automatiquement s'ajuster pour équilibrer les coûts",
              "La plateforme publicitaire remboursera la différence à l'entreprise"
            ],
            correctIndex: 1
          }
        }
      ]
    };

    await setDoc(doc(db, "ai_courses", "digital_marketing_native_fr"), {
      ...digitalMarketingNativeCourseFR,
      createdAt: new Date().toISOString()
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

// -------------------------------------------------------------------------
// MONETIZATION & CLICK TRACKING FUNCTIONS
// -------------------------------------------------------------------------

export async function logUserClick(clickData: {
  userId?: string;
  userEmail?: string;
  type: string; // "program_syllabus_click" | "program_join_click" | "resource_click" | "partner_website_click"
  targetId?: string;
  targetName: string;
  partnerId?: string;
  partnerName?: string;
  platform?: string;
  trackTitle: string;
  country: string;
  language?: string;
  industrySelections?: string[];
  primarySuggestedTrack?: string;
  primarySuggestedSector?: string;
  secondSuggestedTrack?: string;
  secondSuggestedSector?: string;
}): Promise<void> {
  if (!db) return;
  const colName = "user_clicks";
  try {
    await addDoc(collection(db, colName), {
      ...clickData,
      createdAt: new Date().toISOString()
    });
    console.log("Logged user click interaction:", clickData.targetName, clickData.type);
  } catch (err) {
    console.error("Failed to log user click:", err);
  }
}

export async function getUserClicks(): Promise<any[]> {
  if (!db) return [];
  const colName = "user_clicks";
  try {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.country === "Cameroon" || data.country === "cm") {
        data.country = "DRCongo";
      }
      return { id: doc.id, ...data };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, colName);
  }
}

// -------------------------------------------------------------------------
// PROPATHSKILL AI COURSE FUNCTIONS
// -------------------------------------------------------------------------

export async function getAICourse(courseId: string): Promise<any | null> {
  if (!db) return null;
  const docRef = doc(db, "ai_courses", courseId);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `ai_courses/${courseId}`);
  }
}

export async function saveAICourse(course: any): Promise<void> {
  if (!db) return;
  const docId = course.id || `course_${Date.now()}`;
  const docPath = `ai_courses/${docId}`;
  try {
    await setDoc(doc(db, "ai_courses", docId), {
      title: course.title || "",
      description: course.description || "",
      industry: course.industry || "",
      partnerId: course.partnerId || "",
      programId: course.programId || "",
      chapters: course.chapters || [],
      aiTutorPersona: course.aiTutorPersona || "ProPath AI Guide",
      createdAt: course.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
  }
}

export async function getAICourses(): Promise<any[]> {
  if (!db) return [];
  const colName = "ai_courses";
  try {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, colName);
  }
}


