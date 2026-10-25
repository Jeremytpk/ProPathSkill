import type { Bilingual, EducationLevel, FieldId, SkillKey, WorkSetting } from "./assessment";

/**
 * Occupation catalogue used for matching.
 *
 * `code` is the occupation's Holland (RIASEC) interest code, strongest type first,
 * aligned with the interest profiles O*NET publishes for the closest US occupation.
 * Have a career counsellor review codes and training times for your markets
 * before relying on them.
 */
export interface Occupation {
  id: string;
  field: FieldId;
  code: string;
  skills: SkillKey[];
  settings: WorkSetting[];
  /** Minimum education usually expected to start training (see EducationLevel). */
  minEducation: EducationLevel;
  /** Typical months of training before earning from this work. */
  trainingMonths: number;
  selfEmployable: boolean;
  title: Bilingual;
  summary: Bilingual;
  /** How people usually get in. */
  entry: Bilingual;
  /** ProPath Learning School course that prepares for this occupation, if any. */
  courseId?: string;
}

export const OCCUPATIONS: Occupation[] = [
  // Energy and electricity
  {
    id: "solar_installer", field: "energy", code: "RCI", skills: ["hands", "numbers", "organising"], settings: ["field", "workshop"],
    minEducation: 1, trainingMonths: 4, selfEmployable: true, courseId: "smartgrid_native",
    title: { en: "Solar PV installer", fr: "Installateur solaire photovoltaïque" },
    summary: { en: "Sizes, installs and maintains solar panels, batteries and inverters for homes, shops and health centres.", fr: "Dimensionne, installe et entretient panneaux solaires, batteries et onduleurs pour maisons, commerces et centres de santé." },
    entry: { en: "A short practical solar course, then work alongside an experienced installer.", fr: "Une courte formation pratique en solaire, puis du travail aux côtés d'un installateur expérimenté." },
  },
  {
    id: "electrician", field: "energy", code: "RIC", skills: ["hands", "numbers", "organising"], settings: ["field", "workshop"],
    minEducation: 1, trainingMonths: 12, selfEmployable: true, courseId: "electrical_native",
    title: { en: "Electrician", fr: "Électricien" },
    summary: { en: "Installs and repairs electrical wiring, panels and equipment in buildings, safely and to code.", fr: "Installe et répare le câblage, les tableaux et les équipements électriques des bâtiments, en sécurité et selon les normes." },
    entry: { en: "A vocational electricity certificate or an apprenticeship with a qualified electrician.", fr: "Un certificat professionnel en électricité ou un apprentissage auprès d'un électricien qualifié." },
  },
  {
    id: "industrial_maintenance", field: "energy", code: "RIC", skills: ["hands", "numbers", "digital"], settings: ["workshop", "field"],
    minEducation: 2, trainingMonths: 24, selfEmployable: false, courseId: "electrical_native",
    title: { en: "Industrial maintenance technician", fr: "Technicien de maintenance industrielle" },
    summary: { en: "Keeps machines, motors and automated systems running in factories, breweries, mines and plants.", fr: "Assure le bon fonctionnement des machines, moteurs et automatismes dans les usines, brasseries, mines et centrales." },
    entry: { en: "A technical diploma (A2 or BTS level) in electromechanics or maintenance.", fr: "Un diplôme technique (niveau A2 ou BTS) en électromécanique ou maintenance." },
  },
  // Construction and woodwork
  {
    id: "carpenter", field: "construction", code: "RCI", skills: ["hands", "numbers", "creative"], settings: ["workshop", "field"],
    minEducation: 0, trainingMonths: 12, selfEmployable: true, courseId: "carpentry_native",
    title: { en: "Carpenter and joiner", fr: "Menuisier et charpentier" },
    summary: { en: "Makes furniture, doors, roofs and fittings from wood, from measurement to finishing.", fr: "Fabrique meubles, portes, charpentes et agencements en bois, de la prise de mesures à la finition." },
    entry: { en: "An apprenticeship in a workshop or a vocational carpentry course.", fr: "Un apprentissage en atelier ou une formation professionnelle en menuiserie." },
  },
  {
    id: "mason", field: "construction", code: "RCE", skills: ["hands", "numbers", "organising"], settings: ["field"],
    minEducation: 0, trainingMonths: 9, selfEmployable: true,
    title: { en: "Mason and builder", fr: "Maçon et bâtisseur" },
    summary: { en: "Builds walls, foundations and slabs with bricks, blocks and concrete, reading simple plans.", fr: "Construit murs, fondations et dalles en briques, parpaings et béton, en lisant des plans simples." },
    entry: { en: "On-site apprenticeship, ideally with a short masonry certificate.", fr: "Apprentissage sur chantier, idéalement avec un court certificat en maçonnerie." },
  },
  {
    id: "plumber", field: "construction", code: "RCI", skills: ["hands", "numbers", "people"], settings: ["field"],
    minEducation: 1, trainingMonths: 9, selfEmployable: true,
    title: { en: "Plumber", fr: "Plombier" },
    summary: { en: "Installs and repairs water supply, drainage, tanks and sanitary fittings.", fr: "Installe et répare l'alimentation en eau, les évacuations, les réservoirs et les sanitaires." },
    entry: { en: "A plumbing course or an apprenticeship with an established plumber.", fr: "Une formation en plomberie ou un apprentissage auprès d'un plombier établi." },
  },
  {
    id: "civil_engineer", field: "construction", code: "IRC", skills: ["numbers", "digital", "organising"], settings: ["office", "field"],
    minEducation: 2, trainingMonths: 60, selfEmployable: false,
    title: { en: "Civil engineer", fr: "Ingénieur en génie civil" },
    summary: { en: "Designs and supervises roads, bridges, buildings and water systems.", fr: "Conçoit et supervise routes, ponts, bâtiments et réseaux d'eau." },
    entry: { en: "A university engineering degree (bachelor's then master's).", fr: "Un diplôme universitaire d'ingénieur (licence puis master)." },
  },
  {
    id: "welder", field: "construction", code: "RCI", skills: ["hands", "numbers"], settings: ["workshop", "field"],
    minEducation: 0, trainingMonths: 6, selfEmployable: true,
    title: { en: "Welder and metal fabricator", fr: "Soudeur et métallier" },
    summary: { en: "Cuts, welds and assembles metal for gates, windows, structures and machinery.", fr: "Découpe, soude et assemble le métal pour portails, fenêtres, structures et machines." },
    entry: { en: "A welding course and practice in a metal workshop.", fr: "Une formation en soudure et de la pratique en atelier de métallerie." },
  },
  // Mechanics and repair
  {
    id: "auto_mechanic", field: "mechanics", code: "RIC", skills: ["hands", "numbers"], settings: ["workshop"],
    minEducation: 0, trainingMonths: 12, selfEmployable: true, courseId: "automotive_native",
    title: { en: "Vehicle and motorbike mechanic", fr: "Mécanicien auto et moto" },
    summary: { en: "Diagnoses and repairs engines, brakes, electrics and suspensions of cars and motorbikes.", fr: "Diagnostique et répare moteurs, freins, électricité et suspensions des voitures et motos." },
    entry: { en: "An apprenticeship in a garage, ideally with a mechanics certificate.", fr: "Un apprentissage en garage, idéalement avec un certificat en mécanique." },
  },
  {
    id: "phone_repair", field: "mechanics", code: "RIC", skills: ["hands", "digital", "selling"], settings: ["workshop", "people"],
    minEducation: 1, trainingMonths: 3, selfEmployable: true,
    title: { en: "Phone and electronics repair technician", fr: "Réparateur de téléphones et d'électronique" },
    summary: { en: "Repairs smartphones, screens, chargers and small electronics, and installs software.", fr: "Répare smartphones, écrans, chargeurs et petits appareils électroniques, et installe des logiciels." },
    entry: { en: "A short hands-on repair course, then a stall or workshop of your own.", fr: "Une courte formation pratique en réparation, puis un stand ou un atelier à votre compte." },
  },
  // Technology
  {
    id: "it_support", field: "tech", code: "RIC", skills: ["digital", "people", "organising"], settings: ["office", "people"],
    minEducation: 2, trainingMonths: 6, selfEmployable: true,
    title: { en: "IT support technician", fr: "Technicien support informatique" },
    summary: { en: "Sets up computers, networks and accounts, and helps users fix problems.", fr: "Installe ordinateurs, réseaux et comptes, et aide les utilisateurs à résoudre leurs problèmes." },
    entry: { en: "An IT support certificate (for example Google IT Support) and practice on real machines.", fr: "Un certificat en support informatique (par exemple Google IT Support) et de la pratique sur de vraies machines." },
  },
  {
    id: "web_developer", field: "tech", code: "ICA", skills: ["digital", "creative", "numbers"], settings: ["remote", "office"],
    minEducation: 2, trainingMonths: 9, selfEmployable: true,
    title: { en: "Web and mobile developer", fr: "Développeur web et mobile" },
    summary: { en: "Builds websites and apps for businesses, schools and organisations.", fr: "Crée des sites web et des applications pour des entreprises, écoles et organisations." },
    entry: { en: "Self-study or a bootcamp, plus a portfolio of 3–5 real projects.", fr: "Autoformation ou bootcamp, avec un portfolio de 3 à 5 vrais projets." },
  },
  {
    id: "data_analyst", field: "tech", code: "ICE", skills: ["numbers", "digital", "communication"], settings: ["office", "remote"],
    minEducation: 2, trainingMonths: 9, selfEmployable: false, courseId: "ai_systems_native",
    title: { en: "Data analyst", fr: "Analyste de données" },
    summary: { en: "Turns sales, health or survey data into clear numbers and charts that guide decisions.", fr: "Transforme les données de ventes, de santé ou d'enquêtes en chiffres et graphiques clairs qui guident les décisions." },
    entry: { en: "Spreadsheet and SQL skills, a data certificate, and a portfolio of analyses.", fr: "Maîtrise du tableur et de SQL, un certificat en données et un portfolio d'analyses." },
  },
  {
    id: "software_engineer", field: "tech", code: "ICR", skills: ["digital", "numbers", "organising"], settings: ["remote", "office"],
    minEducation: 2, trainingMonths: 36, selfEmployable: true, courseId: "ai_systems_native",
    title: { en: "Software engineer", fr: "Ingénieur logiciel" },
    summary: { en: "Designs and builds reliable software systems, including AI-powered tools.", fr: "Conçoit et construit des systèmes logiciels fiables, y compris des outils basés sur l'IA." },
    entry: { en: "A computer science degree, or intensive self-study with a strong project portfolio.", fr: "Un diplôme en informatique, ou une autoformation intensive avec un solide portfolio de projets." },
  },
  {
    id: "cybersecurity", field: "tech", code: "ICR", skills: ["digital", "numbers", "organising"], settings: ["office", "remote"],
    minEducation: 2, trainingMonths: 18, selfEmployable: false,
    title: { en: "Cybersecurity analyst", fr: "Analyste en cybersécurité" },
    summary: { en: "Protects banks, telecoms and businesses against fraud and cyber attacks.", fr: "Protège banques, opérateurs télécoms et entreprises contre la fraude et les cyberattaques." },
    entry: { en: "IT foundations, then a security certificate such as CompTIA Security+.", fr: "Des bases en informatique, puis un certificat en sécurité comme CompTIA Security+." },
  },
  // Agriculture and food
  {
    id: "agri_entrepreneur", field: "agriculture", code: "REC", skills: ["hands", "selling", "organising"], settings: ["field"],
    minEducation: 0, trainingMonths: 3, selfEmployable: true,
    title: { en: "Farmer and agribusiness owner", fr: "Agriculteur et entrepreneur agricole" },
    summary: { en: "Runs a farm, poultry or fish-farming business and sells to markets, shops and restaurants.", fr: "Gère une exploitation agricole, avicole ou piscicole et vend aux marchés, boutiques et restaurants." },
    entry: { en: "Practical training in modern techniques, starting small and growing with your profits.", fr: "Une formation pratique aux techniques modernes, en commençant petit et en grandissant avec vos bénéfices." },
  },
  {
    id: "agri_technician", field: "agriculture", code: "RIC", skills: ["hands", "numbers", "people"], settings: ["field"],
    minEducation: 2, trainingMonths: 24, selfEmployable: false,
    title: { en: "Agricultural technician", fr: "Technicien agricole" },
    summary: { en: "Advises farmers on seeds, soil, irrigation and pests, and runs field trials.", fr: "Conseille les agriculteurs sur les semences, le sol, l'irrigation et les ravageurs, et conduit des essais au champ." },
    entry: { en: "A technical diploma in agronomy (ITA or A2) or an agricultural institute.", fr: "Un diplôme technique en agronomie (ITA ou A2) ou un institut supérieur agricole." },
  },
  {
    id: "food_processing", field: "agriculture", code: "ERC", skills: ["hands", "selling", "organising"], settings: ["workshop"],
    minEducation: 0, trainingMonths: 3, selfEmployable: true,
    title: { en: "Food processing entrepreneur", fr: "Entrepreneur en transformation alimentaire" },
    summary: { en: "Turns local produce into packaged products like flour, juice, peanut butter or soap.", fr: "Transforme les produits locaux en produits emballés : farine, jus, pâte d'arachide ou savon." },
    entry: { en: "A hygiene and processing course, then small batches sold locally.", fr: "Une formation en hygiène et transformation, puis de petites productions vendues localement." },
  },
  {
    id: "chef", field: "hospitality", code: "ERA", skills: ["hands", "creative", "organising"], settings: ["workshop", "people"],
    minEducation: 0, trainingMonths: 6, selfEmployable: true,
    title: { en: "Cook and caterer", fr: "Cuisinier et traiteur" },
    summary: { en: "Prepares meals for restaurants, hotels and events, or runs a catering business.", fr: "Prépare des repas pour restaurants, hôtels et événements, ou gère une activité de traiteur." },
    entry: { en: "A culinary course or kitchen apprenticeship, then events and catering.", fr: "Une formation culinaire ou un apprentissage en cuisine, puis des événements et du traiteur." },
  },
  // Health
  {
    id: "nurse", field: "health", code: "SIC", skills: ["people", "organising", "communication"], settings: ["people"],
    minEducation: 2, trainingMonths: 36, selfEmployable: false, courseId: "biotech_native",
    title: { en: "Nurse", fr: "Infirmier(ère)" },
    summary: { en: "Cares for patients, gives treatments and supports doctors in clinics and hospitals.", fr: "Soigne les patients, administre les traitements et assiste les médecins en clinique et à l'hôpital." },
    entry: { en: "A nursing diploma from an accredited institute (ISTM or equivalent).", fr: "Un diplôme d'infirmier d'un institut agréé (ISTM ou équivalent)." },
  },
  {
    id: "community_health", field: "health", code: "SCE", skills: ["people", "communication", "organising"], settings: ["people", "field"],
    minEducation: 1, trainingMonths: 3, selfEmployable: false,
    title: { en: "Community health worker", fr: "Agent de santé communautaire" },
    summary: { en: "Visits families, raises awareness about health and refers patients to clinics.", fr: "Visite les familles, sensibilise à la santé et oriente les patients vers les centres de santé." },
    entry: { en: "Short training through a health zone, NGO or health programme.", fr: "Une courte formation via une zone de santé, une ONG ou un programme de santé." },
  },
  {
    id: "lab_technician", field: "health", code: "RIC", skills: ["numbers", "organising", "hands"], settings: ["workshop"],
    minEducation: 2, trainingMonths: 36, selfEmployable: false, courseId: "biotech_native",
    title: { en: "Medical laboratory technician", fr: "Technicien de laboratoire médical" },
    summary: { en: "Runs tests on blood and samples to help diagnose malaria, HIV and other diseases.", fr: "Réalise des analyses de sang et d'échantillons pour diagnostiquer le paludisme, le VIH et d'autres maladies." },
    entry: { en: "A medical laboratory diploma (ISTM or equivalent).", fr: "Un diplôme en techniques de laboratoire (ISTM ou équivalent)." },
  },
  {
    id: "pharmacy_assistant", field: "health", code: "CRS", skills: ["organising", "people", "numbers"], settings: ["people"],
    minEducation: 2, trainingMonths: 12, selfEmployable: false,
    title: { en: "Pharmacy assistant", fr: "Assistant en pharmacie" },
    summary: { en: "Dispenses medicines under supervision, manages stock and advises customers.", fr: "Délivre les médicaments sous supervision, gère le stock et conseille les clients." },
    entry: { en: "A pharmacy assistant course and supervised work in a licensed pharmacy.", fr: "Une formation d'assistant en pharmacie et du travail supervisé en officine agréée." },
  },
  // Education and social
  {
    id: "teacher", field: "education", code: "SAE", skills: ["communication", "people", "organising"], settings: ["people"],
    minEducation: 2, trainingMonths: 36, selfEmployable: false,
    title: { en: "Teacher", fr: "Enseignant(e)" },
    summary: { en: "Teaches children or young people, prepares lessons and follows each learner's progress.", fr: "Enseigne aux enfants ou aux jeunes, prépare les cours et suit les progrès de chaque élève." },
    entry: { en: "A teaching diploma (ISP or pedagogy degree).", fr: "Un diplôme pédagogique (ISP ou licence en pédagogie)." },
  },
  {
    id: "vocational_trainer", field: "education", code: "SER", skills: ["communication", "people", "hands"], settings: ["people", "workshop"],
    minEducation: 3, trainingMonths: 6, selfEmployable: true,
    title: { en: "Vocational trainer", fr: "Formateur professionnel" },
    summary: { en: "Trains apprentices in a trade you master, in a centre or your own workshop.", fr: "Forme des apprentis dans un métier que vous maîtrisez, en centre ou dans votre atelier." },
    entry: { en: "Experience in a trade plus a short trainer-of-trainers course.", fr: "De l'expérience dans un métier et une courte formation de formateurs." },
  },
  {
    id: "social_worker", field: "education", code: "SIE", skills: ["people", "communication", "organising"], settings: ["people", "field"],
    minEducation: 2, trainingMonths: 36, selfEmployable: false,
    title: { en: "Social worker", fr: "Assistant(e) social(e)" },
    summary: { en: "Supports vulnerable families, children and survivors, and connects them to services.", fr: "Accompagne familles vulnérables, enfants et survivants, et les relie aux services." },
    entry: { en: "A social work degree, often followed by NGO work.", fr: "Un diplôme en travail social, souvent suivi d'un emploi en ONG." },
  },
  {
    id: "program_officer", field: "education", code: "SEC", skills: ["organising", "communication", "people"], settings: ["office", "field"],
    minEducation: 4, trainingMonths: 6, selfEmployable: false,
    title: { en: "NGO programme officer", fr: "Chargé(e) de programme en ONG" },
    summary: { en: "Plans and follows up development projects, budgets and reports for NGOs and agencies.", fr: "Planifie et suit des projets de développement, budgets et rapports pour ONG et agences." },
    entry: { en: "A degree, plus project management and report-writing skills.", fr: "Un diplôme, avec des compétences en gestion de projet et rédaction de rapports." },
  },
  // Business and finance
  {
    id: "accountant", field: "business", code: "CEI", skills: ["numbers", "organising", "digital"], settings: ["office"],
    minEducation: 2, trainingMonths: 24, selfEmployable: true, courseId: "fintech_native",
    title: { en: "Bookkeeper and accountant", fr: "Comptable" },
    summary: { en: "Keeps the accounts of businesses, prepares statements and handles taxes.", fr: "Tient la comptabilité des entreprises, prépare les états financiers et gère la fiscalité." },
    entry: { en: "An accounting diploma (OHADA/SYSCOHADA) and practice with accounting software.", fr: "Un diplôme en comptabilité (OHADA/SYSCOHADA) et de la pratique avec un logiciel comptable." },
  },
  {
    id: "mobile_money", field: "business", code: "ECS", skills: ["selling", "numbers", "people"], settings: ["people"],
    minEducation: 1, trainingMonths: 1, selfEmployable: true, courseId: "fintech_native",
    title: { en: "Mobile money and banking agent", fr: "Agent mobile money et bancaire" },
    summary: { en: "Runs a point for deposits, withdrawals and transfers, building a base of loyal customers.", fr: "Tient un point de dépôts, retraits et transferts, en fidélisant sa clientèle." },
    entry: { en: "Register with an operator or bank, with starting float capital.", fr: "S'enregistrer auprès d'un opérateur ou d'une banque, avec un fonds de roulement de départ." },
  },
  {
    id: "small_business", field: "business", code: "ECS", skills: ["selling", "numbers", "organising"], settings: ["people"],
    minEducation: 0, trainingMonths: 1, selfEmployable: true,
    title: { en: "Shop or trading business owner", fr: "Commerçant(e) et gérant(e) de boutique" },
    summary: { en: "Buys, stocks and sells goods, manages cash, suppliers and customers.", fr: "Achète, stocke et vend des marchandises, gère la caisse, les fournisseurs et les clients." },
    entry: { en: "Basic business and bookkeeping training, then start small and reinvest.", fr: "Une formation de base en gestion et comptabilité, puis commencer petit et réinvestir." },
  },
  {
    id: "logistics", field: "business", code: "CEI", skills: ["organising", "numbers", "digital"], settings: ["office", "field"],
    minEducation: 2, trainingMonths: 12, selfEmployable: false,
    title: { en: "Logistics and supply coordinator", fr: "Coordinateur logistique et approvisionnement" },
    summary: { en: "Plans transport, warehouses and stock so goods arrive on time.", fr: "Planifie le transport, les entrepôts et le stock pour que les marchandises arrivent à temps." },
    entry: { en: "A logistics certificate and good spreadsheet skills.", fr: "Un certificat en logistique et une bonne maîtrise du tableur." },
  },
  {
    id: "project_manager", field: "business", code: "ECS", skills: ["organising", "communication", "people"], settings: ["office"],
    minEducation: 3, trainingMonths: 6, selfEmployable: true,
    title: { en: "Project manager", fr: "Chef de projet" },
    summary: { en: "Leads projects from plan to delivery: people, budget, deadlines and risks.", fr: "Pilote des projets du plan à la livraison : équipes, budget, délais et risques." },
    entry: { en: "Experience leading work, plus a project management certificate.", fr: "De l'expérience en gestion d'activités, avec un certificat en gestion de projet." },
  },
  // Creative and media
  {
    id: "tailor", field: "creative", code: "RAC", skills: ["hands", "creative", "selling"], settings: ["workshop"],
    minEducation: 0, trainingMonths: 9, selfEmployable: true,
    title: { en: "Tailor and fashion designer", fr: "Couturier(ère) et styliste" },
    summary: { en: "Designs, cuts and sews clothes, from custom outfits to small collections.", fr: "Conçoit, coupe et coud des vêtements, du sur-mesure aux petites collections." },
    entry: { en: "A sewing apprenticeship or fashion course, then build a client base.", fr: "Un apprentissage en couture ou une formation en mode, puis se constituer une clientèle." },
  },
  {
    id: "hairdresser", field: "creative", code: "ASE", skills: ["hands", "creative", "people"], settings: ["people", "workshop"],
    minEducation: 0, trainingMonths: 6, selfEmployable: true,
    title: { en: "Hairdresser and beautician", fr: "Coiffeur(se) et esthéticien(ne)" },
    summary: { en: "Cuts, braids and styles hair, and provides beauty care in a salon.", fr: "Coupe, tresse et coiffe, et propose des soins de beauté en salon." },
    entry: { en: "A salon apprenticeship or beauty course.", fr: "Un apprentissage en salon ou une formation en esthétique." },
  },
  {
    id: "graphic_designer", field: "creative", code: "ARE", skills: ["creative", "digital", "communication"], settings: ["remote", "office"],
    minEducation: 2, trainingMonths: 6, selfEmployable: true, courseId: "creativedesign_native",
    title: { en: "Graphic designer", fr: "Graphiste" },
    summary: { en: "Creates logos, posters, packaging and social media visuals for businesses.", fr: "Crée logos, affiches, emballages et visuels pour les réseaux sociaux des entreprises." },
    entry: { en: "Learn a design tool (Canva, Figma, Adobe), then build a portfolio.", fr: "Apprendre un outil de design (Canva, Figma, Adobe), puis constituer un portfolio." },
  },
  {
    id: "photo_video", field: "creative", code: "ARE", skills: ["creative", "digital", "selling"], settings: ["field", "people"],
    minEducation: 0, trainingMonths: 4, selfEmployable: true, courseId: "content_creation_native",
    title: { en: "Photographer and videographer", fr: "Photographe et vidéaste" },
    summary: { en: "Shoots and edits photos and videos for weddings, events, brands and media.", fr: "Réalise et monte photos et vidéos pour mariages, événements, marques et médias." },
    entry: { en: "Practise with a phone or camera, learn editing, and show your work.", fr: "Pratiquer avec un téléphone ou un appareil, apprendre le montage et montrer son travail." },
  },
  {
    id: "content_creator", field: "creative", code: "AES", skills: ["creative", "communication", "digital"], settings: ["remote"],
    minEducation: 1, trainingMonths: 3, selfEmployable: true, courseId: "content_creation_native",
    title: { en: "Content creator and community manager", fr: "Créateur de contenu et community manager" },
    summary: { en: "Creates posts and videos and manages social media pages for brands.", fr: "Crée des publications et des vidéos et gère les pages de réseaux sociaux des marques." },
    entry: { en: "Grow your own page as proof, then manage pages for businesses.", fr: "Développer votre propre page comme preuve, puis gérer celles d'entreprises." },
  },
  {
    id: "journalist", field: "creative", code: "AEI", skills: ["communication", "creative", "digital"], settings: ["field", "office"],
    minEducation: 2, trainingMonths: 24, selfEmployable: true,
    title: { en: "Journalist and communications officer", fr: "Journaliste et chargé(e) de communication" },
    summary: { en: "Investigates, writes and presents news, or handles an organisation's communication.", fr: "Enquête, écrit et présente l'actualité, ou gère la communication d'une organisation." },
    entry: { en: "A journalism or communication degree, plus published work.", fr: "Un diplôme en journalisme ou communication, avec des travaux publiés." },
  },
  {
    id: "artisan", field: "creative", code: "ARE", skills: ["hands", "creative", "selling"], settings: ["workshop"],
    minEducation: 0, trainingMonths: 6, selfEmployable: true, courseId: "art_native",
    title: { en: "Artist and craftsperson", fr: "Artiste et artisan d'art" },
    summary: { en: "Creates paintings, sculptures, jewellery or crafts and sells to buyers and tourists.", fr: "Crée peintures, sculptures, bijoux ou objets artisanaux et les vend aux acheteurs et touristes." },
    entry: { en: "Learn from a master, build a body of work, sell at markets and online.", fr: "Apprendre auprès d'un maître, constituer une œuvre, vendre sur les marchés et en ligne." },
  },
  // Marketing and sales
  {
    id: "digital_marketer", field: "marketing", code: "EAC", skills: ["digital", "selling", "communication"], settings: ["remote", "office"],
    minEducation: 2, trainingMonths: 4, selfEmployable: true, courseId: "digital_marketing_native",
    title: { en: "Digital marketer", fr: "Spécialiste du marketing digital" },
    summary: { en: "Runs online ads, social media and WhatsApp campaigns that bring customers to a business.", fr: "Gère publicités en ligne, réseaux sociaux et campagnes WhatsApp qui amènent des clients." },
    entry: { en: "A digital marketing certificate and real campaigns for local businesses.", fr: "Un certificat en marketing digital et de vraies campagnes pour des commerces locaux." },
  },
  {
    id: "sales_rep", field: "marketing", code: "ECS", skills: ["selling", "communication", "people"], settings: ["field", "people"],
    minEducation: 1, trainingMonths: 1, selfEmployable: false,
    title: { en: "Sales representative", fr: "Commercial(e)" },
    summary: { en: "Visits clients, presents products and closes sales for a company.", fr: "Visite des clients, présente des produits et conclut des ventes pour une entreprise." },
    entry: { en: "Join a distributor or telecom company and learn on the job.", fr: "Rejoindre un distributeur ou un opérateur télécom et apprendre sur le terrain." },
  },
  // Hospitality and tourism
  {
    id: "hotel_reception", field: "hospitality", code: "CES", skills: ["people", "communication", "organising"], settings: ["people"],
    minEducation: 2, trainingMonths: 3, selfEmployable: false,
    title: { en: "Hotel receptionist and hospitality agent", fr: "Réceptionniste et agent d'accueil hôtelier" },
    summary: { en: "Welcomes guests, manages bookings and payments, and solves guests' problems.", fr: "Accueille les clients, gère réservations et paiements, et résout leurs problèmes." },
    entry: { en: "A hospitality course; English and French are a strong advantage.", fr: "Une formation en hôtellerie ; parler anglais et français est un fort atout." },
  },
  {
    id: "tour_guide", field: "hospitality", code: "SEA", skills: ["communication", "people", "selling"], settings: ["field", "people"],
    minEducation: 2, trainingMonths: 3, selfEmployable: true,
    title: { en: "Tour guide and travel organiser", fr: "Guide touristique et organisateur de voyages" },
    summary: { en: "Organises and leads trips to parks, lakes and cultural sites.", fr: "Organise et anime des visites de parcs, lacs et sites culturels." },
    entry: { en: "A guide course and deep knowledge of your region; languages help.", fr: "Une formation de guide et une bonne connaissance de votre région ; les langues aident." },
  },
  // Environment and mining
  {
    id: "mining_technician", field: "environment", code: "RIC", skills: ["hands", "numbers", "organising"], settings: ["field"],
    minEducation: 2, trainingMonths: 24, selfEmployable: false,
    title: { en: "Mining and geology technician", fr: "Technicien des mines et de géologie" },
    summary: { en: "Supports exploration, sampling and safe operations at mining sites.", fr: "Appuie l'exploration, l'échantillonnage et la sécurité des opérations sur les sites miniers." },
    entry: { en: "A technical diploma in mining or geology.", fr: "Un diplôme technique en mines ou en géologie." },
  },
  {
    id: "environment_officer", field: "environment", code: "IRC", skills: ["numbers", "communication", "organising"], settings: ["field", "office"],
    minEducation: 2, trainingMonths: 36, selfEmployable: false, courseId: "smartcities_native",
    title: { en: "Environment and conservation officer", fr: "Agent de l'environnement et de la conservation" },
    summary: { en: "Monitors forests, water and pollution, and runs conservation projects.", fr: "Surveille forêts, eaux et pollution, et mène des projets de conservation." },
    entry: { en: "A degree in environmental science, forestry or biology.", fr: "Un diplôme en sciences de l'environnement, foresterie ou biologie." },
  },
];
