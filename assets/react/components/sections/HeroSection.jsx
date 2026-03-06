import React from "react";
import { Upload, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import DotGrid from '../ui/DotGrid';

export default function HeroSection() {
    return (
        <section className="relative py-28 px-4 overflow-hidden">
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
                <div className="space-y-5">
                    <Badge
                        variant="outline"
                        className="rounded-full bg-background/50 gap-2 px-3 py-1 text-xs border-primary/30"
                    >
                        <span className="rounded-full bg-primary h-1.5 w-1.5 inline-block" />
                        Conversion instantanée gratuitement
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                        Convertissez vos documents{" "}
                        <span className="block text-primary font-normal">
                            en quelques secondes
                        </span>
                    </h1>

                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                        La solution professionnelle pour convertir vos fichiers Word en PDF.
                        Rapide, sécurisé et simple d'utilisation.
                    </p>
                </div>

                {/* Drop zone */}
                <div className="border-2 border-dashed border-border bg-card/50 rounded-2xl p-12 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-secondary p-4 group-hover:bg-primary/10 transition-colors">
                            <Upload className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <p className="font-medium text-foreground">Glissez-déposez votre fichier ici</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                DOC, DOCX, HTML, JPG, PNG — Max 10 Mo
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="mt-1">
                            Sélectionner un fichier
                        </Button>
                    </div>
                </div>

                <Button size="lg" asChild className="gap-2">
                    <a href="/converter">
                        Commencer la conversion
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </Button>
            </div>
        </section>
    );
}
