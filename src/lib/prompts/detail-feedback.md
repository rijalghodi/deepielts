## TASK:

Generate detail feedback for my {{taskType}} IELTS Writing response.

Detect my tone and style based on the instructions and samples below. Clone or apply them to some explanations to match my style. For the rest, be creative and flexible—use a variety of tones, styles, sentence structures, and correction methods:

Examples:

- This sentence does not contrast with the previous one, so using “On the contrary” here is incorrect.
- In present perfect tense, “do” should be “done.” This mistake occurs quite often — please double-check your grammar.
- Be careful with verb agreement: since the subject is "this person", the verb should be "sees".
- The noun is not specific, so you should not use "the" here.
- This word is misspelled — please check it again.

## INPUTS:

**IELTS Question:**

"{{question}}".

**My Response**

"{{answer}}".

**Data from Attachment**

{{attachment}}

## RULES:

- Output only markdown following the output format below exactly
- Do **not** include any welcome message, conclusion, or extra explanation
- Remove all lines starting with `//`
- Use popular terms in english-uk

## OUTPUT FORMAT:

## Detailed Feedback

### Improve Each Paragraphs

// Provide feedback & suggestions for each paragraph in the task response.

#### NAME THE PARAGRAPH (IN UPPERCASE) SUCH AS: "SALUTATION", "INTRODUCTION", "OVERVIEW", "OPENING STATEMENT", "BODY PARAGRAPH 1", "BODY PARAGRAPH 2" "CONCLUSION", "CLOSING STATEMENT", "SIGN-OFF", ETC.

// Use markdown italic format:
_"Quote the mentioned paragraph here"_.

##### Comments

- **Task Response/Task Achievement:** Provide comprehensive & in-depth feedback/analysis in english-uk with 3 - 4 clear proof & examples, pointing out errors & weak areas, suggests specific & detailed improvements with clear examples to enhance these sub-criteria: "Relevance to Prompt", "Clarity of Position", "Depth of Ideas", "Appropriateness of Format" & "Relevant & Specific Examples", do not provide grammar suggestions in this part.
- **Coherence & Cohesion:** Provide comprehensive & in-depth feedback/analysis in english-uk with 3 - 4 clear proof & examples, pointing out errors & weak areas, suggests specific & detailed improvements with clear examples to enhance these sub-criteria: "Logical Organization", "Effective Introduction & Conclusion", "Supported Main Points" & "Cohesive Devices Usage", do not provide grammar suggestions in this part.
- **Grammatical Range & Accuracy:** Provide brief feedback/analysis in english-uk with 3 - 4 proof & examples, pointing out errors & weak areas, suggests specific & detailed improvements with clear examples to enhance these sub-criteria: "Sentence Structure Variety", and "Grammar Accuracy", provide detailed grammar suggestions in this part.
- **Lexical Resource:** Provide brief feedback/analysis in english-uk with 3 - 4 proof & examples, pointing out errors & weak areas, suggests specific & detailed improvements with clear examples to enhance these sub-criteria: "Vocabulary Range", "Lexical Accuracy" & "Spelling and Word Formation", provide very detailed & specific vocabulary suggestions in this part (such as vocabulary corrections, vocabulary replacements, etc.).

##### Revised Version

// Use markdown italic format:
_"Rewrite the mentioned paragraph here with improvements based on the feedback and suggestions"_
// Keep as much of the original content as possible, but improve it based on the feedback and suggestions.
// Use vocabulary level and grammar appropriate for this target band level: "Band 5.5–6.5 (Intermediate)".
// Skip if there is no issue or no room for improvements.

<hr></hr>

// Continue with the next paragraph, and to the last paragraph, using the same format & structure.

### Improve Structure & Argument

#### TASK TYPE

// Name the task type based on the task prompt, such as "Opinion: Agree or Disagree", "Formal Letter: Requesting Information or Action", "Report: Bar Chart", "Report: Line Graph", etc.

#### KEY TIPS

// Create an one-level bulleted list of 3 most useful & popular key tips in english-uk, tailored to the mentioned task prompt & task type.

#### RECOMMENDED ESSAY OUTLINE/STRUCTURE

// Use one-level bulleted list to create an in-depth outline, specifically tailored to this task, using english-uk.
// Integrate the mentioned tips above, aiming for a band 9.0. Include samples of topic sentences in English, tips & examples for each paragraph.

### Relevant Vocabulary

// Suggest 10 most related English vocabulary for this topic that are not currently used in the original task response, using a table in markdown syntax with 4 columns: New Word | Word Type | Definition.
// New words are in English, and can be Nouns, Adjectives, Verbs, and Adverbs.
// Definition content must be very short in english-uk.

| New Word | Word Type | Definition |
| -------- | --------- | ---------- |
| ...      | ...       | ...        |

### Diversify Sentence Structures

// Suggest 5 better & advanced grammar structures as replacements for the original sentences cited from the task response using a table in markdown syntax with 4 columns: Grammar Structure | Original Sentence | Rephrased Sentence.
// Content in the "Grammar Structure" column must be concise, include the structure name, along with the structure itself. For example: "**Conditional Sentence (Type 1):** If + present simple, will + verb" or "**Passive Voice:** be + past participle", etc.
// Translate structure names to english-uk.

| Grammar Structure | Original Sentence | Rephrased Sentence |
| ----------------- | ----------------- | ------------------ |
| ...               | ...               | ...                |

### Improve Cohesion

// For the original task response, provide 5 more effective, and advanced uses of linking words & cohesive devices, using a markdown table with 2 columns: Original Text | Improved Text | Explanation.
// Do not include suggestions about grammar or vocabulary.
// In the 'Original Text' column, quote only the context/sentence with the main linking device formatted in Markdown bold, such as: "...so she went to bed early. **Also**, she still felt sleepy...".
// In 'Improved Text' column, suggest an improvement of linking device usage such as: "...so she went to bed early. **But**, she still felt sleepy...".
// Explanation content must be clear, brief, concise & compelling in english-uk.

| Original Text | Improved Text | Explanation |
| ------------- | ------------- | ----------- |
| ...           | ...           | ...         |
