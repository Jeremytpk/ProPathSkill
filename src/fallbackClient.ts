import { CareerTrack } from "./types";

// Helper to get industry-specific course resource for Learning School website
export function getIndustryCourseResource(sectorOrTitle: string, isFrench: boolean) {
  const s = (sectorOrTitle || "").toLowerCase();

  if (s.includes("ai") || s.includes("intelligence") || s.includes("ia") || s.includes("machine learning") || s.includes("llm")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Systèmes IA & Architectures LLM (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/ai_systems_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - AI Systems & LLM Architectures (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/ai_systems_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("fintech") || s.includes("finance") || s.includes("trading") || s.includes("banking") || s.includes("defi") || s.includes("blockchain")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - FinTech & Analyse Quantitative (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/fintech_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - FinTech & Quantitative Risk (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/fintech_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("energy") || s.includes("énergie") || s.includes("solar") || s.includes("wind") || s.includes("grid") || s.includes("renouvelable")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Énergie Propre & Réseaux Intelligents (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/smartgrid_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Smart Grid & Clean Energy (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/smartgrid_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("biotech") || s.includes("dna") || s.includes("genomic") || s.includes("health") || s.includes("sante") || s.includes("pharma")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Bioinformatique & Génomique (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/biotech_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Bioinformatics & Computational Genomics (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/biotech_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("space") || s.includes("aero") || s.includes("orbital") || s.includes("rocket") || s.includes("satellite")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Génie Aérospatial & Systèmes Orbitaux (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/spacetech_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Aerospace & Orbital Systems (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/spacetech_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("smartcities") || s.includes("city") || s.includes("ville") || s.includes("iot") || s.includes("urban")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Villes Intelligentes & Réseaux IoT (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/smartcities_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Smart Cities & Urban IoT Infrastructure (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/smartcities_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("creativedesign") || s.includes("ux") || s.includes("ui") || s.includes("spatial") || s.includes("ar") || s.includes("vr")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Design Numérique & Interfaces Spatiales (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/creativedesign_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Spatial UI & Creative Digital Design (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/creativedesign_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("art") || s.includes("fine") || s.includes("beaux-arts") || s.includes("peinture") || s.includes("gallery")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Beaux-Arts & Direction Artistique (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/art_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Fine Arts & Creative Media Direction (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/art_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("electrical") || s.includes("électr") || s.includes("automatis") || s.includes("wiring") || s.includes("cablage")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Automatisme & Électrotechnique Industrielle (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/electrical_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Industrial Automation & Electrical Systems (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/electrical_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("carpentry") || s.includes("charpent") || s.includes("menuis") || s.includes("bois") || s.includes("timber") || s.includes("wood")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Charpenterie Artisanale & Éco-Construction (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/carpentry_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Artisanal Carpentry & Sustainable Construction (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/carpentry_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("automotive") || s.includes("auto") || s.includes("moteur") || s.includes("engine") || s.includes("vehicle") || s.includes("véhicule")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Motorisation Électrique & Diagnostic Auto (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/automotive_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Electric Vehicle Drivetrains & Diagnostics (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/automotive_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("marketing") || s.includes("digitalmarketing") || s.includes("growth") || s.includes("seo")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Marketing Digital & Médias Sociaux (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/digital_marketing_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Digital Marketing & Social Media (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/digital_marketing_native",
      type: "Interactive Course"
    };
  }

  if (s.includes("content") || s.includes("contenu") || s.includes("social") || s.includes("creator") || s.includes("video")) {
    return isFrench ? {
      name: "ProPath École d'Apprentissage - Stratégie de Contenu Réseaux Sociaux (Cours Certifiant)",
      platform: "ProPath Learning School",
      duration: "À votre rythme (4 Semaines)",
      link: "propathskill://course/content_creation_native",
      type: "Cours interactif"
    } : {
      name: "ProPath Learning School - Social Content Strategy & Media Production (Certifying Course)",
      platform: "ProPath Learning School",
      duration: "Self-Paced (4 Weeks)",
      link: "propathskill://course/content_creation_native",
      type: "Interactive Course"
    };
  }

  // General industry fallback
  return isFrench ? {
    name: `ProPath École d'Apprentissage - Spécialisation Professionnelle (${sectorOrTitle})`,
    platform: "ProPath Learning School",
    duration: "À votre rythme (4 Semaines)",
    link: `propathskill://course/${s.replace(/[^a-z0-9]/g, "_")}_native`,
    type: "Cours interactif"
  } : {
    name: `ProPath Learning School - Professional Specialization (${sectorOrTitle})`,
    platform: "ProPath Learning School",
    duration: "Self-Paced (4 Weeks)",
    link: `propathskill://course/${s.replace(/[^a-z0-9]/g, "_")}_native`,
    type: "Interactive Course"
  };
}

// Helper to ensure ProPath Learning School course is always attached for the confirmed selected industry
export function ensureProPathSkillForSelectedIndustry(recommendedTracks: any[], language: string, primarySectorId?: string) {
  if (!recommendedTracks || !Array.isArray(recommendedTracks)) return recommendedTracks;

  const isFrench = language.toLowerCase() === "french";

  return recommendedTracks.map((track) => {
    if (!track) return track;

    if (!track.educationalResources) {
      track.educationalResources = [];
    }

    const targetSector = primarySectorId || track.sector || track.category || track.title || "ai";
    const nativeResource = getIndustryCourseResource(targetSector, isFrench);

    // Filter out previous propathskill links
    const filteredResources = track.educationalResources.filter(
      (res: any) => !(res.link && res.link.startsWith("propathskill://"))
    );

    // Unshift the confirmed industry resource at position 0
    track.educationalResources = [nativeResource, ...filteredResources];

    return track;
  });
}

// Helper to generate a baseline robust fallback if Gemini is offline/missing
export function getFallbackRoadmap(selectedSectors: string[], answers: Record<string, string>, country = "United States", language = "english"): CareerTrack[] {
  const isFrench = language.toLowerCase() === "french";
  const sectors = selectedSectors.length > 0 ? selectedSectors : ["ai"];
  const tracks: any[] = [];

  // Determine salary multiplier based on country (all stored as integers in schema)
  let salaryMultiplier = 1;
  const lowerCountry = country.toLowerCase();
  if (lowerCountry === "france") {
    salaryMultiplier = 0.85; // rough EUR conversion scale
  } else if (lowerCountry === "canada") {
    salaryMultiplier = 1.3; // CAD conversion scale
  } else if (lowerCountry === "cameroon" || lowerCountry === "senegal" || lowerCountry === "ivory coast" || lowerCountry === "côte d'ivoire") {
    salaryMultiplier = 600; // FCFA conversion scale (e.g. $10,000 USD is ~6,000,000 FCFA)
  }

  // Generate customized track based on sector
  sectors.forEach((secId) => {
    if (secId === "ai") {
      tracks.push({
        id: "ai-engineer",
        title: isFrench ? "Architecte de Systèmes IA & Modèles LLM" : "Agentic Systems & LLM Architect",
        category: isFrench ? "Intelligence Artificielle" : "Artificial Intelligence",
        sector: "ai",
        matchScore: 9.6,
        description: isFrench 
          ? "Spécialiste dans la conception de workflows d'agents autonomes, l'ajustement de modèles LLM et le déploiement de bases de données vectorielles pour l'industrie locale."
          : "Specializes in designing stateful multi-agent workflows, training fine-tuned vertical models, and implementing retrieval-augmented generation (RAG) pipelines for global scale enterprises.",
        demandLevel: isFrench ? "Exponentielle" : "Exponential",
        salaryTimeline: [
          { year: 1, role: isFrench ? "Ingénieur IA Junior" : "Junior AI Engineer", salary: Math.round(115000 * salaryMultiplier) },
          { year: 3, role: isFrench ? "Développeur Systèmes IA" : "AI Software Engineer", salary: Math.round(145000 * salaryMultiplier) },
          { year: 5, role: isFrench ? "Architecte de Modèles LLM" : "Senior LLM Architect", salary: Math.round(185000 * salaryMultiplier) },
          { year: 7, role: isFrench ? "Chercheur Principal en IA" : "Principal AI Researcher", salary: Math.round(230000 * salaryMultiplier) },
          { year: 10, role: isFrench ? "Directeur de l'Intelligence Artificielle" : "VP of Artificial Intelligence", salary: Math.round(320000 * salaryMultiplier) }
        ],
        skillsPredicted: [
          { name: isFrench ? "Modèles de Langage (LLM)" : "Large Language Models (LLMs)", current: 35, predicted: 95 },
          { name: isFrench ? "Architecture de Réseaux Neurones" : "Neural Network Architecture", current: 20, predicted: 85 },
          { name: isFrench ? "Workflows d'Agents Autonomes" : "Agentic Workflows & Tool Use", current: 15, predicted: 90 },
          { name: isFrench ? "Bases de Données Vectorielles" : "Data Engineering & Vector DBs", current: 40, predicted: 80 },
          { name: isFrench ? "Calcul Distribué & Mise à l'Échelle" : "Distributed Systems Scaling", current: 30, predicted: 75 }
        ],
        certificationRoadmap: [
          { name: "Google Cloud Professional Machine Learning Engineer", provider: "Google Cloud", difficulty: "Intermediate", time: "3 months" },
          { name: isFrench ? "Spécialisation Apprentissage Profond" : "Deep Learning Specialization", provider: "DeepLearning.AI", difficulty: "Beginner", time: "2 months" },
          { name: "AWS Certified Machine Learning - Specialty", provider: "AWS", difficulty: "Advanced", time: "4 months" }
        ],
        educationalResources: [
          { name: isFrench ? "Spécialisation Apprentissage Profond" : "Deep Learning Specialization", platform: "Coursera", duration: "80 hours", link: "https://www.coursera.org/specializations/deep-learning", type: "Specialization" },
          { name: "CS50's Introduction to Artificial Intelligence with Python", platform: "Harvard edX", duration: "12 weeks", link: "https://www.edx.org/course/cs50s-introduction-to-artificial-intelligence-with-python", type: "Course" },
          { name: "TensorFlow Developer Certificate Program", platform: "freeCodeCamp", duration: "24 hours", link: "https://www.freecodecamp.org/news/tensorflow-developer-certificate-prep-course/", type: "Video Course" }
        ],
        shortTermTimeline: isFrench ? [
          "Maîtriser Python et l'algèbre matricielle appliquée.",
          "Comprendre les bases théoriques de PyTorch et coder un Transformer simple.",
          "Contribuer à des projets open-source sur les frameworks d'agents."
        ] : [
          "Master Python & advanced matrix mathematics.",
          "Complete PyTorch core fundamentals and build a transformer model from scratch.",
          "Contribute to open-source LLM agent frameworks (e.g., LangChain, AutoGen)."
        ],
        mediumTermTimeline: isFrench ? [
          "Déployer un système multi-agent autonome en environnement de test.",
          "Maîtriser les méthodes d'ajustement fin (Fine-Tuning LoRA et QLoRA).",
          "Optimiser l'indexation de la base vectorielle locale pour réduire la latence."
        ] : [
          "Deploy custom micro-agents supporting tool use in production workflows.",
          "Learn pipeline fine-tuning techniques (LoRA, QLoRA) on custom domain datasets.",
          "Design scalable vector database indexing layouts to minimize latency."
        ],
        longTermTimeline: isFrench ? [
          "Diriger une équipe de développement de systèmes d'IA de nouvelle génération.",
          "Établir des protocoles d'évaluation et de défense contre les attaques contradictoires.",
          "Déployer des modèles multimodaux de pointe intégrés aux réalités industrielles."
        ] : [
          "Lead a technical engineering team developing cross-platform autonomous agents.",
          "Establish ethical guidelines, evaluation matrices, and defense structures against adversarial attacks.",
          "Pioneer state-of-the-art multimodal reasoning frameworks for commercial use."
        ]
      });
    } else if (secId === "fintech") {
      tracks.push({
        id: "fintech-quant",
        title: isFrench ? "Analyste Quantitatif & Risques DeFi" : "Quantitative DeFi Risk Analyst",
        category: isFrench ? "Technologie Financière" : "Financial Technology",
        sector: "fintech",
        matchScore: 9.3,
        description: isFrench
          ? "Conçoit des modèles mathématiques de couverture de risques, audite des smart contracts Solidity et développe des algorithmes de trading systématique adaptés à la réglementation."
          : "Designs mathematical models to price complex financial assets, manages systemic risk profiles, and drafts automated algorithmic strategy frameworks for high-frequency trading.",
        demandLevel: isFrench ? "Forte Croissance" : "High Growth",
        salaryTimeline: [
          { role: isFrench ? "Analyste de Risque Associé" : "Associate Risk Analyst", year: 1, salary: Math.round(98000 * salaryMultiplier) },
          { role: isFrench ? "Trader Algorithmique DeFi" : "DeFi Algorithmic Trader", year: 3, salary: Math.round(135000 * salaryMultiplier) },
          { role: isFrench ? "Chercheur Quantitatif Senior" : "Senior Quantitative Researcher", year: 5, salary: Math.round(190000 * salaryMultiplier) },
          { role: isFrench ? "Architecte de Modélisation Financière" : "Lead Quantitative Architect", year: 7, salary: Math.round(245000 * salaryMultiplier) },
          { role: isFrench ? "Directeur des Risques (CRO)" : "Chief Risk Officer", year: 10, salary: Math.round(380000 * salaryMultiplier) }
        ],
        skillsPredicted: [
          { name: isFrench ? "Mathématiques Quantitatives & Calcul" : "Quantitative Math & Calculus", current: 45, predicted: 90 },
          { name: isFrench ? "Audit de Contrats Intelligents" : "Smart Contract Verification", current: 15, predicted: 80 },
          { name: isFrench ? "Machine Learning Statistique" : "Statistical Machine Learning", current: 30, predicted: 85 },
          { name: isFrench ? "Modélisation Algorithmique des Risques" : "Algorithmic Risk Modeling", current: 25, predicted: 95 },
          { name: isFrench ? "Développement C++ & Python Haute Performance" : "C++ & Python High Performance", current: 50, predicted: 88 }
        ],
        certificationRoadmap: [
          { name: "Financial Risk Manager (FRM)", provider: "GARP", difficulty: "Advanced", time: "9 months" },
          { name: "Certified Solidity Smart Contract Auditor", provider: "Blockchain Council", difficulty: "Intermediate", time: "3 months" },
          { name: "Chartered Financial Analyst (CFA) Level 1", provider: "CFA Institute", difficulty: "Intermediate", time: "6 months" }
        ],
        educationalResources: [
          { name: isFrench ? "Ingénierie Financière et Gestion des Risques" : "Financial Engineering and Risk Management", platform: "Columbia Coursera", duration: "40 hours", link: "https://www.coursera.org/specializations/financialengineering", type: "Specialization" },
          { name: isFrench ? "Guide du Développeur Smart Contract" : "Smart Contract Developer Roadmap", platform: "freeCodeCamp", duration: "32 hours", link: "https://www.freecodecamp.org/news/learn-solidity-and-smart-contract-development/", type: "Course" },
          { name: "CS50 for Business Professionals", platform: "Harvard edX", duration: "6 weeks", link: "https://www.edx.org/course/cs50s-computer-science-for-business-professionals", type: "Course" }
        ],
        shortTermTimeline: isFrench ? [
          "Réviser l'algèbre linéaire, le calcul stochastique et les statistiques financières.",
          "Développer de premiers modèles simples de simulation avec Pandas en Python.",
          "Étudier la syntaxe de Solidity et le fonctionnement de l'EVM."
        ] : [
          "Complete comprehensive statistics, linear algebra, and financial calculus reviews.",
          "Build a portfolio of basic trading simulation models in Python using pandas.",
          "Learn Solidity syntax, EVM fundamentals, and common exploit vector patterns."
        ],
        mediumTermTimeline: isFrench ? [
          "Réaliser des audits de contrats intelligents à l'aide d'outils de vérification formelle.",
          "Mettre en place des modèles de stress de liquidité en temps réel.",
          "Effectuer du backtesting de stratégies quantitatives sur des registres historiques."
        ] : [
          "Perform automated smart contract security audits using formal verification tools.",
          "Implement high-performance risk models mapping liquidity volatility metrics.",
          "Backtest quantitative trading algorithms across historical blockchain ledgers."
        ],
        longTermTimeline: isFrench ? [
          "Gérer les réserves de liquidité d'un protocole d'automatisation d'actifs.",
          "Diriger un fonds de couverture décentralisé de plusieurs millions d'euros.",
          "Conseiller les régulateurs nationaux sur les cadres de finance décentralisée."
        ] : [
          "Manage strategic asset reserves using automated liquidity routing protocols.",
          "Direct a multi-million-dollar decentralized portfolio hedge fund.",
          "Consult regulatory agencies on decentralized finance frameworks and risk guidelines."
        ]
      });
    } else if (secId === "energy") {
      tracks.push({
        id: "energy-grid",
        title: isFrench ? "Ingénieur d'Intégration Réseaux Électriques Intelligents" : "Smart Grid Integration Engineer",
        category: isFrench ? "Énergie Durable" : "Sustainable Energy",
        sector: "energy",
        matchScore: 9.1,
        description: isFrench
          ? "Optimise la distribution et le stockage des énergies renouvelables (solaire, éolien) dans les réseaux électriques nationaux à l'aide de jumeaux numériques."
          : "Designs control systems and digital twins to optimize the storage, transmission, and integration of volatile wind, solar, and tidal energy assets into municipal power grids.",
        demandLevel: isFrench ? "Forte Croissance" : "High Growth",
        salaryTimeline: [
          { role: isFrench ? "Analyste de Performance Réseau" : "Grid Performance Analyst", year: 1, salary: Math.round(88000 * salaryMultiplier) },
          { role: isFrench ? "Ingénieur d'Intégration Réseau" : "Integration Engineer", year: 3, salary: Math.round(112000 * salaryMultiplier) },
          { role: isFrench ? "Architecte Réseaux Intelligents Senior" : "Senior Smart Grid Architect", year: 5, salary: Math.round(155000 * salaryMultiplier) },
          { role: isFrench ? "Directeur d'Actifs Énergétiques" : "Renewables Asset Director", year: 7, salary: Math.round(195000 * salaryMultiplier) },
          { role: isFrench ? "Vice-Président Énergies Propres" : "VP of Clean Infrastructure", year: 10, salary: Math.round(260000 * salaryMultiplier) }
        ],
        skillsPredicted: [
          { name: isFrench ? "Analyse de Réseaux Électriques" : "Power Grid Analytics", current: 30, predicted: 92 },
          { name: isFrench ? "Stockage par Batterie & Chimie" : "Battery Chemistry & Storage", current: 15, predicted: 75 },
          { name: isFrench ? "Systèmes SCADA & IoT" : "SCADA & IoT Systems", current: 40, predicted: 88 },
          { name: isFrench ? "Analyse Prédictive (Machine Learning)" : "Predictive Analytics (ML)", current: 25, predicted: 82 },
          { name: isFrench ? "Réglementation & Conformité" : "Regulatory Compliance", current: 20, predicted: 80 }
        ],
        certificationRoadmap: [
          { name: "Certified Energy Manager (CEM)", provider: "Association of Energy Engineers", difficulty: "Intermediate", time: "4 months" },
          { name: "Professional Engineer (PE) license", provider: "NCEES", difficulty: "Advanced", time: "12 months" },
          { name: "Renewable Energy Certificates", provider: "Stanford Online", difficulty: "Intermediate", time: "3 months" }
        ],
        educationalResources: [
          { name: "Introduction to Sustainable Energy", platform: "MIT OpenCourseWare", duration: "36 hours", link: "https://ocw.mit.edu/courses/nuclear-engineering/22-081j-introduction-to-sustainable-energy-fall-2010/", type: "Full Course" },
          { name: "Smart Grids: Electricity Transmission Systems", platform: "Delft edX", duration: "8 weeks", link: "https://www.edx.org/course/smart-grids-electricity-transmission-systems", type: "Course" },
          { name: "Solar Energy Engineering", platform: "freeCodeCamp", duration: "15 hours", link: "https://www.freecodecamp.org/news/solar-energy-engineering-free-course/", type: "Video Tutorial" }
        ],
        shortTermTimeline: isFrench ? [
          "Maîtriser les bases du génie électrique et des lois de distribution d'énergie.",
          "Prendre en main MATLAB, Simulink et les simulateurs de charge électrique.",
          "Étudier les codes de raccordement réseau et les politiques locales."
        ] : [
          "Understand electrical engineering fundamentals, power transmission laws, and energy grid load concepts.",
          "Learn MATLAB, Simulink, and specialized electrical load simulation tools.",
          "Review national grid code rules and local sustainable energy integration policies."
        ],
        mediumTermTimeline: isFrench ? [
          "Créer un jumeau numérique simulant le comportement d'une batterie de stockage locale.",
          "Optimiser l'algorithme d'arbitrage de charge avec de l'apprentissage automatique.",
          "Superviser un projet pilote de raccordement d'un champ solaire local."
        ] : [
          "Engineer responsive digital twins mimicking battery storage micro-grid responses.",
          "Optimize dispatch algorithms minimizing peak load stress using predictive machine learning.",
          "Lead local regional solar field grid interconnection trials."
        ],
        longTermTimeline: isFrench ? [
          "Concevoir des schémas d'infrastructure nationale pour un réseau 100% décarboné.",
          "Déployer des centrales électriques virtuelles connectant des milliers de foyers.",
          "Conseiller les investissements publics d'infrastructure propre au niveau de l'État."
        ] : [
          "Spearhead national infrastructure designs transitioning grids to 100% carbon-free assets.",
          "Pioneer smart virtual power plant (VPP) systems across major metropolitan grids.",
          "Direct clean infrastructure capital investment strategies at a state or national level."
        ]
      });
    } else {
      // General fallbacks for newly added sectors (art, electrical, carpentry, automotive)
      const namesMapEn: Record<string, string> = {
        biotech: "Bioinformatics Computational Lead",
        spacetech: "Orbital Mechanics & Drone Pilot",
        smartcities: "Urban Resource Loop Architect",
        creativedesign: "Spatial UI Product Designer",
        art: "Fine Arts Director & Creative Lead",
        electrical: "Industrial Automation & Smart Grid Lead",
        carpentry: "Master Craftsman & Restoration Lead",
        automotive: "Electric Vehicle Drivetrain Engineer",
        digitalmarketing: "Growth Hacking & Digital Marketing Director",
        contentcreation: "Social Media Strategist & Creative Content Director"
      };
      const namesMapFr: Record<string, string> = {
        biotech: "Chef de Projet Bioinformatique",
        spacetech: "Spécialiste Mécanique Orbitale & Drone",
        smartcities: "Architecte de Flux Urbains Intelligents",
        creativedesign: "Designer d'Interfaces Spatiales UI",
        art: "Directeur Créatif & Art Numérique",
        electrical: "Ingénieur d'Automatisation Industrielle & Électricité",
        carpentry: "Maître Artisan Charpentier & Éco-Construction",
        automotive: "Ingénieur Motorisation Électrique & Diagnostic Auto",
        digitalmarketing: "Directeur Marketing Digital & Growth Hacking",
        contentcreation: "Stratège Réseaux Sociaux & Directeur Création de Contenu"
      };
      
      const categoryMapEn: Record<string, string> = {
        biotech: "Biotech & Genomics",
        spacetech: "Aerospace & SpaceTech",
        smartcities: "Smart Cities & IoT",
        creativedesign: "Creative Digital Design",
        art: "Fine Arts & Creative Media",
        electrical: "Electrical & Smart Grid Systems",
        carpentry: "Artisanal Carpentry & Construction",
        automotive: "Automotive Technology & Mechanics",
        digitalmarketing: "Digital Marketing & Growth Hacking",
        contentcreation: "Social Media & Content Production"
      };
      const categoryMapFr: Record<string, string> = {
        biotech: "Biotechnologies & Génomique",
        spacetech: "Aérospatiale & Technologie Spatial",
        smartcities: "Villes Intelligentes & IoT",
        creativedesign: "Design Numérique Créatif",
        art: "Beaux-Arts & Médias Créatifs",
        electrical: "Systèmes Électriques & Réseaux",
        carpentry: "Charpenterie Artisanale & Éco-Construction",
        automotive: "Technologie Automobile & Mécanique",
        digitalmarketing: "Marketing Digital & Growth Hacking",
        contentcreation: "Réseaux Sociaux & Production de Contenu"
      };

      const title = isFrench ? (namesMapFr[secId] || "Architecte de Solutions Techniques") : (namesMapEn[secId] || "Technical Solutions Architect");
      const category = isFrench ? (categoryMapFr[secId] || "Ingénierie & Métiers de Demain") : (categoryMapEn[secId] || (secId.charAt(0).toUpperCase() + secId.slice(1)));

      let description = isFrench 
        ? `Parcours de spécialisation pratique axé sur l'intégration technologique, l'apprentissage de terrain et la maîtrise opérationnelle dans la catégorie ${category}.`
        : `High-fidelity engineering and management track focusing on specialized workflows in the ${category} field. Addresses challenges with advanced system structures, collaborative data analysis, and scalable pipelines.`;
      
      let skillsPredicted = [
        { name: isFrench ? "Architecture Système" : "System Architecture", current: 30, predicted: 90 },
        { name: isFrench ? "Ingénierie Stratégique" : "Strategic Engineering", current: 25, predicted: 85 },
        { name: isFrench ? "Spécialisation Métier" : "Domain Specialization", current: 20, predicted: 95 },
        { name: isFrench ? "Leadership Collaboratif" : "Collaborative Leadership", current: 40, predicted: 88 },
        { name: isFrench ? "Automatisation Avancée" : "Advanced Automation", current: 30, predicted: 80 }
      ];

      let certificationRoadmap = [
        { name: "Professional Solutions Architect", provider: "Industry Council", difficulty: "Intermediate" as any, time: "3 months" },
        { name: "Advanced System Engineering Certificate", provider: "National Institute", difficulty: "Advanced" as any, time: "6 months" }
      ];

      let educationalResources = [
        { name: "Systems Thinking Fundamentals", platform: "Harvard edX", duration: "6 weeks", link: "https://www.edx.org/", type: "Course" },
        { name: "Modern Automation Tools Guide", platform: "freeCodeCamp", duration: "10 hours", link: "https://www.freecodecamp.org/", type: "Tutorial" }
      ];

      // Deep dive custom fallback
      if (secId === "art") {
        description = isFrench 
          ? "Supervise la conception visuelle et thématique d'expositions physiques ou virtuelles, d'installations interactives et de campagnes créatives."
          : "Guides the visual, sensory, and thematic direction of physical and digital exhibitions, hybrid installations, and corporate creative campaigns using contemporary mediums.";
        skillsPredicted = [
          { name: isFrench ? "Illustration Traditionnelle & Digitale" : "Traditional & Digital Illustration", current: 40, predicted: 92 },
          { name: isFrench ? "Scénographie d'Exposition" : "Exhibition Space Planning", current: 20, predicted: 85 },
          { name: isFrench ? "Communication Visuelle et Stratégie" : "Visual Communication Strategy", current: 35, predicted: 88 },
          { name: isFrench ? "Direction Artistique et Design" : "Visual Artistry & Direction", current: 45, predicted: 78 },
          { name: isFrench ? "Histoire de l'Art & Muséologie" : "Art History & Curation", current: 30, predicted: 80 }
        ];
        educationalResources = [
          { name: "Modern and Contemporary Art Specialization", platform: "MoMA Coursera", duration: "4 weeks", link: "https://www.coursera.org/specializations/modern-contemporary-art-design", type: "Specialization" },
          { name: "Art History & Fine Arts Fundamentals", platform: "Khan Academy", duration: "12 hours", link: "https://www.khanacademy.org/humanities/art-history", type: "Course" }
        ];
      } else if (secId === "electrical") {
        description = isFrench
          ? "Conçoit, câble et programme des automates industriels (PLC) et des systèmes de contrôle automatisés pour les usines de production locales."
          : "Spearheads the design, wiring, and integration of industrial programmable logic controllers, automated manufacturing machinery, and smart-grid electricity load balancing infrastructure.";
        skillsPredicted = [
          { name: isFrench ? "Systèmes Électriques Intelligents" : "Smart Grid Systems", current: 25, predicted: 90 },
          { name: isFrench ? "Automatisme & Programmation d'Automates" : "PLC & Industrial Automation", current: 35, predicted: 92 },
          { name: isFrench ? "Analyse de Circuits & Simulation" : "Circuit Analysis & Simulation", current: 40, predicted: 85 },
          { name: isFrench ? "Distribution Énergie Haute Tension" : "High-Voltage Power Distribution", current: 15, predicted: 78 },
          { name: isFrench ? "Maintenance Électrique Prédictive" : "Predictive Electrical Maintenance", current: 20, predicted: 80 }
        ];
        educationalResources = [
          { name: "Introduction to Electronics", platform: "Georgia Tech Coursera", duration: "8 weeks", link: "https://www.coursera.org/learn/introduction-to-electronics", type: "Course" },
          { name: "Electrical Engineering Principles", platform: "freeCodeCamp", duration: "8 hours", link: "https://www.youtube.com/watch?v=m4jzgqZu-4s", type: "Video Masterclass" }
        ];
      } else if (secId === "carpentry") {
        description = isFrench
          ? "Conçoit, fabrique et restaure des structures en bois durables, des charpentes à haute performance énergétique et des meubles artisanaux."
          : "Designs, fabricates, and restores highly specialized wooden architectural systems, eco-friendly load-bearing frames, and custom artisanal furniture.";
        skillsPredicted = [
          { name: isFrench ? "Menuiserie de Précision & Profilage" : "Precision Woodworking & Milling", current: 45, predicted: 94 },
          { name: isFrench ? "Lecture de Plans & Charpenterie" : "Architectural Framing Blueprinting", current: 30, predicted: 88 },
          { name: isFrench ? "Choix d'Éco-Matériaux Durables" : "Eco-Friendly Material Selection", current: 25, predicted: 82 },
          { name: isFrench ? "Fabrication Numérique Bois (CAM)" : "CAD/CAM Digital Wood Fabrication", current: 20, predicted: 80 },
          { name: isFrench ? "Calcul de Charges Structurales" : "Structural Load Calculation", current: 35, predicted: 85 }
        ];
        educationalResources = [
          { name: "Construction Engineering & Management", platform: "University of Michigan Coursera", duration: "16 weeks", link: "https://www.coursera.org/specializations/construction-engineering-management", type: "Specialization" },
          { name: "Essential Woodworking Skills Guide", platform: "Woodworking For Mere Mortals", duration: "10 hours", link: "https://www.youtube.com/user/stevinmarin", type: "Video Tutorial" }
        ];
      } else if (secId === "automotive") {
        description = isFrench
          ? "Développe et dépanne les systèmes de propulsion électrique, les batteries haute performance et les logiciels de diagnostic embarqués."
          : "Engineers and diagnoses state-of-the-art electric vehicle drivetrains, high-performance battery packs, and intelligent automotive diagnostic frameworks.";
        skillsPredicted = [
          { name: isFrench ? "Motorisation Électrique & Propulsion" : "EV Drivetrain Configuration", current: 25, predicted: 92 },
          { name: isFrench ? "Gestion Thermique des Batteries" : "Battery Thermal Management", current: 20, predicted: 88 },
          { name: isFrench ? "Réseau de Multiplexage & Diagnostic CAN" : "Automotive Network Diagnostics (CAN)", current: 35, predicted: 90 },
          { name: isFrench ? "Logiciels Embarqués de Diagnostic Auto" : "Embedded Automotive Software", current: 30, predicted: 85 },
          { name: isFrench ? "Gestion de Cellules Solides de Batterie" : "Solid-State Cell Integration", current: 15, predicted: 75 }
        ];
        educationalResources = [
          { name: "Electric and Hybrid Vehicles", platform: "Lund University Coursera", duration: "6 weeks", link: "https://www.coursera.org/learn/electric-hybrid-vehicles", type: "Course" },
          { name: "Automotive Technology & Maintenance", platform: "Udemy", duration: "15 hours", link: "https://www.udemy.com/course/car-maintenance-and-repair/", type: "Course" }
        ];
      } else if (secId === "digitalmarketing") {
        description = isFrench
          ? "Conçoit et optimise des campagnes de marketing multi-canaux, gère le SEO/SEM, l'acquisition d'utilisateurs et l'analyse de données de performance pour stimuler la croissance."
          : "Spearheads cross-channel marketing campaigns, user acquisition funnels, SEO/SEM performance metrics, and growth-hacking strategies using data-driven platforms.";
        skillsPredicted = [
          { name: isFrench ? "Optimisation des Conversions (CRO)" : "Conversion Rate Optimization (CRO)", current: 20, predicted: 90 },
          { name: isFrench ? "SEO & Acquisition Organique" : "SEO & Organic Acquisition", current: 30, predicted: 95 },
          { name: isFrench ? "Campagnes de Publicité Payante" : "Paid Media & PPC Campaigns", current: 15, predicted: 88 },
          { name: isFrench ? "Analyse de Données Marketing" : "Marketing Data Analytics", current: 25, predicted: 85 },
          { name: isFrench ? "Marketing d'Influence" : "Influencer & Affiliate Marketing", current: 35, predicted: 80 }
        ];
        educationalResources = [
          { name: "Google Digital Marketing & E-commerce Certificate", platform: "Coursera", duration: "6 months", link: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce", type: "Professional Certificate" },
          { name: "Growth Hacking Masterclass", platform: "Udemy", duration: "12 hours", link: "https://www.udemy.com/", type: "Course" }
        ];
      } else if (secId === "contentcreation") {
        description = isFrench
          ? "Dirige la création de contenu visuel et écrit attrayant sur TikTok, YouTube, Instagram, rédige des textes persuasifs et développe la présence de marque de manière virale."
          : "Directs viral short-form and long-form video production, copywriting, social media community building, and cross-platform storytelling strategies for leading brands.";
        skillsPredicted = [
          { name: isFrench ? "Montage Vidéo Mobile (CapCut/Premiere)" : "Mobile Video Editing (CapCut/Premiere)", current: 35, predicted: 95 },
          { name: isFrench ? "Rédaction Persuasive & Copywriting" : "Copywriting & Storytelling", current: 30, predicted: 92 },
          { name: isFrench ? "Gestion de Communauté & Engagement" : "Community Management", current: 25, predicted: 88 },
          { name: isFrench ? "Production de Formats Courts (Reels/TikTok)" : "Short-form Content Formats (Reels/TikTok)", current: 40, predicted: 96 },
          { name: isFrench ? "Design Graphique & Canaux Visuels" : "Visual Graphic Design & Branding", current: 20, predicted: 82 }
        ];
        educationalResources = [
          { name: "Social Media Marketing Specialization", platform: "Meta Coursera", duration: "5 months", link: "https://www.coursera.org/specializations/social-media-marketing-meta", type: "Specialization" },
          { name: "Viral Video Creation Guide", platform: "freeCodeCamp", duration: "6 hours", link: "https://www.freecodecamp.org/", type: "Video Tutorial" }
        ];
      }

      tracks.push({
        id: `${secId}-track`,
        title: title,
        category: category,
        sector: secId,
        matchScore: 9.2,
        description: description,
        demandLevel: isFrench ? "Forte Croissance" : "High Growth",
        salaryTimeline: [
          { role: isFrench ? "Spécialiste Associé" : "Associate Specialist", year: 1, salary: Math.round(90000 * salaryMultiplier) },
          { role: isFrench ? "Technicien / Ingénieur Qualifié" : "Qualified Systems Engineer", year: 3, salary: Math.round(120000 * salaryMultiplier) },
          { role: isFrench ? "Responsable Technique" : "Lead Systems Architect", year: 5, salary: Math.round(165000 * salaryMultiplier) },
          { role: isFrench ? "Chef d'Atelier / Directeur" : "Director of Technology", year: 7, salary: Math.round(210000 * salaryMultiplier) },
          { role: isFrench ? "Expert Principal" : "Chief Expert", year: 10, salary: Math.round(290000 * salaryMultiplier) }
        ],
        skillsPredicted: skillsPredicted,
        certificationRoadmap: certificationRoadmap,
        educationalResources: educationalResources,
        shortTermTimeline: isFrench ? [
          "Acquérir les notions de base et manipuler les premiers outils du métier.",
          "Concevoir de petites maquettes ou projets pilotes résolvant des cas réels.",
          "S'intégrer aux réseaux locaux professionnels de la région sélectionnée."
        ] : [
          "Acquire core domain principles, notation, and toolkits.",
          "Build small-scale proof-of-concept projects modeling domain scenarios.",
          "Join community groups and review leading white papers in the sector."
        ],
        mediumTermTimeline: isFrench ? [
          "Prendre en charge des tâches d'automatisation ou d'optimisation de procédés.",
          "Mettre en place des protocoles d'assurance qualité stricts.",
          "Guider de nouvelles recrues et coordonner de petites équipes locales."
        ] : [
          "Deploy custom pipelines integrating data collection networks in real-time.",
          "Design failover mechanisms and automate quality assurance workflows.",
          "Mentor incoming junior engineers and coordinate cross-functional sprints."
        ],
        longTermTimeline: isFrench ? [
          "Devenir un expert technique incontournable reconnu dans la région.",
          "Superviser des chantiers d'installation ou des équipes à grande échelle.",
          "Contribuer à l'amélioration constante des formations professionnelles locales."
        ] : [
          "Pioneer groundbreaking patents and research papers in this specialized industry.",
          "Direct corporate initiatives scaling infrastructure safely to millions of active nodes.",
          "Represent the sector in national panels, driving next-generation standards."
        ]
      });
    }
  });

  // Ensure we return at least 2 tracks
  if (tracks.length === 1) {
    tracks.push({
      id: "universal-pm",
      title: isFrench ? "Chef d'Équipe Technique Multi-Secteurs" : "Cross-Sector Technical Product Lead",
      category: isFrench ? "Gestion Stratégique d'Équipes" : "Strategic Product Management",
      sector: sectors[0],
      matchScore: 8.8,
      description: isFrench 
        ? "Assure le pont entre les capacités techniques, la gestion de chantiers ou projets et la satisfaction du client final dans les industries d'avenir."
        : "Bridges the gap between engineering capabilities, business models, and high-fidelity product execution across multi-disciplinary, high-growth sectors.",
      demandLevel: isFrench ? "Forte Croissance" : "High Growth",
      salaryTimeline: [
        { role: isFrench ? "Coordinateur Technique Junior" : "Associate Technical Lead", year: 1, salary: Math.round(95000 * salaryMultiplier) },
        { role: isFrench ? "Chef de Projet Technique" : "Technical Project Manager", year: 3, salary: Math.round(125000 * salaryMultiplier) },
        { role: isFrench ? "Chef d'Équipe Technique Principal" : "Senior Technical Lead", year: 5, salary: Math.round(165000 * salaryMultiplier) },
        { role: isFrench ? "Directeur d'Opérations" : "Director of Technical Operations", year: 7, salary: Math.round(215000 * salaryMultiplier) },
        { role: isFrench ? "Directeur Général d'Activité (CPO/COO)" : "Chief Operating Officer", year: 10, salary: Math.round(300000 * salaryMultiplier) }
      ],
      skillsPredicted: [
        { name: isFrench ? "Planification & Suivi de Chantier" : "Project Planning & Milestones", current: 50, predicted: 95 },
        { name: isFrench ? "Analyse d'Opportunités Locales" : "Market Opportunity Analysis", current: 30, predicted: 88 },
        { name: isFrench ? "Évaluation de Faisabilité Technique" : "Technical Feasibility Assessment", current: 25, predicted: 80 },
        { name: isFrench ? "Négociation avec les Partenaires" : "Stakeholder Negotiation", current: 40, predicted: 92 },
        { name: isFrench ? "Optimisation d'Expérience Client" : "Client Experience Optimization", current: 35, predicted: 85 }
      ],
      certificationRoadmap: [
        { name: "Professional Technical Lead Certification", provider: "Global Council", difficulty: "Intermediate" as any, time: "1 month" }
      ],
      educationalResources: [
        { name: "Technical Project Coordination", platform: "edX", duration: "12 hours", link: "https://www.edx.org", type: "Course" }
      ],
      shortTermTimeline: isFrench ? [
        "S'approprier les méthodologies de suivi et de planification locale.",
        "Faciliter l'organisation quotidienne d'équipes et la gestion des tâches.",
        "Maîtriser les métriques de réussite de projets industriels complexes."
      ] : [
        "Learn core agile frameworks, story sizing, and feedback loops.",
        "Facilitate product definition and coordinate small features from ideation to launch.",
        "Familiarize yourself with target metrics, database schemas, and analytics tools."
      ],
      mediumTermTimeline: isFrench ? [
        "Superviser des lancements de produits ou des livraisons de chantiers clés.",
        "Réaliser des audits de productivité d'équipe.",
        "Ajuster les indicateurs de coûts et de planification opérationnelle."
      ] : [
        "Manage complex multi-tier roadmap projects with active release criteria.",
        "Conduct competitive analyses and launch major structural updates.",
        "Implement data logging systems tracking precise user drop-off points."
      ],
      longTermTimeline: isFrench ? [
        "Prendre la direction générale opérationnelle de départements entiers.",
        "Concevoir de nouveaux standards de collaboration pour l'éco-système régional.",
        "Développer des partenariats stratégiques majeurs à haute rentabilité commerciale."
      ] : [
        "Lead entire product suites generating tens of millions in annual recurring revenue.",
        "Establish design languages and agile operations practices across the company.",
        "Define long-term corporate mergers, acquisitions, and core technical shifts."
      ]
    });
  }

  return ensureProPathSkillForSelectedIndustry(tracks.slice(0, 3), language, sectors[0]);
}
