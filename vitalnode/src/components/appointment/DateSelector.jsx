// DateSelector component to display a horizontal scrollable list of the next 7 days for appointment booking
const DateSelector = ({ selectedDate, setSelectedDate }) => {
    // Generate the next 7 days including today
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push(nextDate);
    }

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const getDayName = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getDayNum = (date) => {
        return date.getDate();
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {dates.map((date, index) => {
                const formatted = formatDate(date);
                const isSelected = selectedDate === formatted;

                return (
                    <button
                        key={index}
                        onClick={() => setSelectedDate(formatted)}
                        className={`flex flex-col items-center min-w-[70px] py-4 rounded-2xl border transition-all ${isSelected
                                ? 'bg-primary-green border-primary-green text-white shadow-lg shadow-primary-green/20 scale-105'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-primary-green/30 hover:bg-gray-50'
                            }`}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            {getDayName(date)}
                        </span>
                        <span className="text-xl font-black">
                            {getDayNum(date)}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default DateSelector;
