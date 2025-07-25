import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <div className="text-center space-y-6">
      <h2 className="section-title">Ready to Improve Your IELTS Score?</h2>
      <p className="section-desc max-w-2xl mx-auto">
        Join thousands of students who are already using Deep IELTS to get better scores. Start your free practice today
        and see the difference AI-powered feedback can make.
      </p>
      <Button size="xl" className="hover:shadow-glowing-lg transition-shadow">
        Try It Now - It's Free
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default CtaSection;
