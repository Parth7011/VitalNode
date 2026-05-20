import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';

// HowItWorksPage component that wraps the HowItWorks section for a standalone page
const HowItWorksPage = () => {
    return (
        <div className="app-container bg-bg-soft font-sans selection:bg-primary-green selection:text-white min-h-screen flex flex-col">
            <Navbar />
            <main className="content-area flex-grow flex flex-col justify-center pt-12 pb-0">
                <div className="mb-0">
                    <HowItWorks />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorksPage;
