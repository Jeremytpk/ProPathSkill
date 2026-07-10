import { Sector, ScenarioQuestion } from "./types";

export const SECTORS_FR: Sector[] = [
  {
    id: "ai",
    name: "Intelligence Artificielle",
    description: "Apprentissage automatique, réseaux de neurones, grands modèles de langage et automatisation par agents IA.",
    category: "Technologie",
    icon: "Brain"
  },
  {
    id: "fintech",
    name: "Technologie Financière (FinTech)",
    description: "Finance décentralisée, trading quantitatif automatisé, plateformes bancaires de nouvelle génération et actifs blockchain.",
    category: "Finance",
    icon: "Coins"
  },
  {
    id: "energy",
    name: "Énergie Durable",
    description: "Intégration au réseau, systèmes solaires et éoliens, stockage par batterie et infrastructures énergétiques intelligentes.",
    category: "Infrastructure",
    icon: "Leaf"
  },
  {
    id: "biotech",
    name: "Biotechnologie & Génomique",
    description: "Bioinformatique, édition génétique CRISPR, thérapies personnalisées et sciences de la longévité.",
    category: "Sciences de la Santé",
    icon: "Dna"
  },
  {
    id: "spacetech",
    name: "Aérospatiale & Technologie Spatiale",
    description: "Constellations de satellites, drones autonomes, mécanique orbitale et logistique spatiale.",
    category: "Aérospatiale",
    icon: "Rocket"
  },
  {
    id: "smartcities",
    name: "Villes Intelligentes & IoT",
    description: "Réseaux de transport autonomes, capteurs connectés, ingénierie architecturale intelligente et boucles de ressources urbaines.",
    category: "Développement Urbain",
    icon: "Cpu"
  },
  {
    id: "creativedesign",
    name: "Design Numérique Créatif",
    description: "Informatique spatiale immersive (AR/VR), pipelines de design d'interfaces génératifs (UI/UX) et systèmes narratifs virtuels.",
    category: "Arts Créatifs",
    icon: "Palette"
  },
  {
    id: "art",
    name: "Beaux-Arts & Médias Créatifs",
    description: "Peinture traditionnelle, sculpture, galeries physiques, illustration créative et artisanat d'art tactile.",
    category: "Arts Créatifs",
    icon: "Paintbrush"
  },
  {
    id: "electrical",
    name: "Électricité & Réseaux Intelligents",
    description: "Câblage intelligent, machines industrielles automatisées, électricité du bâtiment intelligente et installations solaires/éoliennes.",
    category: "Métiers Techniques",
    icon: "Zap"
  },
  {
    id: "carpentry",
    name: "Charpenterie & Menuiserie Artisanale",
    description: "Travail du bois de précision, charpente résidentielle sur mesure, architecture de restauration et fabrication de matériaux techniques.",
    category: "Métiers Techniques",
    icon: "Hammer"
  },
  {
    id: "automotive",
    name: "Technologie & Mécanique Automobile",
    description: "Configuration de transmissions électriques, diagnostic mécanique de véhicules intelligents et ingénierie de moteurs personnalisés.",
    category: "Métiers Techniques",
    icon: "Wrench"
  }
];

export const QUESTIONS_FR: ScenarioQuestion[] = [
  {
    id: "q1",
    text: "Comment réagissez-vous face à un obstacle inattendu dans votre flux de travail ?",
    scenario: "Votre équipe est à 48 heures d'une mise en production majeure lorsqu'une API centrale change soudainement, cassant plusieurs composants vitaux de votre déploiement.",
    options: [
      {
        id: "q1_opt1",
        text: "Analyser immédiatement la situation, consulter les logs pour identifier la rupture exacte et écrire un adaptateur sur mesure pour corriger la compatibilité.",
        dimension: "Technical Analytics"
      },
      {
        id: "q1_opt2",
        text: "Réunir l'équipe pour une synchronisation rapide, déléguer la résolution des modules et tenir les parties prenantes informées des délais.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q1_opt3",
        text: "Repenser le parcours utilisateur pour contourner complètement l'API défaillante, en utilisant d'autres états visuels pour préserver l'expérience.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q1_opt4",
        text: "Passer en revue les protocoles de restauration opérationnelle, effectuer un retour arrière (rollback) sécurisé et activer le plan de secours standard.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q2",
    text: "Quel indicateur de performance privilégiez-vous naturellement ?",
    scenario: "Vous devez évaluer la performance d'un nouveau service. On vous présente un tableau de bord unifié couvrant plusieurs dimensions du projet.",
    options: [
      {
        id: "q2_opt1",
        text: "L'efficacité algorithmique, la vitesse d'exécution et le nombre de requêtes de base de données par seconde.",
        dimension: "Technical Analytics"
      },
      {
        id: "q2_opt2",
        text: "L'adoption globale du marché, le taux de rétention des utilisateurs et la trajectoire de la valeur client à long terme.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q2_opt3",
        text: "L'attrait esthétique, la clarté des retours visuels et le plaisir procuré par les micro-interactions.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q2_opt4",
        text: "Le taux de respect des accords de niveau de service (SLA), la redondance et la disponibilité globale de la plateforme.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q3",
    text: "Quel style d'interaction d'équipe stimule le plus vos performances ?",
    scenario: "Une nouvelle initiative de recherche est lancée et vous choisissez votre mode de fonctionnement au sein du groupe.",
    options: [
      {
        id: "q3_opt1",
        text: "Des sessions de développement intenses (sprints) avec relecture de code par les pairs, ateliers de conception et débats techniques rigoureux.",
        dimension: "Technical Analytics"
      },
      {
        id: "q3_opt2",
        text: "Une coordination transversale, l'alignement des feuilles de route produit et le mentorat des profils juniors pour atteindre les objectifs.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q3_opt3",
        text: "Des remue-méninges (brainstormings) visuels rapides, la création de scénarimages (storyboards) et la co-conception avec les responsables artistiques.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q3_opt4",
        text: "L'établissement de procédures opérationnelles standards, de cadres de documentation et de pipelines d'automatisation robustes.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q4",
    text: "Comment évaluez-vous le risque lors de décisions critiques ?",
    scenario: "L'opportunité se présente d'intégrer une technologie de pointe expérimentale qui n'a pas encore été largement adoptée dans l'industrie.",
    options: [
      {
        id: "q4_opt1",
        text: "L'analyse des indices de référence (benchmarks) locaux, l'évaluation des audits techniques approfondis et des tests de charge (stress tests).",
        dimension: "Technical Analytics"
      },
      {
        id: "q4_opt2",
        text: "L'évaluation de l'avantage concurrentiel, le calcul des gains potentiels de part de marché et la rédaction d'un plan de réduction des risques.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q4_opt3",
        text: "La construction d'un prototype hautement visuel et interactif pour tester l'enthousiasme émotionnel de l'utilisateur final.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q4_opt4",
        text: "La conception de mécanismes de repli (fallbacks), la vérification de conformité de sécurité et la mise en place d'un déploiement progressif.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q5",
    text: "Quelle activité représente votre dimanche après-midi idéal ?",
    scenario: "Vous n'avez aucune obligation professionnelle et disposez de cinq heures consécutives de temps libre.",
    options: [
      {
        id: "q5_opt1",
        text: "La lecture d'articles scientifiques, l'écriture de scripts d'automatisation personnelle ou la résolution de défis algorithmiques.",
        dimension: "Technical Analytics"
      },
      {
        id: "q5_opt2",
        text: "L'analyse des tendances de marché, la planification d'un projet de startup ou l'organisation de rencontres communautaires.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q5_opt3",
        text: "Le dessin d'interfaces utilisateur, la composition de musique numérique ou l'écriture du scénario d'un jeu personnel.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q5_opt4",
        text: "La configuration d'un serveur d'expérimentation (home-lab), la création de scénarios domotiques ou la réévaluation de budgets.",
        dimension: "Operations & Reliability"
      }
    ]
  }
];

const DEEP_DIVE_TEMPLATES_FR: Record<string, { text: string; scenario: string; options: { text: string; dimension: string }[] }[]> = {
  ai: [
    {
      text: "Comment réagissez-vous lorsqu'un système d'agent IA récursif se bloque dans une boucle ?",
      scenario: "Un workflow d'assistance client autonome tombe en panne suite à un appel d'outil en boucle infinie qui consomme rapidement vos crédits API.",
      options: [
        { text: "Analyser le journal d'état, identifier le déclencheur de récurrence sémantique et programmer un filtre de contrôle en Python.", dimension: "Technical Analytics" },
        { text: "Organiser un retour d'expérience pour fixer des limites de débit et des seuils de crédit sur tous les serveurs.", dimension: "Leadership & Strategy" },
        { text: "Restructurer la hiérarchie des invites (prompts) pour utiliser un routage multi-agents plutôt qu'une chaîne de décision rigide.", dimension: "Creative Problem Solving" },
        { text: "Mettre en place des alertes de santé du système en temps réel et activer le script de retour arrière automatisé.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "Comment gérez-vous la dérive de performance (drift) d'un modèle de production ?",
      scenario: "Le système de classification automatique d'un client commence à perdre en précision après une mise à jour majeure de la plateforme.",
      options: [
        { text: "Extraire un échantillon de données récent, exécuter une analyse de corrélation et recalculer les poids de l'architecture.", dimension: "Technical Analytics" },
        { text: "Négocier de nouveaux critères de qualité de service (SLA) avec les parties prenantes et replanifier la feuille de route.", dimension: "Leadership & Strategy" },
        { text: "Injecter des couches de feedback utilisateur en direct avec des visualisations interactives pour ajuster le modèle.", dimension: "Creative Problem Solving" },
        { text: "Déployer un pipeline automatisé de ré-entraînement régulier et surveiller la cohérence des bases de données.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  fintech: [
    {
      text: "Comment gérez-vous les anomalies de trading à haute fréquence ?",
      scenario: "Un algorithme de trading automatisé commence à exécuter des ordres aberrants à cause d'un décalage de flux de données réseau.",
      options: [
        { text: "Isoler le bloc de code fautif, mesurer la latence des paquets réseau et réécrire le gestionnaire de socket.", dimension: "Technical Analytics" },
        { text: "Interrompre immédiatement le flux de trading et en informer l'autorité de régulation pour maintenir la conformité.", dimension: "Leadership & Strategy" },
        { text: "Créer un panneau de contrôle d'urgence dynamique affichant les flux pour permettre un ajustement sémantique instantané.", dimension: "Creative Problem Solving" },
        { text: "Déclencher l'interrupteur d'urgence du système (kill-switch), purger le cache et restaurer la configuration de secours stable.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  energy: [
    {
      text: "Comment équilibrez-vous une baisse soudaine de tension sur un réseau intelligent ?",
      scenario: "Une couverture nuageuse inattendue réduit drastiquement la production solaire régionale au moment de la demande de pointe en soirée.",
      options: [
        { text: "Exécuter des modèles prédictifs de charge et réaffecter dynamiquement les ressources de stockage de secours.", dimension: "Technical Analytics" },
        { text: "Négocier des contrats d'effacement de consommation à la demande avec les principaux utilisateurs industriels.", dimension: "Leadership & Strategy" },
        { text: "Concevoir une campagne de sensibilisation interactive avec des incitations d'application pour encourager la réduction volontaire.", dimension: "Creative Problem Solving" },
        { text: "Démarrer immédiatement les génératrices thermiques de réserve et basculer sur les commutateurs réseau d'urgence.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  biotech: [
    {
      text: "Comment résolvez-vous des incohérences de séquençage d'ADN ?",
      scenario: "Un pipeline d'analyse génomique produit des scores d'alignement de gènes divergents d'un lot d'échantillons à un autre.",
      options: [
        { text: "Auditer les algorithmes d'alignement, comparer les variantes de bases de données et corriger les biais de calcul.", dimension: "Technical Analytics" },
        { text: "Valider les étapes de traitement avec les responsables de laboratoire pour garantir la conformité scientifique.", dimension: "Leadership & Strategy" },
        { text: "Imaginer un nouveau modèle de rendu 3D pour repérer visuellement les repliements de protéines anormaux.", dimension: "Creative Problem Solving" },
        { text: "Étalonner à nouveau les séquenceurs physiques, remplacer les réactifs et documenter les protocoles de nettoyage.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  spacetech: [
    {
      text: "Comment corrigez-vous une dérive orbitale de constellation de satellites ?",
      scenario: "Une tempête géomagnétique augmente la traînée atmosphérique et altère l'altitude nominale de plusieurs micro-satellites.",
      options: [
        { text: "Recalculer les vecteurs d'attitude à partir des capteurs d'étoiles et programmer des séquences d'allumage moteur précises.", dimension: "Technical Analytics" },
        { text: "Coordonner l'attribution de fréquences d'urgence avec les régulateurs de télécommunication internationaux.", dimension: "Leadership & Strategy" },
        { text: "Développer une chorégraphie d'évitement de débris collective en utilisant des algorithmes d'essaim décentralisés.", dimension: "Creative Problem Solving" },
        { text: "Activer les propulseurs à gaz froid de sécurité pour remonter l'orbite de garde et lancer les routines d'autodiagnostic.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  smartcities: [
    {
      text: "Comment résolvez-vous une congestion de transport autonome ?",
      scenario: "Des navettes sans chauffeur s'accumulent à un carrefour clé suite à un conflit de priorité de capteurs IoT routiers.",
      options: [
        { text: "Analyser le flux de données des capteurs de voirie pour identifier et corriger le goulot d'étranglement réseau.", dimension: "Technical Analytics" },
        { text: "Présenter un plan d'aménagement urbain pour ajuster les corridors de transit prioritaires au conseil municipal.", dimension: "Leadership & Strategy" },
        { text: "Créer un signal lumineux dynamique au sol pour guider harmonieusement piétons et navettes autonomes.", dimension: "Creative Problem Solving" },
        { text: "Déployer un patch de mise à jour des règles de priorité des navettes et envoyer une équipe d'inspection.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  creativedesign: [
    {
      text: "Comment ajustez-vous une fatigue visuelle dans un environnement VR ?",
      scenario: "Les testeurs d'une application d'apprentissage spatial signalent des maux de tête après 15 minutes d'immersion interactive.",
      options: [
        { text: "Mesurer la latence d'affichage des trames et optimiser le rendu du moteur de rastérisation.", dimension: "Technical Analytics" },
        { text: "Organiser des ateliers de conception pour établir de nouvelles directives de sécurité et de confort visuel.", dimension: "Leadership & Strategy" },
        { text: "Modifier la palette de couleurs, atténuer les contrastes brusques et fluidifier les transitions spatiales.", dimension: "Creative Problem Solving" },
        { text: "Restreindre le taux de rafraîchissement à une fréquence de sécurité fixe et vérifier les alignements d'optique.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  art: [
    {
      text: "Comment protégez-vous des œuvres d'art fragiles contre les dégradations thermiques ?",
      scenario: "Une galerie d'art historique subit des fluctuations d'humidité menaçant la conservation de peintures anciennes.",
      options: [
        { text: "Analyser les relevés de capteurs climatiques pour modéliser les micro-courants d'air dans les salles.", dimension: "Technical Analytics" },
        { text: "Collaborer avec les conservateurs de musée pour planifier un budget de rénovation des verrières et isolations.", dimension: "Leadership & Strategy" },
        { text: "Concevoir des vitrines d'exposition hermétiques sur mesure avec des éclairages LED d'ambiance protecteurs.", dimension: "Creative Problem Solving" },
        { text: "Remplacer les filtres de climatisation, calfeutrer les accès et lancer des rondes de contrôle systématiques.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  electrical: [
    {
      text: "Comment réagissez-vous face à une surcharge de disjoncteur industriel ?",
      scenario: "Un équipement de soudage robotisé déclenche de manière répétée le disjoncteur principal d'un atelier de production.",
      options: [
        { text: "Mesurer les appels de courant avec un ampèremètre et analyser les harmoniques de tension sur le circuit.", dimension: "Technical Analytics" },
        { text: "Planifier l'échelonnement des horaires d'utilisation des machines avec les chefs d'atelier pour lisser la charge.", dimension: "Leadership & Strategy" },
        { text: "Repenser le schéma d'équilibrage des phases de l'armoire de distribution électrique pour mieux répartir la puissance.", dimension: "Creative Problem Solving" },
        { text: "Remplacer le disjoncteur défectueux, vérifier le serrage des connexions et réaliser des tests d'isolement de terre.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  carpentry: [
    {
      text: "Comment gérez-vous une déformation hygrométrique de bois précieux ?",
      scenario: "Un lot de chêne de haute qualité destiné à un mobilier d'art commence à se déformer suite à un stockage inadéquat.",
      options: [
        { text: "Mesurer le taux d'humidité à cœur du bois avec un humidimètre et calculer l'indice de retrait volumique.", dimension: "Technical Analytics" },
        { text: "Renégocier les délais de livraison avec le client et réorganiser le calendrier de fabrication.", dimension: "Leadership & Strategy" },
        { text: "Adapter la conception du meuble pour intégrer des assemblages flottants permettant les variations dimensionnelles naturelles.", dimension: "Creative Problem Solving" },
        { text: "Transférer le bois dans un séchoir contrôlé, empiler le lot sous presse et surveiller quotidiennement la stabilisation.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  automotive: [
    {
      text: "Comment résolvez-vous une surchauffe de batterie de véhicule électrique ?",
      scenario: "Un prototype de voiture électrique affiche des températures de cellules élevées lors des phases d'accélération intense.",
      options: [
        { text: "Analyser les données de diagnostic du bus CAN et mesurer la chute de tension pour localiser les connexions résistives.", dimension: "Technical Analytics" },
        { text: "Réunir les équipes de développement de la chimie des cellules pour réévaluer et abaisser les limites d'intensité.", dimension: "Leadership & Strategy" },
        { text: "Optimiser le circuit de fluide de refroidissement en créant un répartiteur sur mesure dirigé vers les zones chaudes.", dimension: "Creative Problem Solving" },
        { text: "Mettre à jour le micrologiciel de sécurité du BMS, calibrer les sondes thermiques et lancer un cycle de test standard.", dimension: "Operations & Reliability" }
      ]
    }
  ]
};

export function getQuestionsForSectorFR(sectorId: string): ScenarioQuestion[] {
  const templates = DEEP_DIVE_TEMPLATES_FR[sectorId] || DEEP_DIVE_TEMPLATES_FR["ai"];
  
  return templates.map((tmpl, idx) => ({
    id: `q_deep_${sectorId}_${idx}`,
    sectorId: sectorId,
    text: tmpl.text,
    scenario: tmpl.scenario,
    options: tmpl.options.map((opt, oIdx) => ({
      id: `q_deep_${sectorId}_${idx}_opt_${oIdx}`,
      text: opt.text,
      dimension: opt.dimension
    }))
  }));
}
