import React from "react";
import { icons } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";

function getIcon(iconName) {
    return icons[iconName] || icons.Wrench;
}

const planBadgeVariant = {
    FREE: "outline",
    BASIC: "secondary",
    PREMIUM: "default",
};

export default function ToolsSection({ tools = [] }) {
    if (tools.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-background border-y border-border">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl">Pourquoi choisir PDF FakTandor ?</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Tout ce dont vous avez besoin pour gérer vos PDF, regroupé en un seul endroit.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool) => {
                        const Icon = getIcon(tool.icon);
                        const planName = tool.minPlan?.name;
                        const variant = planBadgeVariant[planName] ?? "outline";

                        return (
                            <a key={tool.id} href={`/converter/${tool.slug}`} className="group">
                                <Card className="h-full cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(0,0,0,0.3)] shadow-none bg-card">
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="rounded-xl bg-primary/10 p-3 w-fit group-hover:bg-primary transition-colors duration-200">
                                                <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-200" />
                                            </div>
                                            {planName && (
                                                <Badge variant={variant}>{planName}</Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-base">{tool.name}</CardTitle>
                                        <CardDescription>{tool.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
