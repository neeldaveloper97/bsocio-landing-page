"use client";

import Image from "next/image";
import { BsocioLogo, Icon } from "./shared";

interface LeadershipViewProps {
    page: "president" | "team";
    onNavigate: (page: "home" | "president" | "team") => void;
    setPage: (page: "president" | "team") => void;
}

export default function LeadershipView({ page, onNavigate, setPage }: LeadershipViewProps) {
    return (
        <div className={`font-[var(--font-open-sans),sans-serif] text-[#202124] leading-relaxed`}>
            {/* Header */}
            <header className="fixed top-0 left-0 z-[1000] w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
                <div className="mx-auto flex h-auto max-w-[1200px] items-center justify-between px-5 py-5">
                    <BsocioLogo onClick={() => onNavigate("home")} />
                </div>
            </header>

            {/* Hero */}
            <div className="bg-gradient-to-br from-[#2A5CBD] to-[#1e4a9f] px-5 pt-24 pb-14 text-center text-white sm:pt-28 sm:pb-20 md:pt-32 md:pb-28">
                <div className="mx-auto max-w-[1000px] sm:px-5">
                    <h1 className="mb-8 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-[4rem] font-[Montserrat,sans-serif] tracking-[-1.5px]">
                        Designated Leadership Team
                    </h1>
                    <p className="text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-[1.4rem]">
                        Our leadership spans technology, global health, sports, entertainment, digital ethics, and policy advocacy.
                    </p>
                    <p className="mt-4 text-base font-light leading-relaxed sm:text-lg md:text-xl lg:text-[1.4rem]">
                        This intentional diversity creates a unique decision-making environment where Silicon Valley innovation meets Geneva policy-making, London cultural influence, and Kenyan ingenuity.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div role="tablist" aria-label="Leadership sections" className="sticky top-[80px] z-[999] flex justify-center border-b-[3px] border-[#e0e0e0] bg-[#f8f9fa]">
                <button
                    role="tab"
                    aria-selected={page === "president"}
                    aria-controls="president-panel"
                    id="president-tab"
                    className={`relative border-none bg-transparent px-4 py-4 text-base font-semibold transition-all sm:px-8 sm:py-5 sm:text-lg md:px-16 ${page === "president" ? "text-[#2A5CBD]" : "text-[#666] hover:bg-[rgba(42,92,189,0.05)] hover:text-[#2A5CBD]"}`}
                    onClick={() => setPage("president")}
                >
                    Our President
                    <span className={`absolute bottom-[-3px] left-0 right-0 h-[3px] bg-[#2A5CBD] transition-transform ${page === "president" ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                </button>
                <button
                    role="tab"
                    aria-selected={page === "team"}
                    aria-controls="team-panel"
                    id="team-tab"
                    className={`relative border-none bg-transparent px-4 py-4 text-base font-semibold transition-all sm:px-8 sm:py-5 sm:text-lg md:px-16 ${page === "team" ? "text-[#2A5CBD]" : "text-[#666] hover:bg-[rgba(42,92,189,0.05)] hover:text-[#2A5CBD]"}`}
                    onClick={() => setPage("team")}
                >
                    Executive Team
                    <span className={`absolute bottom-[-3px] left-0 right-0 h-[3px] bg-[#2A5CBD] transition-transform ${page === "team" ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
                </button>
            </div>

            {/* ─── President Tab ─── */}
            {page === "president" && (
                <div id="president-panel" role="tabpanel" aria-labelledby="president-tab" className="animate-[fadeIn_0.5s_ease-out]">
                    {/* President Hero */}
                    <section
                        className="relative px-5 pt-20 pb-16 text-center text-white sm:px-[5%] sm:pt-28 sm:pb-28 overflow-hidden"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=75"
                            alt="Event venue representing culture in service of humanity"
                            fill
                            className="object-cover object-center z-0"
                            sizes="(max-width: 768px) 100vw, 1200px"
                        />
                        <div className="absolute inset-0 bg-black/70 z-10" />
                        <div className="mx-auto max-w-[900px] relative z-20">
                            <h1 className="mb-5 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl lg:text-[3.6rem] font-[var(--font-arimo),sans-serif] tracking-[-1px]">
                                Culture in Service of Humanity
                            </h1>
                            <p className="mb-4 text-sm font-light text-white/90 sm:text-base md:text-lg lg:text-[1.4rem] max-w-[800px] mx-auto">
                                Grammy-winning artist and philanthropist advancing global missions—most recently spotlighting hunger awareness alongside Bill Gates—by turning urgency into empathy and action.
                            </p>
                            <h2 className="text-2xl font-bold text-white md:text-3xl font-[var(--font-arimo),sans-serif]">Jon Batiste</h2>
                            <h3 className="mb-8 text-lg font-light text-white/90">Cultural Strategist • President &amp; Board Member</h3>
                            <button
                                onClick={() => document.getElementById('president-strategy')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-block rounded bg-[#F65314] px-8 py-3 font-semibold text-white transition-all hover:bg-[#d94910] cursor-pointer"
                            >
                                Why Culture Matters
                            </button>
                        </div>
                    </section>

                    {/* Human Stories. Global Impact. */}
                    <section id="president-strategy" className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                Human Stories. Global Impact.
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                        </div>
                        <div className="mt-12 grid items-center gap-14 md:grid-cols-2">
                            <div>
                                <p className="text-lg leading-relaxed">
                                    Jon Batiste – President and Board Member brings culture to the center of philanthropy—ensuring that global priorities like hunger, equity, and dignity are understood not just as statistics, but as human realities that demand collective action
                                </p>
                                <div className="mt-8 rounded-lg border-l-[5px] border-[#F65314] bg-[#f8f9fa] p-8">
                                    <p className="text-lg italic text-[#202124]">
                                        &quot;Philanthropy begins with listening—honoring dignity and standing with communities as they define their own futures.&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-[#e0e0e0] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <Image
                                    src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/jonathan+batiste.jpg"
                                    alt="Jon Batiste"
                                    width={600}
                                    height={400}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        </div>
                    </section>

                    {/* President & Board Member */}
                    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                President &amp; Board Member
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                            <p className="mt-4 text-lg">Shapes cultural strategy at the highest level</p>
                        </div>
                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                            {[
                                { icon: "people-arrows", title: "Grounds governance in empathy, ethics, and long-term impact", text: "Ensuring decisions are made with compassion and consideration for future generations." },
                                { icon: "balance-scale", title: "Aligns global objectives with lived local realities", text: "Bridging the gap between high-level strategy and on-the-ground experience." },
                                { icon: "handshake", title: "Bridges philanthropy, policy, and creative sectors", text: "Creating innovative partnerships that drive meaningful change across sectors." },
                                { icon: "chart-line", title: "Drives cultural strategy with measurable outcomes", text: "Implementing frameworks that track impact and adapt to changing needs." },
                            ].map((item) => (
                                <div key={item.title} className="rounded-lg bg-white p-8 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                                    <Icon name={item.icon} className="mb-5 text-[2.2rem] text-[#2A5CBD]" />
                                    <h3 className="mb-3 text-lg font-bold font-[Montserrat,sans-serif]">{item.title}</h3>
                                    <p className="text-[1.1rem]">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* From the Ground Up */}
                    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                From the Ground Up
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                        </div>
                        <div className="mt-12 grid items-center gap-14 md:grid-cols-2">
                            <div className="overflow-hidden rounded-lg bg-[#e0e0e0] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <Image
                                    src="https://i0.wp.com/www.tantvnews.com/wp-content/uploads/2024/09/20240904-Africa_Trip-Image_06-001-Center_Medium-Desktop_780x480.jpg?w=780&ssl=1"
                                    alt="Hunger Awareness Journey with Bill Gates"
                                    width={780}
                                    height={480}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="mb-6 text-lg leading-relaxed">
                                    Following his recent hunger-awareness journey with Bill Gates, Jon Batiste amplifies voices from affected communities—connecting lived experience to global platforms that drive understanding, funding, and action.
                                </p>
                                <h3 className="mb-4 text-xl font-bold font-[Montserrat,sans-serif]">Focus Areas</h3>
                                <div className="flex flex-wrap gap-3">
                                    {["Hunger & food security", "Cultural dignity & equity", "Community-led solutions", "Sustainable agriculture", "Policy advocacy", "Education & empowerment"].map((tag) => (
                                        <span key={tag} className="rounded-[30px] border border-[rgba(42,92,189,0.25)] bg-[#f8f9fa] px-5 py-2.5 font-semibold text-[#2A5CBD]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Turning Complexity into Connection */}
                    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                Turning Complexity into Connection
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                        </div>
                        <div className="mt-12 grid items-center gap-14 md:grid-cols-2">
                            <div>
                                <p className="text-lg leading-relaxed">
                                    Jon Batiste reframes systemic challenges through narrative—mobilizing empathy, sustaining attention, and building bridges where traditional advocacy falls short.
                                </p>
                                <div className="mt-8 rounded-lg border-l-[5px] border-[#F65314] bg-[#f8f9fa] p-8">
                                    <p className="text-lg italic text-[#202124]">
                                        &quot;Culture is the connective tissue that transforms global missions into human experiences.&quot;
                                    </p>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-lg bg-[#e0e0e0] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                                <Image
                                    src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/culturalframwork.png"
                                    alt="Jon Batiste performing"
                                    width={600}
                                    height={400}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Impact & Reach */}
                    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                Impact &amp; Reach
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                        </div>
                        <div className="mt-8 grid gap-8 md:grid-cols-3">
                            {[
                                { icon: "bullhorn", title: "Elevates humanitarian missions through culture-first storytelling", text: "Transforming statistics into compelling narratives that drive action." },
                                { icon: "expand-arrows-alt", title: "Expands reach beyond traditional development audiences", text: "Engaging new demographics in humanitarian causes through cultural channels." },
                                { icon: "network-wired", title: "Builds cross-sector coalitions for lasting change", text: "Forging partnerships between arts, business, government, and nonprofit sectors." },
                            ].map((item) => (
                                <div key={item.title} className="group rounded-lg bg-white p-8 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#2A5CBD] hover:text-white hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                                    <Icon name={item.icon} className="mb-5 text-[2.2rem] text-[#2A5CBD] group-hover:text-white" />
                                    <h3 className="mb-3 text-lg font-bold font-[Montserrat,sans-serif] group-hover:text-white">{item.title}</h3>
                                    <p className="text-[1.1rem] group-hover:text-white">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recognition & Credibility */}
                    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-[5%] sm:py-20">
                        <div className="mb-8 text-center">
                            <h2 className="relative inline-block pb-3 text-2xl font-bold text-[#2A5CBD] sm:text-3xl md:text-[2.5rem] font-[Montserrat,sans-serif]">
                                Recognition &amp; Credibility
                                <span className="absolute bottom-[-10px] left-0 h-1 w-20 bg-[#F65314]" />
                            </h2>
                        </div>
                        <div className="mt-8 grid gap-8 md:grid-cols-3">
                            {[
                                { icon: "trophy", title: "Grammy Award Winner", text: "Artistic excellence in service of impact" },
                                { icon: "award", title: "Humanitarian & Charity Honors", text: "Recognized for social contribution" },
                                { icon: "microphone-alt", title: "Global Voice", text: "Trusted perspective on culture's role in solving world challenges" },
                            ].map((item) => (
                                <div key={item.title} className="rounded-lg bg-white p-8 text-center shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
                                    <Icon name={item.icon} className="mb-5 text-[2.2rem] text-[#2A5CBD]" />
                                    <h3 className="mb-3 text-lg font-bold font-[Montserrat,sans-serif]">{item.title}</h3>
                                    <p className="text-[1.1rem]">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Closing */}
                    <section className="bg-gradient-to-br from-[#2A5CBD] to-[#1e4a9f] px-5 py-10 text-center text-white sm:px-[5%] sm:py-14">
                        <h2 className="relative inline-block pb-3 text-xl font-bold text-white sm:text-2xl md:text-[2rem] font-[Montserrat,sans-serif]">
                            When culture leads, humanity follows.
                            <span className="absolute bottom-0 left-1/2 h-1 w-[70px] -translate-x-1/2 bg-[#F65314]" />
                        </h2>
                        <p className="mx-auto mt-6 max-w-[720px] text-lg text-white/90">
                            Join the movement to place culture at the center of global philanthropy and humanitarian action.
                        </p>
                        <p className="mt-6 text-xl font-semibold">Be Kind to be Great</p>
                    </section>
                </div>
            )}

            {/* ─── Team Tab ─── */}
            {page === "team" && (
                <div id="team-panel" role="tabpanel" aria-labelledby="team-tab" className="animate-[fadeIn_0.5s_ease-out]">
                    <div className="mx-auto max-w-[1400px] space-y-10 bg-white px-[5%] py-16">
                        {/* Team Members */}
                        {[
                            { name: "Titus Gicharu", role: "CEO and Board Member", title: "Visionary Architect", desc: "A strategic thinker with deep roots in both African entrepreneurship and global systems change, Titus provides the foundational vision and operational discipline to transform ambitious goals into measurable outcomes. His leadership ensures that Bsocio remains anchored in both innovation and integrity.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/titus+gicharu.jpg" },
                            { name: "Anil Dash", role: "Board Member", title: "Technology Ethicist & Digital Strategist", desc: "A pioneer in examining technology's impact on society, Anil ensures our digital tools and platforms empower rather than exploit. He guides Bsocio's responsible innovation framework in an increasingly connected world.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/anil+dash.jpg" },
                            { name: "David Beckham", role: "Board Member", title: "Global Influence Ambassador", desc: "One of the world's most recognized and trusted figures, David transforms awareness into action. His unparalleled global platform and philanthropic experience mobilize public will and private sector partnerships at unprecedented scale.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/david+beckham.jpg" },
                            { name: "Michael Sheldrick", role: "Board Member", title: "Policy & Advocacy Architect", desc: "Co-founder of Global Citizen and a master of policy-driven change, Michael bridges grassroots activism with governmental action. His expertise turns public momentum into legislative and financial commitments.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/michael+sheldrick.jpg" },
                            { name: "Dr. Lawrence Haddad", role: "Board Member", title: "Global Health & Nutrition Authority", desc: "Executive Director of the Global Alliance for Improved Nutrition (GAIN) and World Food Prize laureate, Dr. Haddad brings evidence-based rigor to our health and nutrition initiatives, ensuring interventions are scientifically sound and scalable.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/lawrence+haddad.jpg" },
                            { name: "Catherine Kamau", role: "Goodwill Ambassador", title: "Voice of the Community", desc: "A beloved actress and authentic connector to everyday realities, Catherine ensures our initiatives remain grounded in human experience. She amplifies community voices within our leadership chambers and brings our work to life through storytelling.", img: "https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/catherine+kamau.jpg" },
                        ].map((member) => (
                            <article
                                key={member.name}
                                className="flex flex-col items-center gap-6 rounded-xl border-l-[6px] border-[#7CBB00] bg-[#f8f9fa] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-l-[#2A5CBD] hover:shadow-[0_8px_30px_rgba(42,92,189,0.12)] sm:gap-8 sm:p-8 md:flex-row md:items-start md:p-10 md:text-left"
                            >
                                <div className="h-[220px] w-[180px] flex-shrink-0 overflow-hidden rounded-xl border-4 border-[#2A5CBD] bg-white shadow-[0_4px_20px_rgba(42,92,189,0.15)] sm:h-[280px] sm:w-[240px] md:h-[320px] md:w-[280px]">
                                    {member.img ? (
                                        <Image
                                            src={member.img}
                                            alt={member.name}
                                            width={280}
                                            height={320}
                                            className="h-full w-full object-cover object-top"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Icon name="user" className="text-5xl text-[#2A5CBD]/30" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="mb-1 text-xl font-bold text-[#2A5CBD] sm:text-2xl font-[Montserrat,sans-serif]">{member.name}</h3>
                                    <span className="mb-3 block text-base font-semibold text-[#7CBB00] sm:mb-5 sm:text-lg">{member.role}</span>
                                    <p className="mb-2 text-base font-bold text-[#2A5CBD] sm:text-lg">{member.title}</p>
                                    <p className="text-base leading-relaxed text-[#444] sm:text-[1.1rem]">{member.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Blue section */}
                    <div className="bg-gradient-to-br from-[#2A5CBD] to-[#1e4a9f] px-5 py-12 text-center text-white sm:px-[5%] sm:py-16">
                        <h2 className="mb-4 text-2xl font-bold font-[Montserrat,sans-serif] sm:text-3xl md:text-[2.5rem]">Together We Build Systems that Last</h2>
                        <p className="text-xl font-semibold sm:text-2xl md:text-[1.8rem]">Be Kind to Be Great</p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-[#1a1a1a] px-5 py-8 text-center text-white sm:p-10 md:p-16">
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
