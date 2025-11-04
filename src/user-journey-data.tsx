import { Role } from "./timeline-entry";

export interface UserJourneyFeature {
  step: string;
  title: string;
  content: string;
  image: string;
}

export const bautraegerUserJourneyData: UserJourneyFeature[] = [
  {
    step: "Dashboard",
    title: "Ihr Dashboard",
    content: "Behalten Sie den Überblick über alle wichtigen Aspekte Ihrer Bauprojekte. Verwalten Sie Projekte effizient mit einem zentralen Dashboard, das alle wichtigen Informationen auf einen Blick zeigt.",
    image: "/assets/BT_Projektübersicht.png",
  },
  {
    step: "Ausschreibungen",
    title: "Ausschreibungen verwalten",
    content: "Erstellen und verwalten Sie Ausschreibungen mühelos. Von der Erstellung bis zur Annahme von Angeboten – alles an einem Ort. Übersichtliche Darstellung von offenen und angenommenen Ausschreibungen.",
    image: "/assets/BT_ausschreibunge.png",
  },
  {
    step: "Finanzen",
    title: "Finanzen im Blick",
    content: "Vollständige Kostenkontrolle nach Kategorien. Analysieren Sie Ihre Ausgaben mit detaillierten Finanzübersichten und behalten Sie Ihr Budget im Griff.",
    image: "/assets/BT_finance.png",
  },
  {
    step: "Terminkalender",
    title: "Termine planen",
    content: "Verwalten Sie alle wichtigen Termine und Besichtigungen in einem zentralen Kalender. Nie mehr verpasste Termine – alles optimal koordiniert.",
    image: "/assets/BT_Terminkalender.png",
  },
  {
    step: "Benachrichtigungen",
    title: "Immer informiert",
    content: "Erhalten Sie Echtzeit-Benachrichtigungen über neue Angebote, wichtige Updates und Termine. Bleiben Sie immer auf dem neuesten Stand.",
    image: "/assets/benachrichtigungen.png",
  },
  {
    step: "Dokumente",
    title: "Dokumente organisieren",
    content: "Zentrales Dokumentenmanagement für alle Projektunterlagen. Organisieren Sie Ausschreibungen, Angebote und Dokumentationen übersichtlich.",
    image: "/assets/Doc_Lasche.png",
  },
  {
    step: "Aufgaben",
    title: "Aufgaben verwalten",
    content: "Verwalten Sie Aufgaben im Kanban-Board. Von der Erstellung bis zur Fertigstellung – behalten Sie alle Aufgaben im Überblick.",
    image: "/assets/kanban.png",
  },
];

export const dienstleisterUserJourneyData: UserJourneyFeature[] = [
  {
    step: "Geo-Suche",
    title: "Ausschreibungen finden",
    content: "Finden Sie passende Ausschreibungen in Ihrer Nähe. Geo-basierte Suche mit Radius-Filter für optimale Standort-Matching. Entdecken Sie neue Projekte in Ihrer Region.",
    image: "/assets/DL_GeoSearch.png",
  },
  {
    step: "Ressourcen",
    title: "Ressourcen verwalten",
    content: "Verwalten Sie Ihr Personal und Ihre Kapazitäten effizient. Planen Sie Ressourcen optimal und teilen Sie Verfügbarkeiten mit Bauträgern für bessere Projektchancen.",
    image: "/assets/DL_ressourcen.png",
  },
  {
    step: "Ressourcen-Kalender",
    title: "Kapazität planen",
    content: "Kalenderansicht für optimale Ressourcenplanung. Sehen Sie auf einen Blick, welche Mitarbeiter wann verfügbar sind und planen Sie Projekte entsprechend.",
    image: "/assets/DL_ressourcen_calender.png",
  },
  {
    step: "Benachrichtigungen",
    title: "Immer informiert",
    content: "Erhalten Sie Echtzeit-Benachrichtigungen über neue Ausschreibungen, Angebotsannahmen und wichtige Updates. Bleiben Sie immer auf dem neuesten Stand.",
    image: "/assets/benachrichtigungen.png",
  },
  {
    step: "Dokumente",
    title: "Dokumente organisieren",
    content: "Zentrales Dokumentenmanagement für alle Projektunterlagen. Organisieren Sie Ausschreibungen, Angebote und Dokumentationen übersichtlich.",
    image: "/assets/Doc_Lasche.png",
  },
  {
    step: "Aufgaben",
    title: "Aufgaben verwalten",
    content: "Verwalten Sie Aufgaben im Kanban-Board. Von der Erstellung bis zur Fertigstellung – behalten Sie alle Aufgaben im Überblick.",
    image: "/assets/kanban.png",
  },
];

