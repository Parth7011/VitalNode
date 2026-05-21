import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../context/DoctorsContext';

const SmartRecommendation = () => {
    const navigate = useNavigate();
    const { doctors } = useDoctors();

    const getDoctorImage = (doc) => {
        if (!doctors || doctors.length === 0) return doc.image;
        const cleanName = (name) => name.toLowerCase().replace(/^dr\.\s*/, '').trim();
        const docClean = cleanName(doc.name);
        const matched = doctors.find(d => cleanName(d.name) === docClean);
        return matched?.image || matched?.profileImage || doc.image || '/images/placeholder-doctor.png';
    };
    const [symptoms, setSymptoms] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock data for recommendations based on keywords
    const database = [
        {
            keywords: ['heart', 'chest', 'pain', 'pressure', 'palpitations'],
            disease: 'Possible Cardiovascular Issue',
            specialty: 'Cardiology',
            recoveryTime: 'Variable based on diagnosis',
            visits: 'Initial consultation + follow-ups',
            precautions: ['Avoid heavy exertion', 'Monitor blood pressure', 'Reduce sodium intake'],
            doctors: [{ id: 1, name: 'Dr. Sarah Johnson', image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=2BB673&color=fff' }]
        },
        {
            keywords: ['headache', 'migraine', 'dizzy', 'numbness', 'vision'],
            disease: 'Neurological Symptom',
            specialty: 'Neurology',
            recoveryTime: 'Varies',
            visits: '1-3 visits for diagnosis',
            precautions: ['Rest in a dark room', 'Stay hydrated', 'Track symptom triggers'],
            doctors: [{ id: 2, name: 'Dr. Michael Chen', image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=2BB673&color=fff' }]
        },
        {
            keywords: ['stomach', 'pain', 'nausea', 'vomit', 'acid'],
            disease: 'Gastrointestinal Distress',
            specialty: 'Gastroenterology',
            recoveryTime: '1-2 weeks',
            visits: '1-2 visits',
            precautions: ['Eat bland foods', 'Stay hydrated', 'Avoid spicy or fatty foods'],
            doctors: [{ id: 3, name: 'Dr. Emily Davis', image: 'https://ui-avatars.com/api/?name=Emily+Davis&background=2BB673&color=fff' }]
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!symptoms.trim()) return;

        setLoading(true);
        setRecommendation(null);

        setTimeout(() => {
            const input = symptoms.toLowerCase();
            const found = database.find(entry => entry.keywords.some(kw => input.includes(kw)));
            
            if (found) {
                setRecommendation(found);
            } else {
                setRecommendation({
                    disease: 'General Consultation Needed',
                    specialty: 'General Medicine',
                    recoveryTime: 'To be determined',
                    visits: '1 initial visit',
                    precautions: ['Monitor symptoms', 'Rest', 'Stay hydrated'],
                    doctors: [{ id: 4, name: 'Dr. Alan Walker', image: 'https://ui-avatars.com/api/?name=Alan+Walker&background=2BB673&color=fff' }]
                });
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-green/5 rounded-bl-[100px]" />
            
            <h2 className="text-xl font-bold text-text-dark mb-2 relative z-10">Smart AI Recommendation</h2>
            <p className="text-sm text-gray-400 mb-6 relative z-10">Describe your symptoms to get directed to the right specialist.</p>

            <form onSubmit={handleSearch} className="mb-8 relative z-10">
                <div className="relative group focus-within:border-primary-green transition-all">
                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none text-text-dark text-sm min-h-[100px] resize-none focus:border-primary-green transition-colors"
                        placeholder="e.g. I've been having sharp chest pains and shortness of breath for the last two days..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-primary-green text-white rounded-[10px] px-[18px] py-[12px] font-bold text-sm shadow-lg shadow-primary-green/20 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Analyzing...
                        </>
                    ) : 'Analyze Symptoms'}
                </button>
            </form>

            {recommendation && (
                <div className="animate-fadeInUp space-y-6">
                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                        <h3 className="font-bold text-blue-900 mb-1">{recommendation.disease}</h3>
                        <p className="text-xs text-blue-700">Recommended Specialty: <strong className="uppercase">{recommendation.specialty}</strong></p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Visits</span>
                            <p className="font-semibold text-text-dark">{recommendation.visits}</p>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Recovery</span>
                            <p className="font-semibold text-text-dark">{recommendation.recoveryTime}</p>
                        </div>
                    </div>

                    <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precautions</span>
                        <ul className="list-disc list-inside text-sm text-text-dark space-y-1">
                            {recommendation.precautions.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                    </div>

                    <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Recommended Doctors</span>
                        <div className="space-y-3">
                            {recommendation.doctors.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-primary-green transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={getDoctorImage(doc)} 
                                            alt={doc.name} 
                                            className="w-10 h-10 rounded-xl object-cover" 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/placeholder-doctor.png';
                                            }}
                                        />
                                        <div>
                                            <h4 className="font-bold text-text-dark text-sm">{doc.name}</h4>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{recommendation.specialty}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/doctors')}
                                        className="text-primary-green text-xs font-bold hover:underline"
                                    >
                                        Book
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartRecommendation;
