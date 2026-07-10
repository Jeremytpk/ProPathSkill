import { ScenarioQuestion, Sector } from "./types";

export const SECTORS: Sector[] = [
  {
    id: "ai",
    name: "Artificial Intelligence",
    description: "Machine learning, neural networks, large language models, and agentic AI automation systems.",
    category: "Technology",
    icon: "Brain"
  },
  {
    id: "fintech",
    name: "Financial Technology",
    description: "Decentralized finance, automated quantitative trading, digital banking platforms, and blockchain assets.",
    category: "Finance",
    icon: "Coins"
  },
  {
    id: "energy",
    name: "Sustainable Energy",
    description: "Grid integration, solar/wind performance systems, battery storage, and smart power infrastructure.",
    category: "Infrastructure",
    icon: "Leaf"
  },
  {
    id: "biotech",
    name: "Biotechnology & Genomics",
    description: "Bioinformatics, CRISPR gene editing, personalized therapeutics, and longevity science.",
    category: "HealthScience",
    icon: "Dna"
  },
  {
    id: "spacetech",
    name: "Aerospace & SpaceTech",
    description: "Satellite constellations, autonomous drones, orbital mechanics, and space logistics.",
    category: "Aerospace",
    icon: "Rocket"
  },
  {
    id: "smartcities",
    name: "Smart Cities & IoT",
    description: "Autonomous transit networks, IoT sensor grids, smart architectural engineering, and urban resource loops.",
    category: "UrbanDev",
    icon: "Cpu"
  },
  {
    id: "creativedesign",
    name: "Creative Digital Design",
    description: "Immersive spatial computing (AR/VR), generative UI/UX pipelines, and virtual narrative systems.",
    category: "Creative Arts",
    icon: "Palette"
  },
  {
    id: "art",
    name: "Fine Arts & Creative Media",
    description: "Traditional painting, sculpting, physical art galleries, creative illustration, and tactile crafts.",
    category: "Creative Arts",
    icon: "Paintbrush"
  },
  {
    id: "electrical",
    name: "Electrical & Smart Grid Systems",
    description: "Intelligent wiring systems, automated industrial machinery, smart building power, and solar/wind installations.",
    category: "Trades",
    icon: "Zap"
  },
  {
    id: "carpentry",
    name: "Artisanal Carpentry & Construction",
    description: "Precision woodworking, custom residential framing, restoration architecture, and technical material fabrication.",
    category: "Trades",
    icon: "Hammer"
  },
  {
    id: "automotive",
    name: "Automotive Technology & Mechanics",
    description: "Electric drivetrain configuration, smart vehicle mechanical diagnostics, and custom engine engineering.",
    category: "Trades",
    icon: "Wrench"
  }
];

export const QUESTIONS: ScenarioQuestion[] = [
  {
    id: "q1",
    text: "How do you approach an unexpected roadblock in your workflow?",
    scenario: "Your team is 48 hours away from a major release when a core API dependency suddenly changes, breaking several vital components of your deployment.",
    options: [
      {
        id: "q1_opt1",
        text: "Triage immediately, analyze logs to identify the exact breakage, and write a custom wrapper to patch the compatibility issue.",
        dimension: "Technical Analytics"
      },
      {
        id: "q1_opt2",
        text: "Gather the core team for a rapid synchronization, delegate patch modules, and keep senior stakeholders updated on timelines.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q1_opt3",
        text: "Re-envision the feature flow to bypass the broken API entirely, using alternative visual states to preserve user experience.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q1_opt4",
        text: "Review the system's operational rollback protocols, revert safely to the previous stable release, and trigger the standard backup plan.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q2",
    text: "Which project metric do you naturally prioritize above others?",
    scenario: "You are tasked with evaluating the performance of a new service. You are presented with a unified dashboard covering multiple project dimensions.",
    options: [
      {
        id: "q2_opt1",
        text: "Algorithmic efficiency, execution speed, and database queries per second.",
        dimension: "Technical Analytics"
      },
      {
        id: "q2_opt2",
        text: "Overall market adoption, user retention rate, and lifetime value trajectory.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q2_opt3",
        text: "Aesthetic appeal, visual feedback clarity, and micro-interaction joy.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q2_opt4",
        text: "SLA compliance rate, redundancy resilience, and platform uptime metrics.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q3",
    text: "What style of team interaction brings out your absolute best performance?",
    scenario: "A new research initiative is being launched, and you are selecting your operational framework within the group.",
    options: [
      {
        id: "q3_opt1",
        text: "Deep-focus sprints with peer code reviews, whiteboard sessions, and rigorous technical debates.",
        dimension: "Technical Analytics"
      },
      {
        id: "q3_opt2",
        text: "Cross-functional coordination, aligning product roadmaps, and mentoring junior engineers to reach milestones.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q3_opt3",
        text: "Rapid visual brainstorming, storyboarding, and co-creating experiential concepts with design leads.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q3_opt4",
        text: "Establishing standard operating procedures, documentation frameworks, and robust automation pipelines.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q4",
    text: "How do you evaluate risk when making critical decisions?",
    scenario: "An opportunity arises to integrate a cutting-edge, experimental technology that has not yet been widely adopted in the industry.",
    options: [
      {
        id: "q4_opt1",
        text: "Run isolated local benchmarks, review deep technical audits, and analyze stress-test profiles.",
        dimension: "Technical Analytics"
      },
      {
        id: "q4_opt2",
        text: "Assess the competitive advantage, calculate potential market share gains, and draft a risk-mitigation plan.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q4_opt3",
        text: "Build a highly sensory, interactive mockup to test user delight and emotional response to the new tech.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q4_opt4",
        text: "Draft fallback mechanisms, verify safety compliance protocols, and create a multi-phase roll-out pipeline.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q5",
    text: "Which activity represents your ideal Sunday afternoon?",
    scenario: "You have zero professional obligations and five hours of completely open, uninterrupted time.",
    options: [
      {
        id: "q5_opt1",
        text: "Reading scientific research papers, writing complex scripts to automate personal tasks, or solving algorithmic challenges.",
        dimension: "Technical Analytics"
      },
      {
        id: "q5_opt2",
        text: "Analyzing market trends, planning a startup idea, or organizing a community meet-up with friends and colleagues.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q5_opt3",
        text: "Sketching interface designs, composing digital music, or writing a narrative story for a personal game.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q5_opt4",
        text: "Setting up a home-lab server, arranging smart home automation triggers, or optimizing personal budgets and schedules.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_ai",
    sectorId: "ai",
    text: "How do you respond when an LLM agentic system gets stuck in a recursive loop?",
    scenario: "An autonomous customer service workflow goes offline because your generative AI model entered an infinite tool-calling loop, consuming thousands of API credits in minutes.",
    options: [
      {
        id: "q_ai_opt1",
        text: "Analyze the state log trace, identify the semantic recursion trigger, and write a deterministic control gate in Python.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_ai_opt2",
        text: "Lead a retrospective to establish rate-limiting governance policies and credit thresholds for all deployment slots.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_ai_opt3",
        text: "Re-engineer the prompt hierarchy to use custom multi-agent routing instead of a monolithic decision chain.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_ai_opt4",
        text: "Establish real-time health-check alarms and activate the automated system rollback script.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_fintech",
    sectorId: "fintech",
    text: "How do you handle high-frequency trading anomalies?",
    scenario: "Your decentralized algorithmic trading pool suddenly starts executing arbitrage trades with high variance during an unexpected flash loan attack.",
    options: [
      {
        id: "q_fintech_opt1",
        text: "Perform a deep-dive bytecode audit of the smart contract transactions to isolate the exact slippage exploit.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_fintech_opt2",
        text: "Synchronize with liquidity providers, freeze critical vaults immediately, and issue an incident communication roadmap.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_fintech_opt3",
        text: "Redesign the algorithmic pool's safety pricing formula to integrate dynamic multi-oracle geometric averages.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_fintech_opt4",
        text: "Trigger the automated circuit breaker to pause trades and safely roll back state pools to pre-incident blocks.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_energy",
    sectorId: "energy",
    text: "How do you approach critical grid load variations?",
    scenario: "A severe localized storm has caused an abrupt drop in wind generation, threatening to overload battery storage grids during peak evening demand.",
    options: [
      {
        id: "q_energy_opt1",
        text: "Use real-time network simulators to recalculate power flow differentials and optimize line resistance.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_energy_opt2",
        text: "Establish an emergency response task force to coordinate with regional utility providers and balance state grids.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_energy_opt3",
        text: "Design a dynamic demand-response program offering instant credit incentives to consumers who throttle smart devices.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_energy_opt4",
        text: "Enforce automated load-shedding sequences on non-critical industrial circuits to safeguard physical batteries.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_biotech",
    sectorId: "biotech",
    text: "How do you address genetic sequencing discrepancies?",
    scenario: "A CRISPR gene-editing sequencing run flags an unexpected off-target mutation rate across a high-value sample cohort.",
    options: [
      {
        id: "q_biotech_opt1",
        text: "Trace sequencing alignment records across secondary reference genomes to detect the chemical baseline mutation cause.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_biotech_opt2",
        text: "Present the findings to the scientific board to secure additional funding and revise lab safety standards.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_biotech_opt3",
        text: "Synthesize alternative guide RNA structural sequences to bypass the problematic off-target locus completely.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_biotech_opt4",
        text: "Enforce strict batch validation protocols, quarantine the mutation sample vials, and verify sterile environmental logs.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_spacetech",
    sectorId: "spacetech",
    text: "How do you manage a satellite telemetry drift?",
    scenario: "A low-Earth orbit constellation satellite reports an anomalous 1.5-degree physical attitude drift after crossing a high-density solar radiation band.",
    options: [
      {
        id: "q_spacetech_opt1",
        text: "Parse physical gyroscopic and star-tracker telemetry raw logs to model the rotational vector deviation.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_spacetech_opt2",
        text: "Communicate with the mission control board, reallocate ground transmitter bandwidth, and delegate thruster commands.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_spacetech_opt3",
        text: "Utilize magnetic torquers in a novel geomagnetic alignment sequence to recover the target attitude without fuel consumption.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_spacetech_opt4",
        text: "Trigger the fail-safe recovery mode, deploy backup solar panels, and lock the system into safe-Sun pointing mode.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_smartcities",
    sectorId: "smartcities",
    text: "How do you resolve central transit communication dropouts?",
    scenario: "A primary wireless node drops offline, causing 45 autonomous city transit shuttles to halt and trigger emergency hazard states.",
    options: [
      {
        id: "q_smartcities_opt1",
        text: "Analyze regional signal interference metrics and optimize localized mesh frequency allocations.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_smartcities_opt2",
        text: "Coordinate with city transport officials and dispatch physical support teams to key traffic intersections.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_smartcities_opt3",
        text: "Leverage ad-hoc vehicle-to-vehicle (V2V) proximity mesh links so shuttles can safely navigate around the dead zone.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_smartcities_opt4",
        text: "Activate the backup low-bandwidth cellular radio link and safely return all shuttles to the nearest depot.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_creativedesign",
    sectorId: "creativedesign",
    text: "How do you address mixed-reality rendering misalignment?",
    scenario: "Your team's custom AR exhibition app experiences heavy graphic stuttering and spatial occlusion glitches on newer glasses.",
    options: [
      {
        id: "q_creativedesign_opt1",
        text: "Profile GPU draw calls, optimize shader mesh geometry, and benchmark dynamic memory leaks.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_creativedesign_opt2",
        text: "Conduct quick user-experience feedback sessions to prioritize the most essential visual layers for release.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_creativedesign_opt3",
        text: "Simplify the layout style using highly stylized minimal wireframes that render perfectly even under low frame rates.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_creativedesign_opt4",
        text: "Set up a rigorous automated performance budget checklist across all target headsets before main build triggers.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_art",
    sectorId: "art",
    text: "How do you handle a physical-digital exhibition space misalignment?",
    scenario: "You are setting up a large-scale multimedia art gallery, and the real-time projection mapping drifts from the physical canvas edges.",
    options: [
      {
        id: "q_art_opt1",
        text: "Use computer-vision calibration cameras to mathematically calculate pixel coordinate offsets on the 3D projection map.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_art_opt2",
        text: "Organize the gallery's technical crew, host a quick review meeting, and assign precise calibration duties.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_art_opt3",
        text: "Embrace the spatial distortion by altering the narrative abstract artwork to morph dynamically around the offset.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_art_opt4",
        text: "Perform a complete mechanical reset of projector rigs, reload stable configuration presets, and lock physical coordinates.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_electrical",
    sectorId: "electrical",
    text: "How do you respond to industrial power balancing faults?",
    scenario: "An automated assembly line experiences frequent breaker trips due to high power surges from new smart motors.",
    options: [
      {
        id: "q_electrical_opt1",
        text: "Measure localized circuit impedance, analyze current harmonic waves, and install custom capacitor filters.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_electrical_opt2",
        text: "Collaborate with factory heads to schedule machine runs sequentially, avoiding overlapping peak startup loads.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_electrical_opt3",
        text: "Repurpose old energy-storage batteries to act as high-speed buffers that absorb voltage spikes on startup.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_electrical_opt4",
        text: "Install heavy-duty surge protection arrays, verify physical grounding rods, and document standard panel loads.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_carpentry",
    sectorId: "carpentry",
    text: "How do you handle wood material moisture deviations?",
    scenario: "You are crafting load-bearing structural beams, but the latest lumber batch has a moisture level exceeding safety standards.",
    options: [
      {
        id: "q_carpentry_opt1",
        text: "Utilize digital pinless moisture meters to map internal density variables and mathematically predict drying rates.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_carpentry_opt2",
        text: "Negotiate terms with the supplier for replacement materials while keeping project coordinators updated on timelines.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_carpentry_opt3",
        text: "Adapt the design to construct decorative, non-bearing elements using this lumber, while sourcing dry wood for beams.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_carpentry_opt4",
        text: "Quarantine the high-moisture lumber, place them in temperature-controlled kilns, and document standard drying logs.",
        dimension: "Operations & Reliability"
      }
    ]
  },
  {
    id: "q_automotive",
    sectorId: "automotive",
    text: "How do you address electric vehicle battery thermal issues?",
    scenario: "A high-performance electric vehicle prototype shows elevated battery cell temperatures during extreme acceleration tests.",
    options: [
      {
        id: "q_automotive_opt1",
        text: "Analyze CAN-bus logs, measure voltage drop across cells, and pinpoint high-resistance electrical connections.",
        dimension: "Technical Analytics"
      },
      {
        id: "q_automotive_opt2",
        text: "Lead a safety review session with the mechanical engineering and battery chemistry teams to revise testing limits.",
        dimension: "Leadership & Strategy"
      },
      {
        id: "q_automotive_opt3",
        text: "Optimize the cooling fluid flow path using a custom manifold that redirects coolant to high-stress cell zones.",
        dimension: "Creative Problem Solving"
      },
      {
        id: "q_automotive_opt4",
        text: "Calibrate thermal cutoff limit sensors, update the battery management safe-mode firmware, and run standardized load tests.",
        dimension: "Operations & Reliability"
      }
    ]
  }
];

export const DEEP_DIVE_TEMPLATES: Record<string, Array<{
  text: string;
  scenario: string;
  options: Array<{ text: string; dimension: string }>;
}>> = {
  ai: [
    {
      text: "How do you respond when an LLM agentic system gets stuck in a recursive loop?",
      scenario: "An autonomous customer service workflow goes offline because your generative AI model entered an infinite tool-calling loop, consuming thousands of API credits in minutes.",
      options: [
        { text: "Analyze the state log trace, identify the semantic recursion trigger, and write a deterministic control gate in Python.", dimension: "Technical Analytics" },
        { text: "Lead a retrospective to establish rate-limiting governance policies and credit thresholds for all deployment slots.", dimension: "Leadership & Strategy" },
        { text: "Re-engineer the prompt hierarchy to use custom multi-agent routing instead of a monolithic decision chain.", dimension: "Creative Problem Solving" },
        { text: "Establish real-time health-check alarms and activate the automated system rollback script.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you mitigate severe model hallucinations in a healthcare deployment?",
      scenario: "Your clinical documentation AI assistant begins recommending incorrect drug dosages during draft generation for physicians.",
      options: [
        { text: "Implement an automated retrieval-augmented generation (RAG) validation layer to verify references against medical textbooks.", dimension: "Technical Analytics" },
        { text: "Convene the medical board to establish a mandatory double-signature audit workflow for all AI drafts.", dimension: "Leadership & Strategy" },
        { text: "Design a high-contrast visual UI highlighting confidence intervals to warn physicians of uncertain data.", dimension: "Creative Problem Solving" },
        { text: "Deploy strict system guardrails that instantly redact suggestions when certainty falls below 95%.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle severe training compute overruns?",
      scenario: "Your team is training a custom foundation model, and cloud infrastructure costs are pacing at 180% of budget prior to convergence.",
      options: [
        { text: "Profile the training run backpropagation passes and implement mixed-precision float16 quantization.", dimension: "Technical Analytics" },
        { text: "Negotiate additional cloud credit grants with suppliers and reallocate engineering headcount budgets.", dimension: "Leadership & Strategy" },
        { text: "Prune less relevant sections of the training dataset to focus strictly on high-impact domain knowledge.", dimension: "Creative Problem Solving" },
        { text: "Set up automated spot-instance scheduling and shut down idle nodes immediately using shell hooks.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you resolve unexpected data drift in production models?",
      scenario: "A visual classification model used in assembly lines reports a 15% drop in accuracy because of a physical factory lighting upgrade.",
      options: [
        { text: "Analyze the pixel histogram shifts, calculate the luminescent delta, and update the normalization matrices.", dimension: "Technical Analytics" },
        { text: "Establish an operational framework for monthly retraining schedules and delegate labeling tasks.", dimension: "Leadership & Strategy" },
        { text: "Utilize generative image augmentations to synthesize simulated factory lighting variables for training.", dimension: "Creative Problem Solving" },
        { text: "Deploy standard manual inspection stations and implement a simple confidence-based routing failover.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you address critical model latency issues in high-demand apps?",
      scenario: "During a peak promotion window, the neural translation API experiences latency spikes, freezing checkout operations.",
      options: [
        { text: "Perform model compilation using TensorRT and cache the most frequent translation strings in Redis.", dimension: "Technical Analytics" },
        { text: "Implement a degradation strategy, informing partners of reduced translation quality in exchange for checkout uptime.", dimension: "Leadership & Strategy" },
        { text: "Design a smooth, local-first skeleton loading flow that pre-translates core titles to conceal latency gaps.", dimension: "Creative Problem Solving" },
        { text: "Activate regional server scaling rules, spin up extra inference pods, and configure standard round-robin routing.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  fintech: [
    {
      text: "How do you handle high-frequency trading anomalies?",
      scenario: "Your decentralized algorithmic trading pool suddenly starts executing arbitrage trades with high variance during an unexpected flash loan attack.",
      options: [
        { text: "Perform a deep-dive bytecode audit of the smart contract transactions to isolate the exact slippage exploit.", dimension: "Technical Analytics" },
        { text: "Synchronize with liquidity providers, freeze critical vaults immediately, and issue an incident communication roadmap.", dimension: "Leadership & Strategy" },
        { text: "Redesign the algorithmic pool's safety pricing formula to integrate dynamic multi-oracle geometric averages.", dimension: "Creative Problem Solving" },
        { text: "Trigger the automated circuit breaker to pause trades and safely roll back state pools to pre-incident blocks.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle cross-border clearing ledger delays?",
      scenario: "An international clearing house experienced a node dropout, freezing high-value enterprise currency swaps worth $12M.",
      options: [
        { text: "Inspect the consensus protocol state log to determine if there is a block validation discrepancy or a network partition.", dimension: "Technical Analytics" },
        { text: "Coordinate with compliance officers and banking executives to issue temporary credit lines to affected partners.", dimension: "Leadership & Strategy" },
        { text: "Create an adaptive queueing protocol that reroutes delayed transactions through secondary liquid clearing lines.", dimension: "Creative Problem Solving" },
        { text: "Deploy secondary fallback validator servers across independent geographic cloud zones.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you assess risks for a novel collateral asset?",
      scenario: "Your credit platform wants to accept tokenized physical real estate as collateral, but lacks historical liquidation data.",
      options: [
        { text: "Build a statistical Monte Carlo simulator modeling worst-case real estate downturns and liquidation speed variables.", dimension: "Technical Analytics" },
        { text: "Host a stakeholder panel with real estate appraisers and legal experts to define low-risk loan-to-value limits.", dimension: "Leadership & Strategy" },
        { text: "Design a fractional liquidation protocol where small shares of the asset can be auctioned incrementally during defaults.", dimension: "Creative Problem Solving" },
        { text: "Establish strict automated margins, require multi-signature approval, and set up daily valuation feeds.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you address a smart contract security vulnerability?",
      scenario: "A white-hat hacker reports a re-entrancy vulnerability in your main deposit vault that could drain all user assets.",
      options: [
        { text: "Locate the state modification line, restructure the transaction flow to update balances before transfer calls, and deploy.", dimension: "Technical Analytics" },
        { text: "Draft a clear public disclosure statement and coordinate a planned upgrade window with the governance council.", dimension: "Leadership & Strategy" },
        { text: "Introduce an emergency circuit breaker wrapper contract that temporary locks withdrawal mechanisms.", dimension: "Creative Problem Solving" },
        { text: "Run automated static analyzer tools, verify the gas cost differentials, and deploy standard pause triggers.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you counter rapid decentralized liquidity drainage?",
      scenario: "An aggressive competitor offers a 200% yield incentive, causing users to withdraw 40% of your platform's stablecoins in hours.",
      options: [
        { text: "Model the liquidity depth decay curves and optimize dynamic withdrawal fees to disincentivize panic runs.", dimension: "Technical Analytics" },
        { text: "Publish an educational article highlighting the competitor's high-risk leverage model to reassure long-term investors.", dimension: "Leadership & Strategy" },
        { text: "Structure a loyalty-pool incentive program offering custom platform tokens to users who lock assets for 90 days.", dimension: "Creative Problem Solving" },
        { text: "Activate capital control rules, limiting maximum hourly withdrawals to preserve platform solvency.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  energy: [
    {
      text: "How do you approach critical grid load variations?",
      scenario: "A severe localized storm has caused an abrupt drop in wind generation, threatening to overload battery storage grids during peak evening demand.",
      options: [
        { text: "Use real-time network simulators to recalculate power flow differentials and optimize line resistance.", dimension: "Technical Analytics" },
        { text: "Establish an emergency response task force to coordinate with regional utility providers and balance state grids.", dimension: "Leadership & Strategy" },
        { text: "Design a dynamic demand-response program offering instant credit incentives to consumers who throttle smart devices.", dimension: "Creative Problem Solving" },
        { text: "Enforce automated load-shedding sequences on non-critical industrial circuits to safeguard physical batteries.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you diagnose rapid solar panel inverter failure?",
      scenario: "A municipal solar farm reports a sudden 25% decrease in daily power output due to localized inverter shutdowns.",
      options: [
        { text: "Analyze the inverter harmonic data and thermal sensor logs to locate physical cell degradation.", dimension: "Technical Analytics" },
        { text: "Organize a field engineering team and establish a rotating inspection protocol to address the failure.", dimension: "Leadership & Strategy" },
        { text: "Implement a dynamic solar tracking algorithm that tilts functional panels to absorb extra solar irradiance.", dimension: "Creative Problem Solving" },
        { text: "Shut down the failing inverters, activate backup grid relays, and record the event logs for compliance.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you mitigate high-voltage storage battery decay?",
      scenario: "The lithium-iron-phosphate battery bank at an off-grid substation shows a accelerated degradation rate of 12% per year.",
      options: [
        { text: "Analyze charge-discharge chemistry curves and write a custom charging profile to minimize thermal stress.", dimension: "Technical Analytics" },
        { text: "Convene with battery manufacturers and engineering heads to renegotiate warranties and lifecycle schedules.", dimension: "Leadership & Strategy" },
        { text: "Design an intelligent cooling and ventilation configuration that maintains cell temperatures at an optimal 22°C.", dimension: "Creative Problem Solving" },
        { text: "Enforce strict peak discharge current limits, install warning alarms, and schedule physical load testing.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle SCADA loop communication dropouts?",
      scenario: "A remote smart hydroelectric plant drops offline from the central SCADA dashboard during high spring-melt inflows.",
      options: [
        { text: "Inspect wireless network packet loss, measure signal-to-noise ratios, and analyze local RTU routing logs.", dimension: "Technical Analytics" },
        { text: "Dispatch an emergency technician team and establish a secondary communication protocol via local satellites.", dimension: "Leadership & Strategy" },
        { text: "Implement an edge-AI control loop at the plant to manage water flow locally while offline.", dimension: "Creative Problem Solving" },
        { text: "Activate local physical fail-safe water bypass gates and verify mechanical backups are locked.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you optimize dynamic pricing consumer incentives?",
      scenario: "A city wants to implement real-time electricity pricing to reduce peak load, but residents find the changing rates confusing.",
      options: [
        { text: "Run statistical modeling on consumer usage habits to calculate optimal pricing thresholds.", dimension: "Technical Analytics" },
        { text: "Coordinate with city marketing leads to launch an education initiative explaining the pricing brackets.", dimension: "Leadership & Strategy" },
        { text: "Design an intuitive mobile dashboard with gamified 'eco-savings' points and smart appliance integrations.", dimension: "Creative Problem Solving" },
        { text: "Deploy smart meters with automated load scheduling templates pre-programmed for low-rate hours.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  biotech: [
    {
      text: "How do you address genetic sequencing discrepancies?",
      scenario: "A CRISPR gene-editing sequencing run flags an unexpected off-target mutation rate across a high-value sample cohort.",
      options: [
        { text: "Trace sequencing alignment records across secondary reference genomes to detect the chemical baseline mutation cause.", dimension: "Technical Analytics" },
        { text: "Present the findings to the scientific board to secure additional funding and revise lab safety standards.", dimension: "Leadership & Strategy" },
        { text: "Synthesize alternative guide RNA structural sequences to bypass the problematic off-target locus completely.", dimension: "Creative Problem Solving" },
        { text: "Enforce strict batch validation protocols, quarantine the mutation sample vials, and verify sterile environmental logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you optimize a multi-omics analytics pipeline bottleneck?",
      scenario: "Your research pipeline takes 18 hours to analyze a single patient's genomic and proteomic profile, delaying clinical trial enrollment.",
      options: [
        { text: "Profile the pipeline code to isolate heavy data transformations and implement parallelized MapReduce steps.", dimension: "Technical Analytics" },
        { text: "Align with clinical trial coordinators to establish a rolling weekly batch-testing schedule to balance lab capacity.", dimension: "Leadership & Strategy" },
        { text: "Introduce a heuristic model that identifies high-probability genomic markers in minutes, running full analysis only as needed.", dimension: "Creative Problem Solving" },
        { text: "Deploy high-performance cloud clusters with automated autoscaling rules to handle incoming test queues.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle a laboratory bio-containment seal leakage alarm?",
      scenario: "A level-3 biosafety lab pressure-differential sensor triggers a minor positive-pressure warning during a pathogenic vector synthesis.",
      options: [
        { text: "Inspect pressure logs, trace airflow rate changes, and calculate the molecular leak location in the HVAC manifold.", dimension: "Technical Analytics" },
        { text: "Enact immediate containment lockdown protocols, notify safety directors, and coordinate team evacuation.", dimension: "Leadership & Strategy" },
        { text: "Repurpose secondary suction systems to create a temporary negative pressure zone around the affected room.", dimension: "Creative Problem Solving" },
        { text: "Activate secondary HEPA air filtration scrubbers, seal access doors manually, and verify pressure relief valves.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you respond to high-throughput molecular screener deviation?",
      scenario: "Your robotic drug-screening system starts registering false-positive binding matches across a chemical library run.",
      options: [
        { text: "Run standard chemical assay calibration checks and examine fluorescent signal-to-noise ratios in raw scans.", dimension: "Technical Analytics" },
        { text: "Organize a review with the assay development team to revise baseline thresholds and screening guidelines.", dimension: "Leadership & Strategy" },
        { text: "Design a secondary enzymatic screening step to weed out typical auto-fluorescent compounds dynamically.", dimension: "Creative Problem Solving" },
        { text: "Pause the automated liquid handlers, replace pipette tips, and log the mechanical alignment variables.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you solve therapeutic protein folding mispredictions?",
      scenario: "An AI protein folding model predicts stable binding for an anti-cancer antibody, but in-vitro lab tests reveal it aggregates rapidly.",
      options: [
        { text: "Extract the atomic coordinate maps and run molecular dynamics simulations to identify unstable salt-bridge bonds.", dimension: "Technical Analytics" },
        { text: "Collaborate with academic partners to gather high-fidelity cryo-EM structural data of the target protein.", dimension: "Leadership & Strategy" },
        { text: "Synthesize minor amino-acid sequence mutations designed to increase surface hydrophilicity and prevent binding aggregation.", dimension: "Creative Problem Solving" },
        { text: "Establish strict quality control validation checkposts for antibody candidates before moving to synthesis.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  spacetech: [
    {
      text: "How do you manage a satellite telemetry drift?",
      scenario: "A low-Earth orbit constellation satellite reports an anomalous 1.5-degree physical attitude drift after crossing a high-density solar radiation band.",
      options: [
        { text: "Parse physical gyroscopic and star-tracker telemetry raw logs to model the rotational vector deviation.", dimension: "Technical Analytics" },
        { text: "Communicate with the mission control board, reallocate ground transmitter bandwidth, and delegate thruster commands.", dimension: "Leadership & Strategy" },
        { text: "Utilize magnetic torquers in a novel geomagnetic alignment sequence to recover the target attitude without fuel consumption.", dimension: "Creative Problem Solving" },
        { text: "Trigger the fail-safe recovery mode, deploy backup solar panels, and lock the system into safe-Sun pointing mode.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you diagnose rocket telemetry antenna degradation?",
      scenario: "A communications antenna on a reusable orbital booster experiences a 10% drop in signal gain during pre-launch checks.",
      options: [
        { text: "Measure antenna reflection loss, examine standing wave ratios, and analyze feed line impedance logs.", dimension: "Technical Analytics" },
        { text: "Coordinate with the launch director to evaluate launch hold criteria and schedule manual technician inspections.", dimension: "Leadership & Strategy" },
        { text: "Modify the transmitter frequency phases dynamically to construct an electronic phased array, compensating for the gain loss.", dimension: "Creative Problem Solving" },
        { text: "Replace the physical cabling, check RF grounding connections, and run standardized radio loop diagnostics.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle solar storm activity warning?",
      scenario: "Space weather reports predict an extreme solar flare that will cross your satellite network's orbital plane in 12 hours.",
      options: [
        { text: "Model solar particle flux paths and calculate specific high-risk spacecraft attitude adjustments.", dimension: "Technical Analytics" },
        { text: "Brief the executive board on potential service disruptions, and synchronize backup plans with global telecom clients.", dimension: "Leadership & Strategy" },
        { text: "Deploy a temporary peer-to-peer inter-satellite routing mesh to bypass expected high-noise ionosphere sectors.", dimension: "Creative Problem Solving" },
        { text: "Command all satellites to safe-mode, power down sensitive transponders, and lock critical magnetic shielding.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you address autonomous drone landing navigation faults?",
      scenario: "An autonomous cargo drone reports sensor conflicts while landing on an offshore drone barge under heavy swells.",
      options: [
        { text: "Compare real-time optical flow data with LIDAR feedback to isolate the sensor bias calculation.", dimension: "Technical Analytics" },
        { text: "Notify maritime coordinates and abort the landing sequence, command the drone to circle a safe coordinate waypoint.", dimension: "Leadership & Strategy" },
        { text: "Implement an adaptive predictive guidance system that syncs the drone descent velocity with the pitch rate of the barge.", dimension: "Creative Problem Solving" },
        { text: "Command the drone to hold a hover, deploy mechanical landing gear locks, and activate ultrasonic altitude arrays.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you solve orbital cargo loading center mismatches?",
      scenario: "A payload loading manifest has a center-of-mass discrepancy of 5cm, which could cause booster steering loss during launch.",
      options: [
        { text: "Calculate the exact thrust vector corrections and gymbal angle adjustments required to compensate for the offset.", dimension: "Technical Analytics" },
        { text: "Lead a review with payload integration clients to negotiate re-packing or adding counterbalance weights.", dimension: "Leadership & Strategy" },
        { text: "Reposition secondary cargo pods dynamically inside the fairing to act as custom counterbalance modules.", dimension: "Creative Problem Solving" },
        { text: "Enforce strict loading checks, halt packaging, and log physical measurements against compliance databases.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  smartcities: [
    {
      text: "How do you resolve central transit communication dropouts?",
      scenario: "A primary wireless node drops offline, causing 45 autonomous city transit shuttles to halt and trigger emergency hazard states.",
      options: [
        { text: "Analyze regional signal interference metrics and optimize localized mesh frequency allocations.", dimension: "Technical Analytics" },
        { text: "Coordinate with city transport officials and dispatch physical support teams to key traffic intersections.", dimension: "Leadership & Strategy" },
        { text: "Leverage ad-hoc vehicle-to-vehicle (V2V) proximity mesh links so shuttles can safely navigate around the dead zone.", dimension: "Creative Problem Solving" },
        { text: "Activate the backup low-bandwidth cellular radio link and safely return all shuttles to the nearest depot.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle smart water quality sensor anomalies?",
      scenario: "Water monitoring sensors in a city district trigger elevated chemical contaminants warnings, causing municipal panic.",
      options: [
        { text: "Compare sensor data with upstream water filtration logs and run a statistical false-alarm analysis.", dimension: "Technical Analytics" },
        { text: "Notify public health departments, draft community safety advisories, and arrange physical water sample collections.", dimension: "Leadership & Strategy" },
        { text: "Design an automated, targeted water flush routing sequence that isolates the suspected pipe branch.", dimension: "Creative Problem Solving" },
        { text: "Shut down primary distribution valves for that sector immediately, and activate backup clean water lines.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you resolve traffic gridlock at smart intersections?",
      scenario: "An autonomous delivery fleet rollout conflicts with local bus routes, causing gridlock across five central city blocks.",
      options: [
        { text: "Model traffic density variables using camera feedback and optimize transit signal timings.", dimension: "Technical Analytics" },
        { text: "Establish an urban mobility committee with fleet providers to define dedicated commercial zones and schedules.", dimension: "Leadership & Strategy" },
        { text: "Design a dynamic corridor prioritization system that temporarily creates express lanes using LED road indicators.", dimension: "Creative Problem Solving" },
        { text: "Manually override intersection lights to flush traffic and set up physical redirect barriers.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you manage peak storm runoff drainage overloads?",
      scenario: "A torrential rainstorm overloads a smart city's bio-retention storm drainage system, causing street level flooding.",
      options: [
        { text: "Track watershed levels and predict overflow pathways using predictive hydrological models.", dimension: "Technical Analytics" },
        { text: "Coordinate with emergency management teams, open auxiliary overflow channels, and warn affected neighborhoods.", dimension: "Leadership & Strategy" },
        { text: "Convert public park storage areas into temporary flood storage retention basins using automated gates.", dimension: "Creative Problem Solving" },
        { text: "Open physical emergency floodgates, activate high-volume water pump arrays, and monitor drainage logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you balance sudden public transit demand surges?",
      scenario: "A major unscheduled tech convention causes a sudden 300% passenger surge at three central subway stations.",
      options: [
        { text: "Model train capacities and schedule express runs to clear the most crowded stations first.", dimension: "Technical Analytics" },
        { text: "Coordinate with station managers, allocate temporary security, and display clear exit-path maps.", dimension: "Leadership & Strategy" },
        { text: "Deploy an on-demand electric shuttle service to ferry surplus travelers along alternative routes.", dimension: "Creative Problem Solving" },
        { text: "Increase train dispatch frequencies to peak levels and limit incoming station entries to control density.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  creativedesign: [
    {
      text: "How do you address mixed-reality rendering misalignment?",
      scenario: "Your team's custom AR exhibition app experiences heavy graphic stuttering and spatial occlusion glitches on newer glasses.",
      options: [
        { text: "Profile GPU draw calls, optimize shader mesh geometry, and benchmark dynamic memory leaks.", dimension: "Technical Analytics" },
        { text: "Conduct quick user-experience feedback sessions to prioritize the most essential visual layers for release.", dimension: "Leadership & Strategy" },
        { text: "Simplify the layout style using highly stylized minimal wireframes that render perfectly even under low frame rates.", dimension: "Creative Problem Solving" },
        { text: "Set up a rigorous automated performance budget checklist across all target headsets before main build triggers.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle AR headset lens occlusion errors?",
      scenario: "In a dynamic outdoor museum tour, AR labels drift off physically exhibits because of direct sunlight glare on optical camera lenses.",
      options: [
        { text: "Develop an edge-detection filter in the app's camera pipeline to isolate high-contrast markers.", dimension: "Technical Analytics" },
        { text: "Negotiate with the museum curator to place high-contrast matte physical tags in shaded display spots.", dimension: "Leadership & Strategy" },
        { text: "Implement a hybrid compass and GPS dead-reckoning algorithm that anchors tags even when camera feedback fails.", dimension: "Creative Problem Solving" },
        { text: "Configure manual re-calibration buttons in the UI and write clear troubleshooting guides for users.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you optimize procedural asset pipeline bottlenecks?",
      scenario: "Your team's procedural environment engine takes too long to render complex landscapes, causing game frame drops.",
      options: [
        { text: "Optimize spatial partitioning trees and write custom shaders to handle distant foliage in low-detail passes.", dimension: "Technical Analytics" },
        { text: "Run team workshops to define asset creation standards and establish performance boundaries for artists.", dimension: "Leadership & Strategy" },
        { text: "Utilize dynamic fog and distance blurs to create a atmospheric visual style that limits active geometry.", dimension: "Creative Problem Solving" },
        { text: "Implement strict level-of-detail (LOD) triggers that swap high-resolution assets for low-res proxies.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you manage immersive headset battery drain?",
      scenario: "User testing reveals your custom VR simulation drains headset battery levels from 100% to zero in under 40 minutes.",
      options: [
        { text: "Trace CPU thread usage, optimize physics cycles, and reduce asset update loops.", dimension: "Technical Analytics" },
        { text: "Advise clients to bundle external battery packs and structure sessions into shorter 20-minute segments.", dimension: "Leadership & Strategy" },
        { text: "Implement foveated rendering, keeping only the user's focus point sharp while blurring peripheries.", dimension: "Creative Problem Solving" },
        { text: "Throttle background services, reduce display refresh rates, and document power savings.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you resolve spatial gesture recognition dropouts?",
      scenario: "Users with diverse physical hand shapes report difficulty triggering the primary menu using standard air-tap gestures.",
      options: [
        { text: "Collect spatial joint coordinate data and adjust gesture detection tolerance thresholds.", dimension: "Technical Analytics" },
        { text: "Review user feedback logs with the product design team to evaluate alternative menu access methods.", dimension: "Leadership & Strategy" },
        { text: "Incorporate intuitive virtual handles and physical button models that respond to proximity.", dimension: "Creative Problem Solving" },
        { text: "Enable a standard hardware controller button fallback and log gesture failures.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  art: [
    {
      text: "How do you handle a physical-digital exhibition space misalignment?",
      scenario: "You are setting up a large-scale multimedia art gallery, and the real-time projection mapping drifts from the physical canvas edges.",
      options: [
        { text: "Use computer-vision calibration cameras to mathematically calculate pixel coordinate offsets on the 3D projection map.", dimension: "Technical Analytics" },
        { text: "Organize the gallery's technical crew, host a quick review meeting, and assign precise calibration duties.", dimension: "Leadership & Strategy" },
        { text: "Embrace the spatial distortion by altering the narrative abstract artwork to morph dynamically around the offset.", dimension: "Creative Problem Solving" },
        { text: "Perform a complete mechanical reset of projector rigs, reload stable configuration presets, and lock physical coordinates.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you debug dynamic kinetic sculpture motor glitches?",
      scenario: "Your kinetic sculpture’s motorized wood hinges begin clicking loudly and losing sync during a gallery opening.",
      options: [
        { text: "Measure current draw across the stepper motors and inspect the timing code for step-rate discrepancies.", dimension: "Technical Analytics" },
        { text: "Gather the gallery coordinators and announce a short technical intermission to safely inspect the sculpture.", dimension: "Leadership & Strategy" },
        { text: "Change the kinetic motion to move in slow waves, making the mechanical clicking sound like a clockwork effect.", dimension: "Creative Problem Solving" },
        { text: "Apply dry lubricants to physical gears, run standardized calibration loops, and log motor voltages.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you stop traditional oil portrait color pigment decay?",
      scenario: "An expensive oil painting in your collection shows signs of premature cracking and pigment yellowing.",
      options: [
        { text: "Run spectroscopic analysis on the varnish layer to identify the chemical reaction causing decay.", dimension: "Technical Analytics" },
        { text: "Synchronize with museum conservators to establish a restoration roadmap and secure funding.", dimension: "Leadership & Strategy" },
        { text: "Display the painting under custom ultraviolet-filtered LED lighting designed to bring out lost blue hues.", dimension: "Creative Problem Solving" },
        { text: "Transfer the painting to a dark nitrogen-sealed archival case and verify temperature logs are locked.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you manage gallery environmental humidity spikes?",
      scenario: "The humidity sensor in a gallery displaying sensitive ancient wood scrolls spikes during a summer storm.",
      options: [
        { text: "Calculate the evaporation rates and trace the HVAC system efficiency to isolate air duct failures.", dimension: "Technical Analytics" },
        { text: "Coordinate with maintenance managers to transfer the wood scroll cases to dry holding rooms.", dimension: "Leadership & Strategy" },
        { text: "Utilize localized silica-gel packets inside the scrolls' display glass to absorb the moisture spike.", dimension: "Creative Problem Solving" },
        { text: "Turn on auxiliary dehumidifiers, check rubber seals on display cases, and record hourly humidity logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you solve hybrid installation viewer trigger failures?",
      scenario: "An interactive sound exhibit fails to play audio when visitors step on the central pressure pads.",
      options: [
        { text: "Test the electrical continuity of the pad switches and inspect the MIDI trigger software logs.", dimension: "Technical Analytics" },
        { text: "Post temporary signage asking visitors to stand closer to visual markers while technician teams check systems.", dimension: "Leadership & Strategy" },
        { text: "Install a camera-based movement tracker to trigger audio, bypassing the physical pressure pads entirely.", dimension: "Creative Problem Solving" },
        { text: "Reset the central audio computer, secure cable connections under carpet runners, and run test loops.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  electrical: [
    {
      text: "How do you respond to industrial power balancing faults?",
      scenario: "An automated assembly line experiences frequent breaker trips due to high power surges from new smart motors.",
      options: [
        { text: "Measure localized circuit impedance, analyze current harmonic waves, and install custom capacitor filters.", dimension: "Technical Analytics" },
        { text: "Collaborate with factory heads to schedule machine runs sequentially, avoiding overlapping peak startup loads.", dimension: "Leadership & Strategy" },
        { text: "Repurpose old energy-storage batteries to act as high-speed buffers that absorb voltage spikes on startup.", dimension: "Creative Problem Solving" },
        { text: "Install heavy-duty surge protection arrays, verify physical grounding rods, and document standard panel loads.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you debug programmable logic controller (PLC) cycle halts?",
      scenario: "A water purification plant’s main PLC enters a fault state, halting clean water distribution to 3,000 homes.",
      options: [
        { text: "Connect diagnostic laptops to download register trace logs, examining memory blocks for cycle overruns.", dimension: "Technical Analytics" },
        { text: "Mobilize emergency engineers, notify local utility offices, and coordinate public updates.", dimension: "Leadership & Strategy" },
        { text: "Implement a redundant heartbeat script that automatically switches control to a hot-standby PLC.", dimension: "Creative Problem Solving" },
        { text: "Manually bypass the PLC using physical relays, activate backup pump systems, and record terminal logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you mitigate solar panel inverter grid surges?",
      scenario: "A commercial solar field inverter experiences voltage surges that exceed local utility feed-in limits during cloud clearance.",
      options: [
        { text: "Analyze the voltage rise rates and adjust the inverter's MPPT tracking loop speed.", dimension: "Technical Analytics" },
        { text: "Represent the energy cooperative in discussions with utility engineers to revise connection rules.", dimension: "Leadership & Strategy" },
        { text: "Design a rapid resistive load bank system that dissipates energy during sudden surges.", dimension: "Creative Problem Solving" },
        { text: "Configure active power curtailment limits in the inverter firmware and monitor grid voltages.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you diagnose high-voltage conduit physical wear?",
      scenario: "An underground high-voltage distribution cable shows suspicious thermal signatures during infrared scanning.",
      options: [
        { text: "Run partial discharge tests to calculate the exact coordinate of the insulation degradation.", dimension: "Technical Analytics" },
        { text: "Coordinate with safety coordinators to arrange a planned power shutdown for cable replacement.", dimension: "Leadership & Strategy" },
        { text: "Introduce nitrogen-cooling lines inside the conduit to extend cable life until the scheduled replacement window.", dimension: "Creative Problem Solving" },
        { text: "Isolate the cable run, reroute power through secondary grid networks, and log conduit temperatures.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you handle backup generator mechanical transfer delays?",
      scenario: "During a power outage at a telecom facility, the diesel generator starts but the automatic transfer switch (ATS) fails to click over.",
      options: [
        { text: "Examine the ATS solenoid coil resistance and trace control circuit schematics for voltage dropouts.", dimension: "Technical Analytics" },
        { text: "Dispatch on-duty technicians and notify network operations leads of the battery drain limits.", dimension: "Leadership & Strategy" },
        { text: "Construct an emergency manual bypass interlock key that allows safe mechanical switching under load.", dimension: "Creative Problem Solving" },
        { text: "Manually actuate the transfer switch using insulated levers, start auxiliary fans, and lock ATS panels.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  carpentry: [
    {
      text: "How do you handle wood material moisture deviations?",
      scenario: "You are crafting load-bearing structural beams, but the latest lumber batch has a moisture level exceeding safety standards.",
      options: [
        { text: "Utilize digital pinless moisture meters to map internal density variables and mathematically predict drying rates.", dimension: "Technical Analytics" },
        { text: "Negotiate terms with the supplier for replacement materials while keeping project coordinators updated on timelines.", dimension: "Leadership & Strategy" },
        { text: "Adapt the design to construct decorative, non-bearing elements using this lumber, while sourcing dry wood for beams.", dimension: "Creative Problem Solving" },
        { text: "Quarantine the high-moisture lumber, place them in temperature-controlled kilns, and document standard drying logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you address wood frame load-bearing stress cracks?",
      scenario: "A post-construction inspection of a custom timber-frame home reveals minor hairline stress cracks in a primary oak post.",
      options: [
        { text: "Examine crack propagation using ultrasound transducers and calculate structural deflection vectors.", dimension: "Technical Analytics" },
        { text: "Coordinate with structural engineers and the homeowner to schedule timber reinforcing.", dimension: "Leadership & Strategy" },
        { text: "Incorporate decorative wrought-iron structural brackets that clamp the post while adding an aesthetic touch.", dimension: "Creative Problem Solving" },
        { text: "Install physical monitoring pins across cracks, record weekly shifts, and secure supporting columns.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you fix precision CNC wood cutting calibration shift?",
      scenario: "Your automatic CNC router starts milling cabinet door hinges 2mm out of square, causing assembly delays.",
      options: [
        { text: "Run diagnostic code, check stepper motor backlash values, and adjust coordinate offsets.", dimension: "Technical Analytics" },
        { text: "Pause the production crew, run a workshop to revise calibration logs, and set clear quality checklists.", dimension: "Leadership & Strategy" },
        { text: "Modify cabinet assembly joints to use self-aligning loose tenons that absorb the 2mm variance.", dimension: "Creative Problem Solving" },
        { text: "Replace physical router collets, tighten ball screws, and run standard alignment square cuts.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you restore historical timber roof architectural decay?",
      scenario: "You are restoring a 150-year-old barn, and the main hand-hewn support tie beams have severe rot at the wall joints.",
      options: [
        { text: "Take wood core samples to measure rot depth, calculating remaining load capacities.", dimension: "Technical Analytics" },
        { text: "Consult historic preservation officers and draft a detailed joinery restoration plan.", dimension: "Leadership & Strategy" },
        { text: "Perform a 'scarf-joint' repair, grafting new seasoned timbers into the rotted zones using traditional wooden pegs.", dimension: "Creative Problem Solving" },
        { text: "Install auxiliary heavy-duty steel support columns and log structural shifts under snow loads.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you resolve green building eco-friendly material supply blocks?",
      scenario: "The specialized FSC-certified recycled cedar cladding requested for an eco-home is backordered for 12 weeks, halting construction.",
      options: [
        { text: "Research alternative certified local species, comparing thermal insulation ratings and lifecycle values.", dimension: "Technical Analytics" },
        { text: "Present alternative material options to the client to obtain approval for a design change.", dimension: "Leadership & Strategy" },
        { text: "Repurpose local reclaimed barn siding, cleaning and milling the timber on-site to create custom cladding.", dimension: "Creative Problem Solving" },
        { text: "Update safety construction schedules, adjust subcontractor schedules, and record new project milestones.", dimension: "Operations & Reliability" }
      ]
    }
  ],
  automotive: [
    {
      text: "How do you address electric vehicle battery thermal issues?",
      scenario: "A high-performance electric vehicle prototype shows elevated battery cell temperatures during extreme acceleration tests.",
      options: [
        { text: "Analyze CAN-bus logs, measure voltage drop across cells, and pinpoint high-resistance electrical connections.", dimension: "Technical Analytics" },
        { text: "Lead a safety review session with the mechanical engineering and battery chemistry teams to revise testing limits.", dimension: "Leadership & Strategy" },
        { text: "Optimize the cooling fluid flow path using a custom manifold that redirects coolant to high-stress cell zones.", dimension: "Creative Problem Solving" },
        { text: "Calibrate thermal cutoff limit sensors, update the battery management safe-mode firmware, and run standardized load tests.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you resolve CAN bus network message checksum collisions?",
      scenario: "The dashboard of a vehicle displays a flickering engine warning light due to intermittent CAN bus communication errors.",
      options: [
        { text: "Connect oscilloscopes to measure signal voltage levels and isolate electrical noise sources.", dimension: "Technical Analytics" },
        { text: "Coordinate with the automotive software engineering team to revise bus signal priority definitions.", dimension: "Leadership & Strategy" },
        { text: "Implement a software message filter that discards redundant low-priority frames during network spikes.", dimension: "Creative Problem Solving" },
        { text: "Check physical terminating resistors, inspect harness grounding, and log CAN transaction logs.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you diagnose regenerative brake fluid pressure variations?",
      scenario: "An electric utility truck reports a soft brake pedal feel during regenerative braking activation at low speeds.",
      options: [
        { text: "Inspect modulator piston displacements and analyze hydraulic pressure sensor logs.", dimension: "Technical Analytics" },
        { text: "Schedule driver training workshops and discuss hydraulic system updates with fleet leads.", dimension: "Leadership & Strategy" },
        { text: "Calibrate the regenerative deceleration curve to blend electric motor braking more smoothly with physical pads.", dimension: "Creative Problem Solving" },
        { text: "Perform a complete brake line fluid purge, replace hydraulic seals, and run standardized stopping tests.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you adjust automated chassis alignment laser drifts?",
      scenario: "Your robotic wheel alignment system reports a 0.5-degree drift in wheel toe angles, causing uneven tire wear in test runs.",
      options: [
        { text: "Measure calibration mirror reflectances and adjust coordinate matrices in the machine controller.", dimension: "Technical Analytics" },
        { text: "Conduct a review with quality assurance teams to implement daily mechanical calibration checks.", dimension: "Leadership & Strategy" },
        { text: "Develop a double-check laser tracking sequence that cross-references physical mechanical wheel clamps.", dimension: "Creative Problem Solving" },
        { text: "Re-anchor laser rigs, replace worn optical filters, and run standard alignment audits.", dimension: "Operations & Reliability" }
      ]
    },
    {
      text: "How do you respond to drivetrain diagnostic codes?",
      scenario: "A hybrid vehicle prototype throws an active drivetrain code for transmission input shaft speed sensor discrepancy.",
      options: [
        { text: "Compare sensor wave outputs against crankshaft positions in oscilloscope traces to isolate signal drops.", dimension: "Technical Analytics" },
        { text: "Organize a engineering review to decide if field recalls or dealer technical bulletins are required.", dimension: "Leadership & Strategy" },
        { text: "Design a software encoder simulation that estimates shaft speed from motor speed if the sensor fails.", dimension: "Creative Problem Solving" },
        { text: "Replace physical sensor modules, inspect the connector shielding, and clear OBD codes.", dimension: "Operations & Reliability" }
      ]
    }
  ]
};

export function getQuestionsForSector(sectorId: string): ScenarioQuestion[] {
  const templates = DEEP_DIVE_TEMPLATES[sectorId];
  if (!templates) return [];
  
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

