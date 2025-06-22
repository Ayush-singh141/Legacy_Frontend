
import { motion } from 'framer-motion';

export default function Testimonial() {
    return (
        <section className="py-20 bg-sepia-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="vintage-title text-4xl mb-4">Loved by Families Worldwide</h2>
                    <p className="handwritten-text text-2xl text-vintage-600">
                        Stories from our community
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            quote: "LegacyVault helped me preserve my grandmother's stories before she passed. Now her voice and memories live on for my children.",
                            author: "Priya M., Mumbai",
                            role: "Granddaughter"
                        },
                        {
                            quote: "As a military family always on the move, this keeps us connected to our roots. The kids love hearing stories from back home.",
                            author: "The Johnson Family",
                            role: "Military Family"
                        },
                        {
                            quote: "I've scanned hundreds of old family photos and organized them by decade. My grandchildren can now explore our history with a click.",
                            author: "Robert T., London",
                            role: "Family Historian"
                        }
                    ].map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                        >
                            <div className="text-sepia-500 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-vintage-700 italic mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                {/* <div className="h-12 w-12 rounded-full bg-sepia-300 mr-4"></div> */}
                                <div>
                                    <p className="font-vintage font-semibold text-vintage-900">{testimonial.author}</p>
                                    <p className="text-sm text-sepia-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
