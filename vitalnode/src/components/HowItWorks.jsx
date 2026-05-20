import { useScrollReveal } from '../hooks/useScrollReveal';

// HowItWorks component detailing the step-by-step process of using the platform
const HowItWorks = () => {
    // Use custom hook for scroll reveal animations
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal();
    const { ref: gridRef, isVisible: isGridVisible } = useScrollReveal();

    const steps = [
        {
            id: 1,
            title: "Search for Doctors",
            description: "Browse through a wide range of medical specialists and departments to find the right doctor for your needs.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Choose Specialty",
            description: "Select the department or specialty that matches your health concern and view available experts.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Book Appointment",
            description: "Choose a convenient date and time and confirm your appointment within seconds.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Get Consultation",
            description: "Meet your doctor in person or through consultation and receive expert medical care.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Medical Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div 
                    ref={headerRef}
                    className={`text-center mb-24 transition-all duration-1000 ease-out transform ${
                        isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                >
                    <h4 className="text-primary-green font-black tracking-widest uppercase text-sm mb-4">Patient Journey</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">Easy Steps for Healthy Life</h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary-green to-[#9ED9AB] mx-auto mt-6 rounded-full"></div>
                </div>

                <div 
                    ref={gridRef}
                    className="relative"
                >
                    {/* Visual Connector - Horizontal Line (Desktop only) */}
                    <div className={`hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary-green/10 via-primary-green/40 to-primary-green/10 -z-10 rounded-full transition-all duration-1000 delay-300 ${
                        isGridVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                    } origin-left`}></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                        {steps.map((step, index) => (
                            <div 
                                key={step.id} 
                                style={{ transitionDelay: `${index * 200}ms` }}
                                className={`relative text-center group flex flex-col items-center transition-all duration-700 ease-out transform ${
                                    isGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                                }`}
                            >
                                {/* Mobile/Tablet Vertical Connector Line - Not visible on Desktop */}
                                {index !== steps.length - 1 && (
                                    <div className="lg:hidden absolute top-[100px] bottom-[-48px] left-1/2 w-[2px] bg-gradient-to-b from-primary-green/40 to-transparent -z-10 -translate-x-1/2"></div>
                                )}

                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary-green group-hover:bg-primary-green group-hover:text-white transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:shadow-[0_20px_40px_rgb(15,165,85,0.25)] transform group-hover:-translate-y-2 border-4 border-[#f5fbf7] group-hover:border-white z-10">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-text-dark shadow-xl rounded-full flex items-center justify-center font-black text-white border-[3px] border-white transition-all duration-500 group-hover:scale-110 group-hover:bg-primary-green z-20 group-hover:rotate-12">
                                        {step.id}
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-black text-text-dark mb-4">{step.title}</h3>
                                <p className="text-gray-500 max-w-xs leading-relaxed text-base">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
