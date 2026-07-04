import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaGlobe
} from "react-icons/fa";

function ContactUsPage() {
  const navigate = useNavigate();

  const contactMethods = [
    {
      id: "email",
      title: "Email Support",
      icon: <FaEnvelope />,
      value: "support@judgex.com",
      description:
        "For general questions, platform issues, account support, and feedback."
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      icon: <FaLinkedin />,
      value: "linkedin.com/in/your-profile",
      description:
        "Connect professionally and follow platform updates."
    },
    {
      id: "github",
      title: "GitHub",
      icon: <FaGithub />,
      value: "github.com/your-profile",
      description:
        "Explore source code, projects, and technical contributions."
    },
    {
      id: "website",
      title: "Website",
      icon: <FaGlobe />,
      value: "www.judgex.com",
      description:
        "Visit our platform and explore new assessment features."
    }
  ];

  return (
    <div className="min-h-screen bg-[#060B13] text-zinc-300 font-sans selection:bg-[#FF8A00]/30 antialiased">

      <nav className="h-16 border-b border-zinc-800/60 flex items-center justify-between px-8 md:px-16 sticky top-0 bg-[#060B13]/90 backdrop-blur-sm z-50">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-white font-bold tracking-tight text-lg">
            JudgeX
          </span>

          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
            CONTACT
          </span>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <FaArrowLeft className="text-[10px]" />
          <span>Back to platform</span>
        </button>

      </nav>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-12">

        <aside className="hidden lg:block sticky top-28 h-fit space-y-3 border-l border-zinc-800/80 pl-4">

          <p className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-4">
            Contact Channels
          </p>

          {contactMethods.map((method) => (
            <a
              key={method.id}
              href={`#${method.id}`}
              className="block text-xs text-zinc-400 hover:text-[#FF8A00] transition-colors"
            >
              {method.title}
            </a>
          ))}

        </aside>

        <main className="lg:col-span-3 space-y-14">

          <header className="border-b border-zinc-800/60 pb-8">

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Contact Us
            </h1>

            <p className="text-xs text-zinc-500 font-mono">
              We'd love to hear from you
            </p>

          </header>

          <p className="text-zinc-400 leading-relaxed text-sm">
            Whether you have feedback, feature requests, technical issues,
            partnership inquiries, or simply want to connect, our team is
            always happy to hear from developers using JudgeX.
          </p>

          <div className="space-y-12">

            {contactMethods.map((method) => (
              <section
                key={method.id}
                id={method.id}
                className="scroll-mt-24"
              >

                <h2 className="text-lg font-bold text-white mb-4 tracking-tight border-b border-zinc-900 pb-2 flex items-center gap-3">
                  <span className="text-[#FF8A00]">
                    {method.icon}
                  </span>

                  {method.title}
                </h2>

                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {method.description}
                </p>

                <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm font-mono text-[#FF8A00]">
                  {method.value}
                </div>

              </section>
            ))}

          </div>

          <section className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-6">

            <h3 className="text-base font-bold text-white mb-2">
              Response Time
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed">
              We aim to respond to all inquiries within 24–48 hours.
              Technical issues affecting assessments receive priority handling.
            </p>

          </section>

        </main>

      </div>

    </div>
  );
}

export default ContactUsPage;