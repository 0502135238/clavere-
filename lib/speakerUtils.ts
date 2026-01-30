/**
 * Speaker utility functions
 */

export function getSpeakerLabel(speakerId: string | null): string {
  if (!speakerId || speakerId === 'unknown') return 'Unknown'
  if (speakerId.startsWith('speaker-')) {
    const num = speakerId.replace('speaker-', '')
    return `Speaker ${num}`
  }
  return speakerId
}

export function getSpeakerColor(speakerId: string | null): string {
  if (!speakerId) return 'bg-gray-500'
  
  const colors = [
    'bg-speaker-1', // Blue
    'bg-speaker-2', // Green
    'bg-speaker-3', // Amber
    'bg-speaker-4', // Purple
  ]
  
  if (speakerId.startsWith('speaker-')) {
    const num = parseInt(speakerId.replace('speaker-', '')) || 0
    return colors[(num - 1) % colors.length] || colors[0]
  }
  
  return colors[0]
}
