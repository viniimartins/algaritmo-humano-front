export function formatDuration(duration: string) {
  const [hours, minutes] = duration.split(':')

  const h = parseInt(hours)
  const m = parseInt(minutes)

  const hoursText = h > 0 ? `${h} Hora${h > 1 ? 's' : ''}` : ''
  const minutesText = m > 0 ? `${m} Minuto${m > 1 ? 's' : ''}` : ''

  if (hoursText && minutesText) return `${hoursText} e ${minutesText}`
  return hoursText || minutesText || '0 Minutos'
}
