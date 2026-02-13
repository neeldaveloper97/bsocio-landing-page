import { redirect } from "next/navigation";

/**
 * The standalone signup page has been removed.
 * Registration is now handled inline on the landing page.
 * This route redirects to the landing page CTA section.
 */
export default function SignupRedirect() {
  redirect("/landingpage#cta");
}
