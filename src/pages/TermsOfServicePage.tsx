import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function TermsOfServicePage() {
  const navigate = useNavigate();

  const sections = [
    {
      id: "use-of-service",
      title: "1. Use of JudgeX",
      points: [
        "By accessing JudgeX, you agree to comply with these Terms of Service.",
        "JudgeX is intended for coding practice, assessments, and interview preparation.",
        "Users must use the platform responsibly, ethically, and lawfully.",
        "We reserve the right to suspend accounts that violate these core guidelines."
      ]
    },
    {
      id: "responsibilities",
      title: "2. Account Responsibilities",
      points: [
        "You are entirely responsible for maintaining the security of your account credentials.",
        "Registration information provided to the platform must be accurate and up to date.",
        "You may not share, lease, or distribute your account access with another person.",
        "All activities performed through your account remain your personal responsibility."
      ]
    },
    {
      id: "conduct",
      title: "3. Assessment Conduct",
      points: [
        "Assessment sessions are strictly designed to evaluate your own independent skills.",
        "Users must not attempt to manipulate scores, testing metrics, or platform behavior.",
        "The use of unauthorized automated tools, bots, or unfair methods is strictly prohibited.",
        "Repeated platform misuse may result in immediate account restrictions or permanent bans."
      ]
    },
    {
      id: "ownership",
      title: "4. Content Ownership",
      points: [
        "Assessment questions and core platform content remain the exclusive property of JudgeX.",
        "Users may not copy, distribute, or resell platform content without explicit written permission.",
        "Users retain full ownership of their original source code submissions.",
        "Anonymous, aggregated assessment statistics may be used to optimize platform features."
      ]
    },
    {
      id: "availability",
      title: "5. Platform Availability",
      points: [
        "We continuously strive to provide a highly reliable and uninterrupted service layout.",
        "Temporary downtime may occasionally occur during routine system maintenance or upgrades.",
        "Features and assessment modules may change as the platform dynamically evolves.",
        "JudgeX is provided strictly on an 'as available' and 'as is' basis."
      ]
    },
    {
      id: "privacy-link",
      title: "6. Privacy & Security Bounds",
      points: [
        "Your legal use of JudgeX is also strictly governed by our companion Privacy Policy.",
        "We execute reasonable security measures to safeguard user logs and dynamic inputs.",
        "Users are strongly encouraged to protect their own network credentials and personal data.",
        "Any suspected account security breach or vulnerability should be reported immediately."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#060B13] text-zinc-300 font-sans selection:bg-[#FF8A00]/30 antialiased">
      
      {/* MINIMAL NAVBAR */}
      <nav className="h-16 border-b border-zinc-800/60 flex items-center justify-between px-8 md:px-16 sticky top-0 bg-[#060B13]/90 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-white font-bold tracking-tight text-lg">JudgeX</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">TERMS</span>
        </div>
        
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back to platform</span>
        </button>
      </nav>

      {/* CORE WRAPPER */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* QUICK FLOATING SIDEBAR NAVIGATION */}
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
        </aside>

        {/* DOCUMENT CONTENT PANEL */}
        <main className="lg:col-span-3 space-y-14">
          
          {/* HEADER BLOCK */}
          <header className="border-b border-zinc-800/60 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Terms of Service
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Last updated: June 2026 &bull; Version 1.0.0
            </p>
          </header>

          {/* GENERAL INTRODUCTION */}
          <p className="text-zinc-400 leading-relaxed text-sm">
            Welcome to JudgeX. These terms govern your engagement with our application runtime, testing nodes,
            and assessment catalogs. By testing your skills here, you consent to these rules designed to preserve 
            a fair, clean, and reliable environment for thousands of developers worldwide.
          </p>

          {/* DYNAMIC TERMS SECTIONS */}
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

          {/* USER NOTICE INLINE PANEL */}
          <section className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">
              Acceptance of Terms
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If any clause or requirement outlined above is unacceptable to you, please discontinue your test actions 
              and avoid generating metrics on this platform. Continued access constitutes absolute confirmation of agreement.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}

export default TermsOfServicePage;

