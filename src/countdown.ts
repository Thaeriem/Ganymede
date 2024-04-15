export function startCountdown(targetDate: string, displayElementId: string): void {
    const targetTime: number = new Date(targetDate).getTime();

    const updateCountdown = (): void => {
        const currentTime: number = new Date().getTime();
        const timeRemaining: number = targetTime - currentTime;

        const days: number = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours: number = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes: number = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds: number = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        const countdownDisplay: string = `${days}D${hours}HR${minutes}MIN${seconds}SEC`;

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
