import {
  ActivityId,
  ActivityOption,
  DecisionQuestion,
  MatchingRule,
  RecommendationProfile,
  RegionId,
  RegionOption,
} from "@/types/loadmap";

const option = (
  value: string,
  label: string,
  score: number,
  contributionLabel: string,
  explanation: string,
) => ({
  value,
  label,
  score,
  contributionLabel,
  explanation,
});

export const activities: ActivityOption[] = [
  {
    id: "lifting",
    label: "Heben & Tragen",
    description: "Manuelle Lastenbewegung mit wiederkehrenden Hebe- oder Tragevorgängen.",
    diagnosticLens: "Wir prüfen Last, Häufigkeit, Distanz und vorhandene Entlastung.",
    typicalDrivers: ["Hohes Lastgewicht", "Viele Hebevorgänge", "Fehlende Hebehilfen"],
  },
  {
    id: "overhead",
    label: "Überkopf-Arbeit",
    description: "Arbeit oberhalb der Schulterhöhe mit erhöhter Arm- und Schulterbeanspruchung.",
    diagnosticLens: "Wir betrachten Dauer über Schulterhöhe, Werkzeuglast und Entlastungspausen.",
    typicalDrivers: ["Lange Haltephasen", "Schwere Werkzeuge", "Fehlende Armunterstützung"],
  },
  {
    id: "standing",
    label: "Langes Stehen",
    description: "Stehende Tätigkeiten mit geringer Entlastung über weite Teile der Schicht.",
    diagnosticLens: "Wir fokussieren Stehdauer, Haltungswechsel, Untergrund und Sitzoptionen.",
    typicalDrivers: ["Lange Standzeiten", "Kaum Bewegungswechsel", "Harter Untergrund"],
  },
  {
    id: "bending",
    label: "Vorbeugen",
    description: "Arbeit mit häufiger Rumpfneigung oder niedrigen Greifzonen.",
    diagnosticLens: "Wir bewerten Vorbeugedauer, Vermeidbarkeit und den vorhandenen Bewegungsspielraum.",
    typicalDrivers: ["Lange Vorbeugephasen", "Schlechter Greifraum", "Zu wenig Verstellbarkeit"],
  },
  {
    id: "repetitive",
    label: "Repetitive Bewegung",
    description: "Gleichförmige, taktgebundene Bewegungsmuster mit hoher Wiederholrate.",
    diagnosticLens: "Wir prüfen Wiederholfrequenz, Kraftbedarf, Taktbindung und Mikropausen.",
    typicalDrivers: ["Hohe Taktung", "Kraftaufwand", "Zu wenig Erholung"],
  },
  {
    id: "pushing",
    label: "Ziehen & Schieben",
    description: "Transportbewegungen mit Rollwagen, Containern oder Materialeinheiten.",
    diagnosticLens: "Wir prüfen Schubkraft, Transportdistanz, Rollwiderstand und Hilfsmittel.",
    typicalDrivers: ["Hohe Schubkräfte", "Lange Wege", "Ungeeignete Transportmittel"],
  },
  {
    id: "awkward",
    label: "Zwangshaltung",
    description: "Arbeit in ungünstigen Haltungen mit eingeschränkter Bewegungsfreiheit.",
    diagnosticLens: "Wir fokussieren Haltungsdauer, Vermeidbarkeit und Bewegungsspielraum.",
    typicalDrivers: ["Enge Arbeitsräume", "Lange Haltungsbindung", "Fehlende Anpassbarkeit"],
  },
];

export const bodyRegions: RegionOption[] = [
  {
    id: "back",
    label: "Rücken",
    bodyZone: "Rumpf",
    description: "Unterer und mittlerer Rücken bei Hebe-, Vorbeuge- oder Schubbelastung.",
  },
  {
    id: "neck",
    label: "Nacken",
    bodyZone: "Obere Wirbelsäule",
    description: "Belastung im Übergang zwischen Kopf, Nacken und oberer Wirbelsäule.",
  },
  {
    id: "shoulders",
    label: "Schulter",
    bodyZone: "Schultergürtel",
    description: "Belastung in Schultergürtel, Oberarm und angrenzender Muskulatur.",
  },
  {
    id: "knees",
    label: "Knie",
    bodyZone: "Unterkörper",
    description: "Belastung beim Beugen, Hocken, Stehen oder beim Bewegen von Lasten.",
  },
  {
    id: "wrists",
    label: "Handgelenke",
    bodyZone: "Arme & Hände",
    description: "Beanspruchung bei repetitiven, feinmotorischen oder kraftvollen Handbewegungen.",
  },
  {
    id: "legsFeet",
    label: "Beine/Füße",
    bodyZone: "Unterkörper",
    description: "Belastung durch langes Stehen, schlechten Untergrund oder wenig Bewegungswechsel.",
  },
];

const liftingQuestions: DecisionQuestion[] = [
  {
    id: "liftFrequency",
    activityIds: ["lifting"],
    category: "frequency",
    label: "Wie häufig wird pro Schicht gehoben oder getragen?",
    hint: "Die Wiederholrate zeigt, ob Belastungsspitzen regelmäßig auftreten.",
    relevance: "Häufiges Heben erhöht das kumulative Risiko für Rücken und Knie.",
    options: [
      option("rare", "Selten", 0, "geringe Hebehäufigkeit", "Nur wenige Hebevorgänge pro Schicht."),
      option("regular", "Mehrfach täglich", 2, "regelmäßige Hebevorgänge", "Die Belastung tritt mehrfach pro Tag auf."),
      option("intense", "Sehr häufig", 4, "hohe Hebehäufigkeit", "Die Tätigkeit prägt große Teile der Schicht."),
    ],
  },
  {
    id: "loadWeight",
    activityIds: ["lifting"],
    category: "force",
    label: "Welches Lastgewicht ist typisch?",
    hint: "Gewicht und Hebeposition bestimmen den mechanischen Belastungsdruck.",
    relevance: "Höhere Lasten steigern den Bedarf an Hebehilfe oder Rückenunterstützung.",
    options: [
      option("light", "Bis 5 kg", 0, "geringes Lastgewicht", "Leichte Lasten dominieren die Aufgabe."),
      option("medium", "5 bis 15 kg", 2, "mittleres Lastgewicht", "Es werden regelmäßig mittlere Lasten bewegt."),
      option("heavy", "Mehr als 15 kg", 4, "hohes Lastgewicht", "Schwere Lasten prägen die Aufgabe."),
    ],
  },
  {
    id: "carryDistance",
    activityIds: ["lifting"],
    category: "distance",
    label: "Wie weit werden Lasten typischerweise getragen?",
    hint: "Längere Wege erhöhen die Gesamtbelastung und erschweren Entlastung.",
    relevance: "Tragedistanzen zeigen, ob Materialfluss und Übergabepunkte optimiert werden sollten.",
    options: [
      option("short", "Kurz, direkt am Arbeitsplatz", 0, "kurze Tragedistanz", "Lasten werden nur über kurze Distanzen bewegt."),
      option("medium", "Mehrere Meter", 2, "mittlere Tragedistanz", "Die Last wird über spürbare Wege getragen."),
      option("long", "Lange Wege oder häufige Umlagerung", 3, "lange Tragedistanz", "Transportwege verstärken die Belastung deutlich."),
    ],
  },
  {
    id: "assistTools",
    activityIds: ["lifting", "pushing"],
    category: "support",
    label: "Welche Hebe- oder Transporthilfen stehen zur Verfügung?",
    hint: "Hilfsmittel reduzieren Lastspitzen und verbessern die Prozesssicherheit.",
    relevance: "Fehlende Hilfsmittel sind ein starker Hebel für Technik- und Beratungsbedarf.",
    options: [
      option("full", "Passende Hilfsmittel vorhanden", 0, "gute Hilfsmittelabdeckung", "Hilfsmittel sind verfügbar und werden genutzt."),
      option("partial", "Teilweise vorhanden", 2, "teilweise fehlende Hilfsmittel", "Unterstützung ist vorhanden, aber nicht durchgängig."),
      option("none", "Keine oder kaum Hilfsmittel", 4, "fehlende Hilfsmittel", "Die Tätigkeit wird überwiegend manuell ausgeführt."),
    ],
  },
];

const overheadQuestions: DecisionQuestion[] = [
  {
    id: "overheadDuration",
    activityIds: ["overhead"],
    category: "duration",
    label: "Wie lange arbeiten Mitarbeitende oberhalb der Schulterhöhe?",
    hint: "Die Haltezeit ist für Schulter und Nacken besonders relevant.",
    relevance: "Lange Überkopf-Phasen erhöhen den Bedarf an Arm- oder Schulterunterstützung.",
    options: [
      option("brief", "Kurzzeitig", 1, "kurze Überkopf-Phasen", "Die Arme werden nur kurzzeitig angehoben."),
      option("recurring", "Wiederkehrend", 3, "wiederkehrende Überkopf-Phasen", "Überkopf-Arbeit ist regelmäßig Teil der Aufgabe."),
      option("sustained", "Lange Haltephasen", 4, "lange Überkopf-Dauer", "Die Schulterlinie wird lange überschritten."),
    ],
  },
  {
    id: "toolWeight",
    activityIds: ["overhead"],
    category: "force",
    label: "Wie schwer oder träge sind die eingesetzten Werkzeuge?",
    hint: "Werkzeuggewicht addiert sich direkt auf die Haltebelastung.",
    relevance: "Schwere Werkzeuge sprechen für Balancer oder aktive Unterstützung.",
    options: [
      option("light", "Leicht oder gut ausbalanciert", 0, "leichtes Werkzeug", "Das Werkzeug erzeugt wenig Zusatzlast."),
      option("medium", "Spürbar, aber kontrollierbar", 2, "mittleres Werkzeuggewicht", "Werkzeuge fordern die Schulter merklich."),
      option("heavy", "Schwer oder unhandlich", 4, "hohes Werkzeuggewicht", "Das Werkzeug verstärkt die Haltearbeit deutlich."),
    ],
  },
  {
    id: "recoveryBreaks",
    activityIds: ["overhead"],
    category: "recovery",
    label: "Gibt es regelmäßige Entlastungs- oder Wechselphasen?",
    hint: "Pausen und Wechselaufgaben entschärfen die statische Haltebelastung.",
    relevance: "Fehlende Erholung erhöht den Bedarf an organisatorischer Entlastung.",
    options: [
      option("good", "Ja, regelmäßig", 0, "gute Entlastungsphasen", "Es gibt planbare Wechsel und Entlastungsfenster."),
      option("limited", "Nur eingeschränkt", 2, "begrenzte Entlastungsphasen", "Wechsel sind möglich, aber nicht zuverlässig."),
      option("poor", "Kaum oder keine", 3, "fehlende Entlastungsphasen", "Die Belastung läuft ohne wirksame Unterbrechung."),
    ],
  },
  {
    id: "armSupport",
    activityIds: ["overhead"],
    category: "support",
    label: "Gibt es Unterstützung für Arme oder Werkzeuge?",
    hint: "Balancer oder Schulterunterstützung senken statische Haltearbeit direkt.",
    relevance: "Fehlende Unterstützung ist ein klarer Trigger für Technikempfehlungen.",
    options: [
      option("supported", "Ja, gut abgestützt", 0, "vorhandene Armunterstützung", "Unterstützungssysteme sind wirksam im Einsatz."),
      option("partial", "Teilweise", 2, "teilweise Armunterstützung", "Unterstützung ist nicht überall nutzbar."),
      option("unsupported", "Nein", 4, "fehlende Armunterstützung", "Die Belastung wird ohne Assistenz abgefangen."),
    ],
  },
];

const standingQuestions: DecisionQuestion[] = [
  {
    id: "standingDuration",
    activityIds: ["standing"],
    category: "duration",
    label: "Wie lange wird überwiegend im Stehen gearbeitet?",
    hint: "Die Dauer ist zentral für Bein-, Fuß- und Ermüdungsbelastung.",
    relevance: "Lange Stehzeiten sprechen für Stehhilfe, Matten und Arbeitsplatzumbau.",
    options: [
      option("mixed", "Mit regelmäßigen Sitz- oder Gehphasen", 1, "gemischte Stehbelastung", "Stehen ist relevant, aber nicht durchgängig."),
      option("mostly", "Über weite Teile der Schicht", 3, "lange Stehbelastung", "Stehen prägt den Arbeitstag deutlich."),
      option("constant", "Fast durchgehend", 4, "sehr lange Stehbelastung", "Es gibt kaum wirksame Entlastung im Tagesverlauf."),
    ],
  },
  {
    id: "postureChange",
    activityIds: ["standing"],
    category: "recovery",
    label: "Wie oft ist ein Haltungs- oder Bewegungswechsel möglich?",
    hint: "Bewegungswechsel reduziert statische Ermüdung und lokale Druckbelastung.",
    relevance: "Wenig Wechsel erhöht den Nutzen organisatorischer Maßnahmen.",
    options: [
      option("frequent", "Häufig möglich", 0, "häufige Haltungswechsel", "Bewegung und Entlastung sind gut integrierbar."),
      option("some", "Teilweise möglich", 2, "eingeschränkte Haltungswechsel", "Wechsel sind möglich, aber nicht konsequent."),
      option("rare", "Kaum möglich", 4, "fehlende Haltungswechsel", "Die Haltung bleibt lange starr gebunden."),
    ],
  },
  {
    id: "floorCondition",
    activityIds: ["standing"],
    category: "environment",
    label: "Wie ist der Untergrund am Arbeitsplatz?",
    hint: "Untergrund und Dämpfung beeinflussen Ermüdung und Komfort stark.",
    relevance: "Ein harter oder ungünstiger Untergrund spricht für Matten oder Umbau.",
    options: [
      option("ergonomic", "Gedämpft oder ergonomisch gestaltet", 0, "geeigneter Untergrund", "Der Untergrund unterstützt längeres Stehen."),
      option("neutral", "Neutral", 1, "neutraler Untergrund", "Der Untergrund ist akzeptabel, aber nicht optimiert."),
      option("hard", "Hart oder ermüdend", 3, "belastender Untergrund", "Der Boden verstärkt die Ermüdungsbelastung."),
    ],
  },
  {
    id: "seatOption",
    activityIds: ["standing"],
    category: "support",
    label: "Gibt es Sitz-, Anlehn- oder Stehhilfen?",
    hint: "Schon kleine Entlastungsoptionen können die Beanspruchung deutlich senken.",
    relevance: "Fehlende Entlastungsoptionen sind ein direkter Umbau- und Maßnahmenhebel.",
    options: [
      option("available", "Ja, sinnvoll nutzbar", 0, "vorhandene Stehhilfe", "Entlastung ist im Arbeitsablauf realistisch nutzbar."),
      option("limited", "Eher eingeschränkt", 2, "eingeschränkte Stehhilfe", "Entlastung ist nur punktuell möglich."),
      option("missing", "Nein", 4, "fehlende Stehhilfe", "Es gibt keine praktikable Entlastungsoption."),
    ],
  },
];

const repetitiveQuestions: DecisionQuestion[] = [
  {
    id: "repeatRate",
    activityIds: ["repetitive"],
    category: "frequency",
    label: "Wie hoch ist die Wiederholfrequenz?",
    hint: "Kurze Taktfolgen erhöhen die lokale Beanspruchung stark.",
    relevance: "Hohe Wiederholrate spricht für organisatorische Entzerrung und Werkzeugoptimierung.",
    options: [
      option("moderate", "Moderat", 1, "moderate Wiederholfrequenz", "Die Bewegungen wiederholen sich, aber nicht in hoher Dichte."),
      option("high", "Hoch", 3, "hohe Wiederholfrequenz", "Die Tätigkeit verlangt viele gleiche Bewegungen."),
      option("extreme", "Sehr hoch oder nahezu ohne Unterbrechung", 4, "extreme Wiederholfrequenz", "Die Aufgabe läuft im engen Takt ohne echte Entlastung."),
    ],
  },
  {
    id: "forceLevel",
    activityIds: ["repetitive"],
    category: "force",
    label: "Wie viel Kraft ist pro Bewegung nötig?",
    hint: "Kraft plus Wiederholung ist besonders kritisch für Handgelenke und Unterarme.",
    relevance: "Kraftvolle Bewegungen erhöhen den Bedarf an ergonomischen Werkzeugen.",
    options: [
      option("light", "Leicht", 0, "geringer Kraftaufwand", "Die Bewegung ist überwiegend feinmotorisch."),
      option("noticeable", "Spürbar", 2, "spürbarer Kraftaufwand", "Die Tätigkeit erfordert wiederholt merkliche Kraft."),
      option("high", "Deutlich kraftvoll", 4, "hoher Kraftaufwand", "Jede Wiederholung bringt eine hohe lokale Beanspruchung."),
    ],
  },
  {
    id: "linePace",
    activityIds: ["repetitive"],
    category: "pace",
    label: "Wie stark ist die Tätigkeit an Takt oder Linie gebunden?",
    hint: "Taktbindung reduziert individuelle Ausgleichsmöglichkeiten.",
    relevance: "Hohe Taktbindung spricht für Job-Rotation und organisatorische Maßnahmen.",
    options: [
      option("flexible", "Flexibel", 0, "geringe Taktbindung", "Das Tempo ist anpassbar."),
      option("guided", "Teilweise vorgegeben", 2, "teilweise Taktbindung", "Das Tempo ist spürbar vorstrukturiert."),
      option("rigid", "Streng taktgebunden", 3, "starke Taktbindung", "Der Ablauf lässt kaum Puffer zu."),
    ],
  },
  {
    id: "microBreaks",
    activityIds: ["repetitive"],
    category: "recovery",
    label: "Sind Mikropausen oder Wechselaufgaben eingeplant?",
    hint: "Kurze Erholungsfenster sind bei repetitiver Arbeit besonders wirksam.",
    relevance: "Fehlende Entlastung verstärkt den Bedarf an organisatorischem Ausgleich.",
    options: [
      option("good", "Ja, zuverlässig", 0, "vorhandene Mikropausen", "Erholung ist fest eingeplant."),
      option("limited", "Teilweise", 2, "eingeschränkte Mikropausen", "Pausen sind nicht durchgängig gesichert."),
      option("missing", "Nein", 4, "fehlende Mikropausen", "Es gibt kaum echte Erholungsfenster."),
    ],
  },
];

const postureQuestions: DecisionQuestion[] = [
  {
    id: "postureDuration",
    activityIds: ["awkward", "bending"],
    category: "duration",
    label: "Wie lange bleibt die belastende Haltung bestehen?",
    hint: "Haltungsdauer ist ein zentraler Risikotreiber bei Vorbeugen und Zwangshaltung.",
    relevance: "Lange Haltungsbindung spricht für Umbau und Assistenz.",
    options: [
      option("brief", "Kurzzeitig", 1, "kurze Haltungsbindung", "Die Haltung wird nur kurz eingenommen."),
      option("recurring", "Regelmäßig wiederkehrend", 3, "wiederkehrende Haltungsbindung", "Die Haltung tritt häufig im Tagesverlauf auf."),
      option("sustained", "Lange oder dauerhaft", 4, "lange Haltungsbindung", "Die ungünstige Haltung prägt wesentliche Arbeitsanteile."),
    ],
  },
  {
    id: "avoidablePosture",
    activityIds: ["awkward", "bending"],
    category: "posture",
    label: "Wie vermeidbar ist die belastende Haltung?",
    hint: "Vermeidbarkeit zeigt, ob eher Verhalten oder eher Arbeitsplatzstruktur ursächlich ist.",
    relevance: "Schlecht vermeidbare Haltungen sprechen für strukturelle Arbeitsplatzanpassungen.",
    options: [
      option("avoidable", "Gut vermeidbar", 0, "gut vermeidbare Haltung", "Die Haltung kann meist angepasst werden."),
      option("partial", "Teilweise vermeidbar", 2, "teilweise vermeidbare Haltung", "Anpassungen sind nur eingeschränkt möglich."),
      option("fixed", "Kaum vermeidbar", 4, "schlecht vermeidbare Haltung", "Die Haltung ist durch Aufbau oder Ablauf fest vorgegeben."),
    ],
  },
  {
    id: "movementSpace",
    activityIds: ["awkward", "bending"],
    category: "environment",
    label: "Wie viel Bewegungsspielraum ist vorhanden?",
    hint: "Enge Räume erhöhen die Zwangshaltung und erschweren Ausgleichsbewegungen.",
    relevance: "Wenig Spielraum erhöht den Nutzen von Umbau oder Positionierhilfen.",
    options: [
      option("open", "Ausreichend", 0, "guter Bewegungsspielraum", "Es gibt genug Raum für ergonomische Bewegungen."),
      option("limited", "Eingeschränkt", 2, "eingeschränkter Bewegungsspielraum", "Der Raum begrenzt ergonomische Ausweichbewegungen."),
      option("tight", "Sehr eng", 3, "enger Bewegungsspielraum", "Die Haltung wird räumlich stark erzwungen."),
    ],
  },
  {
    id: "supportSetup",
    activityIds: ["awkward", "bending"],
    category: "support",
    label: "Gibt es verstellbare oder unterstützende Arbeitsplatzlösungen?",
    hint: "Verstellbarkeit reduziert den Bedarf, sich an den Arbeitsplatz anzupassen.",
    relevance: "Fehlende Verstellbarkeit ist ein zentraler Treiber für Ergonomieberatung.",
    options: [
      option("good", "Ja, gut nutzbar", 0, "vorhandene Arbeitsplatzanpassung", "Der Arbeitsplatz lässt sich sinnvoll anpassen."),
      option("partial", "Teilweise", 2, "teilweise Arbeitsplatzanpassung", "Anpassungen sind nur begrenzt vorhanden."),
      option("missing", "Nein", 4, "fehlende Arbeitsplatzanpassung", "Es fehlen wirksame Anpass- oder Positionierhilfen."),
    ],
  },
];

const pushingQuestions: DecisionQuestion[] = [
  {
    id: "pushForce",
    activityIds: ["pushing"],
    category: "force",
    label: "Wie hoch ist die nötige Schub- oder Zugkraft?",
    hint: "Kraftbedarf zeigt, ob Wagen, Rollen oder Beladung problematisch sind.",
    relevance: "Hohe Kräfte sprechen für Hilfsmittel und Materialflussoptimierung.",
    options: [
      option("light", "Gering", 0, "geringe Schubkraft", "Bewegungen gelingen ohne hohe Kraftspitzen."),
      option("medium", "Spürbar", 2, "mittlere Schubkraft", "Es braucht regelmäßig Kraft für den Transport."),
      option("high", "Deutlich hoch", 4, "hohe Schubkraft", "Transportbewegungen erfordern hohe Kräfte."),
    ],
  },
  {
    id: "transportDistance",
    activityIds: ["pushing"],
    category: "distance",
    label: "Welche Distanzen werden transportiert?",
    hint: "Lange Wege erhöhen die kumulative Belastung auch bei moderater Kraft.",
    relevance: "Distanz zeigt, ob Wegeführung oder Übergabepunkte optimiert werden sollten.",
    options: [
      option("short", "Kurz", 0, "kurze Transportdistanz", "Die Wege bleiben überschaubar."),
      option("medium", "Mehrere Stationen", 2, "mittlere Transportdistanz", "Der Transport umfasst spürbare Wege."),
      option("long", "Lange oder häufige Wege", 3, "lange Transportdistanz", "Transportwege sind ein eigener Belastungsfaktor."),
    ],
  },
  {
    id: "routeCondition",
    activityIds: ["pushing"],
    category: "environment",
    label: "Wie gut rollt oder führt die Transportstrecke?",
    hint: "Boden, Schwellen und Kurven bestimmen den realen Kraftbedarf stark mit.",
    relevance: "Schlechte Strecken sprechen für Umbau oder geeignetere Transportmittel.",
    options: [
      option("good", "Gut rollbar", 0, "gute Transportstrecke", "Die Strecke unterstützt einen flüssigen Transport."),
      option("mixed", "Teilweise erschwert", 2, "teilweise erschwerte Transportstrecke", "Einzelne Abschnitte erhöhen den Kraftaufwand."),
      option("poor", "Häufig schwergängig", 4, "schlechte Transportstrecke", "Strecke und Rollwiderstand treiben die Belastung deutlich."),
    ],
  },
];

const focusRegionQuestion: DecisionQuestion = {
  id: "focusRegion",
  activityIds: ["lifting", "overhead", "standing", "bending", "repetitive", "pushing", "awkward"],
  category: "region",
  label: "Welche Körperregion ist aktuell der deutlichste Belastungsschwerpunkt?",
  hint: "Diese Angabe schärft das Belastungsprofil und das Technologie-Matching.",
  relevance: "Die stärkste Körperregion priorisiert die spätere Technik- und Beratungslogik.",
  options: bodyRegions.map((region) => ({
    value: region.id,
    label: region.label,
    score: 0,
    contributionLabel: `Schwerpunkt ${region.label}`,
    explanation: `Die Region ${region.label} wird als Hauptbelastung wahrgenommen.`,
  })),
};

export const questionCatalog: DecisionQuestion[] = [
  ...liftingQuestions,
  ...overheadQuestions,
  ...standingQuestions,
  ...repetitiveQuestions,
  ...postureQuestions,
  ...pushingQuestions,
  focusRegionQuestion,
];

const technologies = {
  backExo: {
    id: "back-exoskeleton",
    label: "Rücken-Exoskelett",
    category: "Assistenzsystem",
    rationale: "Unterstützt wiederkehrende Hebe- oder Vorbeugebelastung im Rumpfbereich.",
  },
  shoulderSupport: {
    id: "shoulder-support",
    label: "Schulter-/Arm-Unterstützung",
    category: "Assistenzsystem",
    rationale: "Entlastet Überkopf-Arbeit und lange Haltephasen oberhalb der Schulterhöhe.",
  },
  liftAid: {
    id: "lift-aid",
    label: "Hebehilfe",
    category: "Handling-Technik",
    rationale: "Reduziert Lastspitzen und manuelle Hebeanteile bei schweren Gütern.",
  },
  balancer: {
    id: "tool-balancer",
    label: "Werkzeugbalancer",
    category: "Werkzeugassistenz",
    rationale: "Fängt Werkzeuggewicht ab und reduziert statische Haltearbeit.",
  },
  ergonomicTools: {
    id: "ergonomic-tools",
    label: "Ergonomische Werkzeuge",
    category: "Werkzeugergonomie",
    rationale: "Reduziert lokalen Kraftaufwand und verbessert Hand- und Griffhaltung bei repetitiver Arbeit.",
  },
  standingAid: {
    id: "standing-aid",
    label: "Stehhilfe",
    category: "Arbeitsplatzassistenz",
    rationale: "Schafft Entlastung bei langen Stehphasen und reduziert Ermüdung.",
  },
  workstation: {
    id: "workstation-redesign",
    label: "Arbeitsplatzumbau",
    category: "Arbeitsplatzgestaltung",
    rationale: "Verändert Greifräume, Höhen und Bewegungsfreiheit strukturell.",
  },
  organization: {
    id: "organizational-measure",
    label: "Organisatorische Maßnahme",
    category: "Organisation",
    rationale: "Entzerrt Belastung durch Ablaufanpassung, Wechselaufgaben oder Rotation.",
  },
  coaching: {
    id: "ergonomics-coaching",
    label: "Schulung / Ergonomie-Coaching",
    category: "Befähigung",
    rationale: "Verankert sicheres Handling, richtige Nutzung von Hilfsmitteln und Belastungsbewusstsein.",
  },
  fieldEval: {
    id: "onsite-evaluation",
    label: "Testtag / Vor-Ort-Evaluation",
    category: "Validierung",
    rationale: "Prüft Technologien und Arbeitsplatzanpassungen direkt im realen Prozess.",
  },
};

const genericProfile: RecommendationProfile = {
  title: "Gemischtes Belastungsprofil mit mehreren Einflussfaktoren",
  primaryStrain: "Mehrere Belastungstreiber wirken gleichzeitig auf die Tätigkeit ein.",
  strainDrivers: [
    "Belastung verteilt sich auf mehrere Einflussfaktoren",
    "Entlastung ist nur teilweise vorhanden",
    "Arbeitsplatz und Ablauf sollten gemeinsam geprüft werden",
  ],
  summary:
    "Das Profil zeigt Optimierungspotenzial in Technik, Organisation und Ergonomie. Eine Vor-Ort-Betrachtung hilft, die wirksamste Maßnahme zu priorisieren.",
  technologies: [technologies.workstation, technologies.organization, technologies.fieldEval],
  advisory:
    "Sinnvoll ist ein strukturiertes Belastungsgespräch mit Arbeitsplatzsichtung, damit Technik und Organisation gemeinsam bewertet werden.",
  nextStep: "Einen kurzen Diagnose-Workshop oder Testtag für den betroffenen Bereich planen.",
  immediate: {
    title: "Sofortmaßnahme",
    items: ["Belastungsspitzen im Ablauf sichtbar machen", "Kurzfristige Entlastungsfenster oder Wechselaufgaben einplanen"],
  },
  technical: {
    title: "Technische Lösung",
    items: ["Arbeitsplatz gezielt nachrüsten", "Passende Assistenzsysteme im Alltag testen"],
  },
  strategic: {
    title: "Strategische Beratungsempfehlung",
    items: ["Pilotbereich auswählen", "Maßnahmen wirtschaftlich und ergonomisch priorisieren"],
  },
};

export const matchingRules: MatchingRule[] = [
  {
    id: "lifting-back-intensive",
    priority: 95,
    activities: ["lifting"],
    regions: ["back", "knees"],
    regionMatchMode: "any",
    minScore: 12,
    answerFilters: {
      loadWeight: ["heavy", "medium"],
      liftFrequency: ["intense", "regular"],
    },
    profile: {
      title: "Manuelle Hebebelastung mit hohem Rückenanteil",
      primaryStrain: "Wiederkehrendes Heben und Tragen erzeugt eine hohe Belastung im Rücken- und Unterkörperbereich.",
      strainDrivers: [
        "Hohes Lastgewicht oder häufige Hebevorgänge",
        "Tragewege verstärken die kumulative Belastung",
        "Hilfsmittel sind nur teilweise vorhanden oder fehlen",
      ],
      summary:
        "Die Diagnose spricht für eine technische Entlastung direkt am Handling-Prozess. Besonders wirksam sind Hebehilfe, Rückenunterstützung und eine Materialflussanalyse.",
      technologies: [technologies.liftAid, technologies.backExo, technologies.fieldEval],
      advisory:
        "Das Profil deutet darauf hin, dass Technik und Materialfluss gemeinsam optimiert werden sollten, bevor reine Verhaltenshinweise gegeben werden.",
      nextStep: "Hebehilfe oder Rückenunterstützung in einem Testtag am realen Arbeitsplatz vergleichen.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Lasten nach Möglichkeit aufteilen", "Zweipersonenhandling für Spitzenlasten prüfen"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Hebehilfe einsetzen", "Rücken-Exoskelett in der Praxis evaluieren"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Materialflussanalyse durchführen", "Investitionspfad für Handling-Technik definieren"],
      },
    },
  },
  {
    id: "overhead-shoulder-static",
    priority: 92,
    activities: ["overhead"],
    regions: ["shoulders", "neck"],
    regionMatchMode: "any",
    minScore: 11,
    answerFilters: {
      overheadDuration: ["recurring", "sustained"],
      armSupport: ["partial", "unsupported"],
    },
    profile: {
      title: "Überkopf-Belastung mit Schulter- und Nackenfokus",
      primaryStrain: "Überkopfarbeit erzeugt eine statische Schulter- und Nackenbelastung mit hohem Halteanteil.",
      strainDrivers: [
        "Lange Phasen oberhalb der Schulterhöhe",
        "Werkzeuggewicht verstärkt die Haltearbeit",
        "Fehlende Arm- oder Werkzeugunterstützung",
      ],
      summary:
        "Das Muster spricht für eine direkte Entlastung von Armen und Werkzeugen. Unterstützende Systeme bringen hier meist schneller Wirkung als reine Verhaltensappelle.",
      technologies: [technologies.shoulderSupport, technologies.balancer, technologies.fieldEval],
      advisory:
        "Sinnvoll ist eine Bewertung von Werkzeuggewicht, Montagelogik und erreichbarer Arbeitshöhe in einem gemeinsamen Termin mit dem Fachbereich.",
      nextStep: "Schulterunterstützung und Werkzeugbalancer direkt im Prozess testen.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Überkopf-Anteile zeitlich entzerren", "Entlastungsphasen und Wechselaufgaben gezielt einbauen"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Schulter-/Arm-Unterstützung testen", "Werkzeugbalancer oder Abstützung ergänzen"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Arbeitsplatzhöhenanalyse durchführen", "Montagelogik für Überkopf-Arbeit überarbeiten"],
      },
    },
  },
  {
    id: "standing-fatigue-profile",
    priority: 86,
    activities: ["standing"],
    regions: ["legsFeet", "knees"],
    regionMatchMode: "any",
    minScore: 9,
    answerFilters: {
      standingDuration: ["mostly", "constant"],
    },
    profile: {
      title: "Stehbelastung mit Ermüdungsfokus in Beinen und Füßen",
      primaryStrain: "Lange Standzeiten bei geringer Entlastung führen zu Ermüdung und lokaler Unterkörperbelastung.",
      strainDrivers: [
        "Lange oder durchgehende Stehphasen",
        "Zu wenig Haltungs- und Bewegungswechsel",
        "Fehlende Stehhilfe oder ungünstiger Untergrund",
      ],
      summary:
        "Die Diagnose spricht für eine Kombination aus Arbeitsplatzentlastung und Organisationsmaßnahmen. Kleine physische Entlastungen können hier schnell spürbar wirken.",
      technologies: [technologies.standingAid, technologies.workstation, technologies.organization],
      advisory:
        "Hier lohnt sich eine kurze Arbeitsplatzanalyse mit Blick auf Untergrund, Bewegungswechsel und real nutzbare Entlastungsoptionen.",
      nextStep: "Stehhilfe und ergonomische Bodengestaltung in einem Pilotbereich testen.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Bewegungswechsel sichtbar im Ablauf verankern", "Kurzpausen oder Wechselpositionen definieren"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Stehhilfe oder Anlehnstütze prüfen", "Untergrund mit Anti-Ermüdungsmatten verbessern"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Arbeitsplatzumbau bewerten", "Linien- oder Stationsgestaltung auf Entlastung prüfen"],
      },
    },
  },
  {
    id: "repetitive-hand-profile",
    priority: 90,
    activities: ["repetitive"],
    regions: ["wrists", "shoulders"],
    regionMatchMode: "any",
    minScore: 11,
    answerFilters: {
      repeatRate: ["high", "extreme"],
      microBreaks: ["limited", "missing"],
    },
    profile: {
      title: "Repetitive Belastung mit Fokus auf Handgelenke und Unterarme",
      primaryStrain: "Hohe Wiederholrate, Kraftaufwand und Taktbindung treiben die lokale Belastung in Armen und Händen.",
      strainDrivers: [
        "Hohe Wiederholfrequenz",
        "Kraftvolle Einzelbewegungen",
        "Fehlende Mikropausen oder starre Taktung",
      ],
      summary:
        "Das Profil spricht für ergonomische Werkzeuge, organisatorische Entzerrung und gezielte Coaching-Maßnahmen im Ablauf.",
      technologies: [technologies.ergonomicTools, technologies.organization, technologies.coaching],
      advisory:
        "Sinnvoll ist eine Kombination aus Tooling-Check, Job-Rotation und kurzer Ergonomiequalifizierung im betroffenen Bereich.",
      nextStep: "Werkzeuge, Taktung und Rotationskonzept gemeinsam in einer Vor-Ort-Evaluation prüfen.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Mikropausen definieren", "Wechselaufgaben oder Handwechsel fördern"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Ergonomische Werkzeuge und Greifhilfen prüfen", "Taktrelevante Arbeitsschritte entlasten"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Job-Rotation strukturieren", "Ergonomie-Coaching mit Teamleitern abstimmen"],
      },
    },
  },
  {
    id: "awkward-posture-profile",
    priority: 88,
    activities: ["awkward", "bending"],
    regions: ["back", "neck", "shoulders"],
    regionMatchMode: "any",
    minScore: 10,
    answerFilters: {
      postureDuration: ["recurring", "sustained"],
      supportSetup: ["partial", "missing"],
    },
    profile: {
      title: "Zwangshaltungsprofil mit strukturellem Anpassungsbedarf",
      primaryStrain: "Ungünstige Arbeitszonen und eingeschränkter Bewegungsspielraum erzeugen ein Haltungsrisiko im Rücken- und Nackenbereich.",
      strainDrivers: [
        "Lange oder wiederkehrende Haltungsbindung",
        "Geringe Vermeidbarkeit der Haltung",
        "Fehlende Verstellbarkeit oder Positionierhilfen",
      ],
      summary:
        "Das Profil zeigt vor allem strukturellen Verbesserungsbedarf. Arbeitsplatzumbau und ergonomische Beratung sind hier meist der wirksamste Hebel.",
      technologies: [technologies.workstation, technologies.backExo, technologies.coaching],
      advisory:
        "Die Aufgabe sollte vor Ort mit Blick auf Greifzonen, Höhen und Bewegungsräume analysiert werden, bevor Einzelmaßnahmen priorisiert werden.",
      nextStep: "Ergonomie-Review am Arbeitsplatz mit Fokus auf Greifraum und Verstellbarkeit durchführen.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Greif- und Arbeitszonen neu ordnen", "Belastende Haltungsphasen verkürzen"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Arbeitsplatzumbau oder Höhenverstellung prüfen", "Positionier- und Kipphilfen ergänzen"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Vor-Ort-Ergonomieberatung durchführen", "Arbeitsplatzlayout systematisch überarbeiten"],
      },
    },
  },
  {
    id: "pushing-transport-profile",
    priority: 82,
    activities: ["pushing"],
    regions: ["back", "shoulders", "knees"],
    regionMatchMode: "any",
    minScore: 9,
    answerFilters: {
      pushForce: ["medium", "high"],
      routeCondition: ["mixed", "poor"],
    },
    profile: {
      title: "Transportbelastung durch Ziehen und Schieben",
      primaryStrain: "Kraftvolle Transportbewegungen belasten Rücken, Schultern und Unterkörper vor allem über Strecke und Rollwiderstand.",
      strainDrivers: [
        "Hohe Schub- oder Zugkraft",
        "Lange Transportdistanz",
        "Schlechte oder widerständige Transportstrecke",
      ],
      summary:
        "Hier sollte nicht nur das Verhalten, sondern vor allem der Transportprozess überprüft werden. Technik und Streckenqualität sind die wichtigsten Hebel.",
      technologies: [technologies.liftAid, technologies.workstation, technologies.fieldEval],
      advisory:
        "Sinnvoll ist eine Materialfluss- und Transportmittelbewertung mit Fokus auf Rollen, Wegeführung und Beladung.",
      nextStep: "Transportmittel und Streckenführung in einer Vor-Ort-Evaluation gemeinsam bewerten.",
      immediate: {
        title: "Sofortmaßnahme",
        items: ["Beladung reduzieren oder aufteilen", "Schlechte Transportabschnitte kurzfristig markieren und vermeiden"],
      },
      technical: {
        title: "Technische Lösung",
        items: ["Geeignete Transport- oder Hebehilfen prüfen", "Rollen, Griffe und Wagenkonzept verbessern"],
      },
      strategic: {
        title: "Strategische Beratungsempfehlung",
        items: ["Transportprozess analysieren", "Materialfluss gemeinsam mit Ergonomie bewerten"],
      },
    },
  },
];

export const fallbackProfile = genericProfile;

export const getActivityById = (activityId: ActivityId | null) =>
  activities.find((activity) => activity.id === activityId) ?? null;

export const getRegionById = (regionId: RegionId) =>
  bodyRegions.find((region) => region.id === regionId);

export const getQuestionsForActivity = (activityId: ActivityId | null): DecisionQuestion[] => {
  if (!activityId) {
    return [];
  }

  return questionCatalog.filter((question) => question.activityIds.includes(activityId));
};
