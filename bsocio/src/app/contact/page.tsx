/**
 * Contact Us Page
 * Contact form for inquiries, media, partnerships, and reports
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CtaImpactSection from "@/components/layout/CtaImpactSection";

// ============================================
// VALIDATION SCHEMA
// ============================================

const contactSchema = z.object({
  reason: z.string().min(1, "Please select a reason for contacting"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Please select your country"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ============================================
// DATA
// ============================================

const CONTACT_REASONS = [
  { value: "MEDIA_PRESS", label: "Media & Press" },
  { value: "PARTNERSHIPS", label: "Partnerships & Collaborations" },
  { value: "REPORT_SCAM", label: "Report Scams or Misuse" },
  { value: "GENERAL_INQUIRY", label: "General Inquiry / Other" },
];

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "ZA", label: "South Africa" },
  { value: "NG", label: "Nigeria" },
  { value: "EG", label: "Egypt" },
  { value: "KE", label: "Kenya" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "CO", label: "Colombia" },
  { value: "PE", label: "Peru" },
  { value: "other", label: "Other" },
];

// ============================================
// COMPONENTS
// ============================================

function InfoBox({
  title,
  children,
  variant = "default",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "info";
}) {
  const bgClass =
    variant === "info"
      ? "bg-blue-50 border-blue-200"
      : "bg-slate-50 border-slate-200";

  return (
    <div className={`p-5 rounded-xl border ${bgClass}`}>
      <h3 className="font-bold text-lg leading-7 text-gray-900 mb-3">{title}</h3>
      <p className="text-sm leading-6 text-gray-700">{children}</p>
    </div>
  );
}

function FormDivider() {
  return <div className="h-px bg-gray-100 my-8" />;
}

// ============================================
// PAGE COMPONENT
// ============================================

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      reason: "",
      fullName: "",
      email: "",
      phone: "",
      country: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);

    try {
      // Map form data to API payload format
      const payload = {
        reason: data.reason, // Already in correct format: MEDIA_PRESS, PARTNERSHIPS, REPORT_SCAM, GENERAL_INQUIRY
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || "",
        country: data.country,
        message: data.message,
      };

      // Make API call to contact endpoint
      const response = await fetch("https://api.specsto.online/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      toast.success(
        "Thank you for contacting us! We will respond within 24-48 business hours."
      );
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold leading-10 text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-base leading-[26px] text-gray-700">
            Please complete the form below and select the option that best describes
            your inquiry.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              {/* Reason for Contacting */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-900">
                      Reason for Contacting <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Please select one option
                    </FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTACT_REASONS.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDivider />

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel className="text-base font-bold text-gray-900">
                      Full Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Enter your full legal name
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="h-12 rounded-xl border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Address */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel className="text-base font-bold text-gray-900">
                      Email Address <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      We&apos;ll use this to respond to your inquiry
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="h-12 rounded-xl border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel className="text-base font-bold text-gray-900">
                      Phone Number{" "}
                      <span className="text-gray-500 font-normal">(Optional)</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Include country code if outside your region
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="h-12 rounded-xl border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country of Residence */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-900">
                      Country of Residence <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Select your current country
                    </FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-gray-300">
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDivider />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-gray-900">
                      Message <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Briefly describe your inquiry so we can assist you
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about your inquiry..."
                        className="min-h-[170px] rounded-xl border-gray-300 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormDivider />

              {/* Privacy Notice */}
              <InfoBox title="Privacy Notice">
                Your privacy is important to us. The information you provide will be
                used solely to respond to your inquiry and will not be shared, sold,
                or used for marketing purposes. By submitting this form, you consent
                to the collection and processing of your information in accordance
                with our Privacy Policy.
              </InfoBox>

              <div className="h-8" />

              {/* Response Time */}
              <InfoBox title="Response Time" variant="info">
                We aim to respond to all inquiries within 24–48 business hours. Media
                and partnership requests may be prioritized.
              </InfoBox>

              <div className="h-8" />

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[200px] h-14 rounded-xl text-base font-bold"
                  variant="primary"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* CTA Section */}
      <CtaImpactSection />
    </>
  );
}
