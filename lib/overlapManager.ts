import { CaptionChunk } from './types'

/**
 * Manages overlapping speech segments intelligently
 * Prevents display breaking and maintains conversation flow
 */

export interface SpeechSegment {
  id: string
  speakerId: string
  text: string
  startTime: number
  endTime: number
  isComplete: boolean
  confidence: number
}

export interface OverlapGroup {
  segments: SpeechSegment[]
  startTime: number
  endTime: number
  priority: number // Lower = higher priority
}

export class OverlapManager {
  private activeSegments: Map<string, SpeechSegment> = new Map()
  private completedSegments: SpeechSegment[] = []
  private maxHistory = 20

  /**
   * Add a new speech segment (interim or final)
   */
  addSegment(segment: SpeechSegment): {
    displayChunks: CaptionChunk[]
    overlaps: OverlapGroup[]
  } {
    // Update or add segment
    if (segment.isComplete) {
      // Move to completed
      this.activeSegments.delete(segment.id)
      this.completedSegments.push(segment)
      
      // Keep only recent history
      if (this.completedSegments.length > this.maxHistory) {
        this.completedSegments.shift()
      }
    } else {
      // Update active segment
      this.activeSegments.set(segment.id, segment)
    }

    // Detect overlaps
    const overlaps = this.detectOverlaps()
    
    // Generate display chunks with priority
    const displayChunks = this.generateDisplayChunks(overlaps)

    return { displayChunks, overlaps }
  }

  /**
   * Detect overlapping speech segments
   */
  private detectOverlaps(): OverlapGroup[] {
    const allSegments = [
      ...Array.from(this.activeSegments.values()),
      ...this.completedSegments.slice(-5), // Recent completed
    ]

    const overlaps: OverlapGroup[] = []
    const processed = new Set<string>()

    for (let i = 0; i < allSegments.length; i++) {
      const seg1 = allSegments[i]
      if (processed.has(seg1.id)) continue

      const overlapping: SpeechSegment[] = [seg1]
      let groupStart = seg1.startTime
      let groupEnd = seg1.endTime

      for (let j = i + 1; j < allSegments.length; j++) {
        const seg2 = allSegments[j]
        
        // Check if segments overlap in time
        if (this.segmentsOverlap(seg1, seg2)) {
          overlapping.push(seg2)
          processed.add(seg2.id)
          groupStart = Math.min(groupStart, seg2.startTime)
          groupEnd = Math.max(groupEnd, seg2.endTime)
        }
      }

      if (overlapping.length > 1) {
        // Multiple speakers talking
        overlaps.push({
          segments: overlapping.sort((a, b) => {
            // Sort by completion time (completed first), then by start time
            if (a.isComplete !== b.isComplete) {
              return a.isComplete ? -1 : 1
            }
            return a.endTime - b.endTime
          }),
          startTime: groupStart,
          endTime: groupEnd,
          priority: this.calculatePriority(overlapping),
        })
      }
    }

    return overlaps
  }

  /**
   * Check if two segments overlap in time
   */
  private segmentsOverlap(seg1: SpeechSegment, seg2: SpeechSegment): boolean {
    // Segments overlap if they have any time intersection
    return (
      (seg1.startTime <= seg2.endTime && seg1.endTime >= seg2.startTime) ||
      (seg2.startTime <= seg1.endTime && seg2.endTime >= seg1.startTime)
    )
  }

  /**
   * Calculate display priority for overlap group
   */
  private calculatePriority(segments: SpeechSegment[]): number {
    // Lower number = higher priority
    // Priority based on:
    // 1. Completion status (completed first)
    // 2. Recency (newer first)
    // 3. Confidence (higher first)

    const mostRecent = Math.max(...segments.map((s) => s.endTime))
    const hasComplete = segments.some((s) => s.isComplete)
    const avgConfidence = segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length

    let priority = mostRecent // Newer = lower priority number
    if (hasComplete) priority -= 1000 // Completed segments get priority
    priority -= avgConfidence * 100 // Higher confidence = priority

    return priority
  }

  /**
   * Generate display chunks with proper hierarchy
   */
  private generateDisplayChunks(overlaps: OverlapGroup[]): CaptionChunk[] {
    const chunks: CaptionChunk[] = []

    // Sort overlaps by priority (lower = higher priority)
    const sortedOverlaps = overlaps.sort((a, b) => a.priority - b.priority)

    for (const overlap of sortedOverlaps) {
      // For each overlap group, create chunks for each segment
      for (const segment of overlap.segments) {
        chunks.push({
          text: segment.text,
          speakerId: segment.speakerId,
          timestamp: segment.endTime,
          isOverlap: overlap.segments.length > 1,
          speed: 'normal',
          emotion: 'neutral',
        })
      }
    }

    // Add non-overlapping segments
    const allSegments = [
      ...Array.from(this.activeSegments.values()),
      ...this.completedSegments.slice(-10),
    ]

    for (const segment of allSegments) {
      const isInOverlap = overlaps.some((o) =>
        o.segments.some((s) => s.id === segment.id)
      )

      if (!isInOverlap) {
        chunks.push({
          text: segment.text,
          speakerId: segment.speakerId,
          timestamp: segment.endTime,
          isOverlap: false,
          speed: 'normal',
          emotion: 'neutral',
        })
      }
    }

    // Sort by timestamp (newest first)
    return chunks.sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Clear old segments
   */
  clearOldSegments(maxAge: number = 30000): void {
    const now = Date.now()
    
    // Clear old active segments
    for (const [id, segment] of this.activeSegments.entries()) {
      if (now - segment.endTime > maxAge) {
        this.activeSegments.delete(id)
      }
    }

    // Clear old completed segments
    this.completedSegments = this.completedSegments.filter(
      (seg) => now - seg.endTime <= maxAge
    )
  }

  /**
   * Get current active speakers
   */
  getActiveSpeakers(): string[] {
    return Array.from(this.activeSegments.values()).map((s) => s.speakerId)
  }
}
