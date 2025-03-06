interface TimeSlot {
    day: string;
    hour: number;
    minute: number;
}

export const formatTimeSlot = (slot: TimeSlot): string => {
    const time = new Date();
    time.setHours(slot.hour, slot.minute, 0);
    
    return `${slot.day.charAt(0) + slot.day.slice(1).toLowerCase()} at ${time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })}`;
}; 