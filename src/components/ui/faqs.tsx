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
      answer: "BuildWise ist eine umfassende digitale Ausschreibungsplattform für die Bauwirtschaft in der Schweiz, die Bauträger und Dienstleister vernetzt. Die Plattform bietet Projektmanagement, Ausschreibungsmanagement, Dokumentenverwaltung, Finanzanalyse und Kommunikationstools."
    },
    {
      question: "Wie finde ich Bauprojekte in der Schweiz?",
      answer: "Als Dienstleister können Sie auf BuildWise einfach Bauprojekte erhalten und Bauaufträge in der Schweiz finden. Nutzen Sie unsere geo-basierte Suche, um Ausschreibungen nach Standort, Kategorie, Budget und Radius zu filtern. Die Plattform zeigt Ihnen alle verfügbaren Bauausschreibungen in der Schweiz an."
    },
    {
      question: "Wie funktioniert die Ausschreibungsplattform Schweiz?",
      answer: "Unsere Ausschreibungsplattform Schweiz verbindet Bauträger und Dienstleister:\n\n• Bauträger erstellen Ausschreibungen (Gewerke) für ihre Bauprojekte\n• Dienstleister finden Bauprojekte erhalten und Bauaufträge in der Schweiz über geo-basierte Suche\n• Einfaches Angebotsverfahren mit automatischer Bestätigung\n• Digitale Ausschreibungsplattform für moderne Bauprozesse in der Schweiz"
    },
    {
      question: "Wie funktionieren Ausschreibungen?",
      answer: "Bauträger erstellen Ausschreibungen (Gewerke) für ihre Projekte. Dienstleister können diese über eine geo-basierte Suche finden und Angebote einreichen.\n\n• Ausschreibungen mit Kategorie-spezifischen Feldern und Terminen erstellen\n• Geo-basierte Suche nach Standort, Kategorie, Budget und Radius\n• Angebote einreichen, vergleichen und bewerten\n• Automatische Auftragsbestätigung und PDF-Generierung"
    }
  ];

  const faqsRight: FAQItem[] = [
    {
      question: "Wie kann ich Bauaufträge in der Schweiz finden?",
      answer: "Mit BuildWise finden Sie Bauaufträge in der Schweiz einfach und schnell:\n\n• Registrieren Sie sich als Dienstleister auf unserer Ausschreibungsplattform Schweiz\n• Nutzen Sie die geo-basierte Suche nach Bauausschreibungen\n• Filtern Sie nach Standort, Gewerke und Budget\n• Reichen Sie Angebote direkt über die Plattform ein\n• Bauprojekte erhalten war noch nie so einfach!"
    },
    {
      question: "Was ist das Credit-System?",
      answer: "Das Credit-System ist ein Belohnungssystem für Bauträger. Credits können für Angebotsannahmen und Premiumfunktionen verwendet werden. Sie erhalten Credits beim Start und können diese durch verschiedene Aktivitäten auf der Plattform verdienen."
    },
    {
      question: "Wie sicher sind meine Daten?",
      answer: "Sicherheit und Datenschutz haben für BuildWise höchste Priorität:\n\n• Datenhaltung in der EU/Schweiz (DSGVO-konform)\n• Verschlußelte Übertragung und Speicherung\n• Rollenbasierte Zugriffskontrolle\n• Vollständige Audit-Logs für alle Aktivitäten\n• Projektbezogene Berechtigungen"
    },
    {
      question: "Wie starte ich mit der Ausschreibungsplattform Schweiz?",
      answer: "Der Einstieg in BuildWise als Ausschreibungsplattform Schweiz ist einfach:\n\n1. Wählen Sie Ihre Rolle (Bauträger oder Dienstleister)\n2. Geben Sie Ihre Firmenadresse in der Schweiz ein\n3. Folgen Sie der Dashboard-Tour\n4. Erhalten Sie Ihre Willkommensnachricht und Start-Credits\n\nNach dem Onboarding können Sie sofort Bauprojekte erhalten, Bauaufträge finden oder Ausschreibungen erstellen."
    }
  ];

  return <FAQSection faqsLeft={faqsLeft} faqsRight={faqsRight} buttonLabel={undefined} />;
}
