## Task

Evaluate this {taskType} response using the latest IELTS Writing Band Descriptors. Return band scores for each criterion listed below.

## Inputs

**IELTS Question**

"{{question}}".

**My Response**

"{{answer}}"

**Data from Attachments**

"{{attachment}}"  
(Use the image to verify or correct information. If it contains line charts, approximate values are acceptable. Minor discrepancies can be ignored.)

## Output Format

// Start of output.
// Precheck:
PC-1: Check if the essay directly & properly responds to the prompt, return “on-topic” or “off-topic”.
// If PC-1="off-topic", forcefully rate all scores of all criteria below at band 1.
PC-2: Currently "=0.000"
PC-3: If PC-2 > 0.1, turn on very hard mode, return "very hard mode" or "normal mode".
// If PC-3 = "very hard mode", be very strict, tough, and difficult when rating, frequently reduce scores for small mistakes, ready to give scores lower than 5.
// Criterion: Task Response (TR).
TR-1: Rate the relevance of the provided prompt and the extent to which the essay addresses it on a scale of 9 (Since the word count is low, forcefully rate it below 7).
TR-2: Rate the clarity of the position taken by the writer in response to the prompt on a scale of 9 (Since the word count is low, forcefully rate it below 7).
TR-3: Rate the depth of ideas presented in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
TR-4: Rate the appropriateness of the essay's format in addressing the prompt on a scale of 9 (Since the word count is low, forcefully rate it below 7).
TR-5: Rate the relevance and specificity of the examples provided in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
TR-6: current_word/required_word = 195/250, so rate 7 rounded to the nearest whole number.
TR-0: Short, concise, & reasonable feedback for TR criterion in english-uk, with clear proof & examples. Refer to each of its sub-criterion (but avoid explicilty mention the names of sub-criterion like TR-1, TR-2,...).
TR: Calculate the average of all TR sub-criteria scores above, then round it up to the nearest whole number.
// Criterion: Coherence & Cohesion (CC).
CC-1: Rate the logical organization of ideas in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
CC-2: Rate the apperance and effectiveness of the introduction and conclusion in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
CC-3: Rate the support provided for the main points in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
CC-4: Rate the usage of cohesive devices & sequencers in connecting ideas throughout the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
CC-5: Rate the effectiveness of paragraphing in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
CC-0: Short, concise, & reasonable feedback for CC criterion in english-uk, with clear proof & examples. Refer to each of its sub-criterion.
CC: Calculate the average of all CC sub-criteria scores above, then round it up to the nearest whole number.
// Criterion: Grammatical Range & Accuracy (GRA).
GRA-1: Rate the variety of sentence structures used in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
GRA-2: Rate the accuracy of grammar and syntax in the essay on a scale of 9, default value "9" (Since the word count is low, forcefully rate it below 7).
GRA-3: Rate the usage of punctuation in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
GRA-0: Short, concise, & reasonable feedback for GRA criterion in english-uk, with clear proof & examples. Refer to each of its sub-criterion.
GRA: Calculate the average of all GRA sub-criteria scores above, then round it up to the nearest whole number.
// Criterion: Lexical Resource (LR).
LR-1: Rate the range of vocabulary used in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
LR-2: Rate the accuracy of word choice and usage in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
LR-3: Rate the spelling and word formation accuracy in the essay on a scale of 9 (Since the word count is low, forcefully rate it below 7).
LR-0: Short, concise, & reasonable feedback for LR criterion in english-uk, with clear proof & examples. Refer to each of its sub-criterion.
LR: Calculate the average of all LR sub-criteria scores above, then round it up to the nearest whole number.
// Overall Band Score.
OVR: Calculate the average of TR, CC, LR, and GRA, with one decimal digit, rounded up to the nearest half-band 0.5 or whole-band score (e.g., 6.0 or 6.5, avoid 6.3 or 6.8).
// End of output

## Rule

- Return valid JSON.
- Use flat, top-level keys only.
- No comments or extra text.
