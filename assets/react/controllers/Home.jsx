import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Shield, History, ArrowRight } from 'lucide-react';
import type { User } from '../App';

interface HomeProps {
    user: User | null;
}

export function Home({ user }: HomeProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(236,72,153,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(244,114,182,0.1),transparent_50%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold mb-6">
                            Convertissez vos documents
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                en quelques secondes
              </span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                            La solution professionnelle pour convertir vos fichiers Word en PDF.
                            Rapide, sécurisé et simple d'utilisation.
                        </p>
                        <div className="flex gap-4 justify-center">
                            {user ? (
                                <Link
                                    to="/conversion"
                                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-lg font-semibold transition-all flex items-center gap-2 text-lg"
                                >
                                    Commencer la conversion
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/auth"
                                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-lg font-semibold transition-all flex items-center gap-2 text-lg"
                                    >
                                        Commencer gratuitement
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/auth"
                                        className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition-all text-lg"
                                    >
                                        Se connecter
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-black py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Pourquoi choisir DocConverter ?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-pink-500 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Conversion rapide</h3>
                            <p className="text-zinc-400">
                                Convertissez vos documents Word en PDF en quelques secondes seulement.
                                Optimisé pour la vitesse et la performance.
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-pink-500 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">100% sécurisé</h3>
                            <p className="text-zinc-400">
                                Vos documents sont traités de manière sécurisée et supprimés après la conversion.
                                Protection totale de vos données.
                            </p>
                        </div>

                        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 hover:border-pink-500 transition-all">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                                <History className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Historique complet</h3>
                            <p className="text-zinc-400">
                                Accédez à l'historique de toutes vos conversions et retrouvez facilement
                                vos fichiers convertis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!user && (
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Créez votre compte gratuitement et convertissez vos premiers documents.
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 hover:bg-zinc-100 rounded-lg font-semibold transition-all text-lg"
                        >
                            S'inscrire maintenant
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
