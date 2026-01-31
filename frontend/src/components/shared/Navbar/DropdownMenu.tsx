"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { MenuItem } from "@/types/menu";

interface DropdownMenuProps {
    item: MenuItem;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    isActive: boolean;
}

/**
 * Get a Lucide icon component by name
 */
function getIcon(iconName: string): React.ElementType | null {
    if (!iconName) return null;
    // Convert icon name to PascalCase for Lucide
    const Icon = (LucideIcons as Record<string, React.ElementType>)[iconName];
    return Icon || null;
}

export default function DropdownMenu({
    item,
    isOpen,
    onOpen,
    onClose,
    isActive,
}: DropdownMenuProps) {
    const hasChildren = item.children && item.children.length > 0;
    const Icon = getIcon(item.icon);

    // If no children, render a simple link
    if (!hasChildren) {
        return (
            <Link
                href={item.url}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                        ? "text-purple-400"
                        : "text-white/70 hover:text-white"
                }`}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {item.name}
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
        >
            {/* Trigger button */}
            <button
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    isActive || isOpen
                        ? "text-purple-400"
                        : "text-white/70 hover:text-white"
                }`}
                onClick={onOpen}
            >
                {Icon && <Icon className="w-4 h-4" />}
                {item.name}
                <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 min-w-[220px] py-2 bg-black/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl shadow-black/50"
                    >
                        {/* Arrow pointer */}
                        <div className="absolute -top-1.5 left-4 w-3 h-3 bg-black/95 border-l border-t border-white/10 rotate-45" />
                        
                        {/* Parent link */}
                        <Link
                            href={item.url}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/90 hover:text-purple-400 hover:bg-white/5 transition-colors border-b border-white/5 mb-1"
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            Voir tout
                        </Link>

                        {/* Children links */}
                        {item.children.map((child) => {
                            const ChildIcon = getIcon(child.icon);
                            return (
                                <Link
                                    key={child.id}
                                    href={child.url}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    {ChildIcon && (
                                        <ChildIcon className="w-4 h-4 text-purple-400/70" />
                                    )}
                                    {child.name}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
