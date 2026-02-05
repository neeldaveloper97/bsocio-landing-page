"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { googleAuthService } from "@/lib/api/services/google-auth.service";

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
  googleId: string;
  name: string;
  picture?: string;
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
  googleId: "",
  name: "",
  picture: "",
  gender: "",
  birthMonth: "",
  birthDate: "",
  birthYear: "",
  acceptTerms: false,
};

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

const inputStyles = [
  "flex h-11 w-full rounded-lg border border-border bg-white px-4",
  "text-base text-text-dark placeholder:text-text-muted/50",
  "focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue",
  "transition-colors duration-200",
].join(" ");

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

// ============================================
// MAIN COMPONENT
// ============================================

export default function GoogleCompletePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get Google user data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem("googleUserData");
    if (!storedData) {
      toast.error("No Google account data found. Please sign in again.");
      router.push("/signup");
      return;
    }

    try {
      const userData = JSON.parse(storedData);
      setFormData(prev => ({
        ...prev,
        email: userData.email || "",
        googleId: userData.googleId || "",
        name: userData.name || "",
        picture: userData.picture || "",
      }));
    } catch (error) {
      console.error("Failed to parse Google user data:", error);
      toast.error("Invalid session data. Please sign in again.");
      router.push("/signup");
    }
  }, [router]);

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
    
    setIsSubmitting(true);
    
    // Format date as YYYY-MM-DD
    const dob = `${formData.birthYear}-${formData.birthMonth}-${formData.birthDate}`;
    
    try {
      // Call Google auth callback with partial data (gender and dob only)
      await googleAuthService.authenticateWithUserData({
        email: formData.email,
        name: formData.name,
        picture: formData.picture,
        googleId: formData.googleId,
        gender: formData.gender as "MALE" | "FEMALE" | "NON_BINARY" | "PREFER_NOT_TO_SAY",
        dob,
      });
      
      // Clear session storage
      sessionStorage.removeItem("googleUserData");
      
      toast.success("Profile updated! Please complete verification.", { duration: 3000 });
      
      // Redirect to verification page
      router.push(`/signup/verify?email=${encodeURIComponent(formData.email)}`);
      
    } catch (error) {
      console.error("Profile completion error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, router]);

  return (
    <section className="flex flex-1 items-center justify-center py-12 sm:py-16">
      <Container variant="narrow">
        <Card className="mx-auto max-w-md border-none shadow-none">
          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-3xl font-bold text-text-darker">
              Complete Your Profile
            </CardTitle>
            <p className="mt-2 text-sm text-text-muted">
              Please provide your basic information
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-text-darker">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`${inputStyles} bg-gray-100`}
                />
              </div>

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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Profile..." : "Continue to Verification"}
              </Button>
            </form>

            {/* Footer Text */}
            <div className="mt-6 border-t border-border pt-5 text-center">
              <p className="text-xs text-text-muted">
                By continuing, you agree to our{" "}
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