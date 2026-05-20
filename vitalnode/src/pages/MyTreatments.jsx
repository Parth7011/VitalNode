import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import TreatmentOverview from '../components/dashboard/TreatmentOverview';
import { useAuth } from '../context/AuthContext';

// MyTreatments page — dedicated full page for viewing all treatments
const MyTreatments = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-bg-soft flex overflow-hidden">
            <DashboardSidebar />

            <main className="flex-1 overflow-y-auto h-screen p-8 lg:p-12">
                <div className="max-w-5xl mx-auto">
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <span className="text-primary-green font-black uppercase tracking-[0.3em] text-[10px]">Healthcare Journey</span>
                            <h1 className="text-3xl font-bold text-text-dark mt-1">My <span className="text-primary-green">Treatments</span></h1>
                            <p className="text-gray-400 text-sm mt-1">Track your ongoing and completed treatments in one place.</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-green rounded-2xl overflow-hidden shadow-lg border-2 border-white shadow-primary-green/20">
                            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2BB673&color=fff`} alt="Profile" />
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        <StatCard
                            label="Total Treatments"
                            storageKey="total"
                            icon={
                                <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Ongoing"
                            storageKey="ongoing"
                            icon={
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Completed"
                            storageKey="completed"
                            icon={
                                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Full Treatment Overview */}
                    <TreatmentOverview fullPage={true} />
                </div>
            </main>
        </div>
    );
};

// Small stat card component used in the MyTreatments page header
const StatCard = ({ label, storageKey, icon }) => {
    const treatments = JSON.parse(localStorage.getItem('vitalnode_treatments') || '[]');
    let count = 0;
    if (storageKey === 'total') count = treatments.length;
    else if (storageKey === 'ongoing') count = treatments.filter(t => t.status === 'ongoing').length;
    else if (storageKey === 'completed') count = treatments.filter(t => t.status === 'completed').length;

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-text-dark">{count}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
        </div>
    );
};

export default MyTreatments;
