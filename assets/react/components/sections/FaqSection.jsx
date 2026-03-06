import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";

const faqs = [
    {
        question: "Quels formats de fichiers sont supportés ?",
        answer: "PDF Faktory supporte la conversion depuis Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), HTML, images (JPG, PNG, TIFF) et URLs de pages web. Vous pouvez également fusionner et découper des fichiers PDF existants.",
    },
    {
        question: "Mes fichiers sont-ils en sécurité ?",
        answer: "Oui. Tous les fichiers sont traités sur des serveurs sécurisés et automatiquement supprimés après la conversion. Nous ne stockons jamais vos documents.",
    },
    {
        question: "Quelle est la limite de conversions ?",
        answer: "Le plan FREE permet 2 conversions par jour. Le plan BASIC monte à 20 conversions par jour. Le plan PREMIUM offre des conversions illimitées.",
    },
    {
        question: "Puis-je utiliser PDF Faktory via une API ?",
        answer: "Oui, le plan PREMIUM inclut un accès API complet avec documentation et clés d'authentification pour intégrer la conversion dans vos propres applications.",
    },
    {
        question: "Puis-je annuler mon abonnement à tout moment ?",
        answer: "Oui, vous pouvez annuler à tout moment depuis votre espace account. Votre accès restera actif jusqu'à la fin de la période de facturation en cours.",
    },
    {
        question: "Y a-t-il un engagement ?",
        answer: "Non, tous nos plans sont sans engagement. Vous pouvez annuler ou changer de plan à tout moment sans frais.",
    },
];

export default function FaqSection() {
    return (
        <section className="py-20 px-4 bg-background border-t border-border">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl">Questions fréquentes</h2>
                    <p className="text-muted-foreground">
                        Tout ce que vous devez savoir sur PDF Faktory.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
