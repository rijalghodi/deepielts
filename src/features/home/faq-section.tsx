import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Deep IELTS free?",
    answer:
      "Yes. You can try this app for free and get detailed feedback. But to access unlimited you need to upgrade plan.",
  },
  {
    question: "How accurate is Deep IELTS compared to a real IELTS examiner?",
    answer:
      "Deep IELTS uses advanced AI models trained on thousands of real essays and examiner feedback. While it closely mimics examiner scoring and feedback, it is not a substitute for the official IELTS test. However, it provides highly relevant, actionable insights to help you improve.",
  },
  {
    question: "What types of IELTS writing tasks can I check?",
    answer:
      "Deep IELTS supports Academic Task 1, General Training Task 1, and Task 2 essays. You can upload, paste, or write your answer directly on the platform.",
  },
  {
    question: "How fast will I get my results?",
    answer:
      "Instantly! As soon as you submit your essay, our AI analyzes your writing and provides a band score with detailed feedback within seconds.",
  },
  {
    question: "Can I trust AI feedback for my IELTS preparation?",
    answer:
      "Our AI is trained on over 10,000 real IELTS essays and examiner comments. It provides feedback on grammar, vocabulary, structure, and task achievement, similar to what you’d get from a human tutor.",
  },
  {
    question: "Is my data and writing kept private?",
    answer:
      "Absolutely. Your essays are processed securely and are never shared with third parties. We respect your privacy and use your data only to improve your experience.",
  },
  {
    question: "Do I need to create an account to use Deep IELTS?",
    answer:
      "You can try the service without an account, but creating one lets you track your progress, save your essays, and access more features.",
  },
  {
    question: "How is Deep IELTS different from ChatGPT or other AI tools?",
    answer:
      "Deep IELTS is specifically trained for IELTS writing tasks and scoring criteria. It provides band scores and feedback tailored to the IELTS exam, unlike general-purpose AI chatbots.",
  },
];

export default function FaqSection() {
  return (
    <>
      <div className="w-full">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14 space-y-4 md:space-y-6">
          <h2 className="font-semibold text-3xl md:text-5xl md:leading-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Answers to the most frequently asked questions.</p>
        </div>
        {/* End Title */}

        <div className="">
          <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                value={`item-${index}`}
                key={faq.question}
                className="bg-muted border-none rounded-md px-5 py-5 flex flex-col gap-3"
              >
                <AccordionTrigger className="text-lg font-semibold text-left p-0">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base p-0">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
