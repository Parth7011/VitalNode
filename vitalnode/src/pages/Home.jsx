import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Specialties from '../components/Specialties';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import FeaturedDoctors from '../components/FeaturedDoctors';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

// Home page component, the main landing page of the application
const Home = () => {
    return (
        <div className="app-container bg-bg-soft font-sans selection:bg-primary-green selection:text-white">
            <Navbar />
            <main className="content-area">
                <Hero />
                <Specialties />
                <HowItWorks />
                <WhyChooseUs />
                <FeaturedDoctors />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
