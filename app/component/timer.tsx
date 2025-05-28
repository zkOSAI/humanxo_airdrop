import { useState, useEffect } from 'react';

function getRemainingTime(): string {
    // Base target date: June 4, 2025 at 3 PM UTC
    const baseTargetDate = new Date('2025-06-04T15:00:00.000Z');
    const now = new Date();

    // Calculate which cycle we're in (0, 1, 2 for June 4, 11, 18)
    const cycleLength = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const timeSinceBase = now.getTime() - baseTargetDate.getTime();

    let currentTargetDate: Date;

    if (timeSinceBase < 0) {
        // Before June 4 - countdown to June 4
        currentTargetDate = baseTargetDate;
    } else if (timeSinceBase < cycleLength) {
        // After June 4, before June 11 - countdown to June 11
        currentTargetDate = new Date(baseTargetDate.getTime() + cycleLength);
    } else if (timeSinceBase < 2 * cycleLength) {
        // After June 11, before June 18 - countdown to June 18
        currentTargetDate = new Date(baseTargetDate.getTime() + 2 * cycleLength);
    } else {
        // After June 18 - show zeros
        return '00:00:00:00';
    }

    // Calculate the difference in milliseconds to current target
    const diffMs = currentTargetDate.getTime() - now.getTime();

    // Convert milliseconds to time components
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const days = totalDays;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Format with leading zeros
    const formatNumber = (num: number, digits: number = 2): string => {
        return num.toString().padStart(digits, '0');
    };

    return `${formatNumber(days)}:${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

function getCurrentTargetDate(): string {
    const baseTargetDate = new Date('2025-06-04T15:00:00.000Z');
    const now = new Date();
    const cycleLength = 7 * 24 * 60 * 60 * 1000;
    const timeSinceBase = now.getTime() - baseTargetDate.getTime();

    if (timeSinceBase < 0) {
        return 'June 4, 2025 3:00 PM UTC';
    } else if (timeSinceBase < cycleLength) {
        return 'June 11, 2025 3:00 PM UTC';
    } else if (timeSinceBase < 2 * cycleLength) {
        return 'June 18, 2025 3:00 PM UTC';
    } else {
        return 'Countdown Complete';
    }
}

export default function CountdownTimer() {
    const [timeRemaining, setTimeRemaining] = useState(getRemainingTime());
    const [targetDate, setTargetDate] = useState(getCurrentTargetDate());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(getRemainingTime());
            setTargetDate(getCurrentTargetDate());
            console.log(targetDate);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">


                <div>
                    {timeRemaining}
                </div>


            </div>
        </div>
    );
}