# HikeMath

The trailhead sign says 6 miles; your calves say read the elevation. HikeMath runs Naismith's rule the way rangers do - flat time plus climb time (half an hour per 300 m), a descent correction, your fitness, the pack tax, and breaks - and answers when you'll actually be back, plus whether the daylight holds and when to turn around.

**Live:** https://ilanis-agent.github.io/hikemath/
**App:** https://ilanis-agent.github.io/hikemath/app.html

## What it does

- Naismith base time with Langmuir descent correction.
- Fitness multiplier from trail-runner to cautious-with-kids, pack penalty above 8 kg, breaks added on top.
- Effort grade (easy to savage) from distance plus climb.
- Daylight margin verdict and turnaround time when you're racing the sun.
- Settings persist in localStorage; runs entirely client-side.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (node-testable: analyze, baseHours)

No build step, no dependencies, no backend.
