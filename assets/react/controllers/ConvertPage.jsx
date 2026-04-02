import React, { useState, useRef } from "react";
import { icons, FileDown, Upload, X, ArrowLeft, Zap, LockKeyhole, Hd } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

function getIcon(iconName) {
    return icons[iconName] || icons.Wrench;
}

// Config par slug — alignée exactement sur ConverterController.php
const TOOL_CONFIG = {
    url: {
        inputType: "url",
        placeholder: "https://example.com",
        label: "URL de la page à convertir",
        hint: "Entrez l'URL complète de la page web à convertir en PDF.",
        // formKey géré manuellement dans handleSubmit
    },
    html: {
        inputType: "file",
        accept: ".html,.htm",
        label: "Fichier HTML à convertir",
        hint: "Fichiers .html et .htm uniquement",
        formKey: "htmlFile",  // POST /converter → request->files->get('htmlFile')
    },
    word: {
        inputType: "file",
        accept: ".doc,.docx",
        label: "Fichier Word à convertir",
        hint: "Fichiers .doc et .docx uniquement",
        formKey: "file",  // POST /converter/word → request->files->get('file')
    },
    excel: {
        inputType: "file",
        accept: ".xls,.xlsx",
        label: "Fichier Excel à convertir",
        hint: "Fichiers .xls et .xlsx uniquement",
        formKey: "file",
    },
    powerpoint: {
        inputType: "file",
        accept: ".ppt,.pptx",
        label: "Fichier PowerPoint à convertir",
        hint: "Fichiers .ppt et .pptx uniquement",
        formKey: "file",
    },
    image: {
        inputType: "file",
        accept: ".jpg,.jpeg,.png,.tiff,.tif,.webp",
        label: "Image à convertir",
        hint: "Fichiers JPG, PNG, TIFF, WebP",
        formKey: "file",
    },
    merge: {
        inputType: "file",
        accept: ".pdf",
        multiple: true,
        label: "Fichiers PDF à fusionner",
        hint: "Sélectionnez au minimum 2 fichiers PDF",
        formKey: "files",  // POST /converter/merge → request->files->get('files', [])
    },
    split: {
        inputType: "file",
        accept: ".pdf",
        label: "Fichier PDF à découper",
        hint: "Fichiers PDF uniquement",
        formKey: "file",
        // extra fields: splitMode, splitSpan
        extraFields: [
            {
                key: "splitMode",
                type: "select",
                label: "Mode de découpe",
                defaultValue: "intervals",
                options: [
                    { value: "intervals", label: "Par intervalle de pages" },
                    { value: "pages", label: "Pages spécifiques" },
                ],
            },
            {
                key: "splitSpan",
                type: "text",
                label: "Valeur (ex: 1, 1-3, 2)",
                defaultValue: "1",
                placeholder: "1",
            },
        ],
    },
    pdfa: {
        inputType: "file",
        accept: ".pdf",
        label: "Fichier PDF à archiver",
        hint: "Fichiers PDF uniquement",
        formKey: "file",
        extraFields: [
            {
                key: "standard",
                type: "select",
                label: "Standard PDF/A",
                defaultValue: "PDF/A-2b",
                options: [
                    { value: "PDF/A-1b", label: "PDF/A-1b" },
                    { value: "PDF/A-2b", label: "PDF/A-2b" },
                    { value: "PDF/A-3b", label: "PDF/A-3b" },
                ],
            },
        ],
    },
    encrypt: {
        inputType: "file",
        accept: ".pdf",
        label: "Fichier PDF à protéger",
        hint: "Fichiers PDF uniquement",
        formKey: "file",
        extraFields: [
            {
                key: "userPassword",
                type: "password",
                label: "Mot de passe utilisateur",
                placeholder: "Requis pour ouvrir le PDF",
                defaultValue: "",
            },
            {
                key: "ownerPassword",
                type: "password",
                label: "Mot de passe propriétaire",
                placeholder: "Requis pour modifier le PDF",
                defaultValue: "",
            },
        ],
    },
};

/* ── Zone de dépôt fichier ── */
function DropZone({ config, file, files, dragActive, onDrag, onDrop, onFileChange, onRemove, fileInputRef }) {
    const multiple = config.multiple ?? false;
    const displayFiles = multiple ? files : (file ? [file] : []);
    const hasFiles = displayFiles.length > 0;

    return (
        <div
            className={cn(
                "relative border-2 border-solid rounded-2xl transition-all cursor-pointer",
                dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50",
                hasFiles ? "p-5" : "p-12"
            )}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
            onClick={() => !hasFiles && fileInputRef.current?.click()}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={config.accept}
                multiple={multiple}
                onChange={onFileChange}
                className="hidden"
            />

            {hasFiles ? (
                <div className="space-y-2">
                    {displayFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 bg-primary/5 rounded-lg px-4 py-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileDown className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{f.name}</p>
                                <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} Ko</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 h-7 w-7"
                                onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-xs hover:underline mt-1 px-1"
                        style={{ color: 'hsl(var(--primary))' }}
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                        + Ajouter {multiple ? "d'autres fichiers" : "un autre fichier"}
                    </button>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                        <Upload className="h-7 w-7" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-base font-semibold">Glissez votre fichier ici</p>
                        <p className="text-sm text-muted-foreground">
                            ou <span className="font-medium" style={{ color: 'hsl(var(--primary))' }}>cliquez pour sélectionner</span>
                        </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        Sélectionner un fichier
                    </Button>
                    <p className="text-xs text-muted-foreground">{config.hint}</p>
                </div>
            )}
        </div>
    );
}

/* ── Champs supplémentaires (split, pdfa, encrypt) ── */
function ExtraFields({ fields, values, onChange }) {
    return (
        <div className="space-y-3">
            {fields.map((field) => (
                <div key={field.key} className="space-y-1.5">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "select" ? (
                        <select
                            value={values[field.key]}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {field.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : (
                        <Input
                            type={field.type}
                            placeholder={field.placeholder ?? ""}
                            value={values[field.key]}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

/* ── Page principale ── */
export default function ConverterPage({ tool, allTools = [], user = null }) {
    const [file, setFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const config = TOOL_CONFIG[tool.slug] ?? TOOL_CONFIG.html;
    const isUrl = config.inputType === "url";
    const isMultiple = config.multiple ?? false;
    const hasExtra = config.extraFields?.length > 0;

    // Init extra fields avec leurs valeurs par défaut
    const [extraValues, setExtraValues] = useState(() => {
        if (!config.extraFields) return {};
        return Object.fromEntries(config.extraFields.map(f => [f.key, f.defaultValue ?? ""]));
    });

    const handleExtraChange = (key, value) => setExtraValues(prev => ({ ...prev, [key]: value }));

    const canSubmit = isUrl
        ? url.length > 0
        : isMultiple
            ? files.length >= 2
            : file !== null;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const dropped = Array.from(e.dataTransfer.files ?? []);
        if (isMultiple) setFiles(prev => [...prev, ...dropped]);
        else if (dropped[0]) setFile(dropped[0]);
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files ?? []);
        if (isMultiple) setFiles(prev => [...prev, ...selected]);
        else if (selected[0]) setFile(selected[0]);
    };

    const handleRemove = (index) => {
        if (isMultiple) setFiles(prev => prev.filter((_, i) => i !== index));
        else { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setLoading(true);

        const formData = new FormData();

        if (isUrl) {
            formData.append("url", url);
        } else if (isMultiple) {
            // POST /converter/merge → files[] (sans le nom du slug)
            files.forEach(f => formData.append(`${config.formKey}[]`, f));
        } else {
            formData.append(config.formKey, file);
        }

        // Champs supplémentaires (splitMode, splitSpan, standard, passwords...)
        if (hasExtra) {
            Object.entries(extraValues).forEach(([key, val]) => {
                if (val) formData.append(key, val);
            });
        }

        // Endpoint : url/html → POST /converter, autres → POST /converter/{slug}
        const endpoint = (tool.slug === "url" || tool.slug === "html")
            ? "/converter"
            : `/converter/${tool.slug}`;

        try {
            const response = await fetch(endpoint, { method: "POST", body: formData });

            if (response.ok) {
                const contentType = response.headers.get("Content-Type") ?? "";
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                const baseName = isUrl
                    ? new URL(url).hostname.replace("www.", "")
                    : (file?.name ?? "converted").replace(/\.[^.]+$/, "");
                link.download = contentType.includes("zip") ? "split.zip"
                    : tool.slug === "merge" ? "merged.pdf"
                        : `${baseName}_converted.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } else {
                const text = await response.text();
                alert(text || "Une erreur est survenue lors de la conversion.");
            }
        } catch {
            alert("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider defaultTheme="system" storageKey="pdf-faktory-theme">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header tools={allTools} user={user} />

                <main className="flex-1 py-12 px-4">
                    <div className="max-w-2xl mx-auto space-y-8">

                        <a href="/converter"
                           className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </a>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{tool.name}</h1>
                            <p className="text-muted-foreground text-sm">{tool.description}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isUrl ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{config.label}</label>
                                    <Input
                                        type="url"
                                        placeholder={config.placeholder}
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">{config.hint}</p>
                                </div>
                            ) : (
                                <DropZone
                                    config={config}
                                    file={file}
                                    files={files}
                                    dragActive={dragActive}
                                    onDrag={handleDrag}
                                    onDrop={handleDrop}
                                    onFileChange={handleFileChange}
                                    onRemove={handleRemove}
                                    fileInputRef={fileInputRef}
                                />
                            )}

                            {hasExtra && (
                                <ExtraFields
                                    fields={config.extraFields}
                                    values={extraValues}
                                    onChange={handleExtraChange}
                                />
                            )}

                            <Button type="submit" size="lg" className="w-full" disabled={loading || !canSubmit}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Conversion en cours...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <FileDown className="h-4 w-4" />
                                        Convertir en PDF
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Zap, title: "Rapide", desc: "Conversion en quelques secondes" },
                                { icon: Hd, title: "Haute qualité", desc: "Rendu fidèle au document original" },
                                { icon: LockKeyhole, title: "Sécurisé", desc: "Vos fichiers ne sont pas conservés" },
                            ].map(({ icon: BadgeIcon, title, desc }) => (
                                <div key={title} className="rounded-xl border border-border p-4 space-y-2">
                                    <BadgeIcon className="h-5 w-5" style={{ color: 'hsl(var(--primary))' }} />
                                    <p className="text-sm font-semibold">{title}</p>
                                    <p className="text-xs text-muted-foreground">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
}
