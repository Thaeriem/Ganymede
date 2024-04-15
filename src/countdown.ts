export function startCountdown(targetDate: string, displayElementId: string): void {
    const targetTime: number = new Date(targetDate).getTime();

    const updateCountdown = (): void => {
        const currentTime: number = new Date().getTime();
        const timeRemaining: number = targetTime - currentTime;

        const days: number = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours: number = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes: number = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds: number = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Pad single-digit hours, minutes, and seconds with leading zeros
        const paddedHours: string = hours.toString().padStart(2, '0');
        const paddedMinutes: string = minutes.toString().padStart(2, '0');
        const paddedSeconds: string = seconds.toString().padStart(2, '0');

        const countdownDisplay: string = `${days}:${paddedHours}:${paddedMinutes}:${paddedSeconds}`;

        const displayElement: HTMLElement | null = document.getElementById(displayElementId);
        if (displayElement) {
            displayElement.innerText = countdownDisplay;
        }

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            if (displayElement) {
                displayElement.innerText = 'Launched!';
            }
        }
    };

    updateCountdown();
    const countdownInterval: number = setInterval(updateCountdown, 1000);
}
