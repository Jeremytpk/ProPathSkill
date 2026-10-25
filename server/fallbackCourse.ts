// Built-in course served when ProPath AI is unavailable.
export function getFallbackCourseContent(title: string, industry: string, isFrench: boolean) {
  return {
    title: title || (isFrench ? "Cours d'Éléments Clés ProPath" : "ProPath Core Elements Course"),
    description: isFrench 
      ? `Un cours interactif complet conçu pour maîtriser les bases de : ${title || industry}.`
      : `An intensive interactive course designed to master core concepts of: ${title || industry}.`,
    aiTutorPersona: isFrench 
      ? "Tuteur ProPath"
      : "ProPath Tutor",
    chapters: [
      {
        id: "chap_1",
        title: isFrench ? "Chapitre 1 : Les Fondements Fondamentaux & Cadres Stratégiques" : "Chapter 1: Foundational Core Principles & Strategic Frameworks",
        summary: isFrench 
          ? "Comprendre l'écosystème du domaine, les outils clés et l'analyse des besoins du marché." 
          : "Master domain architecture, critical toolkits, and high-intent market analysis.",
        sections: [
          {
            title: isFrench ? "1. Cartographie de l'Écosystème & Analyse de l'Intention" : "1. Ecosystem Architecture & Intent Analysis",
            content: isFrench
              ? `Le succès professionnel dans ${title || industry} exige une compréhension approfondie de l'écosystème global. Plutôt que de traiter les tâches de manière isolée, les spécialistes adoptent une approche systémique qui aligne chaque action avec l'intention réelle des utilisateurs et les objectifs stratégiques globaux.\n\nEn analysant les points d'accroche et les goulots d'étranglement, vous développez une vision globale permettant d'anticiper les risques opérationnels et de maximiser la valeur livrée.`
              : `Professional excellence in ${title || industry} demands an ecosystem-first mindset. Rather than executing isolated tasks, top industry experts design end-to-end architectures that align technical outputs with buyer intent and strategic ROI goals.\n\nBy auditing workflow friction points early, practitioners mitigate operational risk, improve team execution velocity, and deliver measurable bottom-line value.`,
            keyPoints: isFrench
              ? [
                  "Adopter une vision systémique basée sur l'intention utilisateur.",
                  "Identifier et corriger les goulots d'étranglement dès les premières étapes.",
                  "Mesurer le rendement (ROI) à chaque niveau d'exécution."
                ]
              : [
                  "Adopt a systems-first architecture aligned with customer intent.",
                  "Audit friction points early to prevent operational debt.",
                  "Measure return-on-investment across every project milestone."
                ],
            example: {
              scenario: isFrench 
                ? "Une entreprise cherchait à améliorer l'efficacité de sa stratégie sans augmenter son budget." 
                : "An enterprise needed to scale operational efficiency without inflating overhead costs.",
              execution: isFrench
                ? "Restructuration complète du pipeline en 3 étapes avec intégration d'outils d'automatisation et audits hebdomadaires."
                : "Implemented a 3-tier workflow restructuring, integrating automated quality audits and clear accountability protocols.",
              result: isFrench
                ? "+240% de productivité et réduction de 45% des erreurs en 60 jours."
                : "+240% team throughput and a 45% reduction in error rates within 60 days."
            },
            diagramType: "process_flow"
          }
        ],
        quiz: {
          question: isFrench 
            ? "Quel est l'objectif principal de la cartographie d'écosystème dans ce module ?" 
            : "What is the primary objective of ecosystem architecture mapping in this module?",
          options: isFrench
            ? [
                "Aligner la stratégie sur l'intention globale et réduire les frictions",
                "Mémoriser des formules complexes sans cas pratique",
                "Remplacer les équipes humaines par du hasard",
                "Ignorer les retours des utilisateurs"
              ]
            : [
                "Align strategy with user intent and audit operational friction points",
                "Memorize abstract terminology without practical execution",
                "Replace human oversight with unmonitored scripts",
                "Ignore qualitative user feedback loops"
              ],
          correctIndex: 0,
          explanation: isFrench
            ? "La cartographie systémique permet de lier la théorie à l'exécution réelle en éliminant les pertes d'efficacité."
            : "Ecosystem mapping directly connects high-level strategy to real-world operational execution."
        }
      },
      {
        id: "chap_2",
        title: isFrench ? "Chapitre 2 : Déploiement Pratique & Optimisation Opérationnelle" : "Chapter 2: Applied Field Execution & Optimization",
        summary: isFrench
          ? "Exécuter des protocoles de terrain, réaliser des tests comparatifs et optimiser les performances."
          : "Execute field protocols, run iterative A/B testing, and maximize performance metrics.",
        sections: [
          {
            title: isFrench ? "2. Protocoles d'Exécution & Tests Itératifs" : "2. Execution Protocols & Iterative A/B Testing",
            content: isFrench
              ? `La deuxième étape consiste à valider les hypothèses sur le terrain. L'exécution méthodique s'appuie sur des itérations rapides : au lieu de lancer des projets massifs sans retour, les professionnels déploient des pilotes ciblés et analysent la donnée en temps réel.\n\nCette rigueur analytique permet d'ajuster continuellement la trajectoire et d'obtenir un rendement supérieur.`
              : `The second phase bridges conceptual design with field execution. Methodical execution relies on rapid iterative loops: rather than launching unvalidated mass campaigns, practitioners deploy targeted pilots and measure live performance metrics.\n\nThis continuous feedback loop empowers teams to pivot swiftly and maximize output quality.`,
            keyPoints: isFrench
              ? [
                  "Déployer des projets pilotes pour valider rapidement les hypothèses.",
                  "Analyser les données en temps réel pour ajuster les opérations.",
                  "Systématiser les tests A/B pour chaque variante critique."
                ]
              : [
                  "Deploy targeted pilots to validate core assumptions rapidly.",
                  "Monitor real-time performance analytics to drive adjustments.",
                  "Systematize A/B testing across all high-impact variables."
                ],
            example: {
              scenario: isFrench 
                ? "Faible taux de conversion lors des campagnes initiales."
                : "Sub-optimal conversion rates during initial rollout.",
              execution: isFrench
                ? "Création de 5 déclinaisons de visuels et d'accroches avec tests A/B dynamiques sur 14 jours."
                : "Executed systematic A/B split testing across 5 messaging angles over a 14-day cycle.",
              result: isFrench
                ? "Triplement du taux de clic (CTR de 1,2% à 3,8%) et baisse de 35% du coût d'acquisition."
                : "Tripled Click-Through Rates (CTR 1.2% -> 3.8%) and lowered acquisition cost by 35%."
            },
            diagramType: "aida"
          }
        ],
        quiz: {
          question: isFrench
            ? "Pourquoi l'exécution itérative est-elle privilégiée par rapport aux déploiements monolithiques ?"
            : "Why are iterative execution loops preferred over monolithic deployments?",
          options: isFrench
            ? [
                "Elle permet d'ajuster rapidement la stratégie grâce aux données en temps réel",
                "Elle augmente indéfiniment les coûts de production",
                "Elle empêche de mesurer les résultats",
                "Elle supprime la nécessité de tester"
              ]
            : [
                "It enables rapid strategic adjustments based on live performance data",
                "It unnecessarily inflates capital expenditure",
                "It prevents real-time outcome tracking",
                "It eliminates the need for data analysis"
              ],
          correctIndex: 0,
          explanation: isFrench
            ? "Les itérations réduisent les risques financiers et garantissent une amélioration continue."
            : "Iterative testing minimizes financial risk while driving continuous performance gains."
        }
      },
      {
        id: "chap_3",
        title: isFrench ? "Chapitre 3 : Maîtrise Avancée, Économie Unitaire & Échelle" : "Chapter 3: Advanced Scale, Unit Economics & Mastery",
        summary: isFrench
          ? "Calculer la rentabilité financière, pérenniser la croissance et obtenir les certifications cibles."
          : "Master unit economics, scale operations sustainably, and secure elite industry credentials.",
        sections: [
          {
            title: isFrench ? "3. Économie Unitaire & Pérennité de la Croissance" : "3. Unit Economics & Scalable Mastery",
            content: isFrench
              ? `Pour atteindre le sommet de la maîtrise professionnelle dans ${title || industry}, la rentabilité unitaire et l'évolutivité sont incontournables. Vous devez mesurer précisément le ratio coût/bénéfice et automatiser les processus récurrents pour libérer de la bande passante stratégique.\n\nEn consolidant vos résultats et en préparant les certifications reconnues, vous vous positionnez comme un leader incontournable de l'industrie.`
              : `Reaching true mastery in ${title || industry} requires mastering unit economics and scalable governance. Professionals must rigorously calculate cost-to-value ratios and automate recurring workflows to free up high-level strategic bandwidth.\n\nBy codifying best practices and earning industry-accredited certifications, you establish long-term authority in your field.`,
            keyPoints: isFrench
              ? [
                  "Maintenir un ratio de rentabilité unitaire élevé (LTV:CAC >= 3:1).",
                  "Automatiser les workflows répétitifs pour libérer la vision stratégique.",
                  "Obtenir les certifications professionnelles clés pour valider l'expertise."
                ]
              : [
                  "Maintain strong unit economics benchmarks (LTV:CAC >= 3:1).",
                  "Automate repetitive workflows to scale operational bandwidth.",
                  "Secure target industry credentials to validate professional authority."
                ],
            example: {
              scenario: isFrench 
                ? "Coûts de gestion trop élevés lors de l'augmentation du volume."
                : "Scaling bottlenecks leading to margin compression.",
              execution: isFrench
                ? "Mise en place d'un tableau de bord financier en temps réel et automatisation du contrôle qualité."
                : "Deployed real-time financial telemetry dashboards and automated quality assurance standards.",
              result: isFrench
                ? "Progression de la marge nette de +28% et passage à l'échelle nationale réussi."
                : "+28% net margin expansion and successful nation-wide scaling."
            },
            diagramType: "roas"
          }
        ],
        quiz: {
          question: isFrench
            ? "Quel ratio financier indique une croissance saine et scalable ?"
            : "Which benchmark ratio signifies sustainable, scalable growth?",
          options: [
            "LTV : CAC ≥ 3 : 1",
            "LTV : CAC = 1 : 1",
            "LTV : CAC = 0.5 : 1",
            "LTV : CAC = 1 : 10"
          ],
          correctIndex: 0,
          explanation: isFrench
            ? "Un ratio LTV/CAC supérieur ou égal à 3:1 garantit une rentabilité solide tout en finançant la croissance."
            : "An LTV:CAC ratio of 3:1 or higher ensures robust profitability while funding expansion."
        }
      }
    ]
  };
}
