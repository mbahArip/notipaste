export default function relativeDate(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (days < 30) {
    return `${Math.floor(days / 7)} weeks ago`;
  } else if (days < 365) {
    return `${Math.floor(days / 30)} months ago`;
  } else if (days >= 365) {
    return `${Math.floor(days / 365)} years ago`;
  } else {
    return date;
  }
}
