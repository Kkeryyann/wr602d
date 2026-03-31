import React from "react";
import { XCircle } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

export default function PaymentCancelPage({ user = null }) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="pdf-faktory-theme">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header tools={[]} user={user} />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-muted">
                            <XCircle className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Paiement annulé</h1>
                            <p className="text-muted-foreground text-sm">
                                Votre paiement a été annulé. Aucun montant n'a été débité.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button asChild>
                                <a href="/subscription">Voir les plans</a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/">Retour à l'accueil</a>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
