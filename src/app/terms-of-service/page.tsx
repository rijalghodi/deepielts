import { BRAND_CONSTANTS } from "@/lib/constants";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background relative w-full px-5 sm:px-6">
      <div className="article mx-auto px-4 py-8 max-w-screen-lg">
        <h1 className="text-center">Terms of Service</h1>

        <p>
          Welcome to Deep IELTS. These Terms of Service govern your use of our IELTS writing assessment service. By
          using our service, you agree to these terms. Please read them carefully before using Deep IELTS.
        </p>

        <h2>Service Description</h2>

        <p>
          Deep IELTS provides an AI-powered IELTS writing assessment service that helps users improve their writing
          skills through automated scoring, feedback, and analysis. Our service includes practice questions, writing
          assessments, and detailed feedback on IELTS writing tasks.
        </p>

        <h2>Account Registration and Usage</h2>

        <p>To use our service, you must:</p>

        <ul>
          <li>Be at least 13 years old</li>
          <li>Provide accurate and complete information when creating an account</li>
          <li>Maintain the security of your account credentials</li>
          <li>Use the service only for lawful purposes</li>
          <li>Not share your account with others</li>
        </ul>

        <h2>Subscription Plans and Pricing</h2>

        <h3>Free Plan</h3>
        <p>Our free plan includes:</p>
        <ul>
          <li>Access to 1000+ IELTS practice questions</li>
          <li>3 IELTS writing assessments per day</li>
          <li>Basic feedback</li>
        </ul>

        <h3>Pro Plan</h3>
        <p>Our Pro plan includes all free features plus:</p>
        <ul>
          <li>Unlimited IELTS writing assessments</li>
          <li>Advanced and in-depth feedback</li>
          {/* <li>Export results to PDF files</li> */}
        </ul>

        <h3>Pricing</h3>
        <ul>
          <li>
            <strong>Monthly:</strong> $4
          </li>
          <li>
            <strong>3-Month:</strong> $8
          </li>
        </ul>

        <h2>Payment Terms</h2>

        <p>Payment terms and conditions:</p>

        <ul>
          <li>All prices are in USD and exclude applicable taxes</li>
          <li>Subscriptions automatically renew unless cancelled</li>
          <li>Payment is processed securely through our payment partners</li>
          <li>Failed payments may result in service suspension</li>
          <li>Price changes will be communicated 30 days in advance</li>
        </ul>
        <h2>Refund Policy</h2>

        <h3>Broken Service Guarantee</h3>
        <p>
          We provide a free trial so you can evaluate our service before subscribing. Once a paid subscription starts,
          all payments are non-refundable, except in cases where the service is unavailable due to a verified technical
          issue caused by us.
        </p>

        <h3>Eligible Refund Cases</h3>
        <ul>
          <li>Service downtime or malfunction lasting more than 48 hours</li>
          <li>
            Technical errors that prevent normal use of the service and cannot be resolved within a reasonable time
          </li>
        </ul>

        <h3>How to Request a Refund</h3>
        <ul>
          <li>Email our support team at {BRAND_CONSTANTS.APP_EMAIL}</li>
          <li>Include your account details, description of the issue, and any relevant evidence (screenshots, logs)</li>
          <li>We will review and respond within 48 hours</li>
          <li>Approved refunds are processed within 5–10 business days</li>
        </ul>

        <h3>Non-Refundable Cases</h3>
        <ul>
          <li>Change of mind after subscription</li>
          <li>Dissatisfaction without a technical issue</li>
          <li>Accounts suspended for policy violations</li>
        </ul>

        <h2>Service Availability and Limitations</h2>

        <p>Service terms and limitations:</p>

        <ul>
          <li>Service is provided "as is" without warranties</li>
          <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
          <li>Free plan users have limited daily usage</li>
          <li>Pro plan users have unlimited access within fair use guidelines</li>
          <li>We may temporarily limit access during maintenance or updates</li>
        </ul>

        <h2>User Conduct and Prohibited Activities</h2>

        <p>You agree not to:</p>

        <ul>
          <li>Attempt to manipulate or game our scoring system</li>
          <li>Use automated tools to access our service</li>
          <li>Share your account credentials with others</li>
          <li>Engage in any activity that could harm our service</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>

        <h2>Intellectual Property Rights</h2>

        <p>Intellectual property terms:</p>

        <ul>
          <li>Our service, content, and technology are protected by copyright and other laws</li>
          <li>You retain ownership of your writing submissions</li>
          <li>We may use anonymized data to improve our service</li>
          <li>You grant us license to process and analyze your submissions</li>
          <li>Practice questions and materials are for educational use only</li>
        </ul>

        <h2>Privacy and Data Protection</h2>

        <p>
          Your privacy is important to us. Our collection and use of your personal information is governed by our
          Privacy Policy, which is incorporated into these Terms of Service by reference.
        </p>

        <h2>Limitation of Liability</h2>

        <p>Limitation of liability terms:</p>

        <ul>
          <li>Our service is for educational purposes only</li>
          <li>We do not guarantee specific IELTS scores or results</li>
          <li>We are not liable for indirect, incidental, or consequential damages</li>
          <li>Our total liability is limited to the amount you paid for the service</li>
          <li>Some jurisdictions do not allow liability limitations</li>
        </ul>

        <h2>Termination and Cancellation</h2>

        <p>Account termination terms:</p>

        <ul>
          <li>You may cancel your subscription at any time</li>
          <li>We may terminate accounts for policy violations</li>
          <li>Cancellation takes effect at the end of the current billing period</li>
          <li>No refunds for partial months or unused time</li>
          <li>Account data is retained according to our Privacy Policy</li>
        </ul>

        <h2>Changes to Terms</h2>

        <p>We may update these terms from time to time. We will notify you of significant changes by:</p>

        <ul>
          <li>Posting updated terms on our website</li>
          <li>Sending email notifications to active users</li>
          <li>Displaying notices when you log in</li>
          <li>Providing 30 days' notice for material changes</li>
        </ul>

        <h2>Governing Law and Disputes</h2>

        <p>Legal terms and dispute resolution:</p>

        <ul>
          <li>These terms are governed by applicable laws</li>
          <li>Disputes will be resolved through good faith discussions</li>
          <li>We prefer informal resolution over formal proceedings</li>
          <li>Arbitration may be required for unresolved disputes</li>
          <li>Small claims court actions are permitted</li>
        </ul>

        <h2>Contact Information</h2>

        <p>For questions about these terms or our service, please contact us:</p>

        <ul>
          <li>
            <strong>Email:</strong> {BRAND_CONSTANTS.APP_EMAIL}
          </li>
          <li>
            <strong>Response Time:</strong> We aim to respond within 48 hours
          </li>
        </ul>

        <h2>Acceptance of Terms</h2>

        <p>
          By using Deep IELTS, you acknowledge that you have read, understood, and agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use our service.
        </p>

        <p>
          Thank you for choosing Deep IELTS. We're committed to providing you with a valuable and reliable IELTS writing
          assessment service.
        </p>
      </div>
    </div>
  );
}
