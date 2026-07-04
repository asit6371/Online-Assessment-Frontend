import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      points: [
        "Name and email address for account setups.",
        "Account credentials used to secure your entry.",
        "Assessment attempts, timestamps, and performance scores.",
        "Coding submissions and granular progress analytics data.",
        "Basic device properties and technical browser metadata."
      ]
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      points: [
        "Authenticate user sessions and safely manage account access.",
        "Track dynamic assessment progress and present your results history.",
        "Optimize background platform speeds and performance benchmarks.",
        "Enhance everyday user experience through interactive interfaces.",
        "Proactively monitor and maintain general infrastructure security."
      ]
    },
    {
      id: "protection",
      title: "3. Data Protection",
      points: [
        "Enforcing industry-standard encryption and security practices.",
        "Defending database nodes against unauthorized perimeter access.",
        "Providing isolated, secure storage profiles for testing logs.",
        "Executing regular audits on core platform protection layers."
      ]
    },
    {
      id: "sharing",
      title: "4. Information Sharing Principles",
      points: [
        "We explicitly do not sell any personal or identifying metrics.",
        "We do not rent user data out to external monetization bureaus.",
        "We do not trade information files compiled during profile creation.",
        "Your metrics are utilized strictly to serve real-time app features."
      ]
    },
    {
      id: "cookies",
      title: "5. Cookies & Site Analytics",
      points: [
        "Retaining core authentication tokens to remember user login states.",
        "Evaluating usage charts to isolate and resolve operational errors.",
        "Analyzing real-time interactions to improve systemic loading speeds.",
        "Saving client preferences to maintain structural operational continuity."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#060B13] text-zinc-300 font-sans selection:bg-[#FF8A00]/30 antialiased">

      {/* MINIMAL NAVBAR */}
      <nav className="h-16 border-b border-zinc-800/60 flex items-center justify-between px-8 md:px-16 sticky top-0 bg-[#060B13]/90 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { stopStream(); navigate("/"); }}>
          <span className="text-white font-bold tracking-tight text-lg">JudgeX</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">LEGAL</span>
        </div>

        <button
          onClick={() => { stopStream(); navigate("/"); }}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back to platform</span>
        </button>
      </nav>

      {/* CORE WRAPPER */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* QUICK FLOATING SIDEBAR NAVIGATION (Desktop only) */}
        <aside className="hidden lg:block sticky top-28 h-fit space-y-3 border-l border-zinc-800/80 pl-4">
          <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-4">On this page</p>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block text-xs text-zinc-400 hover:text-[#FF8A00] transition-colors scroll-smooth"
            >
              {section.title.substring(3)}
            </a>
          ))}
          <a href="#contact" className="block text-xs text-zinc-400 hover:text-[#FF8A00] transition-colors">
            Contact Support
          </a>
        </aside>

        {/* DOCUMENT CONTENT PANEL */}
        <main className="lg:col-span-3 space-y-14">

          {/* HEADER HEADER BLOCK */}
          <header className="border-b border-zinc-800/60 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Last updated: June 2026 &bull; Version 1.0.2
            </p>
          </header>

          {/* POLICY CONTENT EXPLANATION */}
          <p className="text-zinc-400 leading-relaxed text-sm">
            At JudgeX, we believe handling data transparently is vital to establishing trust.
            This document lays out explicitly what information we look at, how those records are filtered,
            and the defensive system layers standing guard over your profile while you master mock company tracks.
          </p>

          {/* DYNAMIC PRIVACY SECTIONS */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-lg font-bold text-white mb-4 tracking-tight border-b border-zinc-900 pb-2">
                  {section.title}
                </h2>
                <ul className="space-y-3 pl-1 text-sm text-zinc-400">
                  {section.points.map((point, index) => (
                    <li key={index} className="flex gap-3 items-start leading-relaxed">
                      <span className="text-[#FF8A00] font-mono select-none mt-0.5 text-xs">&mdash;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* CONTACT INLINE BLOCK */}
          <section id="contact" className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6 scroll-mt-24">
            <h3 className="text-base font-bold text-white mb-2">
              Questions or Concerns?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              If you discover ambiguous wording or wish to issue inquiries regarding logged metadata tracking assets,
              please write directly to our automated processing queue.
            </p>
            <a
              href="mailto:support@judgex.com"
              className="text-xs text-[#FF8A00] hover:underline font-medium tracking-wide"
            >
              support@judgex.com &rarr;
            </a>
          </section>

        </main>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;