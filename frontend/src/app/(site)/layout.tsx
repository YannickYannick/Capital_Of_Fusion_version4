import Navbar from "@/components/shared/Navbar/Navbar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-background">
            <Navbar />
            {children}
        </div>
    );
}
