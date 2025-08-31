## TASK:

Extract **relevant values** from JSON (number or text) and insert them into the markdown template.

- **Every placeholder in `[[LIKE_THIS]]` MUST be replaced** with the correct value from JSON.
- **Do NOT leave any `[[FIELD]]` unfilled.**
- **Completely ignore** the fields: `PC-1`, `PC-2`, `PC-3`.

## INPUT JSON:

{{score}}

## RULES:

- Output only markdown following the output format below exactly.
- Do **not** include any welcome message, conclusion, or extra explanation.
- Remove all lines starting with `//` as it is only guiding comment
- **No** blockcode

## OUTPUT FORMAT:

<div class="overall-score">

## Est. Overall Band Score

[[OVR]]

(+/- 0.5)

</div>

<div class="criteria-score">

| TR     | CC     |
| ------ | ------ |
| [[TR]] | [[CC]] |

| LR     | GRA     |
| ------ | ------- |
| [[LR]] | [[GRA]] |

</div>

<div class="criteria-detail">

Task Response (TR): [[TR]]

[[TR-0]]

- <strong data-score="[[TR-1]]">[[TR-1]]</strong> Relevance to Prompt
- <strong data-score="[[TR-2]]">[[TR-2]]</strong> Clarity of Position
- <strong data-score="[[TR-3]]">[[TR-3]]</strong> Format Appropriateness
- <strong data-score="[[TR-4]]">[[TR-4]]</strong> Introduction & Conclusion effectiveness
- <strong data-score="[[TR-5]]">[[TR-5]]</strong> Idea Development

</div>

<div class="criteria-detail">

Coherence & Cohesion (CC): [[CC]]

[[CC-0]]

- <strong data-score="[[CC-1]]">[[CC-1]]</strong> Logical Organization
- <strong data-score="[[CC-2]]">[[CC-2]]</strong> Paragraphing
- <strong data-score="[[CC-3]]">[[CC-3]]</strong> Idea sequencing
- <strong data-score="[[CC-4]]">[[CC-4]]</strong> Referencing & Substitution
- <strong data-score="[[CC-5]]">[[CC-5]]</strong> Cohesive Devices Usage
</div>

<div class="criteria-detail">

Grammatical Range & Accuracy (GRA): [[GRA]]

[[GRA-0]]

- <strong data-score="[[GRA-1]]">[[GRA-1]]</strong> Sentence Variety
- <strong data-score="[[GRA-2]]">[[GRA-2]]</strong> Grammar Accuracy
- <strong data-score="[[GRA-3]]">[[GRA-3]]</strong> Punctuation Usage

</div>

<div class="criteria-detail">

Lexical Resource (LR): [[LR]]

[[LR-0]]

- <strong data-score="[[LR-1]]">[[LR-1]]</strong> Vocabulary Range
- <strong data-score="[[LR-2]]">[[LR-2]]</strong> Accuracy of Word Choice
- <strong data-score="[[LR-3]]">[[LR-3]]</strong> Collocation & Idiomatic Use
- <strong data-score="[[LR-3]]">[[LR-3]]</strong> Spelling and Word Formation

</div>

## Example Output

<div class="overall-score">

## Est. Overall Band Score

5.0

(+/- 0.5)

</div>

<div class="criteria-score">

| TR  | CC  |
| --- | --- |
| 6   | 5   |

| LR  | GRA |
| --- | --- |
| 5   | 5   |

</div>

<div class="tr-detail">

## Task Response (TR): 6

The essay addresses the prompt by discussing unethical advertising methods...

- <strong data="6">6</strong> Relevance to Prompt
- <strong data="6">6</strong> Clarity of Position
- <strong data="5">5</strong> Format Appropriateness
- <strong data="6">6</strong> Introduction & Conclusion Effectiveness
- <strong data="5">5</strong> Idea Development

</div>

// ... Continue
