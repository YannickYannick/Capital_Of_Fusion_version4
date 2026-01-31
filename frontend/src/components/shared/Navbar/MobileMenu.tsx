"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shield } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MobileMenuProps {
    items: MenuItem[];
    isOpen: boolean;
    onClose: () => void;
}

interface AccordionItemProps {
    item: MenuItem;
    onClose: () => void;
}

/**
 * Get a Lucide icon component by name
 */
function getIcon(iconName: string): React.ElementType | null {
    if (!iconName) return null;
    const Icon = (LucideIcons as Record<string, React.ElementType>)[iconName];
    return Icon || null;
}

function AccordionItem({ item, onClose }: AccordionItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = getIcon(item.icon);

    if (!hasChildren) {
        return (
            <Link
                href={item.url}
                onClick={onClose}
                className="flex items-center gap-3 py-3 text-white/80 hover:text-purple-400 text-lg font-medium transition-colors"
            >
                {Icon && <Icon className="w-5 h-5" />}
                {item.name}
            </Link>
        );
    }

    return (
        <div className="border-b border-white/5 last:border-b-0">
            {/* Accordion header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full py-3 text-white/80 hover:text-purple-400 text-lg font-medium transition-colors"
            >
                <span className="flex items-center gap-3">
                    {Icon && <Icon className="w-5 h-5" />}
                    {item.name}
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Accordion content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-3 pl-4 space-y-1">
                            {/* "Voir tout" link */}
                            <Link
                                href={item.url}
                                onClick={onClose}
                                className="flex items-center gap-3 py-2 text-white/60 hover:text-purple-400 text-base transition-colors"
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                Voir tout
                            </Link>
                            
                            {/* Children */}
                            {item.children.map((child) => {
                                const ChildIcon = getIcon(child.icon);
                                return (
                                    <Link
                                        key={child.id}
                                        href={child.url}
                                        onClick={onClose}
                                        className="flex items-center gap-3 py-2 text-white/60 hover:text-purple-400 text-base transition-colors"
                                    >
                                        {ChildIcon && (
                                            <ChildIcon className="w-4 h-4 text-purple-400/50" />
                                        )}
                                        {child.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-black/90 backdrop-blur-xl overflow-hidden border-b border-white/10"
                >
                    <div className="flex flex-col p-6 space-y-1 max-h-[70vh] overflow-y-auto">
                        {/* Menu items */}
                        {items.map((item) => (
                            <AccordionItem
                                key={item.id}
                                item={item}
                                onClose={onClose}
                            />
                        ))}

                        {/* Admin link */}
                        <Link
                            href="/admin"
                            onClick={onClose}
                            className="flex items-center gap-3 text-white/50 hover:text-white text-sm pt-4 mt-2 border-t border-white/10"
                        >
                            <Shield className="w-4 h-4" />
                            Administration
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
