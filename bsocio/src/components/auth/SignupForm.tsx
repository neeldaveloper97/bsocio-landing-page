"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// Hooks
import { useSignup } from "@/hooks";

// Components
const GoogleSignInButton = dynamic(
  () => import("@/components/auth/GoogleSignInButton").then((mod) => mod.GoogleSignInButton),
  { ssr: false, loading: () => <div /> }
);

// Types
import type { UserRole } from "@/types";

// UI Components
import { Button } from "@/components/ui";
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
  labelClassName?: string;
  inputClassName?: string;
}

interface SelectFieldProps {
  name: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

interface SignupFormProps {
  /** Visual variant: "card" renders with card wrapper, "inline" renders flat */
  variant?: "card" | "inline";
  /** Additional className for the outer wrapper */
  className?: string;
  /** Override label/input colors for dark backgrounds */
  darkMode?: boolean;
  /** Title text */
  title?: string;
  /** Callback when signup completes successfully */
  onSuccess?: () => void;
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

const DEFAULT_ROLE: UserRole = "USER";

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateDateOptions(): SelectOption[] {
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
      value: day < 10 ? `0${day}` : `${day}`,
      label: `${day}`,
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

const inputStyles = [
  "flex h-11 w-full rounded-lg border border-border bg-white px-4",
  "text-base text-gray-900 placeholder:text-gray-400",
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
  labelClassName = "text-sm font-medium text-gray-900",
  inputClassName,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClassName}>
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
        className={`${inputClassName || inputStyles} ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ name, placeholder, options, value, onChange, required }: SelectFieldProps) {
  return (
    <Select
      value={value}
      onValueChange={(newValue) => {
        const syntheticEvent = {
          target: { name, value: newValue },
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

export default function SignupForm({
  variant = "card",
  className = "",
  darkMode = false,
  title = "Register Your Interest",
  onSuccess,
}: SignupFormProps) {
  const { signup, isLoading } = useSignup();

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

  const handleGoogleSuccess = useCallback(() => {
    setGoogleAuthState({ isLoading: false, isSuccess: true, isError: false, error: null });
    toast.success("Registered! We will get back to you through email.", { duration: 5000 });
    onSuccess?.();
  }, [onSuccess]);

  const handleGoogleError = useCallback((err: Error) => {
    setGoogleAuthState({
      isLoading: false,
      isSuccess: false,
      isError: true,
      error: err.message || "Google sign-in failed",
    });
  }, []);

  const dateOptions = useMemo(() => generateDateOptions(), []);
  const yearOptions = useMemo(() => generateYearOptions(100), []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isCheckbox = type === "checkbox";
      setFormData((prev) => ({
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      }));
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.gender) errors.gender = "Please select your gender";
    if (!formData.birthMonth || !formData.birthDate || !formData.birthYear) {
      errors.birthday = "Please select your complete birthday";
    }
    if (!formData.acceptTerms) errors.acceptTerms = "You must accept the terms of use";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;
      const dob = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDate}`;
      try {
        const result = await signup({
          email: formData.email,
          role: DEFAULT_ROLE,
          dob,
          isTermsAccepted: formData.acceptTerms,
          gender: formData.gender as "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY",
        });
        if (result) {
          toast.success("Registered! We will get back to you through email.", { duration: 5000 });
          setFormData(INITIAL_FORM_STATE);
          onSuccess?.();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create account. Please try again.";
        toast.error(errorMessage);
      }
    },
    [formData, validateForm, signup, onSuccess]
  );

  const labelClass = darkMode
    ? "text-sm font-medium text-white/90"
    : "text-sm font-medium text-gray-900";

  const content = (
    <>
      {/* Google Auth Error */}
      {googleAuthState.isError && googleAuthState.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{googleAuthState.error}</p>
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
          labelClassName={labelClass}
        />

        {/* Gender */}
        <div className="space-y-1.5">
          <label htmlFor="gender" className={labelClass}>
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
          <label className={labelClass}>Birthday</label>
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
            <span className={darkMode ? "text-sm text-white/80" : "text-sm text-gray-600"}>
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
          {isLoading ? "Registering..." : "Register Your Interest"}
        </Button>
      </form>

      {/* Footer Text */}
      <div className="mt-6 border-t border-border pt-5 text-center">
        <p className={darkMode ? "text-xs text-white/60" : "text-xs text-gray-500"}>
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
    </>
  );

  if (variant === "inline") {
    return <div className={className}>{content}</div>;
  }

  // Card variant (default)
  return (
    <div className={`mx-auto max-w-md ${className}`}>
      <div className="pb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {content}
    </div>
  );
}
