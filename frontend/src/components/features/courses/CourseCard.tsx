"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
    course: {
        id: string;
        name: string;
        slug: string;
        description: string;
        level_name: string;
        style_name: string;
        image?: string;
        schedules: any[];
    };
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-colors duration-500 shadow-2xl"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] to-transparent z-10 opacity-60" />
                {course.image ? (
                    <Image
                        src={course.image}
                        alt={course.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-emerald-400/20" />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        {course.style_name}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90">
                        {course.level_name}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                    {course.name}
                </h3>
                <p className="text-sm text-white/60 mb-6 line-clamp-2 font-medium leading-relaxed">
                    {course.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/40">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                            {course.schedules?.[0]?.day_of_week || "À venir"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                            {course.schedules?.[0]?.location_name || "Lieu TBA"}
                        </span>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0e27] bg-white/10 flex items-center justify-center">
                                <Users className="w-3 h-3 text-white/30" />
                            </div>
                        ))}
                        <span className="ml-4 text-[10px] font-bold text-white/30 uppercase flex items-center">
                            +12 inscrits
                        </span>
                    </div>

                    <Link
                        href={`/cours/${course.slug}`}
                        className="p-2 rounded-xl bg-white/5 hover:bg-blue-600 text-white/50 hover:text-white transition-all duration-300 group/btn"
                    >
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
