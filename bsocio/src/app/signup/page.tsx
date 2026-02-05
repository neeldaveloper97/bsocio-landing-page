"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Hooks
import { useSignup } from "@/hooks";

// Components
// Load Google sign-in button client-side only to avoid bundling @react-oauth/google on all pages
const GoogleSignInButton = dynamic(
  () => import("@/components/auth/GoogleSignInButton").then((mod) => mod.GoogleSignInButton),
  { ssr: false, loading: () => <div /> }
);

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface FormData {
  email: string;
  gender: string;
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

const GENDER_OPTIONS: SelectOption[] = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
];

const INITIAL_FORM_STATE: FormData = {
  email: "",
  gender: "",
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
    <Select
      value={value}
      onValueChange={(newValue) => {
        // Create a synthetic event to match the onChange signature
        const syntheticEvent = {
          target: { name, value: newValue }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }}
      required={required}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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

// ============================================
// MAIN COMPONENT
// ============================================

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, isError, error } = useSignup();
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [googleAuthState, setGoogleAuthState] = useState<{
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
  }>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Google auth handlers
  const handleGoogleSuccess = useCallback(() => {
    setGoogleAuthState({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });
    toast.success("Account created successfully! Please check your email for verification.");
  }, []);

  const handleGoogleError = useCallback((err: Error) => {
    setGoogleAuthState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: err.message || 'Google sign-in failed',
    });
  }, []);

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
    
    // Gender validation
    if (!formData.gender) {
      errors.gender = "Please select your gender";
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
    
    try {
      // Call signup API (without password - user will set later)
      const result = await signup({
        email: formData.email,
        role: DEFAULT_ROLE,
        dob,
        isTermsAccepted: formData.acceptTerms,
        gender: formData.gender as "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY",
      });
      
      // Handle response - only redirect if we got a result
      if (result) {
        toast.success("Registration successful! Please complete verification.", { duration: 3000 });
        // Redirect to verification page with email
        router.push(`/signup/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      // Error is handled by the hook's onError or shown here
      const errorMessage = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      toast.error(errorMessage);
    }
  }, [formData, validateForm, signup, router]);

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
            {/* Google Auth Error */}
            {googleAuthState.isError && googleAuthState.error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">
                  {googleAuthState.error}
                </p>
              </div>
            )}

            {/* Google Sign Up */}
            <GoogleSignInButton 
              className="w-full"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            <Divider />

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

              {/* Gender */}
              <div className="space-y-1.5">
                <label htmlFor="gender" className="text-sm font-medium text-text-darker">
                  Gender
                </label>
                <SelectField
                  name="gender"
                  placeholder="Select your gender"
                  options={GENDER_OPTIONS}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                />
                {validationErrors.gender && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.gender}</p>
                )}
              </div>

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
                disabled={isLoading || googleAuthState.isLoading}
              >
                {isLoading ? "Creating Account..." : "Accept the Invitation"}
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
