export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm">
                <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    BachataVibe V4
                </h1>
                <p className="text-center text-xl mb-4">
                    Bienvenue sur la V4 de BachataVibe
                </p>
                <p className="text-center text-lg text-gray-400">
                    Capital of Fusion France - Plateforme de danse Bachata
                </p>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border border-gray-700 rounded-lg hover:border-primary transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-primary">✅ Backend Django</h3>
                        <p className="text-gray-400">API REST avec 6 apps modulaires</p>
                    </div>
                    <div className="p-6 border border-gray-700 rounded-lg hover:border-primary transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-primary">✅ Frontend Next.js</h3>
                        <p className="text-gray-400">TypeScript + Tailwind + V2 Design</p>
                    </div>
                    <div className="p-6 border border-gray-700 rounded-lg hover:border-primary transition-colors">
                        <h3 className="text-xl font-semibold mb-2 text-secondary">🚀 Phase 1 Complete</h3>
                        <p className="text-gray-400">Infrastructure prête pour le développement</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
