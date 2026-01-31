"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { fetchMenuItems } from "@/lib/api";
import { MenuItem } from "@/types/menu";
import DropdownMenu from "./DropdownMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    // Fetch menu items from API
    useEffect(() => {
        async function loadMenu() {
            setIsLoading(true);
            const items = await fetchMenuItems();
            setMenuItems(items);
            setIsLoading(false);
        }
        loadMenu();
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Check if a menu item or any of its children is active
    const isItemActive = (item: MenuItem): boolean => {
        if (pathname === item.url) return true;
        if (pathname.startsWith(item.url + "/")) return true;
        return item.children?.some((child) => pathname === child.url) || false;
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
                isScrolled || isMobileMenuOpen
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
                <div className="hidden md:flex items-center gap-6">
                    {/* Home link */}
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors ${
                            pathname === "/"
                                ? "text-purple-400"
                                : "text-white/70 hover:text-white"
                        }`}
                    >
                        Accueil
                    </Link>

                    {/* Dynamic menu items */}
                    {!isLoading &&
                        menuItems.map((item) => (
                            <DropdownMenu
                                key={item.id}
                                item={item}
                                isOpen={openDropdown === item.id}
                                onOpen={() => setOpenDropdown(item.id)}
                                onClose={() => setOpenDropdown(null)}
                                isActive={isItemActive(item)}
                            />
                        ))}

                    {/* Loading skeleton */}
                    {isLoading && (
                        <>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="h-4 w-16 bg-white/10 rounded animate-pulse"
                                />
                            ))}
                        </>
                    )}
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
            <MobileMenu
                items={menuItems}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </nav>
    );
}
