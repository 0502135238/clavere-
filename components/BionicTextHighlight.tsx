'use client'

import { useSettings } from '@/lib/settings'

interface BionicTextHighlightProps {
  text: string
  size?: 'small' | 'medium' | 'large'
  highlightKeywords?: string[]
}

export function BionicTextHighlight({ text, size, highlightKeywords = [] }: BionicTextHighlightProps) {
  const { settings } = useSettings()
  const textSize = size || settings.textSize

  // Bionic reading: bold first 40% of words longer than 4 characters
  const processWord = (word: string): React.ReactNode => {
    const cleanWord = word.replace(/[.,!?;:]/g, '')
    const punctuation = word.replace(/[^.,!?;:]/g, '')
    
    if (cleanWord.length <= 4) {
      return <span>{word}</span>
    }
    
    const boldLength = Math.ceil(cleanWord.length * 0.4)
    const boldPart = cleanWord.slice(0, boldLength)
    const restPart = cleanWord.slice(boldLength)
    
    // Check if this word should be highlighted
    const shouldHighlight = highlightKeywords.some(
      (keyword) => cleanWord.toLowerCase().includes(keyword.toLowerCase())
    )
    
    const highlightClass = shouldHighlight ? 'bg-purple-500/30 text-white' : ''
    
    return (
      <span className={highlightClass}>
        <span className="font-bold">{boldPart}</span>
        {restPart}
        {punctuation}
      </span>
    )
  }

  const words = text.split(/(\s+)/)

  const sizeClasses = {
    small: 'text-base md:text-lg',
    medium: 'text-lg md:text-2xl',
    large: 'text-2xl md:text-3xl lg:text-4xl',
  }

  return (
    <div className={`${sizeClasses[textSize]} text-white leading-relaxed`}>
      {words.map((word, index) => (
        <span key={index}>
          {word.match(/^\s+$/) ? word : processWord(word)}
        </span>
      ))}
    </div>
  )
}
