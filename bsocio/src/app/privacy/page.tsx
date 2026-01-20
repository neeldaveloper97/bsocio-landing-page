import { Metadata } from "next";
import "./page.css";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy - Bsocio",
  description: "Learn how Bsocio collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
