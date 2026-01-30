'use client'

import { useSettings } from '@/lib/settings'

interface BionicTextProps {
  text: string
  size?: 'small' | 'medium' | 'large'
}

export function BionicText({ text, size }: BionicTextProps) {
  const { settings } = useSettings()
  const textSize = size || settings.textSize

  // Bionic reading: bold first 3-4 letters of words longer than 4 characters
  const processWord = (word: string): React.ReactNode => {
    const cleanWord = word.replace(/[.,!?;:]/g, '')
    const punctuation = word.replace(/[^.,!?;:]/g, '')
    
    if (cleanWord.length <= 4) {
      return <span>{word}</span>
    }
    
    // Bold first 40% of the word (rounded up)
    const boldLength = Math.ceil(cleanWord.length * 0.4)
    const boldPart = cleanWord.slice(0, boldLength)
    const restPart = cleanWord.slice(boldLength)
    
    return (
      <span>
        <span className="font-bold">{boldPart}</span>
        {restPart}
        {punctuation}
      </span>
    )
  }

  const words = text.split(/(\s+)/)

  const sizeClasses = {
    small: 'text-caption-sm',
    medium: 'text-caption-md',
    large: 'text-caption-lg',
  }

  return (
    <div className={`${sizeClasses[textSize]} text-gray-900 dark:text-white leading-relaxed`}>
      {words.map((word, index) => (
        <span key={index}>
          {word.match(/^\s+$/) ? word : processWord(word)}
        </span>
      ))}
    </div>
  )
}
