/**
 * ProPath career assessment content.
 *
 * Interests use the Holland (RIASEC) model: six interest types that career
 * services and the O*NET database use to describe both people and occupations.
 * Skills are self-rated. Context questions make the matches realistic (how much
 * training the person can take on, their education, whether they want a job or
 * their own business).
 */

export type RiasecType = "R" | "I" | "A" | "S" | "E" | "C";
export const RIASEC_TYPES: RiasecType[] = ["R", "I", "A", "S", "E", "C"];

export type Lang = "english" | "french";
export interface Bilingual {
  en: string;
  fr: string;
}

export const tr = (text: Bilingual, lang: Lang) => (lang === "french" ? text.fr : text.en);

export const RIASEC_INFO: Record<RiasecType, { name: Bilingual; strength: Bilingual }> = {
  R: {
    name: { en: "Hands-on builder", fr: "Bâtisseur pratique" },
    strength: {
      en: "You like working with tools, machines, plants or animals, and seeing a concrete result.",
      fr: "Vous aimez travailler avec des outils, des machines, des plantes ou des animaux, et voir un résultat concret.",
    },
  },
  I: {
    name: { en: "Problem solver", fr: "Résolveur de problèmes" },
    strength: {
      en: "You like understanding how things work, analysing information and finding the cause of a problem.",
      fr: "Vous aimez comprendre comment les choses fonctionnent, analyser l'information et trouver la cause d'un problème.",
    },
  },
  A: {
    name: { en: "Creator", fr: "Créatif" },
    strength: {
      en: "You like expressing ideas through design, images, words, music or style.",
      fr: "Vous aimez exprimer des idées par le design, l'image, les mots, la musique ou le style.",
    },
  },
  S: {
    name: { en: "Helper", fr: "Accompagnateur" },
    strength: {
      en: "You like teaching, caring for and supporting other people.",
      fr: "Vous aimez enseigner, prendre soin des autres et les soutenir.",
    },
  },
  E: {
    name: { en: "Entrepreneur", fr: "Entrepreneur" },
    strength: {
      en: "You like leading, convincing, selling and turning opportunities into income.",
      fr: "Vous aimez diriger, convaincre, vendre et transformer les opportunités en revenus.",
    },
  },
  C: {
    name: { en: "Organiser", fr: "Organisateur" },
    strength: {
      en: "You like order, accuracy and clear procedures: records, money, stock and schedules.",
      fr: "Vous aimez l'ordre, la précision et les procédures claires : registres, argent, stock et plannings.",
    },
  },
};

export interface InterestItem {
  id: string;
  type: RiasecType;
  text: Bilingual;
}

const ITEMS_BY_TYPE: Record<RiasecType, Bilingual[]> = {
  R: [
    { en: "Repair a motorbike, a generator or a water pump", fr: "Réparer une moto, un groupe électrogène ou une pompe à eau" },
    { en: "Install solar panels or the electrical wiring of a house", fr: "Installer des panneaux solaires ou le câblage électrique d'une maison" },
    { en: "Build furniture or a structure with wood, metal or bricks", fr: "Fabriquer des meubles ou une structure en bois, en métal ou en briques" },
    { en: "Grow crops or raise animals", fr: "Cultiver la terre ou élever des animaux" },
    { en: "Use tools and machines in a workshop", fr: "Utiliser des outils et des machines dans un atelier" },
    { en: "Work outdoors on a building site, a farm or a mine", fr: "Travailler dehors sur un chantier, une ferme ou une mine" },
  ],
  I: [
    { en: "Find out why a machine or a phone stopped working", fr: "Trouver pourquoi une machine ou un téléphone ne marche plus" },
    { en: "Study how diseases spread and how to prevent them", fr: "Étudier comment les maladies se propagent et comment les prévenir" },
    { en: "Analyse numbers to find patterns in prices, sales or harvests", fr: "Analyser des chiffres pour repérer des tendances (prix, ventes, récoltes)" },
    { en: "Do experiments in a laboratory", fr: "Faire des expériences dans un laboratoire" },
    { en: "Learn how computers and software work", fr: "Comprendre comment fonctionnent les ordinateurs et les logiciels" },
    { en: "Read about science, nature or technology for fun", fr: "Lire sur la science, la nature ou la technologie par plaisir" },
  ],
  A: [
    { en: "Draw, paint, or design logos and posters", fr: "Dessiner, peindre ou créer des logos et des affiches" },
    { en: "Design clothes or style hair", fr: "Créer des vêtements ou coiffer" },
    { en: "Take photos or make videos", fr: "Prendre des photos ou réaliser des vidéos" },
    { en: "Write stories, songs or articles", fr: "Écrire des histoires, des chansons ou des articles" },
    { en: "Decorate a room, a shop or an event", fr: "Décorer une pièce, une boutique ou un événement" },
    { en: "Play music, dance or act", fr: "Jouer de la musique, danser ou faire du théâtre" },
  ],
  S: [
    { en: "Teach or explain something to younger people", fr: "Enseigner ou expliquer quelque chose à des plus jeunes" },
    { en: "Care for sick or elderly people", fr: "Prendre soin de personnes malades ou âgées" },
    { en: "Help people solve personal or family problems", fr: "Aider des personnes à résoudre des problèmes personnels ou familiaux" },
    { en: "Organise activities for your community or church", fr: "Organiser des activités pour votre communauté ou votre église" },
    { en: "Welcome and serve customers or visitors", fr: "Accueillir et servir des clients ou des visiteurs" },
    { en: "Train a group of people", fr: "Former un groupe de personnes" },
  ],
  E: [
    { en: "Start and run your own small business", fr: "Créer et gérer votre propre petite entreprise" },
    { en: "Sell products and convince people to buy", fr: "Vendre des produits et convaincre les gens d'acheter" },
    { en: "Lead a team and make the decisions", fr: "Diriger une équipe et prendre les décisions" },
    { en: "Negotiate prices with suppliers", fr: "Négocier les prix avec des fournisseurs" },
    { en: "Speak in front of a crowd or on the radio", fr: "Parler devant un public ou à la radio" },
    { en: "Spot a way to earn money and go after it", fr: "Repérer une façon de gagner de l'argent et la saisir" },
  ],
  C: [
    { en: "Keep accounts and track money coming in and going out", fr: "Tenir les comptes et suivre les entrées et sorties d'argent" },
    { en: "Organise files, stock or records so nothing gets lost", fr: "Ranger des dossiers, du stock ou des registres pour ne rien perdre" },
    { en: "Plan schedules and follow procedures carefully", fr: "Planifier des horaires et suivre des procédures avec soin" },
    { en: "Enter data into a computer accurately", fr: "Saisir des données sur ordinateur avec précision" },
    { en: "Check work for mistakes", fr: "Vérifier un travail pour y trouver les erreurs" },
    { en: "Manage deliveries and stock for a shop or a warehouse", fr: "Gérer les livraisons et le stock d'une boutique ou d'un entrepôt" },
  ],
};

/** Items interleaved by type (R, I, A, S, E, C, R, ...) so no page is about a single type. */
export const INTEREST_ITEMS: InterestItem[] = Array.from({ length: 6 }, (_, round) =>
  RIASEC_TYPES.map((type) => ({ id: `${type}${round + 1}`, type, text: ITEMS_BY_TYPE[type][round] }))
).flat();

export const INTEREST_SCALE: { value: number; label: Bilingual }[] = [
  { value: 0, label: { en: "Not for me", fr: "Pas pour moi" } },
  { value: 1, label: { en: "Maybe", fr: "Peut-être" } },
  { value: 2, label: { en: "I'd enjoy it", fr: "J'aimerais" } },
];
export const INTEREST_MAX = 2;

export type SkillKey =
  | "hands"
  | "numbers"
  | "digital"
  | "communication"
  | "creative"
  | "organising"
  | "people"
  | "selling";

export const SKILLS: { key: SkillKey; label: Bilingual; short: Bilingual }[] = [
  { key: "hands", label: { en: "Working with my hands and tools", fr: "Travailler de mes mains et avec des outils" }, short: { en: "hands-on work", fr: "le travail manuel" } },
  { key: "numbers", label: { en: "Numbers and calculations", fr: "Les chiffres et les calculs" }, short: { en: "numbers", fr: "les chiffres" } },
  { key: "digital", label: { en: "Computers and smartphones (beyond social media)", fr: "Ordinateurs et smartphones (au-delà des réseaux sociaux)" }, short: { en: "digital tools", fr: "les outils numériques" } },
  { key: "communication", label: { en: "Speaking and writing clearly", fr: "Parler et écrire clairement" }, short: { en: "communication", fr: "la communication" } },
  { key: "creative", label: { en: "Drawing, designing or creating", fr: "Dessiner, concevoir ou créer" }, short: { en: "creativity", fr: "la créativité" } },
  { key: "organising", label: { en: "Organising and planning", fr: "Organiser et planifier" }, short: { en: "organisation", fr: "l'organisation" } },
  { key: "people", label: { en: "Listening to and helping people", fr: "Écouter et aider les gens" }, short: { en: "helping people", fr: "l'aide aux autres" } },
  { key: "selling", label: { en: "Convincing and selling", fr: "Convaincre et vendre" }, short: { en: "selling", fr: "la vente" } },
];

export const SKILL_SCALE: { value: number; label: Bilingual }[] = [
  { value: 0, label: { en: "Not yet", fr: "Pas encore" } },
  { value: 1, label: { en: "A little", fr: "Un peu" } },
  { value: 2, label: { en: "Good", fr: "Bien" } },
  { value: 3, label: { en: "Very good", fr: "Très bien" } },
];
export const SKILL_MAX = 3;

/** 0 = none or primary, 1 = some secondary, 2 = secondary diploma, 3 = vocational certificate, 4 = university degree. */
export type EducationLevel = 0 | 1 | 2 | 3 | 4;
export type Situation = "student" | "looking" | "employed" | "self_employed";
export type Goal = "job" | "business" | "both";
export type WorkSetting = "field" | "workshop" | "office" | "people" | "remote";
export type FieldId =
  | "tech"
  | "energy"
  | "construction"
  | "mechanics"
  | "agriculture"
  | "health"
  | "education"
  | "business"
  | "creative"
  | "marketing"
  | "hospitality"
  | "environment";

export interface AssessmentContext {
  education: EducationLevel;
  situation: Situation;
  goal: Goal;
  /** Longest training the person can commit to, in months. */
  maxTrainingMonths: number;
  settings: WorkSetting[];
  fields: FieldId[];
}

export interface AssessmentAnswers {
  interests: Record<string, number>;
  skills: Partial<Record<SkillKey, number>>;
  context: AssessmentContext;
}

export const EDUCATION_OPTIONS: { value: EducationLevel; label: Bilingual }[] = [
  { value: 0, label: { en: "Primary school or none", fr: "École primaire ou aucune" } },
  { value: 1, label: { en: "Some secondary school", fr: "Une partie du secondaire" } },
  { value: 2, label: { en: "Secondary diploma (Diplôme d'État or equivalent)", fr: "Diplôme d'État ou équivalent" } },
  { value: 3, label: { en: "Vocational or technical certificate", fr: "Certificat professionnel ou technique" } },
  { value: 4, label: { en: "University degree", fr: "Diplôme universitaire" } },
];

export const SITUATION_OPTIONS: { value: Situation; label: Bilingual }[] = [
  { value: "student", label: { en: "I'm a student", fr: "Je suis étudiant(e)" } },
  { value: "looking", label: { en: "I'm looking for work", fr: "Je cherche du travail" } },
  { value: "employed", label: { en: "I have a job", fr: "J'ai un emploi" } },
  { value: "self_employed", label: { en: "I work for myself", fr: "Je travaille à mon compte" } },
];

export const GOAL_OPTIONS: { value: Goal; label: Bilingual }[] = [
  { value: "job", label: { en: "Get a job", fr: "Trouver un emploi" } },
  { value: "business", label: { en: "Start my own business", fr: "Lancer ma propre activité" } },
  { value: "both", label: { en: "Either, or both", fr: "L'un ou l'autre, ou les deux" } },
];

export const TRAINING_OPTIONS: { value: number; label: Bilingual }[] = [
  { value: 3, label: { en: "Up to 3 months", fr: "Jusqu'à 3 mois" } },
  { value: 12, label: { en: "Up to 1 year", fr: "Jusqu'à 1 an" } },
  { value: 36, label: { en: "Up to 3 years", fr: "Jusqu'à 3 ans" } },
  { value: 72, label: { en: "More than 3 years", fr: "Plus de 3 ans" } },
];

export const SETTING_OPTIONS: { value: WorkSetting; label: Bilingual }[] = [
  { value: "field", label: { en: "Outdoors or on site", fr: "Dehors ou sur le terrain" } },
  { value: "workshop", label: { en: "In a workshop", fr: "Dans un atelier" } },
  { value: "office", label: { en: "In an office", fr: "Dans un bureau" } },
  { value: "people", label: { en: "Face to face with people", fr: "En contact direct avec les gens" } },
  { value: "remote", label: { en: "Online, from anywhere", fr: "En ligne, depuis n'importe où" } },
];

export const FIELD_OPTIONS: { value: FieldId; label: Bilingual }[] = [
  { value: "tech", label: { en: "Technology and IT", fr: "Technologie et informatique" } },
  { value: "energy", label: { en: "Energy and electricity", fr: "Énergie et électricité" } },
  { value: "construction", label: { en: "Construction and woodwork", fr: "Construction et menuiserie" } },
  { value: "mechanics", label: { en: "Mechanics and repair", fr: "Mécanique et réparation" } },
  { value: "agriculture", label: { en: "Agriculture and food", fr: "Agriculture et alimentation" } },
  { value: "health", label: { en: "Health and care", fr: "Santé et soins" } },
  { value: "education", label: { en: "Education and social work", fr: "Éducation et action sociale" } },
  { value: "business", label: { en: "Business and finance", fr: "Commerce et finance" } },
  { value: "creative", label: { en: "Design, fashion and media", fr: "Design, mode et médias" } },
  { value: "marketing", label: { en: "Marketing and sales", fr: "Marketing et vente" } },
  { value: "hospitality", label: { en: "Hospitality and tourism", fr: "Hôtellerie et tourisme" } },
  { value: "environment", label: { en: "Environment and mining", fr: "Environnement et mines" } },
];
