## JSON Data

{{scoreJson}}

## Instruction

- Extract the **relevant values** (numbers or text) from the JSON.
- Insert them into the **placeholders marked by square brackets** (`[like this]`) in the Markdown template.
- Do **not** wrap the output in a code block — let the Markdown render normally.
- **Ignore** the fields: `PC-1`, `PC-2`, and `PC-3`.

## Output Format

// Start of output.

> Est. Overall Band Score
>
> [[OVR]]
>
> (+/- 0.5)

| TR     | CC     |
| ------ | ------ |
| [[TR]] | [[CC]] |

| LR     | GRA     |
| ------ | ------- |
| [[LR]] | [[GRA]] |

> Task Response (TR): [[TR]]
>
> [[TR-0]]
>
> - **[[TR-1]]** Relevance to Prompt
> - **[[TR-2]]** Clarity of Position
> - **[[TR-3]]** Depth of Ideas
> - **[[TR-4]]** Appropriateness of Format
> - **[[TR-5]]** Relevant & Specific Examples
> - **[[TR-6]]** Appropriate Word Count

> Coherence & Cohesion (CC): [[CC]]
>
> [[CC-0]]
>
> - **[[CC-1]]** Logical Organization
> - **[[CC-2]]** Effective Introduction & Conclusion
> - **[[CC-3]]** Supported Main Points
> - **[[CC-4]]** Cohesive Devices Usage
> - **[[CC-5]]** Paragraphing

> Grammatical Range & Accuracy (GRA): [[GRA]]
>
> [[GRA-0]]
>
> - **[[GRA-1]]** Sentence Structure Variety
> - **[[GRA-2]]** Grammar Accuracy
> - **[[GRA-3]]** Punctuation Usage

> Lexical Resource (LR): [[LR]]
>
> [[LR-0]]
>
> - **[[LR-1]]** Vocabulary Range
> - **[[LR-2]]** Lexical Accuracy
> - **[[LR-3]]** Spelling and Word Formation

// End of output.

## Example of output:

> Est. Overall Band Score
>
> 5.0
>
> (+/- 0.5)

| TR  | CC  |
| --- | --- |
| 6   | 5   |

| LR  | GRA |
| --- | --- |
| 5   | 5   |

> Task Response (TR): 6
>
> The essay addresses the prompt by discussing unethical advertising methods...
>
> - **6** Relevance to Prompt
> - **6** Clarity of Position
> - **5** Depth of Ideas
> - **6** Appropriateness of Format
> - **5** Relevant & Specific Examples
> - **9** Appropriate Word Count
>   ...

## Output Rules

- Only return the completed Markdown with replaced values.
- Do **not** include explanations, extra messages, or formatting outside the specified section.
