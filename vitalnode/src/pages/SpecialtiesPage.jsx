import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Specialties from '../components/Specialties';

// SpecialtiesPage component that wraps the Specialties section for a standalone page
const SpecialtiesPage = () => {
    return (
        <div className="app-container bg-bg-soft font-sans selection:bg-primary-green selection:text-white min-h-screen flex flex-col">
            <Navbar />
            <main className="content-area flex-grow flex flex-col justify-center pt-12 pb-0">
                <div className="mb-0">
                    <Specialties />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SpecialtiesPage;
