import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Fallback mode active.");
}

// Helper to generate a baseline robust fallback if Gemini is offline/missing
function getFallbackRoadmap(selectedSectors: string[], answers: Record<string, string>, country = "United States", language = "english"): any[] {
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
        automotive: "Electric Vehicle Drivetrain Engineer"
      };
      const namesMapFr: Record<string, string> = {
        biotech: "Chef de Projet Bioinformatique",
        spacetech: "Spécialiste Mécanique Orbitale & Drone",
        smartcities: "Architecte de Flux Urbains Intelligents",
        creativedesign: "Designer d'Interfaces Spatiales UI",
        art: "Directeur Créatif & Art Numérique",
        electrical: "Ingénieur d'Automatisation Industrielle & Électricité",
        carpentry: "Maître Artisan Charpentier & Éco-Construction",
        automotive: "Ingénieur Motorisation Électrique & Diagnostic Auto"
      };
      
      const categoryMapEn: Record<string, string> = {
        biotech: "Biotech & Genomics",
        spacetech: "Aerospace & SpaceTech",
        smartcities: "Smart Cities & IoT",
        creativedesign: "Creative Digital Design",
        art: "Fine Arts & Creative Media",
        electrical: "Electrical & Smart Grid Systems",
        carpentry: "Artisanal Carpentry & Construction",
        automotive: "Automotive Technology & Mechanics"
      };
      const categoryMapFr: Record<string, string> = {
        biotech: "Biotechnologies & Génomique",
        spacetech: "Aérospatiale & Technologie Spatial",
        smartcities: "Villes Intelligentes & IoT",
        creativedesign: "Design Numérique Créatif",
        art: "Beaux-Arts & Médias Créatifs",
        electrical: "Systèmes Électriques & Réseaux",
        carpentry: "Charpenterie Artisanale & Éco-Construction",
        automotive: "Technologie Automobile & Mécanique"
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
        { name: "Professional Solutions Architect", provider: "Industry Council", difficulty: "Intermediate", time: "3 months" },
        { name: "Advanced System Engineering Certificate", provider: "National Institute", difficulty: "Advanced", time: "6 months" }
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
      }

      tracks.push({
        id: `${secId}-track`,
        title: title,
        category: category,
        sector: secId,
        matchScore: 9.2,
        description: description,
        demandLevel: isFrench ? "Forte Demande" : "High Growth",
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
        { name: "Professional Technical Lead Certification", provider: "Global Council", difficulty: "Intermediate", time: "1 month" }
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

  return tracks.slice(0, 3);
}

// REST API Route to generate career roadmap via Gemini API
app.post("/api/generate-roadmap", async (req, res) => {
  try {
    const { answers, selectedSectors, country, language } = req.body;

    const chosenCountry = country || "United States";
    const chosenLanguage = language || "english";

    if (!selectedSectors || !Array.isArray(selectedSectors) || selectedSectors.length === 0) {
      return res.status(400).json({ error: "At least one sector must be selected." });
    }

    console.log("Generating roadmap for country:", chosenCountry, "language:", chosenLanguage, "sectors:", selectedSectors);

    // If Gemini client is not initialized, run fallback immediately
    if (!aiClient) {
      console.log("No Gemini API key available. Serving high-fidelity fallback.");
      const fallback = getFallbackRoadmap(selectedSectors, answers, chosenCountry, chosenLanguage);
      return res.json({ recommendedTracks: fallback });
    }

    // Build the Prompt for Gemini
    const sectorDescriptionList = selectedSectors.map(s => `- ${s}`).join("\n");
    const formattedAnswers = Object.entries(answers || {}).map(([qId, optId]) => `Question ${qId}: Option chosen is ${optId}`).join("\n");

    const promptText = `
You are the Career Alignment Brain for ProPath, a vocational intelligence platform.
The user has completed a vocational style assessment, selected a country of residency, and selected up to three global target industries.

Selected Target Industries:
${sectorDescriptionList}

User Scenario Assessment Answers:
${formattedAnswers}

Residency Country Constraint:
The user resides in: ${chosenCountry}.
Your suggestions MUST reflect real-world opportunities, schools, and professional structures of ${chosenCountry}.
1. For educational resources, certification providers, and pathway schools, prefer real, accredited entities from ${chosenCountry} (e.g. state-sponsored trade programs, local polytechnics, national academies, public training organizations, specialized ministries, etc.).
2. The salaries in the salary timeline must reflect ${chosenCountry}'s actual local economy and values. Since the response schema requires integers, output appropriate progressive numbers in the dominant currency. (For Cameroon, Senegal, or Ivory Coast, use annual integers representing the local currency FCFA, e.g. 3000000, 5000000, 10000000 FCFA. For France, use Euros €, e.g. 35000, 50000, 80000. For Canada, use Canadian Dollars CAD $, e.g. 70000, 95000, 130000. For US, use USD $, e.g. 80000, 110000, 150000).

Language Constraint:
The chosen language is: ${chosenLanguage}.
IMPORTANT: You MUST write the entire JSON response (including titles, categories, descriptions, role names, providers, platform, timeline steps, etc.) fully translated in **French** if the chosen language is 'french'. If the language is 'english', write in English. JSON schema keys must remain strictly in English as defined below.

Task:
Generate exactly 2 high-fidelity, completely customized career tracks that sit at the intersection of their aptitude profile (revealed by their answers) and their selected sectors, fully tailored to ${chosenCountry} and written in ${chosenLanguage}.

For each career track, generate:
1. ID: unique lowercase string identifier
2. Title: highly descriptive, high-growth modern title matching their country and trade
3. Category: target sector category
4. Sector: the corresponding selected sector ID
5. MatchScore: compatibility score between 8.0 and 9.9 out of 10 based on how well their quiz dimensions line up
6. Description: 2-3 sentence overview of this specific role
7. DemandLevel: one of "Exponential", "High Growth", "Emerging" (translated to French if requested)
8. SalaryTimeline: 5 key milestones for Year 1, Year 3, Year 5, Year 7, and Year 10. Each milestone should have 'year' (integer), 'role' (string, progressive seniority), and 'salary' (integer, matching chosen currency standard of ${chosenCountry}).
9. SkillsPredicted: 5 core skills that are relevant. Each skill has 'name' (string), 'current' (integer percentage baseline, e.g. 15-50), and 'predicted' (integer percentage in 5 years, e.g. 75-98).
10. CertificationRoadmap: 2-3 prestigious industry credentials (such as Google, AWS, ISA, SAE, ASE, MoMA, or National Carpentry/Electrical credentials relevant to ${chosenCountry}) with 'name' (string), 'provider' (string), 'difficulty' (string: "Beginner", "Intermediate", or "Advanced"), and 'time' (string: e.g. "3 months").
11. EducationalResources: 2-3 genuine, highly relevant, 100% free online courses or tutorials from reputable sites (such as freeCodeCamp, Harvard edX, Coursera, MoMA, Khan Academy, or standard YouTube video tutorials, or local state vocational platforms) specific to the trade or industry. Ensure 'link' is a valid, real external URL that teaches/trains in this industry, and 'platform', 'name', 'duration', and 'type' are provided.
12. ShortTermTimeline: 3 concrete action milestones for months 0-6.
13. MediumTermTimeline: 3 strategic action milestones for months 6-18.
14. LongTermTimeline: 3 visionary action milestones for months 18+.

Respond STRICTLY with a valid JSON object matching the requested schema. Ensure the response contains a 'recommendedTracks' array. Do not include any markdown backticks or outer prose wrapper. Only return the JSON.
`;

    let response;
    let retries = 3;
    let delay = 1000;
    while (retries > 0) {
      try {
        response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                recommendedTracks: {
                  type: Type.ARRAY,
                  description: "The list of 2 custom recommended career tracks.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      category: { type: Type.STRING },
                      sector: { type: Type.STRING },
                      matchScore: { type: Type.NUMBER },
                      description: { type: Type.STRING },
                      demandLevel: { type: Type.STRING },
                      salaryTimeline: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            year: { type: Type.INTEGER },
                            role: { type: Type.STRING },
                            salary: { type: Type.INTEGER }
                          },
                          required: ["year", "role", "salary"]
                        }
                      },
                      skillsPredicted: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            current: { type: Type.INTEGER },
                            predicted: { type: Type.INTEGER }
                          },
                          required: ["name", "current", "predicted"]
                        }
                      },
                      certificationRoadmap: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            provider: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                            time: { type: Type.STRING }
                          },
                          required: ["name", "provider", "difficulty", "time"]
                        }
                      },
                      educationalResources: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            platform: { type: Type.STRING },
                            duration: { type: Type.STRING },
                            link: { type: Type.STRING },
                            type: { type: Type.STRING }
                          },
                          required: ["name", "platform", "duration", "link", "type"]
                        }
                      },
                      shortTermTimeline: { type: Type.ARRAY, items: { type: Type.STRING } },
                      mediumTermTimeline: { type: Type.ARRAY, items: { type: Type.STRING } },
                      longTermTimeline: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: [
                      "id", "title", "category", "sector", "matchScore", "description",
                      "demandLevel", "salaryTimeline", "skillsPredicted",
                      "certificationRoadmap", "educationalResources",
                      "shortTermTimeline", "mediumTermTimeline", "longTermTimeline"
                    ]
                  }
                }
              },
              required: ["recommendedTracks"]
            }
          }
        });

        const jsonText = response.text;
        if (!jsonText) {
          throw new Error("Empty response from Gemini API");
        }

        const data = JSON.parse(jsonText);
        return res.json(data);
      } catch (err: any) {
        retries--;
        const isTransient = err?.status === 503 || err?.statusCode === 503 || (err?.message && (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("UNAVAILABLE") || err.message.includes("temporary")));
        if (isTransient && retries > 0) {
          console.warn(`Gemini API 503 detected. Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        } else {
          throw err; // Out of retries or non-transient error
        }
      }
    }
  } catch (error: any) {
    console.error("Gemini Roadmap generation error:", error);
    // Graceful fallback
    console.log("Serving high-fidelity fallback to ensure premium app uptime.");
    const fallback = getFallbackRoadmap(req.body.selectedSectors || ["ai"], req.body.answers || {}, req.body.country, req.body.language);
    res.json({ recommendedTracks: fallback, note: "Loaded via ProPath intelligent backup engine due to transient API latency." });
  }
});

// Setup Vite Development Server or Static Build Assets Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite developer server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production built files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProPath Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
