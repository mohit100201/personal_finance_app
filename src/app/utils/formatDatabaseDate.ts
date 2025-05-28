export default function formatDatabaseDate(dateString: string) {
    if(dateString === null || dateString === undefined || dateString === '') {
  return '';    
    }
  const [year, month, day] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}