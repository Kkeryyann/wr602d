import React, { useEffect, useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import ToolsSection from "../components/sections/ToolsSection";
import PricingSection from "../components/sections/PricingSection";
import FaqSection from "../components/sections/FaqSection";
import CtaSection from "../components/sections/CtaSection";
import DotGrid from "../components/ui/DotGrid";

function hslVarToHex() {
    try {
        const hsl = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary')
            .trim();
        if (!hsl) return '#ff0000';

        // --primary est du type "0 100% 50%" (sans "hsl()")
        const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));

        const sn = s / 100;
        const ln = l / 100;
        const k = n => (n + h / 30) % 12;
        const a = sn * Math.min(ln, 1 - ln);
        const f = n => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r = Math.round(f(0) * 255);
        const g = Math.round(f(8) * 255);
        const b = Math.round(f(4) * 255);

        return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    } catch {
        return '#ff0000';
    }
}

export default function Home({ plans = [], tools = [] }) {
    const [activeColor, setActiveColor] = useState('#ff0000');

    useEffect(() => {
        // Lit la couleur au montage
        setActiveColor(hslVarToHex());

        // Observe les changements de --primary (favoriteColor de l'user)
        const observer = new MutationObserver(() => {
            setActiveColor(hslVarToHex());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative">
            <div style={{ width: '100%', height: '100dvh', position: 'fixed', zIndex: 0, pointerEvents: 'none' }}>
                <DotGrid
                    dotSize={2}
                    gap={15}
                    baseColor="#1F1F1F"
                    activeColor={activeColor}
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>
            <div className="relative" style={{ zIndex: 1 }}>
                <HeroSection />
                <ToolsSection tools={tools} />
                <PricingSection plans={plans} />
                <FaqSection />
                <CtaSection />
            </div>
        </div>
    );
}
