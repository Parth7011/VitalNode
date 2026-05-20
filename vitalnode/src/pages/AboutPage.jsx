import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// AboutPage component displays the mission, vision, and features of the VitalNode platform
const AboutPage = () => {
    return (
        <div className="app-container bg-bg-soft">
            <Navbar />
            <main className="content-area pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                
                {/* Hero Section */}
                <section className="text-center space-y-6 pt-8">
                    <h1 className="text-5xl md:text-6xl font-black text-text-dark">
                        About <span className="text-primary-green">VitalNode</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Transforming the future of digital healthcare by bringing exceptional medical expertise directly to you, wherever you are.
                    </p>
                </section>

                {/* Mission & Vision */}
                <section className="grid md:grid-cols-2 gap-12">
                    <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-text-dark mb-4">Our Mission</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Our mission is to democratize access to premium healthcare. We strive to break down geographical barriers and connect patients with world-class medical specialists through a seamless, secure, and user-friendly digital platform.
                        </p>
                    </div>
                    <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 bg-primary-green/10 text-primary-green rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-text-dark mb-4">Our Vision</h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            We envision a world where high-quality healthcare is instantly accessible to everyone. By leveraging cutting-edge technology, we aim to be the global standard for remote patient care and digital medical consultations.
                        </p>
                    </div>
                </section>

                {/* Platform Features */}
                <section>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-text-dark mb-4">Platform Features</h2>
                        <div className="w-24 h-1.5 bg-primary-green mx-auto rounded-full"></div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Online Consultations", desc: "HD video calls with doctors.", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
                            { title: "Digital Prescriptions", desc: "Instant secure prescriptions.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                            { title: "Certified Specialists", desc: "Top-tier medical professionals.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
                            { title: "Instant Booking", desc: "No waiting, book immediately.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl text-center border border-gray-100 hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                                <div className="w-16 h-16 bg-bg-soft rounded-full flex items-center justify-center text-primary-green mx-auto mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-xl text-text-dark mb-2">{feature.title}</h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How VitalNode Works & Why Choose */}
                <section className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-text-dark">How VitalNode Works</h2>
                        <div className="space-y-6">
                            {[
                                { step: "1", text: "Search for a specialist" },
                                { step: "2", text: "Book an appointment" },
                                { step: "3", text: "Have a video consultation" },
                                { step: "4", text: "Receive a digital prescription" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-primary-green text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-lg">
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-text-dark">{item.text}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary-green text-white p-12 rounded-[40px] shadow-xl">
                        <h2 className="text-4xl font-black mb-8">Why Choose VitalNode</h2>
                        <ul className="space-y-6">
                            {[
                                "500+ Board Certified Doctors",
                                "100% Secure & Private Consultations",
                                "Fast & Flexible Appointments",
                                "Integrated Digital Prescriptions"
                            ].map((adv, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-lg font-semibold">
                                    <svg className="w-6 h-6 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {adv}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Call To Action */}
                <section className="bg-white rounded-[50px] p-16 text-center shadow-xl border border-gray-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <h2 className="text-4xl font-black text-text-dark mb-6 relative z-10">Ready to Prioritize Your Health?</h2>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto relative z-10">
                        Join thousands of patients who trust VitalNode for their digital healthcare needs. Get started today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
                        <Link to="/doctors" className="bg-[#B0E5BD] text-[#0f172a] hover:bg-[#9ED9AB] px-10 py-4 rounded-full font-bold text-lg shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all transform hover:scale-105 active:scale-95">
                            Find Doctors
                        </Link>
                        <Link to="/book-appointment" className="bg-primary-green text-white hover:bg-secondary-green px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary-green/20 transition-all transform hover:scale-105 active:scale-95">
                            Book Appointment
                        </Link>
                    </div>
                </section>

            </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
