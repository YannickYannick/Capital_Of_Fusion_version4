import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "BachataVibe V4",
    description: "Plateforme de danse Bachata - Capital of Fusion France",
};

import Providers from "@/components/shared/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={inter.variable}>
            <body className="antialiased font-sans">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
