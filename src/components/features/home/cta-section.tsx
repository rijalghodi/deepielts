import { ArrowRight } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <h2 className="section-title">Ready to Improve Your IELTS Score?</h2>
      <p className="section-desc max-w-2xl mx-auto">Start your free practice today and see the difference.</p>
      <Button size="xl" className="hover:shadow-glowing-lg transition-shadow">
        Try It Now <span className="hidden sm:inline">- It's Free</span>
        <ArrowRight />
      </Button>
    </div>
  );
}

export default CtaSection;
