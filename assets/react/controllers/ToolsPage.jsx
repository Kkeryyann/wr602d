import React from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToolsSection from "../components/sections/ToolsSection";

export default function ToolsPage({ tools = [], user = null }) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="pdf-faktory-theme">
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header tools={tools} user={user} />
                <main className="flex-1">
                    <ToolsSection tools={tools} />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}
