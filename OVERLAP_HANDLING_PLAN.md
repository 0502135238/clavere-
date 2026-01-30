# CLAVERE - Smart Overlap Handling & Multi-Speaker Display Plan

## Problem Statement
When multiple people speak simultaneously, we need to:
1. **Not break the display** - Handle overlaps gracefully
2. **Show all speakers** - Display what each person said
3. **Maintain context** - Keep conversation flow understandable
4. **Visual clarity** - Make it clear who said what, even when overlapping

## Solution Architecture

### 1. Overlap Detection & Queue System

**Approach:**
- Detect when multiple speakers are active simultaneously
- Queue overlapping speech segments
- Process them in order of completion (not start time)
- Display them in a way that doesn't confuse the reader

**Implementation:**
```
Audio Stream → Speaker Detection → Overlap Detection → Queue Manager → Display Engine
```

### 2. Multi-Speaker Display Strategies

#### Strategy A: Side-by-Side (Recommended for Mobile)
- Current speaker on left (larger)
- Overlapping speaker on right (smaller)
- Both fade as they age
- Best for 2 speakers

#### Strategy B: Stacked with Labels
- Current speaker on top (largest)
- Overlapping speaker below (medium)
- Clear speaker labels/colors
- Best for 3+ speakers

#### Strategy C: Sequential with Indicators
- Show speakers one after another
- Visual indicator (⚡) shows overlap occurred
- Timestamp shows they happened simultaneously
- Best for complex overlaps

### 3. Context Display

**What to Show:**
- Current topic/keywords
- Conversation sentiment
- Active speakers
- Recent topics timeline

**Where to Show:**
- Top bar (compact)
- Side panel (desktop)
- Expandable drawer (mobile)
- Floating badge (minimal)

## Implementation Plan

### Phase 1: Smart Queue System
1. Create overlap detection algorithm
2. Implement speech queue manager
3. Handle simultaneous speech streams
4. Prioritize by completion time

### Phase 2: Multi-Speaker UI
1. Design side-by-side layout
2. Add speaker labels/colors
3. Implement fade animations
4. Test with 2-4 speakers

### Phase 3: Context Display
1. Extract and update context in real-time
2. Design context UI component
3. Add expandable context panel
4. Show topic transitions

### Phase 4: Polish & Optimization
1. Smooth animations
2. Performance optimization
3. Mobile responsiveness
4. Accessibility improvements

## Technical Details

### Overlap Detection Algorithm
```typescript
interface SpeechSegment {
  speakerId: string
  text: string
  startTime: number
  endTime: number
  isComplete: boolean
}

function detectOverlaps(segments: SpeechSegment[]): Overlap[] {
  // Find segments that overlap in time
  // Return overlaps with priority (by completion)
}
```

### Queue Manager
- Maintains active speech segments
- Tracks which are complete
- Orders by completion time
- Manages display priority

### Display Priority
1. Most recent complete segment (largest)
2. Active incomplete segments (medium)
3. Previous complete segments (smaller)
4. Historical segments (faded)

## UI/UX Considerations

### Mobile First
- Side-by-side works well on phones
- Stack vertically if needed
- Touch-friendly speaker labels
- Swipe to see context

### Visual Hierarchy
- Current speaker: 100% opacity, largest
- Overlapping speaker: 70% opacity, medium
- Previous: 50% opacity, smaller
- Historical: 30% opacity, smallest

### Color Coding
- Each speaker gets unique color
- Consistent across session
- Colorblind-friendly palette
- High contrast for readability

## Success Metrics
- ✅ No display breaking with overlaps
- ✅ All speakers visible
- ✅ Context always accessible
- ✅ Smooth animations
- ✅ Mobile-friendly
- ✅ < 500ms latency
