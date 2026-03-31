import React from "react";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

// Prix réels DB : FREE = 0, BASIC = 9.9, PREMIUM = 45
const features = [
    { label: "Conversion HTML vers PDF", minPrice: 0 },
    { label: "Conversion URL vers PDF", minPrice: 0 },
    { label: "Conversion Image vers PDF", minPrice: 0 },
    { label: "Conversion Word vers PDF", minPrice: 0 },
    { label: "Conversion Excel vers PDF", minPrice: 0 },
    { label: "Conversion PowerPoint vers PDF", minPrice: 0 },
    { label: "Conversion Markdown vers PDF", minPrice: 9.9 },
    { label: "Taille max : 20 Mo", minPrice: 9.9 },
    { label: "Fusion de PDF", minPrice: 9.9 },
    { label: "Compression de PDF", minPrice: 9.9 },
    { label: "Support prioritaire", minPrice: 9.9 },
    { label: "Conversions illimitées", minPrice: 45 },
    { label: "API Access", minPrice: 45 },
    { label: "Suppression de pub", minPrice: 45 },
];

function getDisplayPrice(plan) {
    if (plan.specialPrice != null && plan.specialPrice < plan.price) {
        return plan.specialPrice;
    }
    return plan.price;
}

function isPopular(plan, allPlans) {
    if (allPlans.length < 2) return false;
    const sorted = [...allPlans].sort((a, b) => a.price - b.price);
    return sorted.length >= 2 && plan.name === sorted[1].name;
}

function FeatureItem({ included, label }) {
    return (
        <li className="flex items-center gap-2 text-sm">
            {included ? (
                <Check className="h-4 w-4 text-primary shrink-0" />
            ) : (
                <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            )}
            <span className={cn(!included && "text-muted-foreground/50 line-through")}>
                {label}
            </span>
        </li>
    );
}

export default function PricingSection({ plans = [], currentPlanId = null }) {
    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl">Choisissez votre plan</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Sélectionnez l'abonnement qui correspond à vos besoins.
                    </p>
                </div>

                <div className={cn(
                    "grid grid-cols-1 gap-6",
                    plans.length === 2 && "md:grid-cols-2 max-w-3xl mx-auto",
                    plans.length >= 3 && "md:grid-cols-3",
                )}>
                    {plans.map((plan) => {
                        const isCurrentPlan = currentPlanId === plan.id;
                        const popular = isPopular(plan, plans);
                        const price = getDisplayPrice(plan);
                        const hasSpecial = plan.specialPrice != null && plan.specialPrice < plan.price;

                        return (
                            <Card
                                key={plan.name}
                                className={cn(
                                    "flex flex-col relative",
                                    popular
                                        ? "border-primary shadow-[0_0_32px_rgba(0,0,0,0.4)] scale-105 bg-card"
                                        : "bg-card/60"
                                )}
                            >
                                {popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="px-3 py-1 text-xs shadow-md">
                                            Populaire
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="pt-3">
                                        {hasSpecial && (
                                            <span className="text-sm text-muted-foreground line-through mr-2">
                                                {plan.price}€
                                            </span>
                                        )}
                                        <span className="text-4xl font-bold">
                                            {price === 0 ? "Gratuit" : `${price}€`}
                                        </span>
                                        {price > 0 && (
                                            <span className="text-muted-foreground text-sm ml-1">/mois</span>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <ul className="space-y-2.5">
                                        <li className="flex items-center gap-2 text-sm font-medium">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            {plan.limitGeneration === -1
                                                ? "Conversions illimitées"
                                                : `${plan.limitGeneration} conversions / jour`}
                                        </li>
                                        <li className="border-t border-border pt-2" />
                                        {features.map((feature) => (
                                            <FeatureItem
                                                key={feature.label}
                                                included={plan.price >= feature.minPrice}
                                                label={feature.label}
                                            />
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter className="pt-4">
                                    <Button
                                        variant={isCurrentPlan ? "secondary" : (popular ? "default" : "outline")}
                                        className="w-full"
                                        disabled={isCurrentPlan}
                                        asChild={!isCurrentPlan}
                                    >
                                        {isCurrentPlan ? (
                                            <span>Formule actuelle</span>
                                        ) : (
                                            <a href={
                                                price === 0
                                                    ? "/converter"
                                                    : plan.stripePriceId
                                                        ? `/payment/checkout/${plan.id}`
                                                        : "/subscription"
                                            }>
                                                {price === 0 ? "Commencer" : `Passer à ${plan.name}`}
                                            </a>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
