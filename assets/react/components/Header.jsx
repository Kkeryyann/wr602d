import React, { useState } from 'react';
import { icons, User, LogOut, Settings, Zap, Crown, Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './ThemeProvider';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from './ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from './ui/dropdown-menu';

function getIcon(iconName) {
    return icons[iconName] || icons.Wrench;
}

function useHover() {
    const [hovered, setHovered] = useState(false);
    return [hovered, { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }];
}

/* ── Item générique avec hover primary ── */
function HoverItem({ href, onClick, className = '', children }) {
    const [hovered, handlers] = useHover();
    const Tag = href ? 'a' : 'button';
    return (
        <Tag
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm cursor-pointer outline-none transition-all ${className}`}
            style={{
                backgroundColor: hovered ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
            }}
            {...handlers}
        >
            {children}
        </Tag>
    );
}

/* ── ListItem menu Convertir ── */
function ListItem({ title, icon: Icon, children, href, ...props }) {
    const [hovered, handlers] = useHover();
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all"
                    style={{ backgroundColor: hovered ? 'hsl(var(--primary) / 0.08)' : 'transparent' }}
                    {...handlers}
                    {...props}
                >
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <Icon className="h-4 w-4 transition-colors"
                                  style={{ color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }} />
                        )}
                        <div className="text-sm font-medium leading-none transition-colors"
                             style={{ color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
                            {title}
                        </div>
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
}

/* ── Avatar ── */
function UserAvatar({ firstname, lastname }) {
    const initials = `${firstname?.[0] ?? ''}${lastname?.[0] ?? ''}`.toUpperCase();
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {initials || <User className="h-4 w-4" />}
        </div>
    );
}

/* ── NavItem ── */
function NavItem({ href, label }) {
    const [hovered, handlers] = useHover();
    const isActive = typeof window !== 'undefined' && window.location.pathname === href;
    return (
        <NavigationMenuItem>
            <NavigationMenuLink
                href={href}
                className="px-4 py-1.5 rounded-sm text-sm font-medium transition-all"
                style={{
                    backgroundColor: isActive ? 'hsl(var(--primary))' : hovered ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                    color: isActive ? 'hsl(var(--primary-foreground))' : hovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                }}
                {...handlers}
            >
                {label}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
}

/* ── Conversions widget ── */
function ConversionsWidget({ conversionsLeft, conversionsLimit, resetTime }) {
    const progress = Math.max(2, (conversionsLeft / conversionsLimit) * 100);
    return (
        <div className="hidden lg:flex flex-col gap-1.5 rounded-lg px-3 py-2 min-w-[160px] border cursor-default"
             style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground">Conversions</span>
                <span className="text-xs font-semibold" style={{ color: 'hsl(var(--primary))' }}>
                    {conversionsLeft} restantes
                </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-xs text-muted-foreground">Reset dans {resetTime}</span>
        </div>
    );
}

/* ── Theme toggle ── */
function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [hovered, handlers] = useHover();
    const iconsMap = { light: Sun, dark: Moon, system: Monitor };
    const Icon = iconsMap[theme] ?? Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-md transition-all outline-none cursor-pointer"
                    style={{
                        backgroundColor: hovered ? 'hsl(var(--primary) / 0.1)' : 'transparent',
                        color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                    }}
                    {...handlers}
                >
                    <Icon className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-1">
                {[
                    { value: 'light', label: 'Clair', Icon: Sun },
                    { value: 'dark', label: 'Sombre', Icon: Moon },
                    { value: 'system', label: 'Système', Icon: Monitor },
                ].map(({ value, label, Icon: ItemIcon }) => (
                    <HoverItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className={theme === value ? 'font-medium' : ''}
                    >
                        <ItemIcon className="h-4 w-4" />
                        {label}
                    </HoverItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ── Menu utilisateur ── */
function UserMenu({ user }) {
    const [hovered, handlers] = useHover();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all outline-none cursor-pointer"
                    style={{ backgroundColor: hovered ? 'hsl(var(--primary) / 0.1)' : 'transparent' }}
                    {...handlers}
                >
                    <span className="hidden sm:block font-medium max-w-[120px] truncate text-sm"
                          style={{ color: hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' }}>
                        {user.firstname} {user.lastname}
                    </span>
                    <UserAvatar firstname={user.firstname} lastname={user.lastname} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuLabel className="px-2 py-1.5">
                    <p className="font-medium text-foreground">{user.firstname} {user.lastname}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <HoverItem href="/account">
                    <Settings className="h-4 w-4" />
                    Mon compte
                </HoverItem>
                <DropdownMenuSeparator />
                <HoverItem href="/logout" className="text-destructive">
                    <LogOut className="h-4 w-4" />
                    Se déconnecter
                </HoverItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ── Header principal ── */
export default function Header({ tools = [], user = null }) {
    const conversionsUsed = user?.conversionsUsed ?? 0;
    const conversionsLimit = parseInt(user?.conversionsLimit ?? 5);
    const conversionsLeft = conversionsLimit === -1 ? null : conversionsLimit - conversionsUsed;
    const resetTime = user?.resetTime ?? "0h 0m";
    const planName = user?.planName ?? "FREE";
    const compact = user && planName !== 'PREMIUM';
    return (
        <header id="main-header" className={`flex items-center border-b border-border bg-background px-6 sticky top-0 z-50 ${compact ? '' : 'py-4.5'}`}>
            <div className="w-full flex items-center justify-between gap-6">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Zap className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm whitespace-nowrap">PDF Faktory</span>
                </a>

                {/* Nav centrale */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="gap-1">
                        <NavItem href="/" label="Accueil" />
                        <NavItem href="/converter" label="Convertir" />
                        <NavItem href="/history" label="Historique" />
                        <NavItem href="/contact" label="Contacts" />
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right section */}
                <div className="flex items-center gap-3 shrink-0">

                    {user && conversionsLimit !== -1 && (
                        <ConversionsWidget
                            conversionsLeft={conversionsLeft}
                            conversionsLimit={conversionsLimit}
                            resetTime={resetTime}
                        />
                    )}

                    {user && (
                        <Button size="sm" variant="default" className="rounded-md px-3 h-7 text-xs gap-1.5" asChild>
                            <a href="/subscription">
                                {planName === 'PREMIUM' && <Crown className="h-3 w-3" />}
                                {planName === 'BASIC' && <Zap className="h-3 w-3" />}
                                {planName}
                            </a>
                        </Button>
                    )}

                    <ThemeToggle />

                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            <Button variant="outline" size="sm" asChild>
                                <a href="/login">Connexion</a>
                            </Button>
                            <Button variant="default" size="sm" asChild>
                                <a href="/register">Inscription</a>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
