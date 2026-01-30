/**
 * OpenAI Context Service
 * Provides advanced context understanding: topics, sentiment, summarization
 */

export interface ContextResult {
  topic?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  keywords: string[]
  summary?: string
  entities?: Array<{ name: string; type: string }>
}

export class OpenAIContextService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Extract context from conversation text
   */
  async extractContext(conversationText: string): Promise<ContextResult> {
    if (!this.apiKey || this.apiKey === 'your-openai-api-key') {
      // Fallback to simple extraction if no API key
      return this.simpleExtraction(conversationText)
    }

    try {
      const prompt = `Analyze this conversation and extract:
1. Main topic (1-3 words)
2. Sentiment (positive/neutral/negative)
3. Key keywords (5 most important words)
4. Brief summary (1 sentence)

Conversation: "${conversationText}"

Respond in JSON format:
{
  "topic": "main topic",
  "sentiment": "positive|neutral|negative",
  "keywords": ["word1", "word2", ...],
  "summary": "brief summary"
}`

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (content) {
        try {
          const parsed = JSON.parse(content)
          return {
            topic: parsed.topic,
            sentiment: parsed.sentiment || 'neutral',
            keywords: parsed.keywords || [],
            summary: parsed.summary,
          }
        } catch {
          // Fallback if JSON parsing fails
          return this.simpleExtraction(conversationText)
        }
      }
    } catch (error) {
      console.warn('OpenAI context extraction failed, using fallback:', error)
    }

    return this.simpleExtraction(conversationText)
  }

  /**
   * Simple extraction fallback (no API needed)
   */
  private simpleExtraction(text: string): ContextResult {
    const lowerText = text.toLowerCase()

    // Extract keywords (words > 4 chars, most frequent)
    const words = lowerText.split(/\s+/).filter((w) => w.length > 4)
    const wordCounts = new Map<string, number>()
    words.forEach((word) => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    })

    const keywords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    // Simple sentiment
    const positiveWords = ['good', 'great', 'excellent', 'love', 'happy', 'wonderful', 'amazing']
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'sad', 'angry', 'disappointed']

    let positiveCount = 0
    let negativeCount = 0

    positiveWords.forEach((word) => {
      if (lowerText.includes(word)) positiveCount++
    })
    negativeWords.forEach((word) => {
      if (lowerText.includes(word)) negativeCount++
    })

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveCount > negativeCount) sentiment = 'positive'
    if (negativeCount > positiveCount) sentiment = 'negative'

    return {
      topic: keywords[0] || 'general',
      sentiment,
      keywords,
    }
  }
}
