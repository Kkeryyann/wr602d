import React from "react";
import { CheckCircle } from "lucide-react";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";

export default function PaymentSuccessPage({ user = null }) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="pdf-faktory-theme">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header tools={[]} user={user} />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center"
                             style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <CheckCircle className="h-10 w-10" style={{ color: 'hsl(var(--primary))' }} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Paiement réussi !</h1>
                            <p className="text-muted-foreground text-sm">
                                Votre abonnement a été activé. Vous pouvez maintenant profiter de toutes les fonctionnalités de votre plan.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button asChild>
                                <a href="/converter">Commencer à convertir</a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/subscription">Mon abonnement</a>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
