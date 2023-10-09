export default function formatDate(date: string) {
  let locale = 'en-US';
  const formater = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return formater.format(new Date(date));
}
