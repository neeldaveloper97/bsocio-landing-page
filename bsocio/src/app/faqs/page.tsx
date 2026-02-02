"use client";

import { useState, useCallback, memo } from "react";
import { useFAQs } from "@/hooks";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/* ==============================================
   SIDEBAR NAV BUTTON COMPONENT
   ============================================== */
const SidebarNavButton = memo(function SidebarNavButton({
  id,
  index,
  question,
  isActive,
  onClick,
}: {
  id: string;
  index: number;
  question: string;
  isActive: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      className={cn(
        "w-full py-2.5 px-3 min-h-10 bg-transparent border-none rounded-xl",
        "font-arimo font-normal text-sm leading-5 text-left cursor-pointer",
        "text-(--text-secondary)",
        "transition-all duration-200 ease-out",
        "hover:bg-primary/5",
        isActive && "bg-primary/10 text-primary"
      )}
      onClick={() => onClick(id)}
    >
      {index + 1}. {question}
    </button>
  );
});

/* ==============================================
   PLUS ICON COMPONENT
   ============================================== */
function PlusIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div
      className={cn(
        "w-8 h-8 bg-(--tag-bg) rounded-full flex items-center justify-center shrink-0",
        "transition-all duration-300 ease-out relative",
        isOpen && "bg-primary rotate-45"
      )}
    >
      <span className="relative w-3.5 h-3.5">
        {/* Horizontal bar */}
        <span
          className={cn(
            "absolute w-3.5 h-0.5 left-0 top-1/2 -translate-y-1/2",
            "bg-(--text-secondary) transition-colors duration-300",
            isOpen && "bg-white"
          )}
        />
        {/* Vertical bar */}
        <span
          className={cn(
            "absolute w-0.5 h-3.5 left-1/2 top-0 -translate-x-1/2",
            "bg-(--text-secondary) transition-colors duration-300",
            isOpen && "bg-white"
          )}
        />
      </span>
    </div>
  );
}

/* ==============================================
   LOADING SKELETON
   ============================================== */
function FAQSkeleton() {
  return (
    <div className="flex-1 max-w-4xl flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="bg-(--card-bg) border border-(--card-border) rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-5 bg-(--tag-bg) rounded" />
            <div className="flex-1 h-5 bg-(--tag-bg) rounded" />
            <div className="w-8 h-8 bg-(--tag-bg) rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ==============================================
   MAIN FAQS PAGE COMPONENT
   ============================================== */
export default function FAQsPage() {
  const { faqs, isLoading, isError, error } = useFAQs();
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  const scrollToFaq = useCallback((id: string) => {
    setActiveId(id);
    const element = document.querySelector(`[data-faq="${id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  // Filter only published and active FAQs
  const displayedFAQs = faqs.filter(
    (faq) =>
      faq.state === "PUBLISHED" &&
      faq.status === "ACTIVE" &&
      faq.visibility === "PUBLIC"
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {/* Hero Section */}
      <section
        className={cn(
          "w-full min-h-70 bg-(--hero-gradient)",
          "flex items-center justify-center py-15 px-5",
          "contain-layout contain-style",
          "max-lg:min-h-60 max-lg:py-12.5",
          "max-md:min-h-50 max-md:py-10 max-md:px-4"
        )}
      >
        <div className="w-full max-w-7xl text-center">
          <h1
            className={cn(
              "font-arimo font-bold text-primary m-0",
              "text-[clamp(32px,5vw,60px)] leading-[1.1]"
            )}
          >
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* FAQ Main Content */}
      <section
        className={cn(
          "w-full py-15 px-10 bg-(--section-bg-alt)",
          "max-lg:py-12.5 max-lg:px-6",
          "max-md:py-10 max-md:px-4"
        )}
      >
        <div className="flex gap-12 max-w-7xl mx-auto items-start">
          {/* Loading State */}
          {isLoading && <FAQSkeleton />}

          {/* Error State */}
          {isError && (
            <div className="text-center py-10 col-span-full flex-1">
              <p className="text-red-500">
                {error?.message || "Failed to load FAQs. Please try again later."}
              </p>
            </div>
          )}

          {/* FAQ Content */}
          {!isLoading && !isError && displayedFAQs.length > 0 && (
            <>
              {/* Sidebar Navigation - Hidden on tablet/mobile */}
              <aside className="w-64 shrink-0 contain-layout contain-style max-lg:hidden">
                <h3
                  className={cn(
                    "font-arimo font-bold text-sm leading-5 tracking-[0.7px] uppercase",
                    "text-(--text-tertiary) mb-4"
                  )}
                >
                  All Questions
                </h3>
                <nav className="flex flex-col gap-2">
                  {displayedFAQs.map((faq, index) => (
                    <SidebarNavButton
                      key={faq.id}
                      id={faq.id}
                      index={index}
                      question={faq.question}
                      isActive={activeId === faq.id}
                      onClick={scrollToFaq}
                    />
                  ))}
                </nav>
              </aside>

              {/* Accordion Content */}
              <Accordion
                type="single"
                collapsible
                value={activeId}
                onValueChange={setActiveId}
                className={cn(
                  "flex-1 max-w-4xl flex flex-col gap-3",
                  "contain-layout contain-style",
                  "max-lg:max-w-full"
                )}
              >
                {displayedFAQs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    data-faq={faq.id}
                    className={cn(
                      "bg-(--card-bg) border border-(--card-border) rounded-xl",
                      "shadow-sm transition-shadow duration-300 overflow-hidden",
                      "contain-layout contain-style",
                      "data-[state=open]:shadow-lg"
                    )}
                  >
                    <AccordionTrigger
                      className={cn(
                        "w-full py-3 px-4 bg-transparent border-none cursor-pointer",
                        "flex justify-between items-center gap-4",
                        "transition-colors duration-200 ease-out",
                        "hover:bg-primary/2",
                        "max-md:py-4 max-md:px-5"
                      )}
                      hideChevron
                    >
                      <div className="flex-1 flex flex-row items-center gap-3 text-left">
                        <span
                          className={cn(
                            "font-arimo font-bold text-sm leading-none text-primary min-w-6",
                            "max-md:text-[10px] max-md:leading-3.5"
                          )}
                        >
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <h3
                          className={cn(
                            "font-arimo font-semibold text-[15px] leading-5.5 m-0",
                            "text-(--heading-primary) transition-colors duration-200",
                            "group-data-[state=open]:text-primary",
                            "max-lg:text-lg max-lg:leading-6.5",
                            "max-md:text-base max-md:leading-5.5"
                          )}
                        >
                          {faq.question}
                        </h3>
                      </div>
                      <PlusIcon isOpen={activeId === faq.id} />
                    </AccordionTrigger>
                    <AccordionContent
                      className={cn(
                        "py-3 px-4 pb-4 bg-(--section-bg) border-t border-(--divider)",
                        "max-md:py-4 max-md:px-5 max-md:pb-5",
                        "[&_p]:font-arimo [&_p]:font-normal [&_p]:text-sm [&_p]:leading-5.5",
                        "[&_p]:text-(--text-body) [&_p]:m-0 [&_p]:mb-2.5",
                        "[&_p]:whitespace-normal [&_p]:wrap-break-word",
                        "[&_p:last-child]:mb-0",
                        "max-md:[&_p]:text-sm max-md:[&_p]:leading-5",
                        "[&_ul]:font-arimo [&_ul]:text-sm [&_ul]:leading-5.5",
                        "[&_ul]:text-(--text-body) [&_ul]:my-2.5 [&_ul]:pl-5",
                        "[&_ol]:font-arimo [&_ol]:text-sm [&_ol]:leading-5.5",
                        "[&_ol]:text-(--text-body) [&_ol]:my-2.5 [&_ol]:pl-5",
                        "[&_li]:mb-1.5 [&_li:last-child]:mb-0",
                        "[&_strong]:font-bold [&_strong]:text-primary"
                      )}
                    >
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && displayedFAQs.length === 0 && (
            <div className="text-center py-10 col-span-full flex-1">
              <p className="text-(--text-secondary)">
                No FAQs available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
