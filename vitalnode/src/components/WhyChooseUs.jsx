import { useNavigate } from 'react-router-dom';

// WhyChooseUs component highlighting the benefits and features of the VitalNode platform
const WhyChooseUs = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-green/5 -skew-x-12 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: Professional Image */}
                    <div className="lg:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-primary-green/10 rounded-[60px] blur-2xl group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative rounded-[50px] shadow-2xl border-[12px] border-white shadow-primary-green/10 img-zoom-container">
                            <img
                                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800&h=1000"
                                alt="Expert Medical Care"
                                className="img-cover-rounded"
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                        <h4 className="text-secondary-green font-black tracking-widest uppercase text-sm">About VitalNode</h4>
                        <h2 className="text-4xl md:text-5xl font-black text-text-dark leading-tight">
                            About Our Online <br />
                            <span className="text-primary-green">Healthcare Platform</span>
                        </h2>
                        <div className="w-20 h-2 bg-primary-green rounded-full mx-auto lg:mx-0"></div>

                        <p className="text-xl text-gray-500 leading-relaxed">
                            VitalNode is a pioneer in bringing premium healthcare to your doorstep. Our platform connects you with the nation's leading medical experts through a secure, high-definition video interface.
                        </p>

                        <div className="space-y-4 text-left">
                            {[
                                "Access to 500+ Certified Specialists",
                                "100% Secure & Confidential Consultations",
                                "Instant Digital Prescriptions",
                                "No Waiting Time, Immediate Booking"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-primary-green text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-lg font-bold text-text-dark">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => navigate('/about')}
                            className="btn-modern bg-primary-green hover:bg-secondary-green text-white px-10 py-4 text-lg active:scale-95"
                        >
                            Read More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
