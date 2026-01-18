"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, Calendar, ShoppingBag, Info, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { name: "Accueil", href: "/", icon: null },
    { name: "Explorer", href: "/explore", icon: Rocket },
    { name: "Cours", href: "/cours", icon: null },
    { name: "Événements", href: "/evenements", icon: Calendar },
    { name: "Boutique", href: "/boutique", icon: ShoppingBag },
    { name: "À propos", href: "/about", icon: Info },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled || isMobileMenuOpen
                    ? "bg-black/80 backdrop-blur-md border-white/10 py-3"
                    : "bg-transparent border-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                        CF
                    </div>
                    <span className="text-white font-bold text-lg tracking-wide uppercase group-hover:text-purple-300 transition-colors">
                        Capital of Fusion
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                                        ? "text-purple-400"
                                        : "text-white/70 hover:text-white"
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <User className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/90 backdrop-blur-xl overflow-hidden border-b border-white/10"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 text-white/80 hover:text-purple-400 text-lg font-medium"
                                >
                                    {link.icon && <link.icon className="w-5 h-5" />}
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 text-white/50 hover:text-white text-sm pt-4 border-t border-white/10"
                            >
                                <Shield className="w-4 h-4" />
                                Administration
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
