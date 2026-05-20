import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

// Specialties component to showcase different medical departments available on the platform
const Specialties = () => {
    // Hooks to trigger animations when the component scrolls into view
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();
    const { ref: gridRef, isVisible: isGridVisible } = useScrollReveal();

    const specialtyItems = [
        {
            id: 1,
            title: "Cardiology",
            slug: "cardiology",
            description: "Expert care for heart health including diagnosis, prevention, and treatment of cardiovascular conditions using advanced medical technology.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Dermatology",
            slug: "dermatology",
            description: "Comprehensive skin care treatments for acne, allergies, infections, and cosmetic skin concerns from certified specialists.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Pediatrics",
            slug: "pediatrics",
            description: "Dedicated healthcare services for infants, children, and adolescents ensuring healthy development and early disease prevention.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Neurology",
            slug: "neurology",
            description: "Specialized treatment for brain, nerve, and spine disorders including migraines, seizures, and neurological conditions.",
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    ];

    return (
        <section id="specialties" className="py-24 bg-gradient-to-b from-white to-[#f5fbf7] relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-green/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-green/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div 
                    ref={headerRef}
                    className={`text-center mb-20 transition-all duration-1000 ease-out transform ${
                        isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                >
                    <h4 className="text-primary-green font-black tracking-widest uppercase text-sm mb-4">Our Departments</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">Reliable Healthcare Units</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary-green to-[#9ED9AB] mx-auto mt-6 rounded-full"></div>
                </div>

                <div 
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {specialtyItems.map((item, idx) => (
                        <div
                            key={item.id}
                            style={{ transitionDelay: `${idx * 150}ms` }}
                            className={`bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(15,165,85,0.12)] border border-gray-100 hover:border-primary-green/30 group hover:-translate-y-2 transition-all duration-700 ease-out flex flex-col h-full transform ${
                                isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                            }`}
                        >
                            <div className="w-20 h-20 bg-[#e8f7ec] text-primary-green rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-primary-green group-hover:text-white transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-lg group-hover:-rotate-3">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-black text-text-dark mb-4">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-base flex-grow">
                                {item.description}
                            </p>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Link 
                                    to={`/departments/${item.slug}`}
                                    className="text-primary-green font-bold flex items-center gap-2 group-hover:text-[#0c8a3c] transition-colors"
                                >
                                    View Doctors
                                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Specialties;
