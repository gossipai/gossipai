export default function formatTimePassed(activityDate) {
    const date = new Date(activityDate);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) {
        return `${days} days`;
    } else if (days === 1) {
        return '1 day';
    } else if (hours > 1) {
        return `${hours} hours`;
    } else if (hours === 1) {
        return '1 hour';
    } else if (minutes > 1) {
        return `${minutes} min`;
    } else if (minutes === 1) {
        return '1 min';
    } else {
        return `${seconds} sec`;
    }
}