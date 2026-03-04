import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { Conversion } from './components/Conversion';
import { History } from './components/History';
import { Contacts } from './components/Contacts';
import { Pricing } from './components/Pricing';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    subscription: 'basic' | 'pro' | 'premium';
    dailyConversions: number;
    lastResetDate: Date;
}

export interface ConversionRecord {
    id: string;
    fileName: string;
    fileSize: number;
    date: Date;
    status: 'completed' | 'processing' | 'failed';
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
}

export const SUBSCRIPTION_LIMITS = {
    basic: { conversions: 5, price: 0, name: 'Basic' },
    pro: { conversions: 50, price: 9.99, name: 'Pro' },
    premium: { conversions: 999, price: 29.99, name: 'Premium' }
};

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [conversions, setConversions] = useState<ConversionRecord[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: '1',
            firstName: 'Marie',
            lastName: 'Dupont',
            email: 'marie.dupont@example.com',
            phone: '+33 6 12 34 56 78',
            company: 'Tech Corp'
        },
        {
            id: '2',
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@example.com',
            phone: '+33 6 98 76 54 32',
            company: 'Digital Agency'
        }
    ]);

    const handleLogin = (email: string, password: string) => {
        // Simulation de connexion
        setUser({
            id: '1',
            firstName: email.split('@')[0],
            lastName: '',
            email: email,
            avatar: undefined,
            subscription: 'basic',
            dailyConversions: 0,
            lastResetDate: new Date()
        });
    };

    const handleRegister = (firstName: string, lastName: string, email: string, password: string) => {
        // Simulation d'inscription
        setUser({
            id: '1',
            firstName: firstName,
            lastName: lastName,
            email: email,
            avatar: undefined,
            subscription: 'basic',
            dailyConversions: 0,
            lastResetDate: new Date()
        });
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleConversion = (file: File) => {
        if (!user) return;

        // Check if we need to reset daily conversions
        const now = new Date();
        const lastReset = new Date(user.lastResetDate);
        const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

        let updatedUser = user;
        if (hoursSinceReset >= 24) {
            updatedUser = { ...user, dailyConversions: 0, lastResetDate: now };
            setUser(updatedUser);
        }

        // Check conversion limit
        const limit = SUBSCRIPTION_LIMITS[user.subscription].conversions;
        if (updatedUser.dailyConversions >= limit) {
            alert('Limite de conversions quotidiennes atteinte. Veuillez passer à un plan supérieur.');
            return;
        }

        const newConversion: ConversionRecord = {
            id: Date.now().toString(),
            fileName: file.name,
            fileSize: file.size,
            date: new Date(),
            status: 'completed'
        };
        setConversions([newConversion, ...conversions]);

        // Increment daily conversions
        setUser({ ...updatedUser, dailyConversions: updatedUser.dailyConversions + 1 });
    };

    const addContact = (contact: Omit<Contact, 'id'>) => {
        const newContact: Contact = {
            ...contact,
            id: Date.now().toString()
        };
        setContacts([...contacts, newContact]);
    };

    const updateContact = (id: string, contact: Omit<Contact, 'id'>) => {
        setContacts(contacts.map(c => c.id === id ? { ...contact, id } : c));
    };

    const deleteContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
    };

    const handleUpgrade = (plan: 'basic' | 'pro' | 'premium') => {
        if (user) {
            setUser({ ...user, subscription: plan, dailyConversions: 0, lastResetDate: new Date() });
            alert(`Félicitations ! Vous êtes maintenant sur le plan ${SUBSCRIPTION_LIMITS[plan].name}`);
        }
    };

    return (
        <Router>
            <div className="min-h-screen bg-black text-white">
                <Navigation user={user} onLogout={handleLogout} />
                <main>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route
                            path="/auth"
                            element={
                                user ? <Navigate to="/conversion" /> :
                                    <Auth onLogin={handleLogin} onRegister={handleRegister} />
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                user ? <Profile user={user} setUser={setUser} /> :
                                    <Navigate to="/auth" />
                            }
                        />
                        <Route
                            path="/conversion"
                            element={
                                user ? <Conversion onConvert={handleConversion} user={user} /> :
                                    <Navigate to="/auth" />
                            }
                        />
                        <Route
                            path="/history"
                            element={
                                user ? <History conversions={conversions} /> :
                                    <Navigate to="/auth" />
                            }
                        />
                        <Route
                            path="/contacts"
                            element={
                                user ?
                                    <Contacts
                                        contacts={contacts}
                                        onAdd={addContact}
                                        onUpdate={updateContact}
                                        onDelete={deleteContact}
                                    /> :
                                    <Navigate to="/auth" />
                            }
                        />
                        <Route
                            path="/pricing"
                            element={<Pricing user={user} onUpgrade={handleUpgrade} />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
