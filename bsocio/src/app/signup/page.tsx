"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Hooks
import { useSignup } from "@/hooks";

// Types
import type { UserRole } from "@/types";

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

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  birthMonth: string;
  birthDate: string;
  birthYear: string;
  acceptTerms: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

interface SelectFieldProps {
  name: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const MONTHS: SelectOption[] = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const INITIAL_FORM_STATE: FormData = {
  email: "",
  password: "",
  confirmPassword: "",
  birthMonth: "",
  birthDate: "",
  birthYear: "",
  acceptTerms: false,
};

// Default role for signup
const DEFAULT_ROLE: UserRole = "USER";

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateDateOptions(): SelectOption[] {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return { 
      value: day < 10 ? `0${day}` : `${day}`, 
      label: `${day}` 
    };
  });
}

function generateYearOptions(count: number = 100): SelectOption[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const year = currentYear - i;
    return { value: `${year}`, label: `${year}` };
  });
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Input field styles using CSS variables
const inputStyles = [
  "flex h-11 w-full rounded-lg border border-border bg-white px-4",
  "text-base text-text-dark placeholder:text-text-muted/50",
  "focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue",
  "transition-colors duration-200",
].join(" ");

function FormField({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  required, 
  value, 
  onChange,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-darker">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`${inputStyles} ${error ? 'border-red-500' : ''}`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

function SelectField({ 
  name, 
  placeholder, 
  options, 
  value, 
  onChange, 
  required 
}: SelectFieldProps) {
  return (
    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className={inputStyles}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-text-muted">OR</span>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path 
        d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z" 
        fill="#4285F4"
      />
      <path 
        d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z" 
        fill="#34A853"
      />
      <path 
        d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 0 0 0 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z" 
        fill="#FBBC05"
      />
      <path 
        d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z" 
        fill="#EA4335"
      />
    </svg>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, isError, error, isSuccess } = useSignup();
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Memoized options to prevent recreation on each render
  const dateOptions = useMemo(() => generateDateOptions(), []);
  const yearOptions = useMemo(() => generateYearOptions(100), []);

  // Unified change handler
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
    
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
    
    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    // Birthday validation
    if (!formData.birthMonth || !formData.birthDate || !formData.birthYear) {
      errors.birthday = "Please select your complete birthday";
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      errors.acceptTerms = "You must accept the terms of use";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Form submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Format date as YYYY-MM-DD
    const dob = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDate}`;
    
    // Call signup API
    const result = await signup({
      email: formData.email,
      password: formData.password,
      role: DEFAULT_ROLE,
      dob,
      isTermsAccepted: formData.acceptTerms,
    });
    
    if (result) {
      // Success - redirect to login or dashboard
      router.push("/");
    }
  }, [formData, validateForm, signup, router]);

  // Google OAuth handler
  const handleGoogleSignup = useCallback(() => {
    // TODO: Implement Google OAuth
    console.log("Google signup clicked");
  }, []);

  return (
    <section className="flex flex-1 items-center justify-center py-12 sm:py-16">
      <Container variant="narrow">
        <Card className="mx-auto max-w-md border-none shadow-none">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-text-darker">
              Accept the Invitation
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* API Error Display */}
            {isError && error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">
                  {error.message || "An error occurred during signup. Please try again."}
                </p>
                {error.errors && Object.entries(error.errors).map(([field, messages]) => (
                  <p key={field} className="text-xs text-red-500 mt-1">
                    {field}: {messages.join(", ")}
                  </p>
                ))}
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-600">
                  Account created successfully! Redirecting...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
              />

              {/* Password */}
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
              />

              {/* Confirm Password */}
              <FormField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={validationErrors.confirmPassword}
              />

              {/* Birthday */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-darker">
                  Birthday
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <SelectField
                    name="birthMonth"
                    placeholder="Month"
                    options={MONTHS}
                    value={formData.birthMonth}
                    onChange={handleChange}
                    required
                  />
                  <SelectField
                    name="birthDate"
                    placeholder="Date"
                    options={dateOptions}
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                  <SelectField
                    name="birthYear"
                    placeholder="Year"
                    options={yearOptions}
                    value={formData.birthYear}
                    onChange={handleChange}
                    required
                  />
                </div>
                {validationErrors.birthday && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.birthday}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border-border text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-text-muted">
                    I have read and accept the{" "}
                    <Link href="/terms" className="text-brand-blue hover:underline">
                      terms of use
                    </Link>
                    .
                  </span>
                </label>
                {validationErrors.acceptTerms && (
                  <p className="text-xs text-red-500 mt-1 ml-8">{validationErrors.acceptTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="mt-2 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Accept the Invitation"}
              </Button>

              <Divider />

              {/* Google Sign Up */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full gap-3"
                onClick={handleGoogleSignup}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </form>

            {/* Footer Text */}
            <div className="mt-6 border-t border-border pt-5 text-center">
              <p className="text-xs text-text-muted">
                By accepting, you agree to our{" "}
                <Link href="/terms" className="text-brand-blue hover:underline">
                  Terms of Use
                </Link>
                {" "}and acknowledge our{" "}
                <Link href="/privacy" className="text-brand-blue hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
