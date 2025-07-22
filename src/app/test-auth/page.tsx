"use client";

import { AuthDialog } from "@/features/auth/login/auth-dialog";
import { Button } from "@/components/ui/button";

export default function TestAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Email Code Authentication Test</h1>
        <p className="text-gray-600">Click the button below to test the email code authentication flow</p>
        <AuthDialog>
          <Button>Test Authentication</Button>
        </AuthDialog>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900">How to test:</h2>
          <ol className="text-left text-blue-800 mt-2 space-y-1">
            <li>1. Click "Test Authentication"</li>
            <li>2. Enter your email address</li>
            <li>3. Check the browser console for the verification code</li>
            <li>4. Enter the code in the verification form</li>
            <li>5. You should be redirected to the home page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
