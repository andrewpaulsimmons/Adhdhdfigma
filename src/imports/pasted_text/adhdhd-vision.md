# AdhdHD Vision

Last updated: 2026-04-22

This document captures the product vision for AdhdHD based on the current public messaging at `adhdhd.com` and the existing macOS product context.

## One-Line Vision

AdhdHD gives people with ADHD a high-definition view of how their work actually happens, so they can stop guessing and start making decisions from patterns they can see.

## Product Idea

Most productivity tools assume the problem is discipline, planning, or motivation. AdhdHD starts from a different assumption:

- the user is not lazy
- the user is not broken
- the user is often missing visibility

People with ADHD often know their days are not random, but they cannot clearly see the patterns driving good days, bad days, false starts, or deep work windows. AdhdHD exists to make those patterns visible.

The product is not trying to force a system onto the user. It is trying to reveal the system that is already there.

That can include a daily focus target, but only as a supportive guide rail. The goal is not to pressure the user into performing. The goal is to give the day a concrete reference point so totals, momentum, and tradeoffs are easier to understand.

## Core Insight

The biggest problem is not just "I got distracted."

The bigger problem is:

- I cannot reliably tell what made today work
- I cannot reliably tell what caused today to collapse
- I am left with vibes, guilt, and unreliable memory instead of evidence

AdhdHD turns that fuzzy experience into a visible record:

- when focused work happened
- when it did not
- how the day broke into blocks
- what conditions tend to precede stronger or weaker performance

## Vision Statement

AdhdHD should become the clearest personal mirror available for ADHD work patterns.

Over time, a user should be able to look at AdhdHD and say:

- these are the hours when I reliably lock in
- these are the conditions that ruin my day
- these are the routines that create momentum
- these are the patterns I can design around instead of fighting blindly

The long-term vision is not generic productivity improvement. The long-term vision is self-knowledge that is specific enough to change behavior.

## Positioning

AdhdHD is:

- a high-definition productivity mirror
- a record of what actually happened
- a pattern-finding tool for ADHD work
- a way to make invisible focus dynamics visible

AdhdHD is not:

- a Pomodoro timer
- a task manager
- a generic productivity coach
- a guilt machine
- a system that tells the user who they should be

The product should always feel more like evidence than advice.

## Who It Is For

AdhdHD is for people with ADHD, or ADHD-like focus volatility, who:

- have some genuinely strong days and some genuinely unusable days
- suspect there are real patterns behind that variance
- want honest feedback instead of motivational theater
- want to understand their own brain rather than conform to someone else's workflow

This includes builders, knowledge workers, founders, creatives, and professionals whose output depends on being able to enter and protect focus states.

## User Promise

If you use AdhdHD consistently, you will get:

- a clear record of when you focused
- a practical daily target that helps put today's total in context
- a visible shape of how your day actually unfolded
- a more trustworthy record when interruptions or time away would otherwise blur what happened
- pattern recognition that gets sharper over time
- better evidence for planning your days around reality

The promise is not "we will fix your ADHD."

The promise is "we will help you see your patterns clearly enough to work with your brain instead of against a blur."

## Product Principles

### 1. Mirror, not coach

AdhdHD should show the truth of the day with as little distortion as possible. It can interpret patterns, but it should not feel preachy, paternalistic, or generic.

### 2. Honest over flattering

If a day was fragmented, the product should show fragmentation. If a routine is not working, the product should help reveal that. The value comes from clarity, not comfort.

### 3. Trustworthy correction over naive tracking

AdhdHD should prefer an honest record over a falsely precise one. When attention breaks, the user steps away, or the device state interrupts tracking, the product should help the user correct the record instead of silently pretending it knows more than it does.

### 4. Lightweight capture, rich reflection

The act of tracking should be fast and low-friction. The value should compound later through history, patterns, summaries, and insight.

### 5. Personal over universal

The point is not what works for "most people with ADHD." The point is what works for this user.

### 6. Pattern detection over productivity theater

Every major feature should help the user answer one of these questions:

- What happened?
- When does it happen?
- What tends to help?
- What tends to hurt?
- What should I protect next time?

### 7. Calm seriousness

The product should feel credible, focused, and useful. Not playful gimmickry. Not hustle culture. Not self-optimization cosplay.

## The Productivity System

AdhdHD should not treat productivity as a vague feeling or a single raw timer total. It should define productivity as a visible relationship between volume, depth, timing, and efficiency.

The core system has four concepts:

- `Total focused time`: how much focused work actually accumulated
- `Sustained flow blocks`: how often focus became long, uninterrupted, and meaningful
- `Peak flow hours`: when the user's attention is most likely to be strong
- `Time efficiency`: how much of the elapsed work window became focused work

Together, these concepts let AdhdHD explain a day without flattening it. Two days can have the same total focused time and still be very different: one may be built from a few protected flow blocks, while another may be scattered across many restarts. One may convert a compact work window into real focus, while another may require a long, leaky span to reach the same total.

This distinction is central to the product. AdhdHD should help the user see not only how much they worked, but what kind of work state they reached, when that state tends to appear, and how much friction surrounded it.

The language should stay consistent:

- use `focused` for raw measurable time
- use `flow` for higher-quality focus states and time-of-day patterns
- use `efficiency` for the relationship between focused time and elapsed work span

Scores can support this system, but they should not become a black box. A productivity score is only trustworthy if it is visibly grounded in focused time, sustained flow, and efficiency. The product should always make the underlying shape of the day easier to see than the score itself.

As a first-pass model, the overall daily score should be weighted toward concrete focused output:

- 65% `Total focused time`
- 25% `Sustained flow blocks`
- 10% `Time efficiency`

This keeps the score intuitive: the largest factor is whether the user actually accumulated meaningful focused time. But the score should still reward quality. Longer uninterrupted blocks should receive more credit than the same amount of focused time split across many short restarts, because sustained flow better represents meaningful progress and lower context-switching cost.

## Product Experience Vision

The ideal AdhdHD experience has five layers:

### 1. Ambient capture

The user can quickly start and stop a session with almost no cognitive overhead, and AdhdHD stays close at hand through glanceable macOS surfaces instead of disappearing into a dashboard.

### 2. Honest daily record

The user can see the day as focus blocks, sessions, gaps, totals, and progress against a personal daily target instead of relying on memory alone.

### 3. Trustworthy recovery

When the day is interrupted by idle time, stepping away, or device-state changes, AdhdHD helps the user correct the record so history stays credible.

### 4. Pattern visibility

The user can see trends by time of day, day of week, context, and recurring conditions.

### 5. Personalized interpretation

Over time, AdhdHD can surface user-specific insights that help explain why some days work and others do not.

## Why This Matters

Many ADHD users live with a painful mismatch:

- they know they are capable of deep work
- they know they are also vulnerable to losing whole days
- they often cannot explain the difference in a way they can act on

That gap produces confusion, self-doubt, and bad planning. AdhdHD aims to close that gap by replacing vague self-judgment with visible evidence.

## Strategic Direction

Near term, AdhdHD should win by being the best possible focused-work recorder for macOS:

- fast to start
- low friction
- always available and glanceable
- trustworthy history
- clear session and day views
- a supportive daily goal that makes totals easier to interpret
- honest correction after interruptions and time away
- synced preferences and continuity foundations across devices

Mid term, it should become a pattern engine:

- stronger summaries
- trend views
- repeated-condition detection
- comparisons across days and weeks
- stronger continuity across devices and sessions

Long term, it should become a personal operating aid for knowledge work with ADHD:

- user-specific insight
- planning support grounded in observed patterns
- an increasingly accurate picture of how the user's attention behaves in real life

## Product Standard

AdhdHD succeeds when a user feels:

- seen accurately
- less confused about their own work
- less dependent on memory and mood
- more able to protect the conditions that lead to good work

The product should help users conclude:

"My best days are not random."

And then:

"Now I can see why."

## Current Expression Of The Vision

Today, the clearest live expression of this vision appears in:

- the public site tagline: `ADHD in HD`
- the landing-page framing around seeing patterns instead of guessing
- the macOS product context centered on a menu-bar-first focused-work recorder with daily goals, clear day history, and honest correction when the record needs adjustment

That combination should remain the backbone of the brand and product direction.
