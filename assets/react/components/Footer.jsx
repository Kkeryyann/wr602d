import React from 'react';
import { useTheme } from './ThemeProvider';
import {ModeToggle} from "./ModeToggle";
import { Zap } from 'lucide-react';

export default function Footer() {
    const { theme } = useTheme();
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const logoSrc = isDark ? '' : '';
    return (
        <footer className="border-t border-border bg-background w-full py-4">
            <div className="flex flex-row items-center justify-between gap-2 w-full max-w-5xl mx-auto">
                <div>
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm whitespace-nowrap">PDF Faktory</span>
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle/>
                    <p className="text-xs text-muted-foreground">© 2026 PDF Faktory. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    )
}
