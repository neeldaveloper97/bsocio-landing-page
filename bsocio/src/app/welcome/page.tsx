import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Welcome - Bsocio",
    description: "Welcome to Bsocio. Your journey starts here.",
};

export default function WelcomePage() {
    return (
        <section className="flex flex-1 items-center justify-center py-24 sm:py-32">
            <div className="mx-auto max-w-lg text-center px-4">
                <h1 className="text-4xl font-bold text-primary sm:text-5xl font-dm-sans">
                    Welcome to Bsocio
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Thank you for verifying your account. More details coming soon.
                </p>
            </div>
        </section>
    );
}
