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
      question: "Ich habe keine Zeit, ein neues Tool zu lernen",
      answer: "BuildWise Setup: 15 Minuten\nZeitersparnis ab erstem Projekt: 11 Stunden\n\nNach 15 Minuten haben Sie schon 10h 45min gespart.\n\nROI: sofort"
    },
    {
      question: "Woher weiß ich, dass es wirklich funktioniert?",
      answer: "Erstes Projekt 100% kostenlos testen\nKostenlose Submissionen\nJederzeit kündbar\n\nWenn es nicht funktioniert, haben Sie nur 15 Min investiert.\nWenn es funktioniert, sparen Sie 880 CHF pro Projekt.\n\nRisk/Reward: asymmetrisch zu Ihren Gunsten"
    },
    {
      question: "Was, wenn ich keine Dienstleister finde?",
      answer: "Dann zahlen Sie: 0 CHF\n\nUnsere Gebühr: Nur bei Erfolg (4.7%)\nKein Erfolg = Keine Kosten\n\nSie haben nichts zu verlieren."
    },
    {
      question: "Sind die Dienstleister qualifiziert?",
      answer: "Alle Dienstleister:\n✓ Verifiziert (Firmendaten, Lizenzen)\n✓ Bewertungssystem (nach jedem Projekt)\n✓ Referenzen sichtbar\n\nSIE entscheiden, wer Ihr Projekt bekommt."
    }
  ];

  const faqsRight: FAQItem[] = [
    {
      question: "Ist BuildWise DSGVO-konform?",
      answer: "100% DSGVO-konform:\n✓ Made in Switzerland\n✓ End-to-End Verschlüsselung\n✓ Volle Datenkontrolle\n✓ Audit-Logs für Compliance\n\nIhre Daten bleiben in der Schweiz."
    },
    {
      question: "Wie viel kostet BuildWise wirklich?",
      answer: "BAUTRÄGER:\nErstes Projekt: 0 CHF (kostenlos)\nDanach: 4.7% nur bei Erfolg\n\nDIENSTLEISTER:\nRegistrierung: 0 CHF\nProvision: 2.7-4.7% nur bei Auftrag\n\nKeine monatlichen Gebühren. Kostenlose Submissionen."
    },
    {
      question: "Was macht BuildWise anders als andere Tools?",
      answer: "ALLES AN EINEM ORT:\n✓ Projektmanagement + Ausschreibungen\n✓ Dokumente + Budget + Kommunikation\n✓ Ein Login statt 5 verschiedene Tools\n\nGEO-BASIERT:\n✓ Dienstleister finden SIE automatisch\n✓ Keine stundenlange Suche mehr\n\nNUR BEI ERFOLG ZAHLEN:\n✓ Kein Risiko für Sie"
    },
    {
      question: "Wie starte ich mit BuildWise?",
      answer: "3 SCHRITTE:\n\n1. Kostenlos registrieren (2 Minuten)\n   → Kostenlose Submissionen\n\n2. Erstes Projekt erstellen (5 Minuten)\n   → Oder: Projekte finden als Dienstleister\n\n3. Loslegen\n   → Zeitersparnis ab dem ersten Projekt\n\nSofort einsatzbereit. Keine Schulung nötig."
    }
  ];

  return <FAQSection 
    title="Häufige Fragen" 
    subtitle="FAQ"
    description="Ihre Fragen, ehrlich beantwortet"
    faqsLeft={faqsLeft} 
    faqsRight={faqsRight} 
    buttonLabel={undefined} 
  />;
}
