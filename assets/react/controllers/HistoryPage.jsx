import React, { useState } from "react";
import { icons, FileDown, FileText, Calendar, HardDrive, Search, Filter } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

function getIcon(iconName) {
    return icons[iconName] || icons.FileText;
}

function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
        + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatSize(bytes) {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

const SLUG_LABELS = {
    url: "URL vers PDF",
    html: "HTML vers PDF",
    word: "Word vers PDF",
    excel: "Excel vers PDF",
    powerpoint: "PowerPoint vers PDF",
    image: "Image vers PDF",
    merge: "Fusion PDF",
    split: "Découpe PDF",
    pdfa: "PDF/A",
    encrypt: "PDF Protégé",
};

/* ── Stat card ── */
function StatCard({ icon: Icon, value, label }) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                 style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                <Icon className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div>
                <p className="text-xl font-bold leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
        </div>
    );
}

/* ── Ligne historique ── */
function GenerationRow({ gen, tools }) {
    const tool = tools.find(t => t.slug === gen.toolSlug);
    const Icon = getIcon(tool?.icon);
    const label = SLUG_LABELS[gen.toolSlug] ?? gen.toolSlug;
    const isZip = gen.mimeType === "application/zip";

    return (
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                 style={{ backgroundColor: 'hsl(var(--primary) / 0.08)' }}>
                <Icon className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {gen.originalFilename ?? "Fichier converti"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(gen.createdAt)}</p>
            </div>

            <Badge variant="outline" className="hidden sm:flex text-xs shrink-0">
                {label}
            </Badge>

            <Badge variant="outline" className="hidden sm:flex text-xs shrink-0">
                {isZip ? "ZIP" : "PDF"}
            </Badge>

            {gen.downloadUrl ? (
                <Button size="sm" variant="outline" className="shrink-0 h-8 gap-1.5" asChild>
                    <a href={gen.downloadUrl} download>
                        <FileDown className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Télécharger</span>
                    </a>
                </Button>
            ) : (
                <span className="text-xs text-muted-foreground shrink-0">Expiré</span>
            )}
        </div>
    );
}

/* ── Page principale ── */
export default function HistoryPage({ generations = [], tools = [], user = null }) {
    const [search, setSearch] = useState("");
    const [filterSlug, setFilterSlug] = useState("all");

    const slugsUsed = [...new Set(generations.map(g => g.toolSlug))];

    const filtered = generations.filter(g => {
        const matchSlug = filterSlug === "all" || g.toolSlug === filterSlug;
        const matchSearch = !search ||
            (g.originalFilename ?? "").toLowerCase().includes(search.toLowerCase()) ||
            (SLUG_LABELS[g.toolSlug] ?? "").toLowerCase().includes(search.toLowerCase());
        return matchSlug && matchSearch;
    });

    const todayCount = generations.filter(g => {
        if (!g.createdAt) return false;
        const d = new Date(g.createdAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    }).length;

    return (
        <ThemeProvider defaultTheme="system" storageKey="pdf-faktory-theme">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header tools={tools} user={user} />

                <main className="flex-1 py-12 px-4">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Titre */}
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Historique des conversions</h1>
                            <p className="text-muted-foreground text-sm">Retrouvez tous vos fichiers convertis</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <StatCard icon={FileText} value={generations.length} label="Conversions totales" />
                            <StatCard icon={Calendar} value={todayCount} label="Aujourd'hui" />
                            <StatCard icon={HardDrive} value={`${generations.length > 0 ? generations.length : 0} fichiers`} label="Fichiers générés" />
                        </div>

                        {/* Filtres */}
                        {generations.length > 0 && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher un fichier..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Button
                                        size="sm"
                                        variant={filterSlug === "all" ? "default" : "outline"}
                                        onClick={() => setFilterSlug("all")}
                                        className="h-9"
                                    >
                                        Tous
                                    </Button>
                                    {slugsUsed.map(slug => (
                                        <Button
                                            key={slug}
                                            size="sm"
                                            variant={filterSlug === slug ? "default" : "outline"}
                                            onClick={() => setFilterSlug(slug)}
                                            className="h-9"
                                        >
                                            {SLUG_LABELS[slug] ?? slug}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Liste */}
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 space-y-3">
                                <div className="h-14 w-14 rounded-full flex items-center justify-center"
                                     style={{ backgroundColor: 'hsl(var(--muted))' }}>
                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="font-medium text-sm">Aucune conversion</p>
                                <p className="text-xs text-muted-foreground">Votre historique de conversions apparaîtra ici</p>
                                <Button size="sm" asChild className="mt-2">
                                    <a href="/converter">Commencer une conversion</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filtered.map(gen => (
                                    <GenerationRow key={gen.id} gen={gen} tools={tools} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
