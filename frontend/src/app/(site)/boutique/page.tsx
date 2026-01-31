"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, Sparkles, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function ShopPage() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/shop/products/');
            return res.data.results;
        }
    });

    const addToCart = useCartStore((state) => state.addToCart);
    const cartItemsCount = useCartStore((state) => state.items.length);

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-4">
                                <Sparkles className="w-4 h-4" />
                                Official Merch
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                                STYLEZ VOTRE <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-400">PASSION</span>
                            </h1>
                        </motion.div>
                    </div>

                    <button className="relative p-6 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group overflow-hidden">
                        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        {cartItemsCount > 0 && (
                            <span className="absolute top-4 right-4 w-5 h-5 flex items-center justify-center bg-blue-600 rounded-full text-[10px] font-black">
                                {cartItemsCount}
                            </span>
                        )}
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products?.map((product: any) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="group relative">
                                <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-4 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60" />
                                    {product.image ? (
                                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                            <ShoppingBag className="w-20 h-20" />
                                        </div>
                                    )}

                                    <button
                                        onClick={() => addToCart(product)}
                                        className="absolute bottom-4 right-4 z-20 p-4 rounded-2xl bg-blue-600 text-white shadow-xl hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>

                                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-yellow-400 text-[10px] font-bold">
                                            <Star className="w-3 h-3 fill-current" />
                                            4.9
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
                                        Collection 2026
                                    </p>
                                    <p className="text-blue-400 font-black text-lg tracking-tighter">
                                        {product.price}€
                                    </p>
                                </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
