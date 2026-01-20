import { Metadata } from "next";
import "./page.css";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use - Bsocio",
  description: "Read the terms and conditions for using the Bsocio platform.",
};

export default function TermsPage() {
  return <TermsContent />;
}
