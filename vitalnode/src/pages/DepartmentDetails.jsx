import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { departmentDetails } from '../data/departmentDetails';

// DepartmentDetails component displays detailed information about a specific medical department
const DepartmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    // Fetch department details from local data
    const department = departmentDetails[id];

    // Handle case where department is not found
    if (!department) {
        return (
            <div className="app-container bg-bg-soft pt-24">
                <Navbar />
                <main className="content-area flex items-center justify-center flex-col">
                    <h2 className="text-3xl font-bold text-text-dark mb-4">Department Not Found</h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-[#B0E5BD] text-[#0f172a] rounded-[10px] px-[18px] py-[10px] font-semibold transition-all duration-200 ease-in-out hover:bg-[#9ED9AB] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] active:scale-[0.98]"
                    >
                        Back to Home
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container bg-bg-soft pt-24">
            <Navbar />
            
            <main className="content-area max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-green transition-colors font-medium mb-8"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Departments
                </button>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="bg-primary-green/5 p-10 text-center border-b border-gray-50 relative overflow-hidden">
                        <div className="w-24 h-24 bg-white text-primary-green rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm relative z-10">
                            {department.icon}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-dark mb-4 relative z-10">{department.title}</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed relative z-10">
                            {department.description}
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 hidden md:block"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-green/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 hidden md:block"></div>
                    </div>

                    <div className="p-8 pb-12 sm:p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
                        
                        <div className="space-y-12">
                            <section>
                                <h3 className="text-2xl font-bold text-text-dark mb-6 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary-green rounded-full"></div>
                                    Conditions Treated
                                </h3>
                                <ul className="space-y-4">
                                    {department.conditionsTreated.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <span className="text-gray-600 font-medium text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-2xl font-bold text-text-dark mb-6 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary-green rounded-full"></div>
                                    Services Offered
                                </h3>
                                <ul className="space-y-4">
                                    {department.servicesOffered.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-primary-green/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            <span className="text-gray-600 font-medium text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-12">
                            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative">
                                <h3 className="text-xl font-bold text-text-dark mb-4">When to Visit This Specialist?</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {department.whenToVisit}
                                </p>
                            </section>

                            <section className="bg-primary-green/5 rounded-3xl p-8 border border-primary-green/10 relative">
                                <h3 className="text-xl font-bold text-primary-green mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Preventive Care Tips
                                </h3>
                                <p className="text-gray-700 leading-relaxed font-medium">
                                    {department.preventiveTips}
                                </p>
                            </section>
                            
                            <div className="pt-4">
                                <button 
                                    onClick={() => navigate(isAuthenticated ? '/book-appointment' : '/login')}
                                    className="w-full bg-[#B0E5BD] text-[#0f172a] rounded-[10px] px-[18px] py-[16px] font-semibold text-lg hover:bg-[#9ED9AB] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-200 transform active:scale-[0.98] flex justify-center items-center gap-2"
                                >
                                    Book Appointment
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DepartmentDetails;
