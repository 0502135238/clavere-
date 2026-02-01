/**
 * Sound Cue Detector
 * Analyzes audio to detect non-speech sounds and environmental cues
 */

export type SoundCueType = 
  | 'door-slam'
  | 'phone-ring'
  | 'alarm'
  | 'knock'
  | 'applause'
  | 'loud-noise'
  | 'silence'

export interface SoundCue {
  type: SoundCueType
  timestamp: number
  confidence: number
  message: string
}

export class SoundCueDetector {
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private dataArray: Uint8Array | null = null
  private timeDataArray: Uint8Array | null = null
  private lastDetectionTime: Map<SoundCueType, number> = new Map()
  private readonly COOLDOWN_MS = 2000 // Don't detect same cue within 2 seconds
  private readonly LOUD_THRESHOLD = 0.7 // Threshold for loud sounds (0-1)
  private readonly SUDDEN_CHANGE_THRESHOLD = 0.5 // Threshold for sudden volume changes
  private readonly SILENCE_THRESHOLD = 0.05 // Threshold for silence detection
  private readonly RING_PATTERN_THRESHOLD = 0.6 // Threshold for repetitive patterns (phone rings)

  /**
   * Initialize audio analysis
   */
  initialize(audioStream: MediaStream): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = this.audioContext.createMediaStreamSource(audioStream)
      
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 2048
      this.analyser.smoothingTimeConstant = 0.8
      
      source.connect(this.analyser)
      
      const bufferLength = this.analyser.frequencyBinCount
      this.dataArray = new Uint8Array(bufferLength)
      this.timeDataArray = new Uint8Array(this.analyser.fftSize)
    } catch (error) {
      console.error('Failed to initialize sound cue detector:', error)
    }
  }

  /**
   * Analyze audio and detect sound cues
   */
  detect(): SoundCue | null {
    if (!this.analyser || !this.dataArray) {
      return null
    }

    try {
      if (!this.analyser || !this.dataArray || !this.timeDataArray) {
        return null
      }

      // Get frequency data
      this.analyser.getByteFrequencyData(this.dataArray)
      
      // Get time domain data for volume analysis
      this.analyser.getByteTimeDomainData(this.timeDataArray)
      const timeData = this.timeDataArray

      // Calculate average volume
      const volume = this.calculateVolume(timeData)
      
      // Calculate frequency characteristics
      const dominantFreq = this.getDominantFrequency(this.dataArray)
      const frequencySpread = this.calculateFrequencySpread(this.dataArray)

      // Detect different sound cues
      const cues: Array<{ type: SoundCueType; confidence: number; message: string }> = []

      // 1. Detect loud sudden sounds (door slams, bangs)
      if (volume > this.LOUD_THRESHOLD) {
        const suddenChange = this.detectSuddenChange(timeData)
        if (suddenChange > this.SUDDEN_CHANGE_THRESHOLD) {
          cues.push({
            type: 'door-slam',
            confidence: Math.min(suddenChange, 0.9),
            message: '🚪 Door slam or loud bang detected',
          })
        }
      }

      // 2. Detect repetitive patterns (phone rings, alarms)
      const repetitivePattern = this.detectRepetitivePattern(timeData)
      if (repetitivePattern > this.RING_PATTERN_THRESHOLD) {
        if (dominantFreq > 1000 && dominantFreq < 3000) {
          // Phone ring frequency range
          cues.push({
            type: 'phone-ring',
            confidence: repetitivePattern,
            message: '📞 Phone ring detected',
          })
        } else {
          // General alarm
          cues.push({
            type: 'alarm',
            confidence: repetitivePattern,
            message: '🚨 Alarm or alert sound detected',
          })
        }
      }

      // 3. Detect knocks (short, sharp sounds)
      if (volume > 0.3 && volume < 0.6 && frequencySpread < 0.3) {
        const sharpness = this.detectSharpness(timeData)
        if (sharpness > 0.5) {
          cues.push({
            type: 'knock',
            confidence: sharpness * 0.8,
            message: '👊 Knock detected',
          })
        }
      }

      // 4. Detect applause (multiple frequencies, rhythmic)
      if (volume > 0.4 && frequencySpread > 0.6) {
        const rhythm = this.detectRhythm(timeData)
        if (rhythm > 0.5) {
          cues.push({
            type: 'applause',
            confidence: rhythm * 0.7,
            message: '👏 Applause detected',
          })
        }
      }

      // 5. Detect very loud noises
      if (volume > this.LOUD_THRESHOLD && volume < 0.95) {
        cues.push({
          type: 'loud-noise',
          confidence: (volume - this.LOUD_THRESHOLD) / (0.95 - this.LOUD_THRESHOLD),
          message: '🔊 Loud noise detected',
        })
      }

      // 6. Detect silence (very low volume)
      if (volume < this.SILENCE_THRESHOLD) {
        cues.push({
          type: 'silence',
          confidence: 1 - (volume / this.SILENCE_THRESHOLD),
          message: '🔇 Silence detected',
        })
      }

      // Return the highest confidence cue (if any)
      if (cues.length > 0) {
        const bestCue = cues.reduce((best, current) => 
          current.confidence > best.confidence ? current : best
        )

        // Check cooldown
        const lastTime = this.lastDetectionTime.get(bestCue.type) || 0
        const now = Date.now()
        
        if (now - lastTime > this.COOLDOWN_MS) {
          this.lastDetectionTime.set(bestCue.type, now)
          
          return {
            type: bestCue.type,
            timestamp: now,
            confidence: bestCue.confidence,
            message: bestCue.message,
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error detecting sound cues:', error)
      return null
    }
  }

  /**
   * Calculate average volume from time domain data
   */
  private calculateVolume(data: Uint8Array): number {
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      const normalized = (data[i] - 128) / 128
      sum += Math.abs(normalized)
    }
    return sum / data.length
  }

  /**
   * Get dominant frequency
   */
  private getDominantFrequency(data: Uint8Array): number {
    let maxIndex = 0
    let maxValue = 0
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i]
        maxIndex = i
      }
    }
    
    // Convert to Hz (assuming sample rate of 44100)
    const sampleRate = this.audioContext?.sampleRate || 44100
    return (maxIndex * sampleRate) / (2 * data.length)
  }

  /**
   * Calculate frequency spread (how distributed the energy is)
   */
  private calculateFrequencySpread(data: Uint8Array): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length
    return Math.sqrt(variance) / 255 // Normalize to 0-1
  }

  /**
   * Detect sudden changes in volume (door slams, bangs)
   */
  private detectSuddenChange(data: Uint8Array): number {
    if (data.length < 2) return 0
    
    let maxChange = 0
    const windowSize = Math.min(100, Math.floor(data.length / 10))
    
    for (let i = windowSize; i < data.length - windowSize; i++) {
      const before = this.calculateVolume(data.slice(i - windowSize, i))
      const after = this.calculateVolume(data.slice(i, i + windowSize))
      const change = Math.abs(after - before)
      maxChange = Math.max(maxChange, change)
    }
    
    return Math.min(maxChange, 1)
  }

  /**
   * Detect repetitive patterns (phone rings, alarms)
   */
  private detectRepetitivePattern(data: Uint8Array): number {
    if (data.length < 200) return 0
    
    // Look for repeating patterns in the waveform
    const patternLength = Math.floor(data.length / 4)
    let maxCorrelation = 0
    
    for (let offset = 10; offset < patternLength; offset++) {
      let correlation = 0
      let count = 0
      
      for (let i = 0; i < data.length - offset - patternLength; i++) {
        const diff = Math.abs(data[i] - data[i + offset])
        correlation += 1 - (diff / 255)
        count++
      }
      
      if (count > 0) {
        correlation = correlation / count
        maxCorrelation = Math.max(maxCorrelation, correlation)
      }
    }
    
    return maxCorrelation
  }

  /**
   * Detect sharpness (for knocks - short, sharp sounds)
   */
  private detectSharpness(data: Uint8Array): number {
    if (data.length < 10) return 0
    
    let sharpness = 0
    for (let i = 1; i < data.length - 1; i++) {
      const change = Math.abs(data[i] - data[i - 1]) + Math.abs(data[i + 1] - data[i])
      sharpness = Math.max(sharpness, change)
    }
    
    return Math.min(sharpness / 255, 1)
  }

  /**
   * Detect rhythm (for applause - rhythmic patterns)
   */
  private detectRhythm(data: Uint8Array): number {
    if (data.length < 100) return 0
    
    // Look for regular peaks
    const peaks: number[] = []
    const threshold = this.calculateVolume(data) * 1.2
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > threshold && data[i] > data[i - 1] && data[i] > data[i + 1]) {
        peaks.push(i)
      }
    }
    
    if (peaks.length < 3) return 0
    
    // Check if peaks are regularly spaced
    const intervals: number[] = []
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1])
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    let regularity = 0
    
    for (const interval of intervals) {
      const deviation = Math.abs(interval - avgInterval) / avgInterval
      regularity += 1 - Math.min(deviation, 1)
    }
    
    return regularity / intervals.length
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close().catch(console.error)
      this.audioContext = null
    }
    this.analyser = null
    this.dataArray = null
    this.timeDataArray = null
    this.lastDetectionTime.clear()
  }
}
