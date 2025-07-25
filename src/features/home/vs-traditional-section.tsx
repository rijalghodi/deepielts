import { ArrowRight, CheckCircle, CircleDollarSign, Zap } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function VsTraditionalSection() {
  return (
    <div className="flex flex-col gap-12">
      {/* Main CTA Content */}
      <div className="text-center space-y-6">
        <Badge variant="light" className="mb-4" size="lg">
          <Zap className="h-3 w-3 mr-1" />
          Save Your Money
        </Badge>

        <h2 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
          Stop Wasting <span className="text-primary relative">Hundreds of Dollars</span> <br />
          Just to Get Manual IELTS Check
        </h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CircleDollarSign className="h-6 w-6 text-destructive" />
                  <h3 className="text-xl font-semibold text-destructive">Traditional Costs</h3>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IELTS Exam Fee:</span>
                    <span className="font-semibold">$200-300</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Preparation Courses:</span>
                    <span className="font-semibold">$500-1000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Per Essay Check:</span>
                    <span className="font-semibold">$15-20</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold text-destructive">
                    <span>Total Cost:</span>
                    <span>$1000-2000+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/50 bg-success/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-success" />
                  <h3 className="text-xl font-semibold text-success">AI-Powered Solution</h3>
                </div>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Unlimited Checks:</span>
                    <span className="font-semibold text-success">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Instant Feedback:</span>
                    <span className="font-semibold text-success">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">AI Analysis:</span>
                    <span className="font-semibold text-success">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold text-success">
                    <span>Total Cost:</span>
                    <span className="text-2xl">$0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Preparing for IELTS the traditional way can easily add up to a{" "}
              <strong className="text-destructive">$1000-2000+</strong> total cost.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Nowadays, AI models like ChatGPT can excel in English and help you prepare for your IELTS score with a
              more <strong className="text-primary">affordable price</strong> - actually,{" "}
              <strong className="text-green-600">completely free</strong>!
            </p>

            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <CheckCircle className="h-5 w-5" />
              <span>So, let's do it. Try it today.</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button size="xl" className="hover:shadow-glowing-lg transition-shadow">
              Start Your Free IELTS Check Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground">
              No credit card required • Instant results • Unlimited checks
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-primary">10K+</div>
          <div className="text-sm text-muted-foreground">Essays Analyzed</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-primary">$0</div>
          <div className="text-sm text-muted-foreground">Cost to Start</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-primary">24/7</div>
          <div className="text-sm text-muted-foreground">Available</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-primary">9.0</div>
          <div className="text-sm text-muted-foreground">Target Band</div>
        </div>
      </div> */}
    </div>
  );
}

export default VsTraditionalSection;
