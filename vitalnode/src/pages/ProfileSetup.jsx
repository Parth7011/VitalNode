import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// ProfileSetup page — shown after first signup to collect health information
const ProfileSetup = () => {
    const { user, updateProfile } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [weight, setWeight] = useState(user?.vitals?.weight || '');
    const [height, setHeight] = useState(user?.vitals?.height || '');
    const [previousDiseases, setPreviousDiseases] = useState(user?.vitals?.previousDiseases || '');
    const [currentMedications, setCurrentMedications] = useState(user?.vitals?.currentMedications || '');
    const [bloodGroup, setBloodGroup] = useState(user?.vitals?.bloodGroup || '');
    const [allergies, setAllergies] = useState(user?.vitals?.allergies || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({
            vitals: { weight, height, previousDiseases, currentMedications, bloodGroup, allergies }
        });
        showNotification('Health profile saved successfully!', 'success');
        setTimeout(() => {
            navigate('/dashboard');
        }, 1000);
    };

    const handleSkip = () => {
        updateProfile({ vitals: {} });
        navigate('/dashboard');
    };

    // Calculate profile completion percentage based on filled fields
    const fields = [weight, height, previousDiseases, currentMedications, bloodGroup, allergies];
    const filledCount = fields.filter(f => f && f.toString().trim() !== '').length;
    const completionPercent = Math.round((filledCount / fields.length) * 100);

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans overflow-hidden">
            {/* Left Panel: Visual Branding */}
            <div className="md:w-[40%] hero-gradient p-12 flex flex-col items-center justify-center text-white relative text-center min-h-[300px]">
                {/* Decorative elements */}
                <div className="absolute top-20 right-10 w-24 h-24 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-40 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-white/5 blur-3xl rounded-t-[100%]"></div>

                <div className="relative z-10 flex flex-col items-center space-y-8 animate-fadeIn">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-xs font-black">✓</div>
                        <div className="w-12 h-0.5 bg-white/30"></div>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-black text-primary-green">2</div>
                    </div>

                    {/* Icon */}
                    <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                        </svg>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-[0.15em] uppercase">HEALTH PROFILE</h1>
                        <p className="text-lg font-medium text-white/80 max-w-xs leading-relaxed">
                            Help us personalize your <br />healthcare experience
                        </p>
                    </div>

                    {/* Completion indicator */}
                    <div className="w-full max-w-[200px] mt-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                            <span className="text-white/60">Completion</span>
                            <span className="text-white">{completionPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form */}
            <div className="md:w-[60%] bg-white p-8 md:p-16 lg:p-24 flex flex-col justify-center relative overflow-y-auto max-h-screen">
                {/* Geometric decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none opacity-10">
                    <div className="absolute top-[-20px] right-20 w-12 h-12 bg-primary-green rotate-45 rounded-sm"></div>
                    <div className="absolute top-20 right-[-10px] w-16 h-16 bg-secondary-green rotate-45 rounded-sm"></div>
                    <div className="absolute top-40 right-20 w-8 h-8 bg-primary-green rotate-45 rounded-sm"></div>
                </div>

                <div className="max-w-lg w-full mx-auto relative z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-text-dark mb-2 tracking-tight">Complete Your Profile</h2>
                        <p className="text-gray-400 font-bold text-base">Add your health details so we can serve you better. You can always update these later.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        {/* Basic Vitals */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-6 h-6 bg-primary-green/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Basic Vitals</span>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">WEIGHT (KG)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm"
                                        placeholder="e.g. 70"
                                    />
                                </div>
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">HEIGHT (CM)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm"
                                        placeholder="e.g. 175"
                                    />
                                </div>
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1 col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">BLOOD GROUP</label>
                                    <select
                                        value={bloodGroup}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">Select blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Medical History */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-6 h-6 bg-primary-green/10 rounded-lg flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Medical History</span>
                            </div>

                            <div className="space-y-5">
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">PREVIOUS DISEASES</label>
                                    <input
                                        type="text"
                                        value={previousDiseases}
                                        onChange={(e) => setPreviousDiseases(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm"
                                        placeholder="e.g. Asthma, Diabetes (Optional)"
                                    />
                                </div>
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">CURRENT MEDICATIONS</label>
                                    <input
                                        type="text"
                                        value={currentMedications}
                                        onChange={(e) => setCurrentMedications(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm"
                                        placeholder="e.g. Metformin (Optional)"
                                    />
                                </div>
                                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">ALLERGIES</label>
                                    <input
                                        type="text"
                                        value={allergies}
                                        onChange={(e) => setAllergies(e.target.value)}
                                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-sm"
                                        placeholder="e.g. Penicillin, Peanuts (Optional)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-10">
                            <button
                                type="submit"
                                className="w-full bg-[#B0E5BD] text-[#0f172a] rounded-[10px] px-[18px] py-[12px] font-semibold tracking-[0.2em] uppercase text-sm shadow-lg transition-all duration-200 ease-in-out hover:bg-[#9ED9AB] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] active:scale-[0.98]"
                            >
                                SAVE &amp; CONTINUE
                            </button>
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="w-full text-gray-400 hover:text-text-dark py-3 text-[11px] font-black uppercase tracking-[0.25em] transition-colors"
                            >
                                SKIP FOR NOW →
                            </button>
                        </div>

                        <p className="text-center text-gray-300 text-[11px] font-bold mt-6">
                            You can update this information anytime from your profile settings.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
