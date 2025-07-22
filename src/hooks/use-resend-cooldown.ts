import { useState, useEffect } from "react";

const RESEND_COOLDOWN_KEY = "resend_cooldown_";
const COOLDOWN_DURATION = 60; // 60 seconds

export function useResendCooldown(email: string) {
  const [countdown, setCountdown] = useState<number>(0);

  // Initialize countdown from localStorage
  useEffect(() => {
    const cooldownKey = RESEND_COOLDOWN_KEY + email;
    const storedTime = localStorage.getItem(cooldownKey);
    if (storedTime) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTime)) / 1000);
      const remaining = Math.max(0, COOLDOWN_DURATION - elapsed);
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        localStorage.removeItem(cooldownKey);
      }
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const cooldownKey = RESEND_COOLDOWN_KEY + email;
          localStorage.removeItem(cooldownKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, email]);

  const startCooldown = () => {
    const cooldownKey = RESEND_COOLDOWN_KEY + email;
    localStorage.setItem(cooldownKey, Date.now().toString());
    setCountdown(COOLDOWN_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    countdown,
    isActive: countdown > 0,
    startCooldown,
    formatTime,
  };
}

export const writeCooldown = (email: string) => {
  const cooldownKey = RESEND_COOLDOWN_KEY + email;
  localStorage.setItem(cooldownKey, Date.now().toString());
};
