"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

// UI Components
import {
  Button,
  Container,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface VerificationFormData {
  email: string;
  phoneNumber: string;
  invitationLink: string;
}

// ============================================
// CONSTANTS
// ============================================

const INITIAL_FORM_STATE: VerificationFormData = {
  email: "",
  phoneNumber: "",
  invitationLink: "",
};

// Input field styles
const inputStyles = [
  "flex h-11 w-full rounded-lg border border-border bg-white px-4",
  "text-base text-text-dark placeholder:text-text-muted/50",
  "focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue",
  "transition-colors duration-200",
].join(" ");

// ============================================
// MAIN COMPONENT
// ============================================

export default function VerifyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<VerificationFormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFromUrl, setEmailFromUrl] = useState<boolean>(false);

  // Get email from URL params (passed from signup)
  useEffect(() => {
    let email: string | null = null;
    if (typeof window !== "undefined") {
      email = new URLSearchParams(window.location.search).get("email");
    }
    if (email) {
      setFormData(prev => ({ ...prev, email: decodeURIComponent(email) }));
      setEmailFromUrl(true);
    }
  }, []);

  // Handle input changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // For phone number, only allow digits after the country code
    if (name === "phoneNumber") {
      // Remove any non-digit characters except the leading +1
      const digitsOnly = value.replace(/[^\d]/g, "");
      // Limit to 10 digits (US phone number without country code)
      const limitedDigits = digitsOnly.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: limitedDigits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  // Validate form data
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone number validation (US format - 10 digits)
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    } else if (formData.phoneNumber.length !== 10) {
      errors.phoneNumber = "Please enter a valid 10-digit US phone number";
    }

    // Invitation link validation
    if (!formData.invitationLink) {
      errors.invitationLink = "Invitation link is required";
    } else if (!formData.invitationLink.includes("bsocio") && !formData.invitationLink.startsWith("http")) {
      errors.invitationLink = "Please enter a valid invitation link";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Form submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.specsto.online/auth/verify-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phoneNumber: `+1${formData.phoneNumber}`,
          invitationLink: formData.invitationLink,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Verification failed");
      }

      toast.success("Verification successful! Redirecting...", { duration: 3000 });

      // Redirect to the welcome page after successful verification
      setTimeout(() => {
        router.push("/welcome");
      }, 2000);

    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, router]);

  // Format phone number for display
  const formatPhoneDisplay = (digits: string) => {
    if (digits.length === 0) return "";
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  return (
    <section className="flex flex-1 items-center justify-center py-12 sm:py-16">
      <Container variant="narrow">
        <Card className="mx-auto max-w-md border-none shadow-none">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-text-darker">
              Complete Verification
            </CardTitle>
            <p className="mt-2 text-sm text-text-muted">
              Complete your account verification by entering your details below
            </p>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-text-muted mb-6 text-center">
              Please enter your email, phone number, and the invitation link you received to complete your registration.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-text-darker">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={emailFromUrl}
                  className={`${inputStyles} ${emailFromUrl ? 'bg-gray-100' : ''} ${validationErrors.email ? 'border-red-500' : ''}`}
                />
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-text-darker">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center justify-center px-4 h-11 bg-gray-100 border border-r-0 border-border rounded-l-lg text-sm text-text-dark font-medium">
                    +1
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="(555) 123-4567"
                    value={formatPhoneDisplay(formData.phoneNumber)}
                    onChange={handleChange}
                    className={`${inputStyles} rounded-l-none ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
                  />
                </div>
                <p className="text-xs text-text-muted">
                  Currently only US phone numbers (+1) are supported
                </p>
                {validationErrors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>

              {/* Invitation Link */}
              <div className="space-y-1.5">
                <label htmlFor="invitationLink" className="text-sm font-medium text-text-darker">
                  Invitation Link
                </label>
                <input
                  type="text"
                  id="invitationLink"
                  name="invitationLink"
                  placeholder="Paste your invitation link here"
                  value={formData.invitationLink}
                  onChange={handleChange}
                  className={`${inputStyles} ${validationErrors.invitationLink ? 'border-red-500' : ''}`}
                />
                {validationErrors.invitationLink && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.invitationLink}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="mt-4 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Complete Verification"}
              </Button>
            </form>

            {/* Footer Text */}
            <div className="mt-6 border-t border-border pt-5 text-center">
              <p className="text-xs text-text-muted">
                Don&apos;t have an invitation link?{" "}
                <Link href="/contact" className="text-brand-blue hover:underline">
                  Contact us
                </Link>
                {" "}for assistance.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
