## Task

Evaluate my {{taskType}} IELTS answer using the latest **IELTS Writing Band Descriptors**. Assign band scores.

## Inputs

**IELTS Question**

"{{question}}".

**My Response**

"{{answer}}"

**Data from Attachments**

"{{attachment}}"  
(Use the image to verify or correct information. If it contains line charts, approximate values are acceptable. Minor discrepancies can be ignored.)

## Output Format

```json
{
  // Precheck: Determines if the essay addresses the prompt.
  "PC-1": "on-topic", // "on-topic" or "off-topic". If "off-topic", all scores must be band 1.

  // Internal metric (e.g., coherence confidence), currently fixed at 0.
  "PC-2": "0.000",

  // Adjusts strictness of scoring based on PC-2 value.
  "PC-3": "normal mode", // "normal mode" or "very hard mode"

  // TASK RESPONSE
  "TR-1": 6, // How fully the task is addressed (coverage of all parts of prompt).
  "TR-2": 6, // Clarity and consistency of the writer’s position.
  "TR-3": 6, // Depth, relevance, and development of ideas.
  "TR-4": 6, // Whether the format suits the task (e.g., essay format).
  "TR-5": 6, // Specificity and appropriateness of supporting examples.
  "TR-6": 7, // Score based on actual word count (195/250 = 7).
  "TR-0": "Your ideas are clear but underdeveloped. The essay touches on all prompt points, but lacks detail and strong examples.", // Concise feedback for TR.
  "TR": 6, // Final TR band: average of TR-1 to TR-6 (rounded up).

  // COHERENCE & COHESION
  "CC-1": 6, // Logical organization of ideas and flow of arguments.
  "CC-2": 6, // Quality of introduction and conclusion.
  "CC-3": 6, // How well main points are supported and linked.
  "CC-4": 6, // Use of cohesive devices (e.g., linkers, transitions).
  "CC-5": 6, // Effectiveness of paragraphing.
  "CC-0": "The structure is logical but transitions could be smoother. Paragraphs are clear but slightly uneven in development.", // Concise feedback for CC.
  "CC": 6, // Final CC band: average of CC-1 to CC-5 (rounded up).

  // GRAMMATICAL RANGE & ACCURACY
  "GRA-1": 6, // Range of sentence structures.
  "GRA-2": 6, // Grammar accuracy (tense, agreement, etc.).
  "GRA-3": 6, // Use of punctuation and sentence control.
  "GRA-0": "Sentence structures are varied but errors appear in complex forms. Punctuation is mostly correct but occasionally inconsistent.", // Concise feedback for GRA.
  "GRA": 6, // Final GRA band: average of GRA-1 to GRA-3 (rounded up).

  // LEXICAL RESOURCE
  "LR-1": 6, // Range of vocabulary used.
  "LR-2": 6, // Appropriateness and precision of word choice.
  "LR-3": 6, // Spelling and word formation.
  "LR-0": "Vocabulary is appropriate but lacks variety. Word choice is sometimes repetitive and could be more precise.", // Concise feedback for LR.
  "LR": 6, // Final LR band: average of LR-1 to LR-3 (rounded up).

  // OVERALL BAND SCORE
  "OVR": 6.0 // Final average score: mean of TR, CC, GRA, and LR, rounded up to nearest 0.5.
}
```

## Rule

- Return only valid JSON
- No comments or extra text
- No codeblocks
