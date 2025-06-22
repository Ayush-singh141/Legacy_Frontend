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

export default function Connectfamilytree() {
    return (

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="vintage-title text-4xl mb-4">Connect Your Family Tree</h2>
                        <p className="handwritten-text text-2xl text-vintage-600">
                            Build your legacy together
                        </p>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <div className="relative max-w-md mx-auto">
                                <div className="absolute -inset-4 bg-sepia-200 rounded-2xl transform rotate-2"></div>
                                <div className="relative bg-vintage-800 rounded-xl shadow-xl overflow-hidden">
                                    <div className="p-6 text-white">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-vintage text-xl">Family Network</h3>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map((item) => (
                                                    <div key={item} className="h-10 w-10 rounded-full bg-sepia-500 border-2 border-vintage-800"></div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { name: "You", role: "Admin", status: "Active" },
                                                { name: "Sarah (Mom)", role: "Contributor", status: "Active" },
                                                { name: "David (Dad)", role: "Viewer", status: "Active" },
                                                { name: "Grandma Ellie", role: "Contributor", status: "Invited" }
                                            ].map((person, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-vintage-700 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-sepia-500 mr-3"></div>
                                                        <div>
                                                            <p className="font-medium">{person.name}</p>
                                                            <p className="text-xs text-sepia-300">{person.role}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${person.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                                                        {person.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="mt-6 w-full py-2 bg-sepia-600 hover:bg-sepia-500 rounded-lg text-sm font-medium transition-colors">
                                            + Invite Family Member
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2"
                        >
                            <h2 className="vintage-title text-3xl mb-6">Build Your Family Legacy Together</h2>
                            <p className="text-vintage-700 text-lg mb-6">
                                LegacyVault makes it easy to involve your entire family in preserving your shared history:
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="bg-sepia-200 text-sepia-800 rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-vintage-800"><strong>Invite family members</strong> with different permission levels (Admin, Contributor, Viewer)</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-sepia-200 text-sepia-800 rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-vintage-800"><strong>Collaborative timelines</strong> where multiple family members can contribute to the same memory</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-sepia-200 text-sepia-800 rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-vintage-800"><strong>Family tree builder</strong> to visualize relationships and connections</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="bg-sepia-200 text-sepia-800 rounded-full p-1 mr-3 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-vintage-800"><strong>Private family messaging</strong> to discuss and reminisce about shared memories</span>
                                </li>
                            </ul>

                            <div className="mt-8">
                                <Link
                                    to="/family"
                                    className="inline-flex items-center btn-primary px-6 py-3"
                                >
                                    <UserGroupIcon className="h-5 w-5 mr-2" />
                                    Explore Family Features
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
    )
}
