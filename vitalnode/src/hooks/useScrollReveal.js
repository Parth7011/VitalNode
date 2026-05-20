import { useState, useEffect, useRef } from 'react';

// Custom hook to reveal elements as they scroll into view
export const useScrollReveal = (threshold = 0.1) => {
    // State to track if the element is currently visible on screen
    const [isVisible, setIsVisible] = useState(false);
    // Reference to the DOM element to be observed
    const ref = useRef(null);

    useEffect(() => {
        // Initialize IntersectionObserver to trigger when element enters viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the element crosses the threshold
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            },
            {
                threshold, // Percentage of element that must be visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef); // Start observing the reference element
        }

        // Cleanup function to unobserve when component unmounts
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return { ref, isVisible };
};
