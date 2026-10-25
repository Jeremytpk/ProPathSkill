import type { Bilingual, FieldId, SkillKey } from "./assessment";

/**
 * Shared skills list. Learning plans, ProPath courses and (later) tutor courses all
 * link through these IDs, so recommendations always point to real courses.
 */

export type SkillGroup = FieldId | "foundation";

export interface Skill {
  id: string;
  group: SkillGroup;
  label: Bilingual;
  /** Self-rated assessment skill closest to this one, used to spot what the person already has. */
  base: SkillKey;
  /** Built-in ProPath Learning School course that teaches this skill, if any. */
  courseId?: string;
}

const s = (id: string, group: SkillGroup, base: SkillKey, en: string, fr: string, courseId?: string): Skill => ({
  id, group, base, label: { en, fr }, courseId,
});

export const SKILLS_CATALOG: Skill[] = [
  // Foundations useful for any job or business
  s("business_basics", "foundation", "organising", "Running a small business", "Gérer une petite entreprise"),
  s("bookkeeping", "foundation", "numbers", "Bookkeeping and cash management", "Tenue de caisse et comptabilité simple", "fintech_native"),
  s("pricing_costing", "foundation", "numbers", "Costing and setting prices", "Calcul des coûts et fixation des prix"),
  s("customer_service", "foundation", "people", "Customer service", "Service client"),
  s("sales_negotiation", "foundation", "selling", "Selling and negotiation", "Vente et négociation"),
  s("digital_literacy", "foundation", "digital", "Computer and smartphone skills", "Maîtrise de l'ordinateur et du smartphone"),
  s("professional_writing", "foundation", "communication", "Professional writing and communication", "Rédaction et communication professionnelles"),
  s("project_planning", "foundation", "organising", "Planning and managing a project", "Planifier et gérer un projet"),
  s("team_leadership", "foundation", "people", "Leading a team", "Diriger une équipe"),
  s("legal_registration", "foundation", "organising", "Business registration and legal basics", "Enregistrement d'entreprise et bases juridiques"),
  s("funding_applications", "foundation", "communication", "Finding funding and writing applications", "Trouver des financements et rédiger des demandes"),
  s("workplace_safety", "foundation", "hands", "Workplace safety and first aid", "Sécurité au travail et premiers secours"),

  // Energy and electricity
  s("solar_pv", "energy", "hands", "Solar PV design and installation", "Conception et installation solaire photovoltaïque", "smartgrid_native"),
  s("battery_storage", "energy", "hands", "Batteries and energy storage", "Batteries et stockage d'énergie", "smartgrid_native"),
  s("electrical_wiring", "energy", "hands", "Electrical wiring", "Câblage électrique", "electrical_native"),
  s("industrial_automation", "energy", "digital", "PLCs and industrial automation", "Automates et automatisation industrielle", "electrical_native"),

  // Construction and woodwork
  s("carpentry", "construction", "hands", "Woodworking and carpentry", "Menuiserie et travail du bois", "carpentry_native"),
  s("masonry", "construction", "hands", "Masonry and concrete", "Maçonnerie et béton"),
  s("plumbing", "construction", "hands", "Plumbing", "Plomberie"),
  s("welding", "construction", "hands", "Welding and metalwork", "Soudure et métallerie"),
  s("plan_reading", "construction", "numbers", "Reading plans and estimating quantities", "Lecture de plans et métré", "carpentry_native"),

  // Mechanics and repair
  s("vehicle_repair", "mechanics", "hands", "Car and motorbike repair", "Réparation auto et moto", "automotive_native"),
  s("small_engines", "mechanics", "hands", "Generators and small engines", "Groupes électrogènes et petits moteurs", "automotive_native"),
  s("electronics_repair", "mechanics", "hands", "Phone and electronics repair", "Réparation de téléphones et d'électronique"),

  // Agriculture and food
  s("crop_farming", "agriculture", "hands", "Crop farming and market gardening", "Cultures et maraîchage"),
  s("poultry_farming", "agriculture", "hands", "Poultry farming", "Aviculture"),
  s("fish_farming", "agriculture", "hands", "Fish farming", "Pisciculture"),
  s("livestock", "agriculture", "hands", "Livestock care", "Élevage"),
  s("food_processing", "agriculture", "hands", "Food processing and hygiene", "Transformation alimentaire et hygiène"),
  s("agri_marketing", "agriculture", "selling", "Selling farm products", "Vente de produits agricoles"),

  // Health and care
  s("first_aid", "health", "people", "First aid", "Premiers secours"),
  s("community_health", "health", "communication", "Health education and hygiene", "Éducation sanitaire et hygiène"),
  s("nutrition", "health", "people", "Nutrition", "Nutrition"),
  s("caregiving", "health", "people", "Caring for patients and the elderly", "Soins aux malades et aux personnes âgées"),

  // Education and social
  s("teaching_training", "education", "communication", "Teaching and training others", "Enseigner et former"),
  s("working_with_children", "education", "people", "Working with children", "Travailler avec les enfants"),
  s("counselling", "education", "people", "Counselling and social support", "Écoute et accompagnement social"),

  // Business and finance
  s("accounting", "business", "numbers", "Accounting (OHADA)", "Comptabilité (OHADA)", "fintech_native"),
  s("mobile_money", "business", "numbers", "Mobile money and agent operations", "Mobile money et gestion d'un point agent", "fintech_native"),
  s("stock_logistics", "business", "organising", "Stock and logistics management", "Gestion des stocks et logistique"),
  s("shop_management", "business", "selling", "Running a shop", "Gestion de boutique"),

  // Technology
  s("spreadsheets", "tech", "digital", "Spreadsheets (Excel, Google Sheets)", "Tableurs (Excel, Google Sheets)"),
  s("web_development", "tech", "digital", "Building websites", "Création de sites web"),
  s("mobile_apps", "tech", "digital", "Building mobile apps", "Création d'applications mobiles"),
  s("data_analysis", "tech", "numbers", "Data analysis", "Analyse de données", "ai_systems_native"),
  s("ai_tools", "tech", "digital", "Using AI tools at work", "Utiliser les outils d'IA au travail", "ai_systems_native"),
  s("it_support", "tech", "digital", "IT support and networks", "Support informatique et réseaux"),
  s("cybersecurity", "tech", "digital", "Cybersecurity basics", "Bases de la cybersécurité"),

  // Design, fashion and media
  s("graphic_design", "creative", "creative", "Graphic design", "Design graphique", "creativedesign_native"),
  s("photography", "creative", "creative", "Photography", "Photographie"),
  s("video_production", "creative", "creative", "Video shooting and editing", "Tournage et montage vidéo"),
  s("sewing_fashion", "creative", "hands", "Sewing and fashion design", "Couture et stylisme"),
  s("hair_beauty", "creative", "hands", "Hairdressing and beauty", "Coiffure et esthétique"),
  s("arts_crafts", "creative", "creative", "Arts and crafts", "Arts et artisanat", "art_native"),
  s("content_writing", "creative", "communication", "Writing and storytelling", "Écriture et storytelling"),

  // Marketing and sales
  s("digital_marketing", "marketing", "selling", "Digital marketing", "Marketing digital", "digital_marketing_native"),
  s("social_media", "marketing", "communication", "Social media management", "Gestion des réseaux sociaux", "digital_marketing_native"),
  s("whatsapp_selling", "marketing", "selling", "Selling on WhatsApp and Facebook", "Vendre sur WhatsApp et Facebook", "digital_marketing_native"),
  s("branding", "marketing", "creative", "Branding", "Image de marque", "creativedesign_native"),

  // Hospitality and tourism
  s("cooking_catering", "hospitality", "hands", "Cooking and catering", "Cuisine et traiteur"),
  s("guest_service", "hospitality", "people", "Hotel and guest service", "Accueil et service hôtelier"),
  s("tour_guiding", "hospitality", "communication", "Tour guiding", "Guide touristique"),
  s("event_planning", "hospitality", "organising", "Event planning", "Organisation d'événements"),

  // Environment and mining
  s("environment_monitoring", "environment", "numbers", "Environmental monitoring and conservation", "Suivi environnemental et conservation"),
  s("waste_recycling", "environment", "hands", "Waste management and recycling", "Gestion et recyclage des déchets"),
  s("mining_safety", "environment", "hands", "Mining operations and safety", "Opérations minières et sécurité"),
];

export const SKILL_IDS = SKILLS_CATALOG.map((k) => k.id) as [string, ...string[]];

export function getSkill(id: string): Skill | undefined {
  return SKILLS_CATALOG.find((k) => k.id === id);
}

/** Course ID for a skill: its built-in ProPath course, or the shared ProPath AI course written for it. */
export function skillCourseId(skill: Skill, lang: "english" | "french") {
  return skill.courseId || `skill_${skill.id}_${lang === "french" ? "fr" : "en"}`;
}
