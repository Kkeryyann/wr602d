import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function HeroSection() {
    const [headerHeight, setHeaderHeight] = useState(69);

    useEffect(() => {
        const measure = () => {
            const header = document.getElementById('main-header');
            if (header) setHeaderHeight(header.offsetHeight);
        };

        measure();

        // Recalcule si le header change de taille (resize, connexion...)
        const observer = new ResizeObserver(measure);
        const header = document.getElementById('main-header');
        if (header) observer.observe(header);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            className="relative px-4 overflow-hidden flex items-center justify-center"
            style={{ height: `calc(100dvh - ${headerHeight}px)` }}
        >
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
                        <span className="block text-primary font-black">
                            en quelques secondes
                        </span>
                    </h1>

                    <p className="text-base text-muted-foreground max-w-xl mx-auto">
                        La solution pour convertir vos fichiers en PDF.
                        Rapide, simple et sécurisé.
                    </p>
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
