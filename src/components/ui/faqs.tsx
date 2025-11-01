import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  faqsLeft: FAQItem[];
  faqsRight: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = "Häufig gestellte Fragen",
  subtitle = "FAQ",
  description = "Alles was Sie über BuildWise wissen müssen",
  buttonLabel = "Alle FAQs durchsuchen →",
  onButtonClick,
  faqsLeft,
  faqsRight,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn("w-full max-w-5xl mx-auto py-16 px-4", className)}>
      {/* Header */}
      <div className="text-center mb-10">
        <p 
          className="text-sm font-medium tracking-wide mb-2"
          style={{ color: 'rgba(249, 199, 79, 0.8)' }}
        >
          {subtitle}
        </p>
        <h2 
          className="text-3xl md:text-4xl font-semibold mb-3"
          style={{ color: '#f7fafc' }}
        >
          {title}
        </h2>
        <p 
          className="max-w-xl mx-auto mb-6"
          style={{ color: 'rgba(230, 235, 239, 0.8)' }}
        >
          {description}
        </p>
      </div>

      {/* FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
          <Accordion
            key={columnIndex}
            type="single"
            collapsible
            className="space-y-4"
          >
            {faqColumn.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${columnIndex}-${i}`}
                className="faq-accordion-item"
              >
                <AccordionTrigger className="faq-accordion-trigger">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="faq-accordion-content">
                  <div className="min-h-[40px] transition-all duration-200 ease-in-out">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}

export default function FAQs() {
  // Remove button from FAQSection by setting buttonLabel to undefined
  const faqsLeft: FAQItem[] = [
    {
      question: "Was ist BuildWise?",
      answer: "BuildWise ist eine umfassende digitale Plattform für die Bauwirtschaft, die Bauträger und Dienstleister vernetzt. Die Plattform bietet Projektmanagement, Ausschreibungsmanagement, Dokumentenverwaltung, Finanzanalyse und Kommunikationstools."
    },
    {
      question: "Welche Rollen gibt es auf BuildWise?",
      answer: "BuildWise unterscheidet zwischen zwei Hauptrollen:\n\n• Bauträger: Vollzugriff auf Projekte, können Ausschreibungen erstellen, Angebote bewerten und das Credit-System nutzen.\n• Dienstleister: Zugriff auf öffentliche Ausschreibungen, können Angebote einreichen, Ressourcen verwalten und Rechnungen erstellen."
    },
    {
      question: "Wie funktioniert das Projektmanagement?",
      answer: "Das Projektmanagement ermöglicht die vollständige Verwaltung von Bauprojekten mit Budget-, Termin- und Statusverfolgung. Sie können:\n\n• Projekte erstellen, bearbeiten und mit Budget und Terminen verwalten\n• Dokumente hochladen und nach Kategorien organisieren\n• Bauphasen verfolgen (länderspezifisch für CH, DE, AT)\n• Aufgaben über ein Kanban-Board verwalten\n• Finanzanalysen und Budget-Tracking durchführen"
    },
    {
      question: "Wie funktionieren Ausschreibungen?",
      answer: "Bauträger erstellen Ausschreibungen (Gewerke) für ihre Projekte. Dienstleister können diese über eine geo-basierte Suche finden und Angebote einreichen.\n\n• Ausschreibungen mit Kategorie-spezifischen Feldern und Terminen erstellen\n• Geo-basierte Suche nach Standort, Kategorie, Budget und Radius\n• Angebote einreichen, vergleichen und bewerten\n• Automatische Auftragsbestätigung und PDF-Generierung"
    }
  ];

  const faqsRight: FAQItem[] = [
    {
      question: "Was ist das Credit-System?",
      answer: "Das Credit-System ist ein Belohnungssystem für Bauträger. Credits können für Angebotsannahmen und Premiumfunktionen verwendet werden. Sie erhalten Credits beim Start und können diese durch verschiedene Aktivitäten auf der Plattform verdienen."
    },
    {
      question: "Wie sicher sind meine Daten?",
      answer: "Sicherheit und Datenschutz haben für BuildWise höchste Priorität:\n\n• Datenhaltung in der EU/Schweiz (DSGVO-konform)\n• Verschlußelte Übertragung und Speicherung\n• Rollenbasierte Zugriffskontrolle\n• Vollständige Audit-Logs für alle Aktivitäten\n• Projektbezogene Berechtigungen"
    },
    {
      question: "Kann ich BuildWise auf dem Mobilgerät nutzen?",
      answer: "Ja, BuildWise ist vollständig für mobile Geräte optimiert:\n\n• Vollständig responsive Oberfläche für alle Bildschirmgrößen\n• Touch-optimierte UI und Swipe-Gesten\n• Lazy Loading und Caching für schnelle Performance\n• Mobile-spezifische Views und Komponenten"
    },
    {
      question: "Wie starte ich mit BuildWise?",
      answer: "Der Einstieg in BuildWise ist einfach:\n\n1. Wählen Sie Ihre Rolle (Bauträger oder Dienstleister)\n2. Geben Sie Ihre Firmenadresse ein\n3. Folgen Sie der Dashboard-Tour\n4. Erhalten Sie Ihre Willkommensnachricht und Start-Credits\n\nNach dem Onboarding können Sie sofort mit der Erstellung von Projekten oder der Suche nach Ausschreibungen beginnen."
    }
  ];

  return <FAQSection faqsLeft={faqsLeft} faqsRight={faqsRight} buttonLabel={undefined} />;
}
