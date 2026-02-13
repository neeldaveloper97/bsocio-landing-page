"use client";

import Image from "next/image";
import { BsocioLogo, Icon, Section, SectionTitle } from "./shared";

interface HomeViewProps {
    onNavigate: (page: "home" | "president" | "team") => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
    return (
        <div className="font-[var(--font-dm-sans),sans-serif] text-[#202124] leading-relaxed">
            {/* Header */}
            <header className="fixed top-0 left-0 z-[1000] w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                <div className="mx-auto flex h-auto max-w-[1200px] items-center justify-between px-5 py-5">
                    <BsocioLogo onClick={() => onNavigate("home")} />
                </div>
            </header>

            <main>
                {/* Hero */}
                <section
                    className="relative flex min-h-[500px] items-center justify-center px-4 pt-[140px] pb-[100px] text-center text-white overflow-hidden"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=75"
                        alt="Children being helped through humanitarian programs"
                        fill
                        priority
                        fetchPriority="high"
                        className="object-cover object-center z-0"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-black/70 z-10" />
                    <div className="mx-auto max-w-[1200px] relative z-20">
                        <h1 className="mb-6 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[3.5rem] font-[var(--font-arimo),sans-serif]">
                            The Bsocio Humanity Fund Is Coming Soon
                        </h1>
                        <h2 className="mb-8 text-base font-normal text-white sm:text-lg md:text-xl lg:text-[1.8rem] font-[var(--font-arimo),sans-serif]">
                            Building a future where no child goes to school hungry—and where the mission of saving lives continues beyond 2045.
                        </h2>
                        <button
                            onClick={() => document.getElementById('why-this-moment')?.scrollIntoView({ behavior: 'smooth' })}
                            className="mt-8 inline-block rounded-[30px] bg-[#F65314] px-7 py-3 text-sm font-bold uppercase tracking-wider text-[#202124] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                        >
                            Learn Why Now ↓
                        </button>
                    </div>
                </section>

                {/* Why This Moment Matters */}
                <Section id="why-this-moment">
                    <SectionTitle>Why This Moment Matters</SectionTitle>
                    <div className="grid gap-10 md:grid-cols-2 md:items-center">
                        <div>
                            <p className="mb-4 text-[1.1rem]">
                                <span className="font-bold text-[#2A5CBD]">
                                    Bsocio means &quot;Be Kind to Be Great — like Bill Gates.&quot;
                                </span>{" "}
                                The greatest humanitarian hero of our time.
                            </p>
                            <p className="mb-4 text-[1.1rem]">
                                For decades, visionary philanthropy has changed the course of global health, education, and human survival.
                            </p>
                            <p className="my-6 border-l-4 border-[#7CBB00] pl-4 text-lg font-bold text-[#1e4a9f]">
                                Imagine a world without his $300 billion in lifetime giving…
                            </p>
                        </div>
                        <div>
                            <div className="my-8 space-y-4">
                                {["Fewer vaccines", "Fewer children in school", "Fewer lives saved"].map((t) => (
                                    <div key={t} className="flex items-center gap-4 text-lg font-semibold md:text-xl">
                                        <Icon name="minus-circle" className="text-2xl text-[#7CBB00]" />
                                        {t}
                                    </div>
                                ))}
                            </div>
                            <p className="text-[1.1rem]">
                                Now, a new generation must carry the torch forward—amplified by technology, guided by evidence, and grounded in humanity.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* About */}
                <Section className="bg-[#f5f7fa]">
                    <SectionTitle>About the Bsocio Humanity Fund</SectionTitle>
                    <div>
                        <p className="mb-4 text-[1.1rem]">
                            The Bsocio Humanity Fund is a $300 billion global action framework designed to honor, expand, and safeguard Bill Gates&apos;s philanthropic legacy.
                        </p>
                        <p className="my-6 border-l-4 border-[#7CBB00] pl-4 text-lg font-bold text-[#1e4a9f]">
                            A $9 billion annual funding gap threatens decades of progress.
                        </p>
                        <p className="text-[1.1rem]">
                            To close it, our founding members have committed $3 billion to seed the Bsocio Humanity Fund—a perpetual engine designed to end classroom hunger worldwide and carry forward his mission of saving lives beyond 2045.
                        </p>
                    </div>
                </Section>

                {/* Anchoring Initiatives */}
                <Section>
                    <SectionTitle>Anchoring Initiatives</SectionTitle>
                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                        {/* Card 1 */}
                        <div className="rounded-lg bg-white p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
                            <h3 className="mb-4 text-xl font-bold text-[#2A5CBD] font-[Montserrat,sans-serif]">
                                Bill Gates Socio Day — October 28
                            </h3>
                            <p className="mb-4 text-[1.1rem]">A global day of action designed to be celebrated every year beyond his lifetime.</p>
                            <p className="mb-4 text-[1.1rem]">On this day, individuals and organizations redirect celebration spending toward child hunger, health, and education.</p>
                            <ul className="ml-5 list-disc space-y-3 text-[1.1rem]">
                                <li>Mobilize millions toward urgent global challenges</li>
                                <li>Amplify awareness through shared storytelling</li>
                                <li>Ensure legacy by embedding generosity into global culture</li>
                            </ul>
                        </div>
                        {/* Card 2 */}
                        <div className="rounded-lg bg-white p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
                            <h3 className="mb-4 text-xl font-bold text-[#2A5CBD] font-[Montserrat,sans-serif]">
                                Bill Gates Socio Centres
                            </h3>
                            <p className="mb-4 text-[1.1rem]">Future global hubs of innovation and opportunity.</p>
                            <p className="mb-4 text-[1.1rem] font-bold">Key Outcomes:</p>
                            <ul className="ml-5 list-disc space-y-3 text-[1.1rem]">
                                <li>School feeding systems across 100+ countries</li>
                                <li>Sustainable nutrition for 500 million children annually</li>
                            </ul>
                            <p className="mt-6 border-l-4 border-[#7CBB00] pl-4 text-lg font-bold text-[#1e4a9f]">
                                So no child ever learns on an empty stomach.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Statistics */}
                <Section className="bg-[#1e4a9f] text-white text-center">
                    <SectionTitle light>Why Classroom Hunger Must End</SectionTitle>
                    <p className="mb-8 text-[1.1rem]">Classroom hunger is not just a crisis—it&apos;s a global economic emergency.</p>
                    <div className="mt-8 grid gap-6 sm:gap-8 sm:grid-cols-3">
                        {[
                            { num: "45M", text: "children arrive at school hungry every day" },
                            { num: "20%", text: "reduction in primary school completion due to malnutrition" },
                            { num: "10%", text: "of GDP lost to childhood stunting in affected countries" },
                        ].map((s) => (
                            <div key={s.num} className="p-5">
                                <div className="mb-2 text-3xl font-extrabold text-[#F65314] sm:text-4xl md:text-[3.5rem]">{s.num}</div>
                                <div className="text-base sm:text-[1.1rem]">{s.text}</div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 border-l-4 border-[#F65314] pl-4 text-left text-lg font-bold text-white">
                        Ending classroom hunger is one of the highest-return investments in human progress.
                    </p>
                </Section>

                {/* Our Story */}
                <Section className="bg-[#f5f7fa]">
                    <SectionTitle>Our Story</SectionTitle>
                    <p className="text-[1.1rem]">
                        What began as a 70th birthday tribute to Bill Gates has evolved into the Bsocio Like Bill Gates Movement—a global call to action dedicated to scaling his vision.
                    </p>
                    <p className="text-[1.1rem]">
                        Co-created by friends, believers, and changemakers worldwide, we are turning gratitude into action, proving that strategic kindness can solve humanity&apos;s greatest challenges.
                    </p>
                </Section>

                {/* Why This Movement Now */}
                <Section>
                    <SectionTitle>Why This Movement Now?</SectionTitle>
                    <p className="text-[1.1rem]">Bill Gates has shown the world how focused generosity can transform health, education, and innovation.</p>
                    <p className="text-[1.1rem]">
                        With the Gates Foundation set to sunset in 2045, a critical question emerges: how do we ensure this momentum not only continues but grows?
                    </p>
                    <p className="my-6 border-l-4 border-[#7CBB00] pl-4 text-lg font-bold text-[#1e4a9f]">
                        Our answer: empower people everywhere to make compassion a daily practice.
                    </p>
                </Section>

                {/* Core Values */}
                <Section>
                    <SectionTitle>Our Core Values</SectionTitle>
                    <div className="mt-8 grid gap-8 md:grid-cols-3">
                        {[
                            { icon: "bullseye", title: "Mission", text: "To inspire one billion acts of kindness by transforming everyday celebrations into shared moments of impact." },
                            { icon: "eye", title: "Vision", text: "A world where compassion becomes our global culture and every person sees themselves as a hero of change." },
                            { icon: "heart", title: "Belief", text: "Like Bill Gates, we believe true greatness is measured by how many people you lift." },
                        ].map((v) => (
                            <div key={v.title} className="rounded-lg bg-white p-8 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
                                <div className="mb-6 text-[2.5rem] text-[#2A5CBD]"><Icon name={v.icon} /></div>
                                <h3 className="mb-4 text-xl font-bold text-[#2A5CBD] font-[Montserrat,sans-serif]">{v.title}</h3>
                                <p className="text-[1.1rem]">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Focus Areas */}
                <Section className="bg-[#f5f7fa]">
                    <SectionTitle>Focus Areas</SectionTitle>
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                        {[
                            { icon: "utensils", title: "Ending Child Hunger" },
                            { icon: "laptop-code", title: "Innovation & Technology for Good" },
                            { icon: "heartbeat", title: "Global Health" },
                            { icon: "leaf", title: "Sustainable Development" },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="rounded-lg bg-white p-6 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] sm:p-8 lg:p-10"
                            >
                                <div className="mb-4 text-[2.5rem] text-[#2A5CBD]"><Icon name={f.icon} /></div>
                                <h3 className="text-base font-bold text-[#2A5CBD] font-[Montserrat,sans-serif] md:text-lg">{f.title}</h3>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* How We Create Impact */}
                <Section>
                    <SectionTitle>How We Create Impact</SectionTitle>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: "Human-Centered Giving", text: "Solutions designed around real lives—not headlines." },
                            { title: "Evidence-Led Action", text: "Data, accountability, and measurable outcomes." },
                            { title: "Strategic Partnerships", text: "Working alongside governments, innovators, and communities." },
                            { title: "Cultural Influence", text: "Turning global awareness into sustained action at scale." },
                        ].map((p) => (
                            <div key={p.title} className="border-l-4 border-[#2A5CBD] bg-[#f8f9fa] p-5 sm:p-6">
                                <h3 className="mb-3 text-lg font-bold text-[#2A5CBD] font-[Montserrat,sans-serif]">{p.title}</h3>
                                <p className="text-[1.1rem]">{p.text}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Coalition */}
                <Section className="bg-[#1e4a9f] text-white text-center">
                    <SectionTitle light>A Coalition for Our Shared Future</SectionTitle>
                    <p className="mb-4 text-[1.1rem]">This mission is bigger than any institution—but achievable when humanity acts together.</p>
                    <p className="mb-4 text-[1.1rem]">
                        We are building a global coalition of philanthropists, governments, businesses, creators, and citizens to ensure no child ever learns on an empty stomach.
                    </p>
                    <div className="my-8 text-2xl font-extrabold text-[#F65314] sm:text-3xl md:text-4xl lg:text-[3.5rem]">Be Kind to Be Great</div>
                    <p className="text-[1.1rem]">Join the movement redefining what it means to celebrate life.</p>
                </Section>

                {/* Our Structure / CTA */}
                <Section className="bg-[#f5f7fa] text-center" id="our-structure">
                    <SectionTitle>Our Structure</SectionTitle>
                    <p className="mb-4 text-[1.1rem]">
                        Bsocio operates through a dual-entity model consisting of a nonprofit and a Public Benefit Corporation (PBC)—a structure designed to accelerate global solutions that end child hunger and carry forward the mission of saving lives beyond 2045.
                    </p>
                    <p className="mb-4 text-[1.1rem]">
                        This integrated model brings together philanthropic permanence and mission-aligned innovation, ensuring Bsocio&apos;s ability to scale impact sustainably and over the long term.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={() => onNavigate("president")}
                            className="inline-block rounded bg-[#F65314] px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#d94910] hover:shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                        >
                            Learn More
                        </button>
                    </div>
                </Section>
            </main>

            {/* Footer */}
            <footer className="bg-[#1a1a1a] px-5 py-10 text-center text-white md:p-16">
                <p className="mb-2 text-sm text-[#999] sm:text-base">© Bsocio Humanity Fund</p>
                <p>
                    <a href="mailto:Acquisitionteam@bsocio.org" className="text-[#7CBB00] no-underline transition-colors hover:text-[#a0d840] hover:underline">
                        Acquisitionteam@bsocio.org
                    </a>
                </p>
            </footer>
        </div>
    );
}
