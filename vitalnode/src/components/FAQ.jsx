import { useState } from 'react';

// FAQ component to display frequently asked questions in an accordion format
const FAQ = () => {
    // State to track which FAQ item is currently expanded
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "Booking is easy. Browse our departments or doctors, click 'Book Appointment', choose your preferred time slot, and confirm. You will receive an instant link for your video consultation."
        },
        {
            question: "Is my medical consultation private and secure?",
            answer: "Absolutely. We use end-to-end encryption for all video calls and follow strict HIPAA guidelines. Your consultation data is strictly confidential and never shared."
        },
        {
            question: "Can I receive digital prescriptions?",
            answer: "Yes, our certified doctors can issue digital prescriptions at the end of your consultation. These are accepted at all major pharmacies nationwide."
        },
        {
            question: "What is your refund policy?",
            answer: "We offer a full refund if the doctor is unable to join the call or if there's a technical failure on our end. Requests must be made within 24 hours of the scheduled time."
        }
    ];

    return (
        <section className="py-24 bg-bg-soft">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h4 className="text-primary-green font-bold tracking-widest uppercase text-sm mb-4">Common Queries</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">Frequently Asked Questions</h2>
                    <div className="w-24 h-1.5 bg-primary-green mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-[32px] overflow-hidden transition-all duration-500 border-2 ${openIndex === index ? 'border-primary-green shadow-xl' : 'border-white shadow-sm'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                className="w-full px-10 py-8 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className={`text-xl font-bold transition-colors ${openIndex === index ? 'text-primary-green' : 'text-text-dark'}`}>{faq.question}</span>
                                <span className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-primary-green text-white rotate-180' : 'bg-bg-soft text-primary-green'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-10 pb-8 text-lg text-gray-500 leading-relaxed border-t border-gray-50 pt-6">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
