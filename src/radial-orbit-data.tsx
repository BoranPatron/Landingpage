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
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

export const radialOrbitData: RadialOrbitItem[] = [
  {
    id: 2,
    title: "Angebotserstellung",
    date: "2024",
    content: "Digitale Angebote erstellen und einreichen in wenigen Klicks. Direkte Kommunikation mit Bauträgern für schnelle Entscheidungen.",
    category: "Angebote",
    icon: FileText,
    relatedIds: [5, 7],
    status: "completed",
    energy: 90
  },
  {
    id: 3,
    title: "Kollaboration",
    date: "2024",
    content: "Nahtlose Zusammenarbeit zwischen Bauträgern und Dienstleistern. Gemeinsame Projekträume für Dokumente, Aufgaben und Kommunikation.",
    category: "Kollaboration",
    icon: Users,
    relatedIds: [6, 9],
    status: "completed",
    energy: 85
  },
  {
    id: 5,
    title: "Qualitätsprüfung",
    date: "2024",
    content: "Verifizierte Dienstleister mit geprüften Referenzen. Bewertungssysteme und Qualitätskontrolle für vertrauensvolle Zusammenarbeit.",
    category: "Qualität",
    icon: Shield,
    relatedIds: [10, 11],
    status: "completed",
    energy: 92
  },
  {
    id: 6,
    title: "Projektmanagement",
    date: "2024",
    content: "Umfassendes Projektmanagement für alle Gewerke. Von der Planung bis zur Abnahme - alles digital und transparent verwaltet.",
    category: "Management",
    icon: Briefcase,
    relatedIds: [3, 9, 12],
    status: "completed",
    energy: 87
  },
  {
    id: 7,
    title: "Netzwerk-Aufbau",
    date: "2024",
    content: "Erweitern Sie Ihr Netzwerk mit qualifizierten Partnern. Langfristige Geschäftsbeziehungen durch erfolgreiche Projektzusammenarbeit.",
    category: "Netzwerk",
    icon: Network,
    relatedIds: [2, 11],
    status: "completed",
    energy: 80
  },
  {
    id: 9,
    title: "Dokumentenmanagement",
    date: "2024",
    content: "Zentrales Dokumentenmanagement für alle Projektunterlagen. Automatische Versionierung, Zugriffskontrolle und Compliance.",
    category: "Dokumente",
    icon: FileText,
    relatedIds: [3, 6, 12],
    status: "completed",
    energy: 89
  },
  {
    id: 10,
    title: "Transparenz & Tracking",
    date: "2024",
    content: "Vollständige Transparenz über Projektstatus, Budget und Termine. Echtzeit-Tracking für alle Beteiligten.",
    category: "Tracking",
    icon: BarChart3,
    relatedIds: [5, 6, 11],
    status: "completed",
    energy: 86
  },
  {
    id: 11,
    title: "Vertrauensaufbau",
    date: "2024",
    content: "Bewertungssysteme und Referenzen schaffen Vertrauen. Erfolgreiche Partnerschaften durch Transparenz und Qualität.",
    category: "Vertrauen",
    icon: Handshake,
    relatedIds: [5, 7, 10],
    status: "completed",
    energy: 91
  },
  {
    id: 12,
    title: "Projekterfolg",
    date: "2024",
    content: "Gemeinsam Projekte erfolgreich abschließen. Von der Planung bis zur Abnahme - alle Schritte nahtlos koordiniert.",
    category: "Erfolg",
    icon: CheckCircle,
    relatedIds: [6, 9, 11],
    status: "completed",
    energy: 94
  }
];

