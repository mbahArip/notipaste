export default function relativeDate(date: string, future: boolean = false) {
  const now = new Date();
  const diff = future ? new Date(date).getTime() - now.getTime() : now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let start = future ? 'in' : '';
  let ending = future ? '' : 'ago';

  if (seconds < 60) {
    return `${start} ${seconds} seconds ${ending}`;
  } else if (minutes < 60) {
    return `${start} ${minutes} minutes ${ending}`;
  } else if (hours < 24) {
    return `${start} ${hours} hours ${ending}`;
  } else if (days < 7) {
    return `${start} ${days} days ${ending}`;
  } else if (days < 30) {
    return `${start} ${Math.floor(days / 7)} weeks ${ending}`;
  } else if (days < 365) {
    return `${start} ${Math.floor(days / 30)} months ${ending}`;
  } else if (days >= 365) {
    return `${start} ${Math.floor(days / 365)} years ${ending}`;
  } else {
    return date;
  }
}
