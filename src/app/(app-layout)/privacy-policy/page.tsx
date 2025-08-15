import { BRAND_CONSTANTS } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background relative w-full px-5 sm:px-6">
      <div className="article mx-auto max-w-screen-lg py-8">
        <h1 className="text-center">Privacy Policy</h1>

        <p>
          Welcome to Deep IELTS. We respect your privacy and are committed to protecting your personal information. This
          privacy policy explains how we collect, use, and safeguard your data when you use our IELTS writing assessment
          service.
        </p>

        <h2>What Information We Collect</h2>

        <p>We collect the following types of information:</p>

        <ul>
          <li>
            <strong>Account Information:</strong> When you create an account, we collect your email address, name, and
            password.
          </li>
          <li>
            <strong>Writing Submissions:</strong> Your IELTS writing responses and essays that you submit for
            assessment.
          </li>
          <li>
            <strong>Assessment Results:</strong> AI-generated feedback, scores, and analysis of your writing.
          </li>
          <li>
            <strong>Usage Data:</strong> How you interact with our service, including login times and feature usage.
          </li>
          <li>
            <strong>Technical Information:</strong> Device information, browser type, and IP address for security
            purposes.
          </li>
        </ul>

        <h2>How We Use Your Information</h2>

        <p>We use your information to:</p>

        <ul>
          <li>Provide and improve our IELTS writing assessment service</li>
          <li>Generate personalized feedback and scores for your writing</li>
          <li>Track your progress and performance over time</li>
          <li>Send you important updates about our service</li>
          <li>Ensure the security and integrity of our platform</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>How We Protect Your Data</h2>

        <p>We implement several security measures to protect your information:</p>

        <ul>
          <li>All data is encrypted during transmission and storage</li>
          <li>We use secure authentication methods</li>
          <li>Regular security audits and updates</li>
          <li>Limited access to personal data by our team members</li>
          <li>Secure hosting infrastructure</li>
        </ul>

        <h2>Data Sharing and Third Parties</h2>

        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share data only in these
          limited circumstances:
        </p>

        <ul>
          <li>
            <strong>Service Providers:</strong> With trusted partners who help us operate our service (hosting,
            analytics)
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of company merger or acquisition (with your consent)
          </li>
        </ul>

        <h2>Your Rights and Choices</h2>

        <p>You have the following rights regarding your data:</p>

        <ul>
          <li>
            <strong>Access:</strong> Request a copy of your personal information
          </li>
          <li>
            <strong>Correction:</strong> Update or correct inaccurate information
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your account and data
          </li>
          <li>
            <strong>Portability:</strong> Export your data in a readable format
          </li>
          <li>
            <strong>Opt-out:</strong> Unsubscribe from marketing communications
          </li>
        </ul>

        <h2>Data Retention</h2>

        <p>
          We keep your information for as long as you have an active account. If you delete your account, we will remove
          your personal data within 30 days. Some information may be retained longer for legal or security purposes.
        </p>

        <h2>Cookies and Tracking</h2>

        <p>We use cookies and similar technologies to:</p>

        <ul>
          <li>Remember your login status</li>
          <li>Improve website functionality</li>
          <li>Analyze how our service is used</li>
          <li>Provide personalized content</li>
        </ul>

        <p>You can control cookie settings through your browser preferences.</p>

        <h2>Children's Privacy</h2>

        <p>
          Our service is not intended for children under 13 years old. We do not knowingly collect personal information
          from children under 13. If you believe we have collected such information, please contact us immediately.
        </p>

        <h2>International Data Transfers</h2>

        <p>
          Your data may be processed in countries other than your own. We ensure that all data transfers comply with
          applicable privacy laws and provide adequate protection for your information.
        </p>

        <h2>Changes to This Policy</h2>

        <p>We may update this privacy policy from time to time. We will notify you of any significant changes by:</p>

        <ul>
          <li>Posting the new policy on our website</li>
          <li>Sending you an email notification</li>
          <li>Displaying a notice when you log in</li>
        </ul>

        <h2>Contact Us</h2>

        <p>If you have questions about this privacy policy or how we handle your data, please contact us:</p>

        <ul>
          <li>
            <strong>Email:</strong> {BRAND_CONSTANTS.APP_EMAIL}
          </li>
          <li>
            <strong>Response Time:</strong> We aim to respond within 48 hours
          </li>
        </ul>

        <h2>Your Consent</h2>

        <p>
          By using Deep IELTS, you consent to the collection and use of your information as described in this privacy
          policy. If you do not agree with any part of this policy, please do not use our service.
        </p>

        <p>
          Thank you for trusting Deep IELTS with your privacy. We are committed to protecting your information and
          providing a secure learning environment.
        </p>
      </div>
    </div>
  );
}
