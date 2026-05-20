// TimeSlots component to display a grid of available times for an appointment
const TimeSlots = ({ selectedSlot, setSelectedSlot }) => {
    const slots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                    <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${isSelected
                                ? 'bg-primary-green border-primary-green text-white shadow-md'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-primary-green/30 hover:bg-gray-50'
                            }`}
                    >
                        {slot}
                    </button>
                );
            })}
        </div>
    );
};

export default TimeSlots;
