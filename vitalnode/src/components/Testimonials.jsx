import { testimonials } from '../data/testimonials';

// Testimonials component to display patient feedback and reviews
const Testimonials = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h4 className="text-primary-green font-bold tracking-widest uppercase text-sm mb-4">Testimonials</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">What Our Patients Say</h2>
                    <div className="w-24 h-1.5 bg-primary-green mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="bg-bg-soft p-12 rounded-[50px] border-2 border-transparent hover:border-primary-green/20 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-2xl group relative"
                        >
                            <div className="absolute -top-6 left-12 w-12 h-12 bg-primary-green rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V4L14.017 3H16.017C18.7784 3 21.017 5.23858 21.017 8V15C21.017 18.866 17.883 22 14.017 22V21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C8.55228 16 9 15.5523 9 15V9C9 8.44772 8.55228 8 8 8H5C3.89543 8 3 7.10457 3 6V4L3 3H5C7.76142 3 10 5.23858 10 8V15C10 18.866 6.86599 22 3 22V21H3Z" />
                                </svg>
                            </div>

                            <p className="text-xl text-text-dark font-medium leading-relaxed mb-10 italic">
                                "{item.comment}"
                            </p>

                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[20px] bg-primary-green/10 flex items-center justify-center text-primary-green font-black text-2xl border-2 border-white overflow-hidden shadow-inner">
                                    <img src={`https://i.pravatar.cc/150?u=${item.id}`} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-text-dark">{item.name}</h4>
                                    <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                                        {Array.from({ length: item.rating }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
