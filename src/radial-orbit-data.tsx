import React from "react";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Briefcase,
  Network,
  BarChart3,
  Shield,
  Handshake
} from "lucide-react";

export interface RadialOrbitItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  relatedIds: number[];
  status: " " | "in-progress" | "pending";
  energy: number;
}

export const radialOrbitData: RadialOrbitItem[] = [
  {
    id: 2,
    title: "E-Mail-Chaos beenden",
    date: "2024",
    content: "Schluss mit 200+ E-Mails pro Projekt. Alle Angebote zentral an einem Ort. Suche in 2 Sekunden statt 30 Minuten. Zeitersparnis: 3h/Woche = 156h/Jahr.",
    category: "Problem",
    icon: FileText,
    relatedIds: [5, 7],
    status: " ",
    energy: 95
  },
  {
    id: 3,
    title: "Dienstleister finden",
    date: "2024",
    content: "Keine stundenlange Suche mehr. Dienstleister finden SIE automatisch über Geo-Suche. Von 5 Stunden auf 0 Stunden reduziert.",
    category: "Zeitersparnis",
    icon: Users,
    relatedIds: [6, 9],
    status: " ",
    energy: 92
  },
  {
    id: 5,
    title: "Budget im Griff",
    date: "2024",
    content: "Schluss mit Excel-Tabellen. Echtzeit Budget-Dashboard zeigt sofort: Haben wir noch Budget? Automatische Warnungen bei Überschreitungen. Ersparnis: 5-10% durch Transparenz.",
    category: "Kostenersparnis",
    icon: BarChart3,
    relatedIds: [10, 11],
    status: " ",
    energy: 94
  },
  {
    id: 6,
    title: "Dokumenten-Suche",
    date: "2024",
    content: "Nie wieder 'Wo war nochmal...?' Automatische Kategorisierung aller Dokumente. Von 2h/Woche Suchen auf 0 Minuten reduziert.",
    category: "Problem",
    icon: Briefcase,
    relatedIds: [3, 9, 12],
    status: " ",
    energy: 90
  },
  {
    id: 7,
    title: "Ausschreibung erstellen",
    date: "2024",
    content: "Von 2 Stunden manuellem Schreiben auf 15 Minuten Formular. Automatische Verteilung an qualifizierte Dienstleister in Ihrer Region.",
    category: "Zeitersparnis",
    icon: Network,
    relatedIds: [2, 11],
    status: " ",
    energy: 93
  },
  {
    id: 9,
    title: "Angebote vergleichen",
    date: "2024",
    content: "Schluss mit Excel-Chaos. Side-by-Side Vergleich aller Angebote. Kostenaufschlüsselung auf einen Blick. Von 2h auf 30 Minuten.",
    category: "Zeitersparnis",
    icon: FileText,
    relatedIds: [3, 6, 12],
    status: " ",
    energy: 91
  },
  {
    id: 10,
    title: "Mehrere Projekte parallel",
    date: "2024",
    content: "5+ Projekte gleichzeitig verwalten ohne Chaos. Projekt-spezifische Dashboards. Schnell zwischen Projekten wechseln. Keine Verwirrung mehr.",
    category: "Problem",
    icon: Shield,
    relatedIds: [5, 6, 11],
    status: " ",
    energy: 89
  },
  {
    id: 11,
    title: "Kostenübersicht",
    date: "2024",
    content: "Nie wieder überrascht von Kosten. Budget vs. Ist-Kosten in Echtzeit. Kostenprognosen für restliche Phasen. Von 2h/Monat auf 5 Minuten.",
    category: "Kostenersparnis",
    icon: Handshake,
    relatedIds: [5, 7, 10],
    status: " ",
    energy: 94
  },
  {
    id: 12,
    title: "Alles an einem Ort",
    date: "2024",
    content: "Keine 5 verschiedenen Tools mehr. Projektmanagement + Ausschreibungen + Dokumente + Budget = eine Plattform. Ein Login für alles.",
    category: "Lösung",
    icon: CheckCircle,
    relatedIds: [6, 9, 11],
    status: " ",
    energy: 96
  }
];

