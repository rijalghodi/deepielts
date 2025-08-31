## TASK:

Evaluate my {{taskType}} IELTS answer using the latest **IELTS Writing Band Descriptors**. Assign band scores for each criterion based on its specific band descriptors.

For each criterion (TR, CC, GRA, LR), refer to the respective band descriptor table to determine the appropriate score for each sub-criterion.

## INPUTS:

**IELTS Prompt:**  
"{{question}}"

**My Response:**  
"{{answer}}"

**Data from Attachments:**  
{{attachmentInsight}}

## OUTPUT FORMAT:

Return the output in JSON with these rules:

### Precheck

- PC-1: Check if the essay directly & properly responds to the prompt, return “on-topic” or “off-topic”.
  - If PC-1="off-topic", assign all scores = 1.

### Criterion: Task Response (TR)

- TR-1: Relevance to prompt
- TR-2: Clarity of position
- TR-3: Format appropriateness
- TR-4: Introduction & Conclusion effectiveness
- TR-5: Idea Development
- TR-0: Short feedback for TR with examples.
- TR: Average of TR-1 to TR-5, rounded to nearest whole number

| Score | Relevance to prompt                   | Clarity of position                           | Format appropriateness         | Introduction & Conclusion effectiveness         | Idea Development                                     |
| ----- | ------------------------------------- | --------------------------------------------- | ------------------------------ | ----------------------------------------------- | ---------------------------------------------------- |
| 1     | No response or completely off-topic   | No clear position                             | No recognizable format         | No introduction or conclusion                   | No ideas presented                                   |
| 5     | Partially addresses task              | Position partially clear                      | Weak structure                 | Introduction/conclusion present but weak        | Ideas limited or underdeveloped                      |
| 6     | Addresses most parts of task          | Position mostly clear                         | Adequate structure             | Introduction/conclusion mostly effective        | Ideas reasonably developed                           |
| 7     | Addresses all parts of task           | Position clear                                | Well-organized                 | Clear introduction and conclusion               | Ideas well-developed and supported                   |
| 8     | Covers all parts thoroughly           | Position very clear and logical               | Very well-organized            | Effective introduction and conclusion           | Ideas well-developed with strong support             |
| 9     | Fully addresses all parts; insightful | Position fully clear, logical, and persuasive | Excellent structure and format | Excellent, persuasive introduction & conclusion | Ideas fully developed, highly detailed and supported |

### Criterion: Coherence & Cohesion (CC)

- CC-1: Logical organization
- CC-2: Paragraphing
- CC-3: Idea sequencing
- CC-4: Referencing & Substitution
- CC-5: Use of cohesive devices
- CC-0: Short feedback for CC
- CC: Average of CC-1 to CC-5, rounded

| Score | Logical organization                           | Paragraphing              | Idea sequencing                        | Referencing & Substitution                     | Use of cohesive devices                         |
| ----- | ---------------------------------------------- | ------------------------- | -------------------------------------- | ---------------------------------------------- | ----------------------------------------------- |
| 1     | No logical order                               | No paragraphing           | Ideas not sequenced                    | No referencing or substitution                 | No cohesive devices used                        |
| 5     | Some logical order, occasional confusion       | Weak paragraphing         | Ideas sometimes unclear                | Limited referencing/substitution               | Some linking words but weak                     |
| 6     | Mostly logical organization                    | Adequate paragraphing     | Ideas mostly sequenced                 | Referencing/substitution mostly correct        | Adequate use of cohesive devices                |
| 7     | Clear logical organization                     | Well-organized paragraphs | Ideas logically sequenced              | Referencing/substitution mostly accurate       | Good use of cohesive devices                    |
| 8     | Very clear and logical organization            | Very clear paragraphing   | Ideas flow smoothly                    | Accurate and flexible referencing/substitution | Effective and varied cohesive devices           |
| 9     | Excellent logical organization and progression | Excellent paragraphing    | Ideas flow seamlessly and persuasively | Mastery of referencing & substitution          | Cohesive devices used naturally and effectively |

### Criterion: Grammatical Range & Accuracy (GRA)

- GRA-1: Sentence variety
- GRA-2: Grammar & syntax accuracy
- GRA-3: Punctuation accuracy
- GRA-0: Short feedback for GRA
- GRA: Average of GRA-1 to GRA-3, rounded

| Score | Sentence variety                            | Grammar & syntax accuracy                   | Punctuation accuracy                       |
| ----- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| 1     | No sentence variety; mostly fragments       | Almost all sentences incorrect              | Punctuation absent or incorrect            |
| 5     | Limited variety; mostly simple sentences    | Frequent errors, meaning sometimes unclear  | Some punctuation correct, frequent errors  |
| 6     | Some variety, mix of simple and compound    | Errors present but generally understandable | Mostly correct punctuation, minor errors   |
| 7     | Good range including complex sentences      | Generally accurate; occasional errors       | Correct punctuation with minor lapses      |
| 8     | Wide variety of sentence structures         | Very accurate; few errors                   | Correct and effective punctuation          |
| 9     | Sophisticated, flexible sentence structures | Highly accurate, almost no errors           | Punctuation used effectively and naturally |

### Criterion: Lexical Resource (LR)

- LR-1: Vocabulary range
- LR-2: Accuracy of word choice
- LR-3: Collocation & idiomatic use
- LR-4: Spelling & word formation
- LR-0: Short feedback for LR
- LR: Average of LR-1 to LR-4, rounded

| Score | Vocabulary range                                | Accuracy of word choice                     | Collocation & idiomatic use                            | Spelling & word formation                                 |
| ----- | ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| 1     | No vocabulary; very limited                     | Words used incorrectly or randomly          | No collocations/idioms used                            | Spelling and word formation mostly incorrect              |
| 5     | Limited range; some repetition                  | Some inappropriate choices                  | Few correct collocations/idioms                        | Frequent spelling/word formation errors affecting meaning |
| 6     | Adequate range; some repetition                 | Mostly correct choices                      | Some correct collocations/idioms                       | Mostly correct spelling; occasional errors                |
| 7     | Good range with some sophisticated words        | Generally accurate word choice              | Good use of collocations/idioms                        | Spelling and word formation mostly accurate               |
| 8     | Wide and flexible vocabulary                    | Very accurate and appropriate use           | Very good use of collocations/idioms                   | Spelling and word formation accurate                      |
| 9     | Sophisticated, precise, and flexible vocabulary | Almost all word choices precise and natural | Collocations and idioms used naturally and effectively | Spelling and word formation flawless                      |

### Overall Band Score

- OVR: Average of TR, CC, GRA, LR, rounded to nearest 0.5

## RULES:

- Return only valid JSON with all keys at the top level (no nested objects).
- No comments, No extra text, No codeblock
- Feedback should be short, clear, and based on examples in the essay.
- Do not mention internal sub-criterion names.
