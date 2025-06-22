import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpenIcon,
    HeartIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    FilmIcon,
    MicrophoneIcon,
    DocumentTextIcon,
    CalendarIcon,
    MapIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
export default function Multimedia() {
    return (

            <section className="py-20 bg-sepia-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-full h-full border-2 border-sepia-300 rounded-lg z-0"></div>
                                <div className="relative z-10 bg-white p-1 rounded-lg shadow-lg">
                                    <div className="bg-vintage-900 rounded-md p-4 text-white">
                                        <div className="flex space-x-2 mb-3">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-sepia-700 h-24 rounded flex items-center justify-center">
                                                <FilmIcon className="h-8 w-8 text-sepia-300" />
                                            </div>
                                            <div className="bg-sepia-700 h-24 rounded flex items-center justify-center">
                                                <MicrophoneIcon className="h-8 w-8 text-sepia-300" />
                                            </div>
                                            <div className="bg-sepia-700 h-24 rounded flex items-center justify-center">
                                                <DocumentTextIcon className="h-8 w-8 text-sepia-300" />
                                            </div>
                                            <div className="bg-sepia-800 h-24 rounded flex items-center justify-center col-span-2">
                                                <div className="text-center">
                                                    <p className="text-sepia-300 text-sm">Family Reunion 2023</p>
                                                    <p className="text-sepia-200 text-xs">12 photos • 3 videos</p>
                                                </div>
                                            </div>
                                            <div className="bg-sepia-700 h-24 rounded flex items-center justify-center">
                                                <HeartIcon className="h-8 w-8 text-sepia-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <h2 className="vintage-title text-4xl mb-6">Bring Memories to Life</h2>
                            <p className="text-vintage-700 text-lg mb-6">
                                LegacyVault supports all your precious memory formats in one secure place:
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-sepia-200 p-2 rounded-full mr-4">
                                        <FilmIcon className="h-6 w-6 text-sepia-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-vintage font-semibold text-xl text-vintage-900 mb-1">Photos & Videos</h3>
                                        <p className="text-vintage-600">Upload high-resolution images and videos with automatic date detection and organization.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-sepia-200 p-2 rounded-full mr-4">
                                        <MicrophoneIcon className="h-6 w-6 text-sepia-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-vintage font-semibold text-xl text-vintage-900 mb-1">Voice Stories</h3>
                                        <p className="text-vintage-600">Record voice memories directly or upload existing audio files to accompany your stories.</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-sepia-200 p-2 rounded-full mr-4">
                                        <DocumentTextIcon className="h-6 w-6 text-sepia-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-vintage font-semibold text-xl text-vintage-900 mb-1">Written Memories</h3>
                                        <p className="text-vintage-600">Add written stories, letters, recipes, or any text-based memories with rich formatting.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
    )
}
