import { CaptionChunk, CaptionMode } from './types'

export function processTextForMode(chunk: CaptionChunk, mode: CaptionMode): string {
  if (mode === 'accuracy') {
    return chunk.text // Return verbatim
  }

  // Social mode: summarize and make more readable
  let text = chunk.text

  // Remove filler words for social mode
  const fillerWords = ['um', 'uh', 'like', 'you know', 'I mean']
  fillerWords.forEach((filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi')
    text = text.replace(regex, '')
  })

  // Clean up multiple spaces
  text = text.replace(/\s+/g, ' ').trim()

  // If text is very long, summarize (simplified)
  if (text.length > 100) {
    const sentences = text.split(/[.!?]+/)
    if (sentences.length > 2) {
      // Take first and last sentence for summary
      text = sentences[0] + '. ' + sentences[sentences.length - 1] + '.'
    }
  }

  return text
}
